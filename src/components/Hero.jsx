export function Hero({ onBegin }) {
  return (
    <header className="hero-section" id="hero">
      <p className="hero-kicker">A Little Surprise For You</p>
      <h1>Happy Birthday, Imelda Kirene</h1>
      <p className="hero-subtitle">I made something special just for you.</p>

      <div className="hero-actions">
        <button className="btn-primary" onClick={onBegin}>
          Buka Kejutan 💌
        </button>
      </div>

      <p className="hero-note">Lagu akan diputar otomatis saat kamu membuka kejutan.</p>
    </header>
  )
}
