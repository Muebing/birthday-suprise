import { memories } from '../data/memories.js'

export function Memories({ onNext }) {
  return (
    <section className="memories-section" id="memories">
      <div className="section-heading">
        <h2>Our Little Memories 💗</h2>
        <p className="section-subtitle">Every moment with you is special.</p>
      </div>

      <div className="memory-gallery">
        {memories.map((memory) => (
          <figure className="memory-card" key={memory.id}>
            <div className="memory-photo">
              <img src={memory.image} alt={memory.title} loading="lazy" />
            </div>
            <figcaption className="memory-caption">
              <h3>{memory.title}</h3>
              <p>{memory.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="stage-actions">
        <button type="button" className="btn-primary" onClick={onNext}>
          Lanjut ke Kue <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  )
}
