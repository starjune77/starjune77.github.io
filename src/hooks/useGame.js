import {useLayoutEffect, useRef, useState} from 'react';
import {Game} from '../../js/game.js';
import {Input} from '../../js/input.js';
import {createState} from '../../js/utils.js';
import {setupDebug} from '../../js/debug.js';
import {zones} from '../../js/world.js';

const initialHUD = {currentZone: 'start', area: 'SYSTEM START', accent: '#3fe3ee', discovered: ['start'], bannerVersion: 0, tutorialMinimized: false, nearby: null};

export default function useGame({canvasRef, shellRef, engineRef, overlay, onOpen, onShortcut, onCanvasUnavailable}) {
  const [hud, setHUD] = useState(initialHUD);
  const [debug, setDebug] = useState({enabled: false, text: '', labels: '[]'});
  const callbacks = useRef({onOpen, onShortcut, onCanvasUnavailable});
  useLayoutEffect(() => {callbacks.current = {onOpen, onShortcut, onCanvasUnavailable};});

  useLayoutEffect(() => {
    const state = createState();
    const reporter = setupDebug(state, setDebug);
    const elements = ['.hud-brand', '#zone-progress', '.quick-control', '#tutorial', '#zone-banner'].map(selector => shellRef.current.querySelector(selector));
    const game = new Game(canvasRef.current, state, block => {
      // Stop physics immediately, even before React commits the dialog render.
      state.setMode(block.type === 'terminal' ? 'terminal' : 'panel');
      callbacks.current.onOpen(block.type, block.contentId);
    }, reporter, {onUI: setHUD, hud: elements});
    const input = new Input(state, action => {
      if (action === 'F2') {reporter.toggle(); game.render();}
      else if (action === 'interact') game.interact();
      else if (action.startsWith('Digit') && reporter.enabled) game.teleport(zones[Number(action.slice(5)) - 1].start + 80);
      else callbacks.current.onShortcut(action);
    });
    game.input = input;
    engineRef.current = {game, input, state};
    game.sync();
    if (!game.ctx) callbacks.current.onCanvasUnavailable();
    document.documentElement.classList.add('ready');
    return () => {
      game.destroy(); engineRef.current = null;
      document.documentElement.classList.remove('ready');
    };
  }, [canvasRef, shellRef, engineRef]);

  useLayoutEffect(() => {
    const runtime = engineRef.current;
    if (!runtime) return;
    runtime.state.quickViewOpen = overlay.mode === 'quick' || overlay.returnTo === 'quick';
    const dialogId = {quick: 'quick-view', panel: 'info-panel', terminal: 'terminal-dialog', choice: 'mobile-choice'}[overlay.mode] || null;
    runtime.state.setMode(overlay.mode, dialogId);
    if (overlay.mode === 'world') canvasRef.current.focus({preventScroll: true});
  }, [overlay, engineRef, canvasRef]);

  // React has now committed the HUD. Measure its real size for world label placement.
  useLayoutEffect(() => {
    const game = engineRef.current?.game;
    game?.measureHud();
    if (game?.state.paused) game.render();
  }, [hud, engineRef]);

  return {hud, debug};
}
