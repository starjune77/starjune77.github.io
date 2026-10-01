import {createState} from './js/utils.js';
import {Game} from './js/game.js';
import {Input} from './js/input.js';
import {setupOverlays,setupPanels} from './js/panels.js';
import {setupQuickView} from './js/quick-view.js';
import {setupResume} from './js/resume.js';
import {setupTerminal} from './js/terminal.js';
import {setupDebug} from './js/debug.js';
import {setupMobileControls} from './js/mobile-controls.js';

const state=createState();
const canvas=document.querySelector('#world');
const overlays=setupOverlays(state,canvas);
const refreshResume=setupResume();
const debug=setupDebug(state);
const openPanel=setupPanels(overlays,()=>game.returnToStart(),refreshResume);
const toggleQuick=setupQuickView(document.querySelector('#quick-view'),overlays);
const toggleTerminal=setupTerminal(overlays,openPanel);
const game=new Game(canvas,state,block=>block.type==='terminal'?toggleTerminal():openPanel(block.type,block.contentId),debug);
const input=new Input(state,action=>{
  if(action==='KeyQ')toggleQuick();
  else if(action==='F2'){debug.toggle();game.render();}
  else if(action==='Backquote')toggleTerminal();
  else if(action==='interact')game.interact();
});
game.input=input;
document.addEventListener('click',event=>{if(event.target.closest('[data-quick]'))toggleQuick();});
setupMobileControls(input,state,overlays,toggleQuick,()=>game.interact());
document.querySelector('#interaction-prompt').addEventListener('click',()=>game.interact());
game.sync();refreshResume();
const directQuick=new URLSearchParams(location.search).get('view')==='quick'||location.hash==='#quick';
if(directQuick||!game.ctx)toggleQuick();
else if(location.hash.startsWith('#project-'))openPanel('project',location.hash.slice(9));
// No content is gated by Canvas support; the semantic Quick View remains usable.
document.documentElement.classList.add('ready');
