export function Finale({ onRestart }) {
  return (
    <section className="finale" id="finale">
      <p className="finale-kicker">The End… for now</p>
      <h2>
        Happy Birthday,
        <br />
        Imelda Kirene
      </h2>
      <p className="finale-text">
  A Little Surprise, Made Just for You ♡
</p>
<p className="finale-note">
  Wishing you endless happiness and beautiful things ahead. ✨
</p>

      <div className="stage-actions">
        <button type="button" className="btn-ghost" onClick={onRestart}>
          Ulangi dari Awal
        </button>
      </div>
    </section>
  )
}
