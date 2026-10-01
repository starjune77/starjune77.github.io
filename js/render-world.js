import {zones} from './world.js';
function rect(ctx,x,y,w,h,fill,stroke) {
  ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,w-1,h-1);}
}
function text(ctx,label,x,y,size=12,color='#9fb2c8',align='left') {
  ctx.fillStyle=color;ctx.font=`${size>=22?'600':'400'} ${size}px ${size>=22?'Arial, sans-serif':'Consolas, monospace'}`;ctx.textAlign=align;ctx.fillText(label,x,y);
}
export function renderWorld(ctx,world,player,camera,view,state,reduced,hovered) {
  const {width,height,dpr}=view;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const background=ctx.createLinearGradient(0,0,0,height);background.addColorStop(0,'#020407');background.addColorStop(.75,'#07111c');background.addColorStop(1,'#03060b');ctx.fillStyle=background;ctx.fillRect(0,0,width,height);
  // Architecture in the distance moves more slowly than the solid foreground.
  const parallax=reduced?0:camera.x*.18;
  for(let x=-((parallax)%280);x<width;x+=280) {
    rect(ctx,x+40,height*.22,160,height*.55,'#081320','#101f30');
    rect(ctx,x+60,height*.25,120,5,'#102b45');
    for(let y=height*.31;y<height*.65;y+=45)rect(ctx,x+62,y,116,1,'#152b41');
  }
  ctx.strokeStyle='#102135';ctx.lineWidth=1;
  const gridOffset=reduced?0:(camera.x*.35)%64;
  ctx.beginPath();for(let x=-gridOffset;x<width;x+=64){ctx.moveTo(x,0);ctx.lineTo(x,height);}for(let y=0;y<height;y+=64){ctx.moveTo(0,y);ctx.lineTo(width,y);}ctx.stroke();
  ctx.save();ctx.scale(camera.scale,camera.scale);ctx.translate(-camera.x,-camera.y);
  const visible=(x,w)=>x+w>=camera.x-100&&x<camera.x+camera.width+100;
  rect(ctx,0,world.ground,world.width,world.height,'#050b12');
  rect(ctx,0,world.ground,world.width,4,'#4c92d3');
  rect(ctx,0,world.ground+20,world.width,1,'#17395c');
  for(let x=Math.floor(camera.x/80)*80;x<camera.x+camera.width;x+=80){rect(ctx,x,world.ground+20,1,35,'#16304a');text(ctx,String(Math.round(x)).padStart(5,'0'),x+6,world.ground+48,9,'#536d89');}
  for(const [index,zone] of zones.entries()) {
    if(!visible(zone.start,zone.end-zone.start))continue;
    const x=zone.start+60;
    text(ctx,`0${index} / ${zone.label.toUpperCase()}`,x,220,12,'#527fa8');
    rect(ctx,x,240,Math.min(650,zone.end-zone.start-120),1,'#1b3955');
    if(index>0){rect(ctx,zone.start,world.ground-150,1,150,'#1c3d59');text(ctx,'→',zone.start+14,world.ground-20,20,'#58a6ff');}
    const serverX=zone.end-150;
    rect(ctx,serverX,world.ground-112,76,112,'#0b1927','#233d55');
    for(let i=0;i<5;i++){rect(ctx,serverX+10,world.ground-100+i*18,56,8,'#142c42');rect(ctx,serverX+14,world.ground-98+i*18,3,3,i%2?'#58a6ff':'#7debff');}
  }
  // A permanent identity sign in the first scene; it is not an HTML hero page.
  if(visible(60,470)) {
    text(ctx,'JUNYOUNG OH',70,345,35,'#f4f7fc');
    text(ctx,'COMPUTER SCIENCE · INTERACTIVE SYSTEMS · AI',72,374,11,'#7debff');
    text(ctx,'UW–MADISON / MADISON, WI',72,399,11,'#9fb2c8');
    text(ctx,'I build software people can experience.',72,434,14,'#c7d8e9');
    text(ctx,'ABOUT → PROJECTS → AI → EXPERIENCE → SKILLS → RESUME → CONTACT',72,475,9,'#7392b0');
  }
  for(const platform of world.platforms) {
    if(!visible(platform.x,platform.width))continue;
    rect(ctx,platform.x,platform.y,platform.width,platform.height,'#152d44','#58a6ff');
    text(ctx,platform.label,platform.x+platform.width/2,platform.y+13,10,'#e2f0ff','center');
  }
  // Small original line drawings describe each area without using external assets.
  if(visible(4560,820)) {
    const t=reduced?0:world.time;
    for(let i=0;i<3;i++){
      const x=4500+i*140,y=540+Math.sin(t+i)*4;
      ctx.strokeStyle='#3a6083';ctx.strokeRect(x,y-30,40,40);
      if(state.currentZone==='ai'){ctx.strokeStyle='#7debff';ctx.strokeRect(x-9,y-39,58,58);text(ctx,`OBJECT ${String.fromCharCode(65+i)}`,x-9,y-45,8,'#7debff');}
    }
    text(ctx,'DECORATIVE SIMULATION / NO CAMERA ACCESS',4510,world.ground+80,9,'#6e92b5');
  }
  if(visible(6520,240)){
    ctx.strokeStyle='#284d6a';ctx.lineWidth=2;ctx.strokeRect(6550,510,120,45);
    ctx.beginPath();ctx.moveTo(6580,510);ctx.lineTo(6630,460);ctx.lineTo(6700,485);ctx.stroke();
    for(const x of [6570,6650]){ctx.beginPath();ctx.arc(x,565,17,0,Math.PI*2);ctx.stroke();}
    text(ctx,'ROBOTICS / CAD / JAVA',6510,world.ground+80,10,'#6e92b5');
  }
  for(const block of world.blocks) {
    if(!visible(block.x,block.width))continue;
    const active=state.nearestInteraction===block||hovered===block;
    const age=world.time-block.hitAt;
    const bump=!reduced&&age>=0&&age<.35?-Math.sin(age/.35*Math.PI)*8:0;
    const y=block.y+bump;
    const featured=block.id==='morrowlab';
    if(active||featured){const glow=ctx.createLinearGradient(0,y,0,y+block.height+70);glow.addColorStop(0,'#123a5d55');glow.addColorStop(1,'#123a5d00');rect(ctx,block.x-10,y-10,block.width+20,block.height+80,glow);}
    rect(ctx,block.x,y,block.width,block.height,featured?'#0d2338':'#081522',active?'#7debff':featured?'#58a6ff':'#315678');
    rect(ctx,block.x+10,y+10,4,4,active?'#7debff':'#58a6ff');
    rect(ctx,block.x+block.width-14,y+10,4,4,'#58a6ff');
    rect(ctx,block.x+12,y+block.height-7,block.width-24,1,'#23527b');
    const size=block.type==='project'?21:block.type==='terminal'?15:31;
    text(ctx,block.label,block.x+block.width/2,y+block.height*.48,size,'#f4f7fc','center');
    text(ctx,block.subtitle,block.x+block.width/2,y+block.height*.73,10,active?'#7debff':'#94b1cc','center');
    if(block.type!=='terminal') {
      ctx.strokeStyle='#1c3952';ctx.setLineDash([3,7]);ctx.beginPath();ctx.moveTo(block.x+block.width/2,y+block.height+4);ctx.lineTo(block.x+block.width/2,world.ground-8);ctx.stroke();ctx.setLineDash([]);
      rect(ctx,block.x+block.width/2-40,world.ground-2,80,2,active?'#7debff':'#2f608b');
    }
    if(!reduced){const scan=block.x+((world.time*22)%block.width);rect(ctx,scan,y+3,1,block.height-6,'#58a6ff22');}
  }
  ctx.fillStyle='#0009';ctx.beginPath();ctx.ellipse(player.x+14,world.ground+7,23,5,0,0,Math.PI*2);ctx.fill();
  player.draw(ctx,reduced);
  ctx.restore();
}
