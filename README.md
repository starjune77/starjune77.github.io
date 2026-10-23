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

React owns all portfolio UI: the HUD, Quick View, project panels, terminal, mobile controls and diagnostics. Vite runs development and produces the static deployment output. The Canvas engine remains plain JavaScript to preserve its existing physics and rendering behavior.

- Entry: `index.html` -> `src/main.jsx` -> `src/App.jsx`.
- `src/components/`: JSX components, native modal dialogs, shared portfolio sections and stateful demos.
- `src/hooks/useGame.js`: creates the Canvas engine and input, synchronizes pause state, and releases listeners/animation frames/observers on cleanup.
- `src/hooks/useResume.js`: abortable PDF availability check shared by all resume links.
- `src/navigation.js`: deep links, panel headings and nested-dialog navigation.
- `js/data.js`: the single source of portfolio facts.
- `js/`: preserved player, physics, camera, world, input, interaction and rendering modules. `game.js` publishes HUD snapshots and `debug.js` publishes diagnostics instead of modifying UI elements.
- `style.css` and `assets/`: original design and supplied assets.

There is no HTML-string UI rendering. The old initializer, template modules and generated bundle have been retired. Semantic no-JavaScript content remains in `index.html`; Canvas unavailability opens Quick View automatically. The original `react-test.html` URL remains as a second entry to the complete application.

See [the beginner-friendly Korean architecture guide](docs/react-architecture.ko.md) for component relationships, hooks and maintenance examples. The older line-by-line guides describe the pre-React version.

## Install, develop and preview

Use Node.js 22.12+ (Node 24 recommended for this checkout).

```sh
npm ci
npm run dev
```

Open Vite's printed local URL. For the production output:

```sh
npm run build
npm run preview
```

Vite writes `dist/` with content-hashed JS/CSS and copies static assets without modifying the source `index.html`. Do not edit or commit `node_modules/` or `dist/`.

## Checks

```sh
npm test
npm run test:build
npm run test:browser
```

- Unit tests cover physics, district reachability, camera behavior, engine cleanup, React-rendered content, deep links and resume accessibility. A small Node loader reuses Vite's JSX transformer; no extra test framework is installed.
- Build checks verify the compiled entry, static assets, PDF, semantic fallback and removal of the legacy bundle.
- Browser checks use installed Chrome/Chromium (override with `CHROME_PATH`) and drive the production build. They cover keyboard/gameplay, all districts, dialogs, terminal history/commands, demos, touch/multi-touch, reduced motion, direct links, contrast, layout, missing PDFs and the no-JavaScript fallback. Screenshots and the isolated browser profile go in the OS temporary folder.
- To test a running dev/preview server, set `BROWSER_BASE_URL` to its origin before running `node tests/browser-check.cjs`. It must be a local server you control.

## GitHub Pages compatibility

Publish the contents of `dist/`, after `npm ci` and `npm run build`. The relative Vite base and copied assets support static hosting without a backend. Deep links use query strings and fragments, so no server-side routing is needed.

The CI workflow on the `react` branch only tests/builds. It does not deploy. If GitHub Pages currently publishes repository source files directly, configure a build-and-deploy workflow to publish `dist/` when deployment is authorized; serving the JSX source directly will not work. No remote settings, other branches, or deployments are changed by this migration.

## Art and assets

- **Original work:** all world art, the character, kiosks, landmarks, the SVG accents in `assets/accents/` and the favicon are drawn in code (Canvas 2D paths) or written by hand as SVG for this portfolio. They do not copy or imitate existing games, films or brands. Sign and billboard text uses the owner's own names (JY/LAB, Junyoung Oh, Madison, project names) or invented words.
- **Third party:** language icons in `assets/skills/` are from Devicon (MIT; see `assets/skills/LICENSE`).
- **Resume:** the supplied resume is at `assets/resume/Junyoung_Oh_Resume.pdf`. Availability is checked automatically on load; refresh after replacing it. Missing PDFs leave the buttons inactive, and the expected HTTP 404 is handled without a JavaScript exception.
- **TODO:** add verified project repository URLs to `js/data.js` when supplied. None are inferred.

All demos are labeled portfolio simulations; sample study data is fictional. No AI benchmark metrics or unprovided achievements are claimed.
