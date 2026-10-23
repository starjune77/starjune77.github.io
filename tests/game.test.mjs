import test from 'node:test';
import assert from 'node:assert/strict';
import {Player,MOVE} from '../js/player.js';
import {Camera} from '../js/camera.js';
import {createWorld,zoneAt,zones} from '../js/world.js';
import {nearestInteraction,Interactions} from '../js/interactions.js';
import {createState} from '../js/utils.js';
import {projects,skills} from '../js/data.js';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import QuickView from '../src/components/QuickView.jsx';

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
  step(player,world,1,{axis:1});assert(player.x>630&&player.x<670,'about 470 units in the first second');assert.equal(player.y,540);assert(player.grounded);
  const previous=player.x;step(player,world,.2);assert(player.x-previous<30);assert.equal(player.vx,0);
  step(player,world,1,{axis:-1});assert(player.x<250);
});
test('run speed is about 500 and Shift sprints about 1.35x faster',()=>{
  const world=createWorld(),run=new Player(),sprint=new Player();
  assert(MOVE.run>=480&&MOVE.run<=520);assert(MOVE.sprint>=1.3&&MOVE.sprint<=1.4);
  step(run,world,.5,{axis:1});step(sprint,world,.5,{axis:1,sprint:true});
  assert.equal(run.vx,MOVE.run);assert(!run.sprinting);
  assert(Math.abs(sprint.vx/run.vx-MOVE.sprint)<1e-9);assert(sprint.sprinting);
  // Acceleration scaled with speed: full speed in well under a fifth of a second.
  const quick=new Player();step(quick,world,.15,{axis:1});assert.equal(quick.vx,MOVE.run);
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
test('world runs end to end in about 22 s (about 16 s sprinting) without mandatory jumps',()=>{
  const traverse=sprint=>{
    const world=createWorld(),player=new Player();let time=0;
    while(player.x<world.width-80&&time<45){player.update({axis:1,sprint},1/120,world);time+=1/120;}
    assert(player.x>world.width-100);return time;
  };
  const run=traverse(false),sprint=traverse(true);
  assert(run>=20&&run<=25,'run '+run);assert(sprint>=14&&sprint<=19,'sprint '+sprint);
  console.log(`Measured simulated traversal: ${run.toFixed(1)} s running, ${sprint.toFixed(1)} s sprinting`);
});
test('every platform is reachable by jumping from the ground or another platform',()=>{
  const world=createWorld(),ground={x:0,y:world.ground,width:world.width,label:'ground'};
  const reached=new Set([ground]),onTop=(player,s)=>player.grounded&&Math.abs(player.y+player.height-s.y)<1e-6&&player.x+player.width>s.x&&player.x<s.x+s.width;
  // Brute force over run-ups: start spot, direction, sprint, and how long the direction is held.
  const reach=(source,target)=>{
    for(let x=Math.max(source.x,target.x-420);x<=Math.min(source.x+source.width-28,target.x+target.width+420);x+=20)
      for(const dir of [1,-1])for(const sprint of [false,true])for(const hold of [.2,.35,.5,2]){
        const player=new Player(x,source.y-60);player.vx=dir*MOVE.run*(sprint?MOVE.sprint:1);
        for(let i=0;i<150;i++){
          player.update({axis:i/120<hold?dir:0,sprint,jumpHeld:true,jumpPressed:i===0},1/120,world);
          if(i>2&&onTop(player,target))return true;
          if(i>2&&player.grounded)break;
        }
      }
    return false;
  };
  for(let pass=0;pass<world.platforms.length;pass++)
    for(const target of world.platforms)if(!reached.has(target)&&[...reached].some(source=>reach(source,target)))reached.add(target);
  for(const platform of world.platforms)assert(reached.has(platform),platform.label+' reachable');
});
test('camera keeps the runner in view at sprint speed and pans smoothly on turns',()=>{
  for(const [w,h] of [[1920,1080],[1366,768],[390,844]]){
    const world=createWorld(),player=new Player(),camera=new Camera();camera.resize(w,h);camera.update(player,world.width,0,true);
    let last=camera.x,backward=0,min=1,max=0;
    for(let i=0;i<120*6;i++){
      player.update({axis:1,sprint:true},1/120,world);camera.update(player,world.width,1/120);
      if(i>60){const at=(player.x+player.width/2-camera.x)/camera.width;min=Math.min(min,at);max=Math.max(max,at);if(camera.x<last-1e-9)backward++;}
      last=camera.x;
    }
    assert.equal(backward,0,'camera never steps backward while running forward '+w);
    assert(min>.3&&max<.7,`runner stays in view at ${w}: ${min.toFixed(2)}–${max.toFixed(2)}`);
    let biggest=0;
    for(let i=0;i<240;i++){const before=camera.x;player.update({axis:-1},1/120,world);camera.update(player,world.width,1/120);biggest=Math.max(biggest,Math.abs(camera.x-before));}
    assert(biggest<15,`turning around pans instead of snapping (${biggest.toFixed(1)} per step)`);
  }
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
test('Quick View has a numbered Skills section with both categories and a decorative marquee',()=>{
  const html=renderToStaticMarkup(React.createElement(QuickView,{active:false,onClose:()=>{},onOpen:()=>{},resumeAvailable:false}));
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,'ids are unique');
  assert.equal(ids.filter(id=>id==='quick-skills').length,1);
  const numbers=[...html.matchAll(/<div class="section-title"><p class="eyebrow">(\d+)<\/p><h2>([^<]+)<\/h2>/g)];
  assert.deepEqual(numbers.map(m=>Number(m[1])),numbers.map((_,i)=>i+1),'section numbers are sequential');
  assert.deepEqual(numbers.map(m=>m[2]).slice(0,5),['About','Featured projects','Experience','Skills','Education']);
  const section=html.match(/<section id="quick-skills">(.*?)<\/section>/s)[1];
  for(const [category,items] of Object.entries(skills)){
    assert(section.includes(`<h3>${category}</h3>`),category);
    for(const item of items)assert(section.includes(`<span>${item}</span>`),item);
  }
  assert(section.includes('Frameworks / technologies')&&section.includes('MediaPipe'));
  const marquee=html.match(/<div class="skills-marquee"[^>]*>/)[0];
  assert(marquee.includes('aria-hidden="true"')&&!marquee.includes(' id='),'marquee is decorative');
  assert(!/<section[^>]*skills-marquee/.test(html),'marquee is not a landmark');
});
