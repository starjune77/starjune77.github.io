# Junyoung Oh — Interactive Portfolio

A 2D side-scrolling platformer portfolio. Visitors explore an original digital lab, or open a complete professional portfolio in **Quick View**.

Live: https://starjune77.github.io · Recruiter link: https://starjune77.github.io/?view=quick

## Controls and modes

- **World:** A/D or left/right arrows to move; Space (also W/up) to jump; E to open the closest block. Blocks also open when hit from below or clicked.
- **Quick View:** Q or the persistent button. Escape / Return to game restores the same world position. Panels pause physics and camera movement.
- **Touch:** Explore World / Quick View choice, then left, right, jump, and open buttons with multi-touch support.
- **Optional tools:** F2 for real diagnostics; backtick or the world terminal for the portfolio console.

## Technology and architecture

HTML, CSS, vanilla JavaScript, Canvas 2D, and ES modules. No build process, third-party runtime libraries, backend, audio, camera access, or API keys.

`script.js` initializes the app. `js/data.js` holds factual content. Game responsibilities are split across `game`, `player`, `physics`, `world`, `render-world`, `camera`, `input`, and `interactions`. DOM views use `panels`, `quick-view`, and shared `templates`; `mobile-controls`, `resume`, `terminal`, and `debug` add the supporting interfaces.

The world is 11,200 × 1,000 units, with continuous safe ground and optional platforms. Zones: Start → About → Projects → AI → Experience → Skills → Resume → Contact. A simulated uninterrupted traversal takes about 34 seconds. Reduced motion removes parallax and decorative animation and makes the camera follow directly. Animation stops when the page is hidden or an overlay is open. A semantic no-JavaScript fallback is included.

## Preview locally

From this repository, run:

```sh
node tools/preview.cjs
```

Keep that terminal open, then visit **http://127.0.0.1:8000** on the same computer. Ctrl+C stops it. If port 8000 is busy, run `node tools/preview.cjs 8001`. Opening `index.html` as a `file://` URL will not load ES modules. GitHub Pages serves the files directly.

## Checks

```sh
node --test tests/game.test.mjs
node tests/browser-check.cjs
```

The integration check uses installed Chrome, without npm packages. Set `CHROME_PATH` if needed. It checks gameplay, overlays, touch controls, links, demos, and the requested screen sizes. Screenshots and the isolated browser profile go in the OS temporary folder.

## Remaining assets

- **TODO:** Place the real PDF at `assets/resume/Junyoung_Oh_Resume.pdf`. Availability is checked automatically on load; refresh after adding it. Missing PDFs leave the buttons inactive. A missing optional file returns an expected HTTP 404, which is handled without a JavaScript exception.
- **TODO:** Add verified project repository URLs to `js/data.js` when supplied. None are inferred.
- The humanoid is original Canvas geometry. `Player.draw()` can later be replaced by a sprite renderer without changing physics.

All demos are labeled portfolio simulations; sample study data is fictional. No AI benchmark metrics or unprovided achievements are claimed.
