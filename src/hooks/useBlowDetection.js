import { useCallback, useEffect, useRef, useState } from 'react'

const BLOW_RMS = 0.11
const BLOW_LOW_ENERGY = 0.12
const HOLD_FRAMES = 5
const COOLDOWN_MS = 280
const LEVEL_INTERVAL_MS = 90

// Deteksi tiupan lewat mikrofon: RMS suara + energi frekuensi rendah,
// harus bertahan beberapa frame agar musik/gesekan mikrofon tidak memicu.
export function useBlowDetection({ onBlow } = {}) {
  const [status, setStatus] = useState('idle')
  const [level, setLevel] = useState(0)
  const [error, setError] = useState(null)

  const statusRef = useRef('idle')
  const onBlowRef = useRef(onBlow)
  const streamRef = useRef(null)
  const contextRef = useRef(null)
  const frameRef = useRef(0)

  useEffect(() => {
    onBlowRef.current = onBlow
  }, [onBlow])

  function updateStatus(next) {
    statusRef.current = next
    setStatus(next)
  }

  const cleanup = useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = 0

    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null

    if (contextRef.current && contextRef.current.state !== 'closed') {
      contextRef.current.close().catch(() => {})
    }
    contextRef.current = null
    setLevel(0)
  }, [])

  const stop = useCallback(() => {
    cleanup()
    if (statusRef.current === 'listening' || statusRef.current === 'requesting') {
      updateStatus('idle')
    }
  }, [cleanup])

  const start = useCallback(async () => {
    if (statusRef.current === 'requesting' || statusRef.current === 'listening') return

    if (!navigator.mediaDevices?.getUserMedia || typeof window.AudioContext === 'undefined') {
      setError('unsupported')
      updateStatus('unsupported')
      return
    }

    setError(null)
    updateStatus('requesting')

    let stream = null
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false,
          autoGainControl: true,
        },
      })
      streamRef.current = stream

      const context = new window.AudioContext()
      contextRef.current = context
      if (context.state === 'suspended') await context.resume()

      const source = context.createMediaStreamSource(stream)
      const analyser = context.createAnalyser()
      analyser.fftSize = 1024
      analyser.smoothingTimeConstant = 0.4
      source.connect(analyser)

      const timeData = new Uint8Array(analyser.fftSize)
      const freqData = new Uint8Array(analyser.frequencyBinCount)
      const lowBins = Math.max(
        2,
        Math.round((480 / (context.sampleRate / 2)) * analyser.frequencyBinCount),
      )

      let hold = 0
      let lastFire = 0
      let lastLevelAt = 0

      const tick = (now) => {
        analyser.getByteTimeDomainData(timeData)
        let sum = 0
        for (let i = 0; i < timeData.length; i += 1) {
          const sample = (timeData[i] - 128) / 128
          sum += sample * sample
        }
        const rms = Math.sqrt(sum / timeData.length)

        analyser.getByteFrequencyData(freqData)
        let low = 0
        for (let i = 1; i < lowBins; i += 1) low += freqData[i]
        low = low / (lowBins - 1) / 255

        const strength = Math.min(1, rms * 3 + low * 0.5)
        if (now - lastLevelAt > LEVEL_INTERVAL_MS) {
          lastLevelAt = now
          setLevel(strength)
        }

        if (rms > BLOW_RMS && low > BLOW_LOW_ENERGY) {
          hold += 1
          if (hold >= HOLD_FRAMES && now - lastFire > COOLDOWN_MS) {
            lastFire = now
            onBlowRef.current?.(strength)
          }
        } else {
          hold = Math.max(0, hold - 1)
        }

        frameRef.current = requestAnimationFrame(tick)
      }

      frameRef.current = requestAnimationFrame(tick)
      updateStatus('listening')
    } catch (err) {
      if (stream) stream.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      cleanup()

      const denied = err?.name === 'NotAllowedError' || err?.name === 'SecurityError'
      setError(denied ? 'denied' : 'error')
      updateStatus(denied ? 'denied' : 'error')
    }
  }, [cleanup])

  useEffect(() => () => cleanup(), [cleanup])

  return { start, stop, status, level, error }
}
