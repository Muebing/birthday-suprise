# AGENTS.md

Personal birthday-surprise site: a single-page React app (React 19 + Vite 8) presented as a staged
experience, one section per screen: intro → letter (envelope + confetti) → feelings envelopes →
photo memories → cake (blow/tap out candles) → finale. No backend, no API, no auth. Runs locally.

## Commands

| Task | Command |
|---|---|
| Install | `npm install` (npm; lockfile is `package-lock.json`) |
| Dev server (HMR) | `npm run dev` |
| Production build | `npm run build` → `dist/` |
| Lint | `npm run lint` |
| Preview a build | `npm run preview` |

- **No tests, no typecheck, no formatter.** Verification = `npm run lint` + `npm run build` + look at it in a browser.
- Linter is **oxlint**, not ESLint (`npm run lint` → `oxlint`; config in `.oxlintrc.json`).
  - `npm run lint` prints **nothing** when clean — silence is success. Use
    `npx oxlint --format=github` to see the summary (currently 0 warnings / 0 errors, 16 files).
  - `react/rules-of-hooks` = error. `react/only-export-components` = warn: exporting plain
    *constants* is allowed (`allowConstantExport`), but exporting a *function* from a file that also
    exports a component triggers the warning.
- Vite 8 uses **Rolldown** + **lightningcss**. No Sass/PostCSS/Tailwind config; plain CSS only.

## Assets — all in `public/`, referenced by absolute URL string

- Photos (`public/photos/*.jpg`), the song (`public/Biru.mp3`) and `public/favicon.svg` live in
  `public/` and are referenced as plain strings: `src="/photos/1m3l.jpg"`, `src="/Biru.mp3"`.
  **Do not `import` them and do not move them into `src/assets/`** — Vite serves `public/` at the
  site root, so imported/bundled paths would break.
- `Biru.mp3` is ~8.2 MB and is copied verbatim into `dist/`. Don't add large binaries unprompted.
- `src/assets/` (`hero.png`, `react.svg`, `vite.svg`) and `public/icons.svg` are unused Vite
  template leftovers; nothing references them.
- Fonts are loaded from Google Fonts in `index.html` (Caveat, Cormorant Garamond, Great Vibes).
  `src/index.css` declares serif/cursive fallbacks, so offline dev still works but looks different.

## Code structure

- Entry chain: `index.html` → `src/main.jsx` (React 19 `createRoot` + `StrictMode`) → `src/App.jsx`.
- `src/App.jsx` is **orchestration only**: it owns `step` (index into `STAGES`), letter `isOpen`,
  the audio element/`isPlaying`, and confetti timing. Don't grow it with markup that belongs in a
  component.
- Stage flow: forward via each section's `onNext`; back and dot navigation are handled by
  `StageShell` (`src/components/StageShell.jsx`). Dots for unvisited future stages are disabled, so
  a "jump forward" button must call `onNext`/`setStep` rather than rely on the dots.
  `StageShell` remounts the stage (`key={step}`), focuses `main`, and scrolls to top on every step.
  Remounting **resets component-local state** on every navigation (leaving the cake relights its
  candles; the letter stays open only because `isOpen` lives in `App`).
- Sections live in `src/components/*.jsx` as **named exports** (`Hero`, `Letter`, `Feelings`,
  `Memories`, `Cake`, `Finale`, `FloatingHearts`, `AmbientBackground`, `StageShell`), composed in
  `App.jsx`.
- Third-party behavior is only `canvas-confetti` (fired from `App.jsx`) and `motion`
  (`motion/react` in `AmbientBackground`); no router, state library, or CSS framework.
- Editable content lives in `src/data/`: `letterContent.js` (date, greeting, paragraphs, sign-off),
  `memories.js` (photo path + title/caption), `feelings.js` (four envelopes). Prefer editing these
  over touching JSX when the copy or gallery changes.
- Local component state only (`useState`/`useRef`) — no global state, router, or data layer.

## Audio and microphone quirks

- Audio is **not** behind a "Play Music" button. `App.jsx` attempts `play()` on mount and again on
  the first `pointerdown`/`keydown` anywhere; the rejection is swallowed. There is no pause control:
  `isPlaying` only toggles the `.music-eq` indicator. Keep new audio behind a user gesture and don't
  rely on autoplay succeeding.
- `Cake` uses `src/hooks/useBlowDetection.js`: `getUserMedia` + `AudioContext` analyser, requiring a
  real blow (RMS + low-frequency energy held for several frames, with cooldown). Mic capture starts
  only when the user clicks "Aktifkan Mikrofon" — there is no auto permission prompt. Must run on
  `localhost` or HTTPS — opening the dev server over a LAN IP (`vite --host` + `http://192.168…`)
  silently has no `getUserMedia`. Denied/unsupported/error states fall back to tapping candles; the
  manual "Tiup manual saja" link also enables tapping. The mic is stopped when all candles are out
  and cleaned up on unmount.

## Styling

- **All app styles live in `src/index.css`** — one global plain-CSS file (~2,000 lines). Tokens
  (colors, fonts, shadows, radii, easings) are CSS custom properties at the top under `:root`;
  reuse them instead of hardcoding new colors.
- No CSS modules, no component-scoped styles, and **no `src/App.css`** (it was Vite boilerplate and
  is gone). `index.css` styles bare `img`/`button` elements, so new markup inherits those rules.
- The file has responsive breakpoints at 900 / 650 / 380 px and a global `prefers-reduced-motion`
  block at the end — put new animations/transitions inside that convention.
- Exception to "CSS only": `AmbientBackground` drives its orbs/petals/motes with `motion` and calls
  `useReducedMotion()` in JS. CSS `prefers-reduced-motion` does not cover those inline animations.
- Add a section by appending classes to `index.css` and using `className` in JSX.

## Language / content conventions

- **Comments are in Indonesian.** Body copy (letter, feelings, cake instructions, navigation
  buttons) is Indonesian; decorative kickers and major headings are English. Match that split
  rather than translating everything to one language.
- The photos, letter text, feelings text and song are personal content for one specific person —
  don't rewrite, reorder or remove them unless asked.

## Repo state

- This folder is **not a git repository** (no `.git`) — `git status`/`git diff` fail until the owner
  inits one. Don't assume a branch/PR workflow.
- `README.md` is the **unmodified Vite template README** and says nothing about this project.
  Ignore it; this file is the source of truth.
- `dist/` is a previous build and is gitignored; regenerate it rather than editing it.
