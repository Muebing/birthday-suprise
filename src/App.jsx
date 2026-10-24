import { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'

import { AmbientBackground } from './components/AmbientBackground.jsx'
import { Cake } from './components/Cake.jsx'
import { Feelings } from './components/Feelings.jsx'
import { Finale } from './components/Finale.jsx'
import { FloatingHearts } from './components/FloatingHearts.jsx'
import { Hero } from './components/Hero.jsx'
import { Letter } from './components/Letter.jsx'
import { Memories } from './components/Memories.jsx'
import { StageShell } from './components/StageShell.jsx'

const STAGES = [
  { id: 'intro', label: 'Pembuka' },
  { id: 'letter', label: 'Surat' },
  { id: 'feelings', label: 'Perasaan' },
  { id: 'memories', label: 'Kenangan' },
  { id: 'cake', label: 'Kue' },
  { id: 'finale', label: 'Penutup' },
]

const FINALE_STEP = STAGES.length - 1

function App() {
  // Tahap yang sedang tampil (satu bagian per layar)
  const [step, setStep] = useState(0)

  // State untuk surat
  const [isOpen, setIsOpen] = useState(false)

  // State untuk musik
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Musik mulai otomatis pada interaksi pertama (kebijakan autoplay browser)
  const playMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !audio.paused) return
    audio.play().then(() => setIsPlaying(true)).catch(() => {})
  }, [])

  useEffect(() => {
    playMusic()

    const onGesture = () => playMusic()
    window.addEventListener('pointerdown', onGesture)
    window.addEventListener('keydown', onGesture)

    return () => {
      window.removeEventListener('pointerdown', onGesture)
      window.removeEventListener('keydown', onGesture)
    }
  }, [playMusic])

  // Confetti saat surat dibuka
  function handleOpenLetter() {
    if (!isOpen) {
      setIsOpen(true)
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }

  // Mulai pengalaman dari layar pembuka
  function beginExperience() {
    playMusic()
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.75 } })
    setStep(1)
  }

  // Confetti penutup
  useEffect(() => {
    if (step !== FINALE_STEP) return undefined

    const left = window.setTimeout(() => {
      confetti({ particleCount: 90, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } })
    }, 150)
    const right = window.setTimeout(() => {
      confetti({ particleCount: 90, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } })
    }, 380)

    return () => {
      window.clearTimeout(left)
      window.clearTimeout(right)
    }
  }, [step])

  // Ulangi dari awal
  function restart() {
    setIsOpen(false)
    setStep(0)
  }

  const goBack = () => setStep((current) => Math.max(0, current - 1))

  return (
    <div className="birthday-container">
      {/* Latar ambient: aurora, kelopak, dan debu keemasan */}
      <AmbientBackground />

      {/* Hati melayang */}
      <FloatingHearts />

      {/* Musik */}
      <audio ref={audioRef} src="/Biru.mp3" loop preload="auto" />

      {/* Penanda musik aktif (bukan tombol) */}
      {isPlaying && (
        <div className="music-eq" title="Musik sedang diputar" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      <StageShell
        step={step}
        stages={STAGES}
        onBack={goBack}
        onJump={setStep}
      >
        {step === 0 && <Hero onBegin={beginExperience} />}

        {step === 1 && (
          <Letter isOpen={isOpen} onOpenLetter={handleOpenLetter} onNext={() => setStep(2)} />
        )}

        {step === 2 && <Feelings onNext={() => setStep(3)} />}

        {step === 3 && <Memories onNext={() => setStep(4)} />}

        {step === 4 && <Cake onNext={() => setStep(FINALE_STEP)} />}

        {step === FINALE_STEP && <Finale onRestart={restart} />}
      </StageShell>
    </div>
  )
}

export default App
