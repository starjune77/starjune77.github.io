import {useEffect,useRef,useState} from 'react';
import GameShell from './GameShell.jsx';
import Dialog from './Dialog.jsx';
import Terminal from './Terminal.jsx';
import PortfolioContent from './PortfolioContent.jsx';
import {panelContent} from './panel-content.js';
import {quickViewHTML} from '../js/quick-view.js';
import {createState} from '../js/utils.js';
import {Game} from '../js/game.js';
import {Input} from '../js/input.js';
import {zones} from '../js/world.js';
import {setupDebug} from '../js/debug.js';

const quickHTML=quickViewHTML();
function initialOverlay(){
  if(new URLSearchParams(location.search).get('view')==='quick'||location.hash==='#quick')return {mode:'quick'};
  if(location.hash.startsWith('#project-'))return {mode:'panel',type:'project',id:location.hash.slice(9)};
  if(matchMedia('(pointer:coarse)').matches&&!new URLSearchParams(location.search).has('view'))return {mode:'choice'};
  return {mode:'world'};
}
export default function App(){
  const [overlay,setOverlay]=useState(initialOverlay);
  const runtime=useRef(null),actions=useRef(null);
  const close=mode=>setOverlay(current=>current.mode===mode?{mode:current.returnTo||'world'}:current);
  const openPanel=(type,id)=>{if(panelContent(type,id))setOverlay(current=>({mode:'panel',type,id,returnTo:current.mode==='quick'||current.returnTo==='quick'?'quick':undefined}));};
  const toggle=mode=>setOverlay(current=>current.mode===mode?{mode:'world'}:{mode});
  actions.current={openPanel,toggle};
  useEffect(()=>{
    const state=createState(),canvas=document.querySelector('#world'),debug=setupDebug(state);
    const game=new Game(canvas,state,block=>block.type==='terminal'?actions.current.toggle('terminal'):actions.current.openPanel(block.type,block.contentId),debug);
    const input=new Input(state,action=>{
      if(action==='KeyQ')actions.current.toggle('quick');
      else if(action==='Backquote')actions.current.toggle('terminal');
      else if(action==='F2'){debug.toggle();game.render();}
      else if(action==='interact')game.interact();
      else if(action.startsWith('Digit')&&debug.enabled)game.teleport(zones[Number(action.slice(5))-1].start+80);
    });
    game.input=input;runtime.current={state,game,input};game.sync();
    if(!game.ctx)setOverlay({mode:'quick'});
    const media=matchMedia('(pointer:coarse)');
    const touchUI=()=>document.body.classList.toggle('touch-device',media.matches);
    touchUI();media.addEventListener('change',touchUI);
    document.documentElement.classList.add('ready');
    return ()=>{game.destroy();runtime.current=null;media.removeEventListener('change',touchUI);document.body.classList.remove('touch-device');document.documentElement.classList.remove('ready');};
  },[]);
  useEffect(()=>{
    const current=runtime.current;if(!current)return;
    current.state.quickViewOpen=overlay.mode==='quick'||overlay.returnTo==='quick';
    current.state.setMode(overlay.mode,overlay.mode==='world'?null:overlay.mode);
    document.querySelectorAll('[data-touch]').forEach(button=>button.classList.remove('held'));
    if(overlay.mode==='world')document.querySelector('#world').focus({preventScroll:true});
  },[overlay]);
  function click(event){
    const target=event.target;
    if(target.closest('[data-quick],#quick-choice')){toggle('quick');return;}
    const opener=target.closest('[data-open]');if(opener){openPanel(opener.dataset.open,opener.dataset.id);return;}
    if(target.closest('[data-close],[data-return],#explore-choice')){close(overlay.mode);return;}
    if(target.closest('[data-start]')){runtime.current?.game.returnToStart();setOverlay({mode:'world'});return;}
    if(target.closest('#interaction-prompt,#touch-open'))runtime.current?.game.interact();
    const anchor=target.closest('a[href^="#quick-"]');
    if(anchor){const section=document.querySelector(anchor.getAttribute('href'));if(section){event.preventDefault();section.scrollIntoView({block:'start',behavior:'auto'});}}
  }
  function pointerDown(event){
    const button=event.target.closest('[data-touch]'),current=runtime.current;
    if(!button||!current||current.state.mode!=='world')return;
    event.preventDefault();button.setPointerCapture(event.pointerId);button.classList.add('held');current.input.setTouch(event.pointerId,button.dataset.touch);
  }
  function release(event){runtime.current?.input.releaseTouch(event.pointerId);event.target.closest('[data-touch]')?.classList.remove('held');}
  const panel=overlay.mode==='panel'?panelContent(overlay.type,overlay.id):null;
  return <div onClick={click} onPointerDown={pointerDown} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}>
    <button className="skip" data-quick="">Open accessible portfolio</button>
    <GameShell />
    <Dialog id="quick-view" className="quick-view" mode="quick" active={overlay.mode==='quick'||overlay.returnTo==='quick'} onClose={close} aria-labelledby="quick-title">
      <header className="quick-header"><a className="brand" href="#quick-main">Junyoung Oh</a><nav aria-label="Portfolio navigation"><a href="#quick-projects">Work</a><a href="#quick-experience">Experience</a><a href="#quick-skills">Skills</a><a href="#quick-resume">Resume</a><a href="#quick-contact">Contact</a></nav><button className="button return-button" data-close="">Return to game <span>×</span></button></header>
      <PortfolioContent id="quick-content" html={quickHTML} />
    </Dialog>
    <Dialog id="info-panel" className="info-panel" mode="panel" active={!!panel} onClose={close} aria-labelledby="panel-title">
      <div className="dialog-toolbar"><p id="panel-label" className="eyebrow">{panel?.label||'INFORMATION MODULE'}</p><div className="panel-tools"><button className="text-button" data-quick="">Quick View</button><button className="button" data-close="" aria-label="Close information panel">Close ×</button></div></div>
      <div className="panel-body"><h2 id="panel-title" tabIndex={-1}>{panel?.title}</h2><PortfolioContent id="panel-content" html={panel?.html||''} /></div>
    </Dialog>
    <Dialog id="terminal-dialog" className="terminal-dialog" mode="terminal" active={overlay.mode==='terminal'} onClose={close} aria-labelledby="terminal-title">
      <div className="dialog-toolbar"><h2 id="terminal-title" className="eyebrow">JUNYOUNG@PORTFOLIO:~</h2><button className="button" data-close="" aria-label="Close terminal">Close ×</button></div>
      <Terminal onResume={()=>openPanel('resume')} />
    </Dialog>
    <Dialog id="mobile-choice" className="mobile-choice" mode="choice" active={overlay.mode==='choice'} onClose={close} aria-labelledby="choice-title">
      <p className="eyebrow">JUNYOUNG LAB</p><h2 id="choice-title">Choose your<br />way in.</h2><p>Explore a playable digital world, or read the full professional portfolio.</p><div className="actions"><button id="explore-choice" className="button primary">Explore world →</button><button id="quick-choice" className="button">Quick View →</button></div>
    </Dialog>
  </div>;
}
