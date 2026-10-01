import {profile,education} from './data.js';
import {aboutHTML,educationHTML,experienceHTML,skillsHTML,honorsHTML,resumeHTML,contactLinks,projectCards} from './templates.js';
import {escapeHTML as esc} from './utils.js';
export function quickViewHTML(){
  return `<main class="portfolio" id="quick-main"><section class="quick-hero" aria-labelledby="quick-title"><p class="eyebrow">${esc(profile.location)}</p><h1 id="quick-title">${esc(profile.name)}<span>.</span></h1><p class="quick-role">${esc(profile.role)}<br>${esc(education.university)}</p><p class="identity">${esc(profile.identity)}</p><p class="tagline">${esc(profile.tagline)}</p><div class="actions"><a class="button" href="#quick-resume">View resume ↗</a>${contactLinks()}<button class="button" data-return>Return to game</button></div></section><section id="quick-about"><div class="section-title"><p class="eyebrow">01</p><h2>About</h2></div>${aboutHTML()}</section><section id="quick-projects"><div class="section-title"><p class="eyebrow">02</p><h2>Featured projects</h2></div><div class="project-grid">${projectCards()}</div></section><section id="quick-experience"><div class="section-title"><p class="eyebrow">03</p><h2>Experience</h2></div><div class="experience-grid">${experienceHTML()}</div></section><section id="quick-skills"><div class="section-title"><p class="eyebrow">04</p><h2>Skills</h2></div><div class="skills-grid">${skillsHTML()}</div></section><section id="quick-education"><div class="section-title"><p class="eyebrow">05</p><h2>Education</h2></div>${educationHTML()}</section><section id="quick-honors"><div class="section-title"><p class="eyebrow">06</p><h2>Honors</h2></div>${honorsHTML()}</section><section id="quick-resume"><div class="section-title"><p class="eyebrow">07</p><h2>Resume</h2></div>${resumeHTML()}</section><section id="quick-contact"><div class="section-title"><p class="eyebrow">08</p><h2>Let’s build something useful.</h2></div><div class="actions">${contactLinks()}</div></section><footer>© ${new Date().getFullYear()} ${esc(profile.name)} · Built as an interactive portfolio.</footer></main>`;
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
