import { letterContent } from '../data/letterContent.js'

export function Letter({ isOpen, onOpenLetter, onNext }) {
  return (
    <section className="letter-section" id="letter">
      <div className="letter-decor" aria-hidden="true">
        <span className="letter-orb letter-orb--one"></span>
        <span className="letter-orb letter-orb--two"></span>
        <span className="letter-orb letter-orb--three"></span>
        <span className="letter-halo"></span>
        <span className="letter-petal letter-petal--one"></span>
        <span className="letter-petal letter-petal--two"></span>
        <span className="letter-petal letter-petal--three"></span>
        <span className="letter-petal letter-petal--four"></span>
        <span className="letter-petal letter-petal--five"></span>
        <span className="letter-petal letter-petal--six"></span>
        <span className="letter-spark letter-spark--one"></span>
        <span className="letter-spark letter-spark--two"></span>
        <span className="letter-spark letter-spark--three"></span>
        <span className="letter-spark letter-spark--four"></span>
        <span className="letter-spark letter-spark--five"></span>
        <span className="letter-spark letter-spark--six"></span>
      </div>

      <div className="section-heading">
        <p className="section-kicker">A Letter For You</p>
        <h2>From My Heart</h2>
      </div>

      <div className={`envelope-scene ${isOpen ? 'is-open' : ''}`}>
        <button
          type="button"
          className={`envelope ${isOpen ? 'open' : ''}`}
          onClick={onOpenLetter}
          aria-expanded={isOpen}
          aria-controls="love-letter"
        >
          <span className="envelope-flap" aria-hidden="true"></span>
          <span className="envelope-pocket" aria-hidden="true"></span>
          <span className="envelope-heart" aria-hidden="true">
            ♥
          </span>
          <span className="envelope-hint" aria-hidden="true">
            {isOpen ? 'Your Letter Is Open' : 'Tap the envelope'}
          </span>
        </button>

        <div
          className={`letter-reveal ${isOpen ? 'is-visible' : ''}`}
          id="love-letter"
          aria-hidden={!isOpen}
        >
          <div className="letter-viewport">
            <div className="letter-card">
              <span className="letter-tape letter-tape--top-left" aria-hidden="true"></span>
              <span className="letter-tape letter-tape--bottom-right" aria-hidden="true"></span>

              <article className="letter-paper">
                <div className="letter-content">
                  <span className="letter-stamp" aria-hidden="true">
                    ♥
                  </span>

                  <header className="letter-header">
                    <p className="letter-date">{letterContent.date}</p>
                    <p className="letter-greeting">{letterContent.greeting}</p>
                  </header>

                  <div className="letter-body">
                    {letterContent.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  <footer className="letter-signoff">
                    <p className="letter-closing">{letterContent.closing}</p>
                    <p className="letter-signature">{letterContent.signature}</p>
                  </footer>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="stage-actions">
          <button type="button" className="btn-primary" onClick={onNext}>
            Lanjut ke Perasaan <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </section>
  )
}
