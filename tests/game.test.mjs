import test from 'node:test';
import assert from 'node:assert/strict';
import {Player} from '../js/player.js';
import {Camera} from '../js/camera.js';
import {createWorld,zoneAt,zones} from '../js/world.js';
import {nearestInteraction,Interactions} from '../js/interactions.js';
import {createState} from '../js/utils.js';
import {projects} from '../js/data.js';

const step = (player,world,seconds,input={axis:0,jumpHeld:false,jumpPressed:false}) => {
  const hits=[];
  for(let i=0;i<Math.round(seconds*120);i++) {
    const hit=player.update({...input,jumpPressed:input.jumpPressed&&i===0},1/120,world);
    if(hit)hits.push(hit.id);
  }
  return hits;
};
test('A/D movement accelerates, stops promptly, and stays on the floor',()=>{
  const world=createWorld(),player=new Player();
  step(player,world,1,{axis:1});assert(player.x>470&&player.x<500);assert.equal(player.y,540);assert(player.grounded);
  const previous=player.x;step(player,world,.2);assert(player.x-previous<20);assert.equal(player.vx,0);
  step(player,world,1,{axis:-1});assert(player.x<250);
});
test('jump rises and lands; a released jump has a shorter arc',()=>{
  const world=createWorld(),held=new Player(),short=new Player();
  step(held,world,.25,{axis:0,jumpPressed:true,jumpHeld:true});
  step(short,world,.25,{axis:0,jumpPressed:true,jumpHeld:false});
  assert(held.y<440);assert(short.y>held.y);
  step(held,world,1);assert.equal(held.y,540);assert(held.grounded);
});
test('every information block can be hit from below and accessed from ground level',()=>{
  const world=createWorld();
  for(const block of world.blocks){
    const player=new Player(block.x+block.width/2-14,540);
    assert.equal(nearestInteraction(player,[block]),block,block.id+' accessible with E');
    const hits=step(player,world,.5,{axis:0,jumpPressed:true,jumpHeld:true});
    assert(hits.includes(block.id),block.id+' jump hit');
  }
});
test('platforms support the player and solid block sides stop movement',()=>{
  const world=createWorld(),platform=world.platforms[0];
  const player=new Player(platform.x+30,platform.y-120);player.grounded=false;
  step(player,world,1);assert.equal(player.y,platform.y-player.height);assert(player.grounded);
  const block=world.blocks[0],side=new Player(block.x-50,block.y+10);side.grounded=false;
  // A single controlled horizontal collision with no vertical gravity interference.
  side.vx=320;side.vy=0;side.update({axis:1,jumpHeld:false},1/120,world);
  for(let i=0;i<20;i++){side.y=block.y+10;side.vy=0;side.update({axis:1,jumpHeld:false},1/120,world);}
  assert(side.x+side.width<=block.x);
});
test('closest interaction wins, distant objects do not open, repeated hits are debounced',()=>{
  const world=createWorld(),player=new Player(1020,540);
  assert.equal(nearestInteraction(player,world.blocks).id,'about');
  assert.equal(nearestInteraction(new Player(4350,540),world.blocks),null);
  let calls=0;const interactions=new Interactions(()=>calls++),block=world.blocks[0];
  assert(interactions.activate(block,1));assert(!interactions.activate(block,1.1));assert.equal(calls,1);
  assert(interactions.activate(block,1.7));assert.equal(calls,2);
});
test('world runs from beginning to end in 30–45 seconds without mandatory jumps',()=>{
  const world=createWorld(),player=new Player();let time=0;
  while(player.x<world.width-80&&time<45){player.update({axis:1},1/120,world);time+=1/120;}
  assert(time>=30&&time<=45);assert(player.x>world.width-100);
  console.log(`Measured simulated traversal: ${time.toFixed(1)} s`);
});
test('fall recovery preserves a safe checkpoint',()=>{
  const world=createWorld(),player=new Player(0,1200);world.checkpoint={x:8700,y:540};
  player.update({axis:0},1/120,world);assert.equal(player.x,8700);assert.equal(player.y,540);
});
test('camera bounds and coordinate conversions work at all requested sizes',()=>{
  const world=createWorld();
  for(const [w,h] of [[1920,1080],[1440,900],[1366,768],[1280,720],[1024,768],[768,1024],[430,932],[390,844]]){
    const camera=new Camera();camera.resize(w,h);
    camera.update(new Player(world.width-30,540),world.width,1,true);
    assert(camera.x>=0&&camera.x+camera.width<=world.width+.01);
    assert.equal(camera.toWorld(0,0).x,camera.x);
    camera.update(new Player(0,540),world.width,1,true);assert.equal(camera.x,0);
  }
});
test('central state pauses without changing data; project modules map to preserved data',()=>{
  const state=createState();let modes=[];state.subscribe(s=>modes.push(s.mode));
  state.setMode('quick');assert(state.paused);state.setMode('world');assert(!state.paused);
  assert.deepEqual(modes,['quick','world']);
  for(const project of projects)assert(createWorld().blocks.some(b=>b.contentId===project.id));
  assert.equal(zoneAt(8700).id,'resume');assert.equal(zones.length,8);
});
