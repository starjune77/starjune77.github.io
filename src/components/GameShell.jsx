import {useLayoutEffect, useRef} from 'react';
import useGame from '../hooks/useGame.js';
import GameHUD from './GameHUD.jsx';
import MobileControls from './MobileControls.jsx';

export default function GameShell({engineRef, overlay, onOpen, onShortcut, onQuick, onCanvasUnavailable}) {
  const canvasRef = useRef(null), shellRef = useRef(null);
  const {hud, debug} = useGame({canvasRef, shellRef, engineRef, overlay, onOpen, onShortcut, onCanvasUnavailable});
  const onInteract = () => engineRef.current?.game.interact();
  useLayoutEffect(() => {
    document.documentElement.style.setProperty('--district', hud.accent);
    return () => document.documentElement.style.removeProperty('--district');
  }, [hud.accent]);
  return <main id="game-shell" ref={shellRef} aria-label="Interactive portfolio world">
    <canvas id="world" ref={canvasRef} tabIndex={0} aria-label="Junyoung Oh’s side-scrolling portfolio. A or D to move, Space to jump, Shift to sprint, E to interact, Q to read the complete portfolio.">Use Quick View to read the complete portfolio without Canvas.</canvas>
    <GameHUD hud={hud} onQuick={onQuick} onInteract={onInteract} />
    <MobileControls engineRef={engineRef} mode={overlay.mode} nearby={hud.nearby} onInteract={onInteract} />
    <div className="world-footer"><span>ORIGINAL CANVAS WORLD / NO CAMERA ACCESS</span><span>JUNYOUNG LAB · MADISON, WI</span></div>
    <pre id="debug-panel" hidden={!debug.enabled} aria-label="Live game diagnostics" data-labels={debug.labels}>{debug.text}</pre>
  </main>;
}
