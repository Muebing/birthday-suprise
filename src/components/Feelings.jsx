import { useState } from 'react'
import { feelings } from '../data/feelings.js'

export function Feelings({ onNext }) {
  const [activeId, setActiveId] = useState(null)

  const activeFeeling = feelings.find((feeling) => feeling.id === activeId)

  return (
    <section className="feelings-section" id="feelings">
      <div className="section-heading">
        <p className="section-kicker">A Little Something For You</p>
        <h2>A Few Little Feelings</h2>
        <p className="section-subtitle">Some things are easier to say through a little letter. ♡</p>
      </div>

      <div className="envelope-grid" role="group" aria-label="Pilihan perasaan">
        {feelings.map((feeling) => (
          <button
            key={feeling.id}
            type="button"
            className={`mini-envelope ${feeling.id} ${activeId === feeling.id ? 'is-active' : ''}`}
            style={{ '--accent': feeling.accent }}
            onClick={() => setActiveId(feeling.id)}
            aria-expanded={activeId === feeling.id}
            aria-controls="feeling-note"
          >
            <span className="mini-envelope-body" aria-hidden="true"></span>
            <span className="mini-envelope-flap" aria-hidden="true"></span>
            <span className="mini-envelope-seal" aria-hidden="true"></span>
            <span className="mini-envelope-label">{feeling.label}</span>
          </button>
        ))}
      </div>

      {activeFeeling && (
        <article className="feeling-card" id="feeling-note" aria-live="polite">
          <div className="feeling-card-inner">
            <header className="feeling-card-header">
              <p className="feeling-kicker" style={{ color: activeFeeling.accent }}>
                {activeFeeling.kicker}
              </p>
              <h3>{activeFeeling.title}</h3>
            </header>

            <div className="feeling-body">
              {activeFeeling.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="feeling-card-actions">
              <button type="button" className="btn-ghost" onClick={() => setActiveId(null)}>
                Back to envelopes
              </button>
            </div>
          </div>
        </article>
      )}

      <div className="stage-actions">
        <button type="button" className="btn-primary" onClick={onNext}>
          Lanjut ke Kenangan <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  )
}
