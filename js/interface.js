import {projects, skills} from './data.js';
export function setupContent(onModule) {
  const grid=document.querySelector('#project-grid');
  const preview='<div class="preview" aria-hidden="true"><h4>MORROW / STUDY CONTEXT</h4><div class="preview-row"><span>Study time</span><span>4h 21m</span></div><div class="preview-row"><span>Focus sessions</span><span>5</span></div><div class="preview-bars">'+[35,70,50,85,65,100,75,90].map(h=>`<i style="--height:${h}%"></i>`).join('')+'</div><div class="preview-row"><span>Next-day plan</span><span>→</span></div><p class="demo-note">Representative UI · fictional sample data</p></div>';
  projects.forEach((p,i)=>{
    const card=document.createElement('button'); card.className=`project-card ${i===0?'featured':''}`;card.dataset.project=p.id;card.setAttribute('aria-haspopup','dialog');
    card.innerHTML=`<div><div class="module-top"><span class="project-number">MODULE / 0${i+1}</span><span>${p.type.toUpperCase()}</span></div><h3>${p.title}</h3><p class="context">${p.context}${p.role?`<br>${p.role}`:''}</p><p>${p.description}</p><div class="tags">${p.technologies.join(' / ')}</div><div class="module-link">Inspect module ↗</div></div>${i===0?preview:''}`;
    card.addEventListener('click',()=>openProject(p,onModule));
    card.addEventListener('pointerenter',()=>onModule(p,'hovered'));card.addEventListener('pointerleave',()=>onModule(null,'idle'));
    card.addEventListener('focus',()=>onModule(p,'focused'));card.addEventListener('blur',()=>onModule(null,'idle'));grid.append(card);
  });
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    projects.forEach(p=>grid.querySelector(`[data-project="${p.id}"]`).hidden=button.dataset.filter!=='all'&&!p.categories.includes(button.dataset.filter));
  }));
  document.querySelector('#quick-projects').innerHTML=projects.map((p,i)=>`<div class="quick-project"><strong>0${i+1} / ${p.title}</strong><p>${p.description}</p></div>`).join('');
  document.querySelector('#skills').innerHTML=Object.entries(skills).map(([name,items])=>`<div><p class="eyebrow">${name}</p><div class="chips">${items.map(s=>`<span>${s}</span>`).join('')}</div></div>`).join('');
  document.querySelector('#scene-projects').innerHTML=projects.map(p=>`<a href="#work" data-scene="${p.id}">${p.title}</a>`).join('');
  document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>openProject(projects.find(p=>p.id===b.dataset.scene),onModule)));
}
function openProject(p,onModule){
  const diagram=p.id==='morrowlab'?'<h3>03 / CONCEPTUAL FLOW</h3><div class="architecture"><span>React interface</span><b>→</b><span>Activity / self-evaluation</span><b>→</b><span>Next-day plan</span></div><div class="architecture"><span>Camera</span><b>→</b><span>MediaPipe</span><b>→</b><span>On-device detection</span></div>':'';
  document.querySelector('#project-detail').innerHTML=`<p class="eyebrow">${p.type}${p.role?` / ${p.role}`:''}</p><h2>${p.title}</h2><h3>01 / CONTEXT</h3><p>${p.context}</p><h3>02 / WHAT I BUILT</h3><p>${p.description}</p>${p.contributions.length?`<ul>${p.contributions.map(c=>`<li>${c}</li>`).join('')}</ul>`:''}${diagram}<h3>TECHNOLOGY</h3><div class="chips">${p.technologies.map(t=>`<span>${t}</span>`).join('')}</div>`;
  onModule(p,'selected');document.querySelector('#project-dialog').showModal();
}
export function setupDialogs(){
  const dialogs=[...document.querySelectorAll('dialog')];
  dialogs.forEach(dialog=>{
    dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
    dialog.addEventListener('close',()=>{document.body.style.overflow=dialogs.some(d=>d.open)?'hidden':'';});
  });
  const observer=new MutationObserver(()=>{document.body.style.overflow=dialogs.some(d=>d.open)?'hidden':'';});dialogs.forEach(d=>observer.observe(d,{attributes:true,attributeFilter:['open']}));
  const quick=document.querySelector('#quick-dialog');
  const toggleQuick=()=>{if(quick.open)quick.close();else{dialogs.forEach(d=>d.close());quick.showModal();}};
  document.querySelectorAll('[data-quick]').forEach(b=>b.addEventListener('click',toggleQuick));
  document.querySelector('[data-resume-section]').addEventListener('click',()=>quick.close());
  return toggleQuick;
}
export function setupDemos(){
  const slider=document.querySelector('#study-hours');slider.addEventListener('input',()=>{
    const hours=Number(slider.value);document.querySelector('#hours-output').textContent=`${hours} hour${hours===1?'':'s'}`;
    const cs=hours*40,reading=hours*20;const format=m=>`${Math.floor(m/60)}h ${String(m%60).padStart(2,'0')}m`;
    document.querySelector('#cs-plan').textContent=format(cs);document.querySelector('#reading-plan').textContent=format(reading);
  });
  document.querySelector('#detection-toggle').addEventListener('click',e=>{const b=e.currentTarget,on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));b.querySelector('span').textContent=on?'ON':'OFF';document.querySelector('.detection-scene').classList.toggle('off',!on);});
  document.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#quiz-result').textContent=b.dataset.answer==='right'?'Correct. Verify the request through a known, trusted channel.':'Try again. Sharing your password can compromise your account.';}));
  const stages=[['Idea','Combine activity tracking and self-evaluation to inform next-day study schedules.'],['Core application','A React/TypeScript study application brings the interface and core features together.'],['Activity tracking','Activity and student self-evaluation provide context for study planning.'],['MediaPipe integration','Object detection and face tracking identify phone use and time away, on-device.'],['Testing','A testing checkpoint in this conceptual build sequence; specific test results are not provided.'],['Hackathon demo','Project context: Badger BuildFest, September 26–27, 2026, at UW–Madison.']];
  document.querySelector('.timeline').innerHTML=stages.map(([name],i)=>`<button data-stage="${i}" aria-pressed="${i===0}"><span>0${i+1}</span>${name}</button>`).join('');
  document.querySelectorAll('[data-stage]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.stage);document.querySelectorAll('[data-stage]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelector('#stage-number').textContent=`STAGE 0${i+1}`;document.querySelector('#stage-title').textContent=stages[i][0];document.querySelector('#stage-description').textContent=stages[i][1];}));
}
