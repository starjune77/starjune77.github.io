export function setupSystem(){
  let enabled=false,current=null,state='idle',section='home',frame=0,last=0,count=0;
  const toggle=document.querySelector('#dev-toggle'),hud=document.querySelector('#dev-hud');
  function inspect(){document.querySelector('#hud-module').textContent=current?.title.toUpperCase()||'NONE';document.querySelector('#inspector-content').innerHTML=current?`<strong>${current.title}</strong><div class="inspector-row">component<span>project-module</span></div><div class="inspector-row">categories<span>${current.categories.join(' / ')}</span></div><div class="inspector-row">technologies<span>${current.technologies.join(' / ')}</span></div><div class="inspector-row">state<span>${state}<br>selected: ${state==='selected'}<br>hovered: ${state==='hovered'}</span></div>`:'Hover or select a module.';}
  function fps(now){if(!enabled||document.hidden)return;count++;if(now-last>=750){document.querySelector('#hud-fps').textContent=Math.round(count*1000/(now-last));count=0;last=now;}frame=requestAnimationFrame(fps);}
  function toggleDev(){enabled=!enabled;toggle.setAttribute('aria-pressed',String(enabled));toggle.querySelector('span').textContent=enabled?'ON':'OFF';document.body.classList.toggle('dev-active',enabled);[hud,document.querySelector('#dev-scene'),document.querySelector('#dev-inspector')].forEach(e=>e.hidden=!enabled);cancelAnimationFrame(frame);if(enabled&&!document.hidden){last=performance.now();count=0;frame=requestAnimationFrame(fps);}inspect();}
  toggle.addEventListener('click',toggleDev);
  document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);if(enabled&&!document.hidden){count=0;last=performance.now();frame=requestAnimationFrame(fps);}document.body.classList.toggle('page-hidden',document.hidden);});
  const size=()=>document.querySelector('#hud-viewport').textContent=`${innerWidth} × ${innerHeight}`;size();addEventListener('resize',size,{passive:true});
  document.addEventListener('pointermove',e=>{if(enabled)document.querySelector('#hud-pointer').textContent=`${Math.round(e.clientX)} / ${Math.round(e.clientY)}`;},{passive:true});
  const sections=[...document.querySelectorAll('main>section')];const nav=[...document.querySelectorAll('.nav nav a')];
  const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);if(!visible.length)return;section=visible[0].target.id;document.querySelector('#hud-section').textContent=section.toUpperCase();nav.forEach(a=>{const active=a.hash===`#${section}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});},{rootMargin:'-15% 0px -50% 0px',threshold:[0,.2,.5]});sections.forEach(s=>observer.observe(s));
  const onModule=(p,s)=>{if(document.querySelector('#project-dialog').open&&s!=='selected')return;current=p;state=s;inspect();document.querySelector('.system-map').style.setProperty('--module-hue',p?.id==='morrowlab'?'1':'.7');};
  document.querySelector('#project-dialog').addEventListener('close',()=>{current=null;state='idle';inspect();});
  return {toggleDev,onModule};
}
export function setupAtmosphere(){
  const media=matchMedia('(pointer:fine) and (hover:hover)'),reduced=matchMedia('(prefers-reduced-motion:reduce)'),cursor=document.querySelector('#cursor'),map=document.querySelector('.system-map');
  let pending=0,x=0,y=0;
  function update(){pending=0;cursor.style.left=`${x}px`;cursor.style.top=`${y}px`;map.style.setProperty('--map-x',`${(x/innerWidth-.5)*12}px`);map.style.setProperty('--map-y',`${(y/innerHeight-.5)*10}px`);}
  function move(e){if(!media.matches||reduced.matches)return;x=e.clientX;y=e.clientY;if(!pending)pending=requestAnimationFrame(update);const target=e.target.closest('a,button,input');cursor.classList.toggle('interactive',!!target);const card=e.target.closest('[data-project]');cursor.querySelector('small').textContent=card?'INSPECT MODULE':'';}
  function configure(){document.body.classList.toggle('cursor-enabled',media.matches&&!reduced.matches);if(reduced.matches){cancelAnimationFrame(pending);pending=0;map.style.setProperty('--map-x','0px');map.style.setProperty('--map-y','0px');}}
  configure();media.addEventListener('change',configure);reduced.addEventListener('change',configure);document.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',()=>cursor.style.visibility='hidden');document.addEventListener('pointerenter',()=>cursor.style.visibility='visible');
}
