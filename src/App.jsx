import {useEffect, useRef, useState} from 'react';
import GameShell from './components/GameShell.jsx';
import QuickView from './components/QuickView.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import Terminal from './components/Terminal.jsx';
import {MobileChoice} from './components/MobileControls.jsx';
import useResume from './hooks/useResume.js';
import {closeOverlay, overlayFromLocation, panelHeading} from './navigation.js';

export default function App() {
  const [overlay, setOverlay] = useState(() => overlayFromLocation(location, matchMedia('(pointer:coarse)').matches));
  const engineRef = useRef(null);
  const resumeAvailable = useResume();
  const close = mode => setOverlay(current => closeOverlay(current, mode));
  const toggleQuick = () => setOverlay(current => ({mode: current.mode === 'quick' ? 'world' : 'quick'}));
  const openPanel = (type, id) => {
    if (!panelHeading(type, id)) return;
    setOverlay(current => ({mode: 'panel', type, id, returnTo: current.mode === 'quick' || current.returnTo === 'quick' ? 'quick' : undefined}));
  };
  function openKiosk(type, id) {
    if (type === 'terminal') setOverlay({mode: 'terminal'});
    else openPanel(type, id);
  }
  function shortcut(action) {
    if (action === 'KeyQ') toggleQuick();
    if (action === 'Backquote') setOverlay(current => ({mode: current.mode === 'terminal' ? 'world' : 'terminal'}));
  }
  function returnToStart() {engineRef.current?.game.returnToStart(); setOverlay({mode: 'world'});}
  useEffect(() => {
    const navigate = () => setOverlay(overlayFromLocation(location));
    addEventListener('hashchange', navigate);
    return () => removeEventListener('hashchange', navigate);
  }, []);
  useEffect(() => {
    if (overlay.mode === 'quick' && location.hash.startsWith('#quick-')) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({block: 'start', behavior: 'auto'});
    }
  }, [overlay]);
  return <>
    <button className="skip" onClick={toggleQuick}>Open accessible portfolio</button>
    <GameShell engineRef={engineRef} overlay={overlay} onOpen={openKiosk} onShortcut={shortcut} onQuick={toggleQuick} onCanvasUnavailable={() => setOverlay({mode: 'quick'})} />
    <QuickView active={overlay.mode === 'quick' || overlay.returnTo === 'quick'} onClose={close} onOpen={openPanel} resumeAvailable={resumeAvailable} />
    <InfoPanel overlay={overlay} onClose={close} onOpen={openPanel} onQuick={toggleQuick} onStart={returnToStart} resumeAvailable={resumeAvailable} />
    <Terminal active={overlay.mode === 'terminal'} onClose={close} onResume={() => openPanel('resume')} />
    <MobileChoice active={overlay.mode === 'choice'} onClose={close} onQuick={toggleQuick} />
  </>;
}
