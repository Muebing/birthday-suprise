import { useEffect, useState } from 'react'
import { useBlowDetection } from '../hooks/useBlowDetection.js'

const TOTAL_CANDLES = 3

export function Cake({ onNext }) {
  const [candles, setCandles] = useState(() => Array(TOTAL_CANDLES).fill(true))
  const [manual, setManual] = useState(false)

  const allOut = candles.every((lit) => !lit)

  const { start, stop, status, level, error } = useBlowDetection({
    onBlow: () => blowOne(),
  })

  // Hentikan mikrofon begitu semua lilin mati
  useEffect(() => {
    if (allOut) stop()
  }, [allOut, stop])

  function blowOutCandle(index) {
    setCandles((current) => {
      if (!current[index]) return current
      return current.map((lit, i) => (i === index ? false : lit))
    })
  }

  function blowOne() {
    setCandles((current) => {
      const index = current.findIndex(Boolean)
      if (index === -1) return current
      return current.map((lit, i) => (i === index ? false : lit))
    })
  }

  const canTap = manual || status === 'denied' || status === 'unsupported' || status === 'error'

  const errorMessage =
    error === 'denied'
      ? 'Izin mikrofon ditolak. Tidak apa-apa — ketuk lilinnya satu per satu.'
      : error === 'unsupported'
        ? 'Browser ini belum mendukung mikrofon. Ketuk lilinnya satu per satu.'
        : 'Mikrofon tidak bisa diakses. Ketuk lilinnya satu per satu.'

  return (
    <section className="cake-section" id="cake">
      <div className="section-heading">
        <p className="section-kicker">One last thing</p>
        <h2>Make a Wish! 🎂</h2>
        <p className="section-subtitle">Tiup ketiga lilinnya, lalu buat permohonan.</p>
      </div>

      <div className="cake-scene" aria-label="Kue ulang tahun dengan tiga lilin">
        <div className="candles">
          {candles.map((lit, index) => (
            <button
              key={index}
              type="button"
              className={`candle ${lit ? 'lit' : 'unlit'}`}
              onClick={canTap ? () => blowOutCandle(index) : undefined}
              disabled={!canTap || !lit}
              aria-label={`Lilin ${index + 1}${lit ? ' menyala' : ' sudah mati'}`}
            >
              <span className="candle-smoke" aria-hidden="true"></span>
              <span className="candle-flame" aria-hidden="true"></span>
              <span className="candle-wick" aria-hidden="true"></span>
              <span className="candle-body" aria-hidden="true"></span>
            </button>
          ))}
        </div>

        <div className="cake">
          <div className="cake-tier cake-tier--top">
            <span className="cake-frosting" aria-hidden="true"></span>
          </div>
          <div className="cake-tier cake-tier--bottom">
            <span className="cake-frosting" aria-hidden="true"></span>
          </div>
          <div className="cake-plate" aria-hidden="true"></div>
        </div>
      </div>

      {!allOut && (
        <div className="mic-panel">
          {status === 'idle' && !manual && (
            <>
              <p className="mic-status">Nyalakan mikrofon, lalu tiup lilinnya sungguhan.</p>
              <button type="button" className="btn-ghost" onClick={start}>
                🎤 Aktifkan Mikrofon
              </button>
            </>
          )}

          {status === 'requesting' && (
            <p className="mic-status" role="status">
              Menunggu izin mikrofon…
            </p>
          )}

          {status === 'listening' && (
            <>
              <p className="mic-status" role="status">
                Tiup ke arah mikrofon…
              </p>
              <div className="blow-meter" aria-hidden="true">
                <span style={{ transform: `scaleX(${Math.max(0.04, level)})` }}></span>
              </div>
              <p className="mic-hint">Tidak terdeteksi? Kamu bisa mengetuk lilinnya.</p>
            </>
          )}

          {(status === 'denied' || status === 'unsupported' || status === 'error') && (
            <p className="mic-status mic-status--error" role="alert">
              {errorMessage}
            </p>
          )}

          {manual ? (
            <p className="mic-status">Mode tiup manual aktif — ketuk tiap lilin untuk mematikan.</p>
          ) : (
            <button
              type="button"
              className="manual-link"
              onClick={() => {
                stop()
                setManual(true)
              }}
            >
              Tiup manual saja
            </button>
          )}
        </div>
      )}

      {allOut && (
        <>
          <div className="wish-message" role="status">
            <h3>Your wish is on its way! 💗</h3>
            <p>May all your beautiful dreams come true.</p>
          </div>

          <div className="stage-actions">
            <button type="button" className="btn-primary" onClick={onNext}>
              Selesai 💗
            </button>
          </div>
        </>
      )}
    </section>
  )
}
