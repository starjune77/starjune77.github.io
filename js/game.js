import {Player} from './player.js';
import {Camera} from './camera.js';
import {createWorld,zoneAt,zones} from './world.js';
import {nearestInteraction,blockAt,Interactions} from './interactions.js';
import {WorldRenderer} from './render-world.js';

export class Game {
  constructor(canvas,state,onOpen,debug) {
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.state=state;
    this.world=createWorld();this.player=new Player();this.camera=new Camera();
    this.interactions=new Interactions(onOpen);this.debug=debug;
    this.renderer=this.ctx?new WorldRenderer(this.world):null;this.coarse=matchMedia('(pointer:coarse)');
    this.view={width:1,height:1,dpr:1};this.frame=0;this.previous=0;this.accumulator=0;
    this.fps=0;this.frameCount=0;this.fpsStart=0;this.hovered=null;this.input=null;
    this.reduced=matchMedia('(prefers-reduced-motion:reduce)');
    this.tick=this.tick.bind(this);this.resize=this.resize.bind(this);this.sync=this.sync.bind(this);
    this.prompt=document.querySelector('#interaction-prompt');this.nearby=null;this.labels=[];
    // World labels are kept below everything the HUD band can show (see measureHud).
    this.hud=['.hud-brand','#zone-progress','.quick-control','#tutorial','#zone-banner'].map(s=>document.querySelector(s)).filter(Boolean);
    this.hudObserver=typeof ResizeObserver==='function'?new ResizeObserver(()=>{this.measureHud();if(!this.frame)this.render();}):null;
    this.hud.forEach(element=>this.hudObserver?.observe(element));
    document.querySelector('#zone-progress').innerHTML=zones.filter(z=>z.id!=='start').map(z=>`<span data-zone="${z.id}">${z.short}</span>`).join('');
    addEventListener('resize',this.resize,{passive:true});document.addEventListener('visibilitychange',this.sync);
    this.unsubscribe=state.subscribe(this.sync);
    this.canvas.addEventListener('click',event=>{
      if(state.paused)return;const rect=canvas.getBoundingClientRect();
      const block=blockAt(this.camera.toWorld(event.clientX-rect.left,event.clientY-rect.top),this.world.blocks);
      if(block)this.interactions.activate(block,this.world.time);
    });
    this.canvas.addEventListener('pointermove',event=>{
      if(state.paused)return;const rect=canvas.getBoundingClientRect();
      this.hovered=blockAt(this.camera.toWorld(event.clientX-rect.left,event.clientY-rect.top),this.world.blocks);
      canvas.style.cursor=this.hovered?'pointer':'default';
    },{passive:true});
    this.canvas.addEventListener('pointerleave',()=>{this.hovered=null;canvas.style.cursor='default';});
    this.resize();
  }
  resize(){
    this.view.width=innerWidth;this.view.height=innerHeight;this.view.dpr=Math.min(devicePixelRatio||1,2);
    this.canvas.width=Math.round(this.view.width*this.view.dpr);this.canvas.height=Math.round(this.view.height*this.view.dpr);
    // Touch and small screens get fewer particles and lighter offscreen layers.
    this.view.lowQuality=this.coarse.matches||Math.min(this.view.width,this.view.height)<600;
    this.camera.resize(this.view.width,this.view.height);this.camera.update(this.player,this.world.width,0,true);
    this.renderer?.resize(this.view);this.measureHud();this.render();
  }
  measureHud(){
    let bottom=0;
    for(const element of this.hud){const r=element.getBoundingClientRect();if(r.width&&r.height)bottom=Math.max(bottom,r.bottom);}
    this.view.safeTop=bottom;
  }
  teleport(x){
    if(this.state.mode!=='world')return;
    this.player.respawn({x,y:this.world.ground-this.player.height});this.camera.update(this.player,this.world.width,0,true);this.render();
  }
  sync(){
    this.input?.clear();this.player.vx=0;
    cancelAnimationFrame(this.frame);this.frame=0;this.previous=0;this.accumulator=0;
    if(!this.state.paused&&!document.hidden&&this.ctx){this.fpsStart=performance.now();this.frameCount=0;this.frame=requestAnimationFrame(this.tick);}
    this.render();
  }
  tick(now){
    this.frame=0;if(this.state.paused||document.hidden)return;
    const dt=this.previous?Math.min((now-this.previous)/1000,.05):0;this.previous=now;
    this.accumulator+=dt;
    while(this.accumulator>=1/120&&!this.state.paused){this.update(1/120);this.accumulator-=1/120;}
    this.frameCount++;if(now-this.fpsStart>=500){this.fps=Math.round(this.frameCount*1000/(now-this.fpsStart));this.fpsStart=now;this.frameCount=0;}
    this.render();if(!this.state.paused&&!document.hidden)this.frame=requestAnimationFrame(this.tick);
  }
  update(dt){
    const controls=this.input.sample();this.world.time+=dt;
    const hit=this.player.update(controls,dt,this.world);
    if(hit){this.interactions.activate(hit,this.world.time);if(this.state.paused)return;}
    this.camera.update(this.player,this.world.width,dt,this.reduced.matches);
    const zone=zoneAt(this.player.x);
    if(zone.id!==this.state.currentZone){
      this.state.currentZone=zone.id;this.state.discovered.add(zone.id);
      this.world.checkpoint={x:zone.start+80,y:this.world.ground-this.player.height};
      document.querySelector('#current-area').textContent=zone.label.toUpperCase();
      document.querySelectorAll('[data-zone]').forEach(element=>{const current=element.dataset.zone===zone.id;element.classList.toggle('current',current);if(current)element.setAttribute('aria-current','location');else element.removeAttribute('aria-current');});
      const banner=document.querySelector('#zone-banner');banner.textContent=zone.label;banner.classList.remove('show');void banner.offsetWidth;banner.classList.add('show');
    }
    if(this.player.x>220&&!this.tutorialMinimized){this.tutorialMinimized=true;document.querySelector('#tutorial').classList.add('minimized');}
    const nearby=nearestInteraction(this.player,this.world.blocks);this.state.nearestInteraction=nearby;
    if(nearby!==this.nearby){
      this.nearby=nearby;this.prompt.hidden=!nearby;
      document.querySelector('#interaction-name').textContent=nearby?.label||'';
      document.querySelector('#interaction-detail').textContent=nearby?.subtitle||'';
      document.querySelector('#touch-open').disabled=!nearby;
    }
  }
  interact(){if(this.state.mode==='world')this.interactions.activate(this.state.nearestInteraction,this.world.time);}
  returnToStart(){this.player.respawn({x:180,y:540});this.camera.update(this.player,this.world.width,0,true);this.state.currentZone='start';this.world.checkpoint={x:180,y:540};document.querySelector('#current-area').textContent='SYSTEM START';document.querySelectorAll('[data-zone]').forEach(e=>{e.classList.remove('current');e.removeAttribute('aria-current');});this.render();}
  render(){
    if(!this.ctx)return;
    // Every text box drawn this frame, in CSS pixels, for layout checks (F2 exposes them).
    const labels=[];
    this.renderer.render(this.ctx,this.world,this.player,this.camera,this.view,this.state,this.reduced.matches,this.hovered,labels);
    this.labels=labels;
    this.debug?.update(this);
  }
  destroy(){cancelAnimationFrame(this.frame);this.hudObserver?.disconnect();removeEventListener('resize',this.resize);document.removeEventListener('visibilitychange',this.sync);this.unsubscribe();this.input?.destroy();}
}
