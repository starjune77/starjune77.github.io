import {projects,profile,contact} from './data.js';
import {aboutHTML,educationHTML,experienceHTML,skillsHTML,honorsHTML,resumeHTML,contactLinks,projectCards,projectHTML,aiDemo,chips} from './templates.js';

export function setupOverlays(state,canvas) {
  const dialogs=[...document.querySelectorAll('dialog')];
  const sync=()=>{
    state.quickViewOpen=document.querySelector('#quick-view').open;
    const open=dialogs.filter(dialog=>dialog.open).at(-1);
    state.setMode(open?.dataset.mode||'world',open?.id||null);
    if(!open)canvas.focus({preventScroll:true});
  };
  dialogs.forEach(dialog=>{
    dialog.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
    dialog.addEventListener('close',sync);
    dialog.addEventListener('click',event=>{
      if(event.target!==dialog||dialog.id==='quick-view'||dialog.id==='mobile-choice')return;
      const rect=dialog.getBoundingClientRect();
      if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
    });
  });
  return {
    open(dialog,mode){dialog.dataset.mode=mode;if(!dialog.open)dialog.showModal();sync();},
    closeOthers(except){dialogs.filter(d=>d!==except&&d.open).forEach(d=>d.close());},
    closeTop(){dialogs.filter(d=>d.open).at(-1)?.close();}
  };
}
export function setupPanels(overlays,onReturnToStart,refreshResume){
  const dialog=document.querySelector('#info-panel'),content=document.querySelector('#panel-content');
  const open=(type,id)=>{
    let title,html,label;
    if(type==='project'){
      const project=projects.find(p=>p.id===id);if(!project)return;
      title=project.title;label=`PROJECT MODULE / 0${projects.indexOf(project)+1}`;html=projectHTML(project);
    } else {
      const pages={
        about:[profile.name,'IDENTITY RECORD',`${aboutHTML()}<h3>Education</h3>${educationHTML()}<h3>Honors</h3>${honorsHTML()}`],
        projects:['Projects','FOUR SYSTEMS',`<p>Applications, interactive learning, and computer vision experiments.</p><div class="project-grid">${projectCards()}</div>`],
        ai:['AI / Experiments','COMPUTER VISION',`<p>Computer vision and machine learning exploration through MorrowLab and the Object Detection Prototype.</p>${chips(['MediaPipe','YOLO','PyTorch','NumPy'])}${aiDemo()}<div class="actions"><button class="button" data-open="project" data-id="morrowlab">MorrowLab ↗</button><button class="button" data-open="project" data-id="detection">Object Detection ↗</button></div>`],
        experience:['Experience','ROBOTICS / LEADERSHIP',experienceHTML()],
        skills:['Skills','SYSTEM CAPABILITIES',skillsHTML()],
        resume:[profile.name,'RESUME ARCHIVE',`${educationHTML()}${resumeHTML()}`],
        contact:['Let’s build something useful.','COMMUNICATION NODE',`<p>${profile.location}<br>${contact.email}</p><div class="actions">${contactLinks()}</div>`],
        end:['Thanks for exploring.','JUNYOUNG LAB',`<p>${profile.tagline}</p><div class="actions"><button class="button" data-quick>Quick View</button>${contactLinks()}<button class="button" data-start>Return to start</button></div>`]
      };
      if(!pages[type])return;[title,label,html]=pages[type];
    }
    document.querySelector('#panel-label').textContent=label;
    document.querySelector('#panel-title').textContent=title;
    content.innerHTML=html;dialog.scrollTop=0;
    overlays.open(dialog,'panel');document.querySelector('#panel-title').focus({preventScroll:true});
    refreshResume();setupDemoControls(content);
  };
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-open]');if(button)open(button.dataset.open,button.dataset.id);
    if(event.target.closest('[data-start]')){dialog.close();onReturnToStart();}
  });
  return open;
}
function setupDemoControls(content){
  const slider=content.querySelector('#study-hours');
  slider?.addEventListener('input',()=>{
    const hours=Number(slider.value),format=minutes=>`${Math.floor(minutes/60)}h ${String(minutes%60).padStart(2,'0')}m`;
    content.querySelector('#hours-output').textContent=`${hours} hour${hours===1?'':'s'}`;
    content.querySelector('#cs-plan').textContent=format(hours*40);content.querySelector('#reading-plan').textContent=format(hours*20);
  });
  content.querySelector('#detection-toggle')?.addEventListener('click',event=>{
    const button=event.currentTarget,on=button.getAttribute('aria-pressed')!=='true';
    button.setAttribute('aria-pressed',String(on));button.textContent=`Detection overlay: ${on?'ON':'OFF'}`;
    content.querySelector('.detection-scene').classList.toggle('off',!on);
  });
}
