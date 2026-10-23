import {zones} from '../../js/world.js';
import {useLayoutEffect, useRef} from 'react';

function ZoneBanner({hud}) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    // Restart the existing CSS arrival animation without replacing the measured HUD node.
    if (hud.bannerVersion) ref.current.getAnimations().forEach(animation => {animation.currentTime = 0; animation.play();});
  }, [hud.bannerVersion]);
  return <p id="zone-banner" ref={ref} className={hud.bannerVersion ? 'show' : undefined} aria-live="polite">{hud.bannerVersion ? hud.banner : ''}</p>;
}

export function Tutorial({minimized}) {
  return <div id="tutorial" className={minimized ? 'minimized' : undefined}>
    <p className="eyebrow">JUNYOUNG OH / INTERACTIVE PORTFOLIO</p>
    <p className="tutorial-desktop"><kbd>A</kbd><kbd>D</kbd> Move <span>·</span> <kbd>Space</kbd> Jump <span>·</span> <kbd>Shift</kbd> Sprint <span>·</span> <kbd>E</kbd> Open</p>
    <p className="tutorial-touch">Move, jump, and open with the controls below.</p>
    <p className="muted tutorial-desktop">Jump into a kiosk from below, press E nearby, or click it. Read everything in Quick View.</p>
    <p className="muted tutorial-touch">Jump into a kiosk from below or tap Open nearby. Read everything in Quick View.</p>
  </div>;
}

export default function GameHUD({hud, onQuick, onInteract}) {
  return <>
    <header className="game-hud">
      <div className="hud-brand"><span>JY<span className="blue">/</span>LAB<span className="status-dot" /></span><p id="current-area">{hud.area}</p></div>
      <nav id="zone-progress" aria-label="World area progress">{zones.filter(zone => zone.id !== 'start').map(zone => {
        const current = hud.currentZone === zone.id;
        return <span key={zone.id} data-zone={zone.id} className={[current && 'current', hud.discovered.includes(zone.id) && 'visited'].filter(Boolean).join(' ')} aria-current={current ? 'location' : undefined}>{zone.short}</span>;
      })}</nav>
      <button className="button quick-control" onClick={onQuick}>Quick View <kbd>Q</kbd></button>
    </header>
    <Tutorial minimized={hud.tutorialMinimized} />
    <ZoneBanner hud={hud} />
    <button id="interaction-prompt" hidden={!hud.nearby} onClick={onInteract}>
      <span id="interaction-name">{hud.nearby?.label}</span><small id="interaction-detail">{hud.nearby?.subtitle}</small>
      <span className="prompt-desktop"><kbd>E</kbd> OPEN <span> / </span> JUMP TO ACCESS</span><span className="prompt-touch">TAP TO OPEN</span>
    </button>
  </>;
}
