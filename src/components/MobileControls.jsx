import {useEffect, useState} from 'react';
import Dialog from './Dialog.jsx';

function TouchButton({action, label, children, engineRef, mode}) {
  const [held, setHeld] = useState(false);
  useEffect(() => {setHeld(false);}, [mode]);
  function press(event) {
    if (engineRef.current?.state.mode !== 'world') return;
    event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId);
    engineRef.current.input.setTouch(event.pointerId, action); setHeld(true);
  }
  function release(event) {engineRef.current?.input.releaseTouch(event.pointerId); setHeld(false);}
  return <button data-touch={action} aria-label={label} className={held ? 'held' : undefined} onPointerDown={press} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}>{children}</button>;
}

export default function MobileControls({engineRef, mode, nearby, onInteract}) {
  useEffect(() => {
    const media = matchMedia('(pointer:coarse)');
    const update = () => document.body.classList.toggle('touch-device', media.matches);
    update(); media.addEventListener('change', update);
    return () => {media.removeEventListener('change', update); document.body.classList.remove('touch-device');};
  }, []);
  return <div id="mobile-controls" aria-label="Touch game controls"><div>
    <TouchButton action="left" label="Move left" engineRef={engineRef} mode={mode}>←</TouchButton>
    <TouchButton action="right" label="Move right" engineRef={engineRef} mode={mode}>→</TouchButton>
  </div><div><TouchButton action="jump" label="Jump" engineRef={engineRef} mode={mode}>Jump</TouchButton><button id="touch-open" disabled={!nearby} onClick={onInteract}>Open</button></div></div>;
}

export function MobileChoice({active, onClose, onQuick}) {
  return <Dialog id="mobile-choice" className="mobile-choice" mode="choice" active={active} onClose={onClose} aria-labelledby="choice-title">
    <p className="eyebrow">JUNYOUNG LAB</p><h2 id="choice-title">Choose your<br />way in.</h2><p>Explore a playable digital world, or read the full professional portfolio.</p>
    <div className="actions"><button id="explore-choice" className="button primary" onClick={() => onClose('choice')}>Explore world →</button><button id="quick-choice" className="button" onClick={onQuick}>Quick View ↗</button></div>
  </Dialog>;
}
