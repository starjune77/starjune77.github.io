// Canvas and its HUD are owned by the game engine; React mounts this stable boundary.
export default function GameShell(){return (
  <main id="game-shell" aria-label="Interactive portfolio world">
    <canvas id="world" tabIndex="0"
      aria-label="Junyoung Oh’s side-scrolling portfolio. A or D to move, Space to jump, Shift to sprint, E to interact, Q to read the complete portfolio.">Use
      Quick View to read the complete portfolio without Canvas.</canvas>
    <header className="game-hud">
      <div className="hud-brand"><span>JY<span className="blue">/</span>LAB<span className="status-dot"></span></span>
        <p id="current-area">SYSTEM START</p>
      </div>
      <nav id="zone-progress" aria-label="World area progress"></nav><button className="button quick-control"
        data-quick="">Quick View <kbd>Q</kbd></button>
    </header>
    <div id="tutorial">
      <p className="eyebrow">JUNYOUNG OH / INTERACTIVE PORTFOLIO</p>
      <p className="tutorial-desktop"><kbd>A</kbd><kbd>D</kbd> Move <span>·</span> <kbd>Space</kbd> Jump <span>·</span>
        <kbd>Shift</kbd> Sprint <span>·</span> <kbd>E</kbd> Open</p>
      <p className="tutorial-touch">Move, jump, and open with the controls below.</p>
      <p className="muted tutorial-desktop">Jump into a kiosk from below, press E nearby, or click it. Read everything in Quick View.</p>
      <p className="muted tutorial-touch">Jump into a kiosk from below or tap Open nearby. Read everything in Quick View.</p>
    </div>
    <p id="zone-banner" aria-live="polite"></p>
    <button id="interaction-prompt" hidden={true}><span id="interaction-name"></span><small
        id="interaction-detail"></small><span className="prompt-desktop"><kbd>E</kbd> OPEN <span> / </span> JUMP TO
        ACCESS</span><span className="prompt-touch">TAP TO OPEN</span></button>
    <div id="mobile-controls" aria-label="Touch game controls">
      <div><button data-touch="left" aria-label="Move left">←</button><button data-touch="right"
          aria-label="Move right">→</button></div>
      <div><button data-touch="jump" aria-label="Jump">Jump</button><button id="touch-open" disabled={true}>Open</button></div>
    </div>
    <div className="world-footer"><span>ORIGINAL CANVAS WORLD / NO CAMERA ACCESS</span><span>JUNYOUNG LAB · MADISON,
        WI</span></div>
    <pre id="debug-panel" hidden={true} aria-label="Live game diagnostics"></pre>
  </main>

);}
