import {Player} from './player.js';
import {Camera} from './camera.js';
import {createWorld,zoneAt,zones} from './world.js';
import {nearestInteraction,blockAt,Interactions} from './interactions.js';
import {WorldRenderer} from './render-world.js';
import {accentFor} from './palette.js';

const STEP=1/120;
const lerp=(a,b,k)=>a+(b-a)*k;

export class Game {
  constructor(canvas,state,onOpen,debug,{onUI=()=>{},hud=[]}={}) {
    this.events=new AbortController();this.onUI=onUI;this.bannerVersion=0;
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.state=state;
    this.world=createWorld();this.player=new Player();this.camera=new Camera();
    this.interactions=new Interactions(onOpen);this.debug=debug;
    this.renderer=this.ctx?new WorldRenderer(this.world):null;this.coarse=matchMedia('(pointer:coarse)');
    this.view={width:1,height:1,dpr:1};this.frame=0;this.previous=0;this.accumulator=0;this.alpha=1;this.prev=null;
    this.fps=0;this.frameCount=0;this.fpsStart=0;this.hovered=null;this.input=null;
    this.reduced=matchMedia('(prefers-reduced-motion:reduce)');
    this.tick=this.tick.bind(this);this.resize=this.resize.bind(this);this.sync=this.sync.bind(this);
    this.nearby=null;this.labels=[];
    // World labels are kept below everything the HUD band can show (see measureHud).
    this.hud=hud;
    this.hudObserver=typeof ResizeObserver==='function'?new ResizeObserver(()=>{this.measureHud();if(!this.frame)this.render();}):null;
    this.hud.forEach(element=>this.hudObserver?.observe(element));
    addEventListener('resize',this.resize,{passive:true,signal:this.events.signal});document.addEventListener('visibilitychange',this.sync,{signal:this.events.signal});
    this.coarse.addEventListener('change',this.resize);this.reduced.addEventListener('change',this.sync);
    this.unsubscribe=state.subscribe(this.sync);
    this.canvas.addEventListener('click',event=>{
      if(state.paused)return;const rect=canvas.getBoundingClientRect();
      const block=blockAt(this.camera.toWorld(event.clientX-rect.left,event.clientY-rect.top),this.world.blocks);
      if(block)this.interactions.activate(block,this.world.time);
    },{signal:this.events.signal});
    this.canvas.addEventListener('pointermove',event=>{
      if(state.paused)return;const rect=canvas.getBoundingClientRect();
      this.hovered=blockAt(this.camera.toWorld(event.clientX-rect.left,event.clientY-rect.top),this.world.blocks);
      canvas.style.cursor=this.hovered?'pointer':'default';
    },{passive:true,signal:this.events.signal});
    this.canvas.addEventListener('pointerleave',()=>{this.hovered=null;canvas.style.cursor='default';},{signal:this.events.signal});
    this.resize();this.publishUI();
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
    this.player.respawn({x,y:this.world.ground-this.player.height});this.camera.update(this.player,this.world.width,0,true);this.prev=null;this.render();
  }
  sync(){
    this.input?.clear();this.player.vx=0;
    cancelAnimationFrame(this.frame);this.frame=0;this.previous=0;this.accumulator=0;this.alpha=1;
    if(!this.state.paused&&!document.hidden&&this.ctx){this.fpsStart=performance.now();this.frameCount=0;this.frame=requestAnimationFrame(this.tick);}
    this.render();
  }
  tick(now){
    this.frame=0;if(this.state.paused||document.hidden)return;
    const dt=this.previous?Math.min((now-this.previous)/1000,.05):0;this.previous=now;
    this.accumulator+=dt;
    while(this.accumulator>=STEP&&!this.state.paused){this.update(STEP);this.accumulator-=STEP;}
    // Render between the last two physics steps so motion stays smooth at any refresh rate.
    this.alpha=Math.min(1,this.accumulator/STEP);
    this.frameCount++;if(now-this.fpsStart>=500){this.fps=Math.round(this.frameCount*1000/(now-this.fpsStart));this.fpsStart=now;this.frameCount=0;}
    this.render();if(!this.state.paused&&!document.hidden)this.frame=requestAnimationFrame(this.tick);
  }
  update(dt){
    this.prev={px:this.player.x,py:this.player.y,cx:this.camera.x};
    const controls=this.input.sample();this.world.time+=dt;
    const hit=this.player.update(controls,dt,this.world);
    if(hit){this.interactions.activate(hit,this.world.time);if(this.state.paused)return;}
    this.camera.update(this.player,this.world.width,dt,this.reduced.matches);
    const zone=zoneAt(this.player.x);
    if(zone.id!==this.state.currentZone){
      this.state.currentZone=zone.id;this.state.discovered.add(zone.id);
      this.world.checkpoint={x:zone.start+80,y:this.world.ground-this.player.height};
      this.bannerVersion++;
      this.publishUI();
    }
    if(this.player.x>220&&!this.tutorialMinimized){this.tutorialMinimized=true;this.publishUI();}
    const nearby=nearestInteraction(this.player,this.world.blocks);this.state.nearestInteraction=nearby;
    if(nearby!==this.nearby){this.nearby=nearby;this.publishUI();}
  }
  interact(){if(this.state.mode==='world')this.interactions.activate(this.state.nearestInteraction,this.world.time);}
  returnToStart(){
    this.prev=null;this.player.respawn({x:180,y:540});this.camera.update(this.player,this.world.width,0,true);
    this.state.currentZone='start';this.world.checkpoint={x:180,y:540};
    this.state.nearestInteraction=null;this.nearby=null;this.publishUI();this.render();
  }
  publishUI(){
    const zone=zones.find(zone=>zone.id===this.state.currentZone)||zones[0];
    this.onUI({currentZone:zone.id,area:zone.id==='start'?'SYSTEM START':zone.label.toUpperCase(),
      accent:accentFor(zone.id),discovered:[...this.state.discovered],banner:zone.label,bannerVersion:this.bannerVersion,
      tutorialMinimized:!!this.tutorialMinimized,nearby:this.nearby});
  }
  render(){
    if(!this.ctx)return;
    // Every text box drawn this frame, in CSS pixels, for layout checks (F2 exposes them).
    const labels=[];
    const {player,camera}=this.interpolated();
    this.renderer.render(this.ctx,this.world,player,camera,this.view,this.state,this.reduced.matches,this.hovered,labels);
    this.labels=labels;
    this.debug?.update(this);
  }
  // Read-only views of the player and camera, blended between physics steps for drawing.
  interpolated(){
    const p=this.prev,a=this.alpha;
    if(!p||a>=1||Math.abs(p.px-this.player.x)>100)return {player:this.player,camera:this.camera};
    return {player:Object.assign(Object.create(this.player),{x:lerp(p.px,this.player.x,a),y:lerp(p.py,this.player.y,a)}),camera:Object.assign(Object.create(this.camera),{x:lerp(p.cx,this.camera.x,a)})};
  }
  destroy(){this.events.abort();cancelAnimationFrame(this.frame);this.frame=0;this.hudObserver?.disconnect();this.coarse.removeEventListener('change',this.resize);this.reduced.removeEventListener('change',this.sync);this.unsubscribe();this.input?.destroy();}
}
