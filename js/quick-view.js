import {profile,education} from './data.js';
import {aboutHTML,educationHTML,experienceHTML,skillsHTML,skillsMarqueeHTML,honorsHTML,resumeHTML,contactLinks,projectCards} from './templates.js';
import {escapeHTML as esc} from './utils.js';
// Section numbers come from this order, so adding or moving a section keeps them sequential.
const sections=()=>[
  ['quick-about','About',aboutHTML()],
  ['quick-projects','Featured projects',`<div class="project-grid">${projectCards()}</div>`],
  ['quick-experience','Experience',`<div class="experience-grid">${experienceHTML()}</div>`],
  ['quick-skills','Skills',`<div class="skills-grid">${skillsHTML()}</div>`],
  ['quick-education','Education',educationHTML()],
  ['quick-honors','Honors',honorsHTML()],
  ['quick-resume','Resume',resumeHTML()],
  ['quick-contact','Let’s build something useful.',`<div class="actions">${contactLinks()}</div>`]
];
export function quickViewHTML(){
  const body=sections().map(([id,title,html],i)=>`<section id="${id}"><div class="section-title"><p class="eyebrow">${String(i+1).padStart(2,'0')}</p><h2>${esc(title)}</h2></div>${html}</section>`).join('');
  return `<main class="portfolio" id="quick-main"><section class="quick-hero" aria-labelledby="quick-title"><img class="hero-skyline" src="assets/accents/skyline.svg" width="640" height="170" alt=""><p class="eyebrow">${esc(profile.location)}</p><h1 id="quick-title">${esc(profile.name)}</h1><p class="quick-role">${esc(profile.role)}<br>${esc(education.university)}</p><p class="identity">${esc(profile.identity)}</p><p class="tagline">${esc(profile.tagline)}</p><div class="actions"><a class="button" href="#quick-resume">View resume ↗</a>${contactLinks()}<button class="button" data-return>Return to game</button></div></section>${body}${skillsMarqueeHTML()}<footer>© ${new Date().getFullYear()} ${esc(profile.name)} · Built as an interactive portfolio.</footer></main>`;
}
export function setupQuickView(dialog,overlays){
  dialog.querySelector('#quick-content').innerHTML=quickViewHTML();
  dialog.querySelectorAll('[data-return]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
  // A fragment inside a fixed dialog should scroll that dialog, not the frozen world.
  dialog.addEventListener('click',event=>{
    const anchor=event.target.closest('a[href^="#quick-"]');if(!anchor)return;
    const target=dialog.querySelector(anchor.getAttribute('href'));if(!target)return;
    event.preventDefault();target.scrollIntoView({block:'start',behavior:'auto'});
  });
  return () => {
    if(dialog.open){overlays.closeOthers(dialog);dialog.close();}
    else {overlays.closeOthers(dialog);overlays.open(dialog,'quick');}
  };
}
