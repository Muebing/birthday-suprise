import { useEffect, useRef } from 'react'

export function StageShell({ step, stages, onBack, onJump, children }) {
  const stageRef = useRef(null)
  const showNav = step > 0 && step < stages.length - 1

  // Setiap pindah tahap: fokus ke konten baru dan kembali ke atas
  useEffect(() => {
    stageRef.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  return (
    <main className="stage-shell" ref={stageRef} tabIndex={-1}>
      <div className="stage" key={step}>
        {children}
      </div>

      {showNav && (
        <nav className="stage-nav" aria-label="Navigasi tahap">
          <button type="button" className="stage-nav-back" onClick={onBack}>
            <span aria-hidden="true">←</span> Kembali
          </button>

          <div className="stage-dots">
            {stages.slice(1).map((stage, index) => {
              const stageStep = index + 1
              const isCurrent = stageStep === step
              const isVisited = stageStep < step

              return (
                <button
                  key={stage.id}
                  type="button"
                  className={`stage-dot${isCurrent ? ' is-current' : ''}${
                    isVisited ? ' is-visited' : ''
                  }`}
                  onClick={() => onJump(stageStep)}
                  disabled={stageStep > step}
                  aria-label={`Tahap ${index + 1}: ${stage.label}`}
                  aria-current={isCurrent ? 'step' : undefined}
                />
              )
            })}
          </div>

          <span className="stage-count">
            {step}/{stages.length - 1}
          </span>
        </nav>
      )}
    </main>
  )
}
