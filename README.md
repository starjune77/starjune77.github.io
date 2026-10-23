# Junyoung Oh — Interactive Portfolio

A 2D side-scrolling platformer portfolio set in the **Rain District**, an original neon city at night. Visitors run through eight districts, or open the complete professional portfolio in **Quick View**.

Live: https://starjune77.github.io · Recruiter link: https://starjune77.github.io/?view=quick

## Controls and modes

- **World:** A/D or left/right arrows to move; Space (also W/up) to jump; hold **Shift to sprint** (keyboard, about 1.35× speed); E to open the closest kiosk. Kiosks also open when hit from below or clicked.
- **Quick View:** Q or the persistent button. Escape / Return to game restores the same world position. Panels pause physics and camera movement.
- **Touch:** Explore World / Quick View choice, then left, right, jump, and open buttons with multi-touch support.
- **Optional tools:** backtick or the world terminal for the portfolio console; F2 for live diagnostics (FPS, render time, particle count). While F2 is open, keys 1–8 jump to each district.

## Movement

Run speed is 500 units/s (sprint 675), with acceleration 4,200, deceleration 5,300, jump velocity −820 and gravity 2,300. The jump keeps the old apex with less air time. Tuning lives in `MOVE` in `js/player.js`. The world is 11,200 × 1,000 units, with continuous safe ground and optional platforms. A simulated uninterrupted run takes about 22 seconds (about 16 seconds sprinting). Tests check that every kiosk can be hit from below and every platform can be reached.

The camera follows with a critically damped spring and an eased look-ahead. Rendering is interpolated between fixed 120 Hz physics steps, so motion stays smooth on any refresh rate.

## The world

Districts, each with its own landmark and accent colour: Start (rooftop gate) → About (ID-scanner arch) → Projects (night market) → AI (lens tower) → Experience (robotics workshop) → Skills (tram station) → Resume (archive vault) → Contact (comms mast).

- Three parallax skyline layers sit over a sky gradient with haze. A street level below the ground line has a wet deck, reflections, a girder underside, lamps, cables and a lower city.
- Animated details: rain, puddle ripples, flickering neon, holographic billboards, flying vehicles and steam.
- Interactive blocks are holographic kiosks; skill platforms are hovering tram decks. Hitboxes come only from `js/world.js`.
- **Performance:**
  - Static skyline pixels are pre-rendered to offscreen tiles and rebuilt on resize.
  - Off-screen objects are culled, and devicePixelRatio is capped at 2.
  - Particle counts are capped, and lower on touch and small screens.
- **Reduced motion** turns off rain, traffic, steam, flicker, parallax and scanline motion, and the camera follows directly. Animation also stops while the page is hidden or an overlay is open.
- **Layout:** world text never draws above the measured HUD band or below the ground line. The browser check enforces this at every tested viewport.

## Technology and architecture

React and Vite manage the UI, native dialogs, navigation, touch input and terminal. The existing Canvas 2D engine remains independent of React so 120 Hz physics and animation do not cause component renders. No backend, camera access, or API keys are required.

- `src/main.jsx`: React entry point and CSS import; development Strict Mode checks mount/cleanup.
- `src/App.jsx`: overlay state, keyboard/game integration, touch controls, deep links and nested Quick View panels.
- `src/GameShell.jsx`: stable Canvas/HUD boundary. The game engine owns the HUD's changing DOM values.
- `src/Dialog.jsx`: native modal focus, Escape and backdrop behavior.
- `src/Terminal.jsx`: controlled input and React output history (maximum 60 lines).
- `src/PortfolioContent.jsx`, `src/panel-content.js`: shared escaped HTML templates, interactive demos and PDF availability. Templates remain in `js/templates.js` and `js/quick-view.js`; they are deliberately isolated from React-owned elements.
- `js/data.js`: single source of factual portfolio content.
- `js/`: preserved physics, world generation, input, Canvas rendering and diagnostics.

The semantic no-JavaScript fallback remains in `index.html`. If Canvas is unavailable, the app opens Quick View automatically.

## Install and run

Use Node.js 22.12+ (Node 24 is used in CI).

```sh
npm ci
npm run dev
```

Open the local URL Vite prints. To check the production build:

```sh
npm run build
npm run preview
```

Vite writes content-hashed JavaScript/CSS to `dist/`; the build copies the resume, icons and other static assets there. Do not commit `node_modules/` or `dist/`. The previous custom bundler is replaced by Vite.

## Checks

```sh
npm test
npm run test:browser
```

Unit tests cover movement, sprint, jumps, kiosk/platform reachability, camera behavior and Quick View content. The integration check uses installed Chrome/Chromium and the production build; set `CHROME_PATH` if needed. It checks keyboard navigation, nested dialogs, terminal commands, demos, touch/multi-touch, reduced motion, deep links, Canvas fallback, contrast and ten viewport layouts. Screenshots and its isolated browser profile go in the OS temporary folder.

## GitHub Pages

`.github/workflows/pages.yml` builds and tests pull requests targeting `main`, and deploys `dist/` only on `main` pushes or a manual run on `main`. The migration branch does not deploy. In repository **Settings ? Pages ? Build and deployment ? Source**, select **GitHub Actions** before merging this branch. This local migration does not change the remote repository setting.

## Original version and migration branch

The original implementation remains on `main` at commit `0e1824c`. This migration is on `react-migration`. Use `git show main:js/terminal.js` to inspect the old terminal without switching branches, or compare with `git diff main...react-migration` after committing. Commit or stash local edits before switching branches.

The existing Korean line-by-line guides under `docs/` describe the pre-React version. See [the migration guide](docs/react-migration.ko.md) for the current file mapping.

## Art and assets

- **Original work:** all world art, the character, kiosks, landmarks, the SVG accents in `assets/accents/` and the favicon are drawn in code (Canvas 2D paths) or written by hand as SVG for this portfolio. They do not copy or imitate existing games, films or brands. Sign and billboard text uses the owner's own names (JY/LAB, Junyoung Oh, Madison, project names) or invented words.
- **Third party:** language icons in `assets/skills/` are from Devicon (MIT; see `assets/skills/LICENSE`).
- **Resume:** the supplied resume is at `assets/resume/Junyoung_Oh_Resume.pdf`. Availability is checked automatically on load; refresh after replacing it. Missing PDFs leave the buttons inactive, and the expected HTTP 404 is handled without a JavaScript exception.
- **TODO:** add verified project repository URLs to `js/data.js` when supplied. None are inferred.

All demos are labeled portfolio simulations; sample study data is fictional. No AI benchmark metrics or unprovided achievements are claimed.
