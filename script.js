import {setupContent,setupDialogs,setupDemos} from './js/interface.js';
import {setupSystem,setupAtmosphere} from './js/system.js';
import {setupTerminal} from './js/terminal.js';
const system=setupSystem();
setupContent(system.onModule);
const toggleQuick=setupDialogs();
setupDemos();setupAtmosphere();
const toggleTerminal=setupTerminal(system.toggleDev);
document.querySelector('#year').textContent=new Date().getFullYear();
document.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey||e.repeat||e.target.closest('input,textarea,select,[contenteditable]'))return;
  const key=e.key.toLowerCase();
  if(key==='q'){e.preventDefault();toggleQuick();}
  if(key==='d'){e.preventDefault();system.toggleDev();}
  if(key==='`'){e.preventDefault();toggleTerminal();}
});
// TODO: Set this to true after placing the real PDF at the documented path.
const resumeAvailable = false;
if (resumeAvailable) {
  document.querySelectorAll('[data-resume]').forEach(a=>{a.removeAttribute('aria-disabled');a.removeAttribute('tabindex');});
  document.querySelector('#resume-status').textContent='Resume PDF available.';
}
document.querySelectorAll('[data-resume]').forEach(a=>a.addEventListener('click',e=>{if(a.getAttribute('aria-disabled')==='true')e.preventDefault();}));
