// Interactive blocks as holographic kiosks, and the skill platforms as hovering tram decks.
// Drawing follows each block's existing hitbox exactly; only the look changes.
import {zoneAt} from './world.js';
import {colors,accentFor} from './palette.js';
import {rgba,chamfer,neon,fit} from './render-kit.js';

const isActive=(block,state,hovered)=>state.nearestInteraction===block||hovered===block;

export function kioskLights(world,state,hovered,visible){
  const lights=[];
  for(const b of world.blocks)if(visible(b.x,b.width))lights.push({x:b.x+24,w:b.width-48,color:accentFor(zoneAt(b.x).id),strength:isActive(b,state,hovered)?1:.6});
  for(const p of world.platforms)if(visible(p.x,p.width))lights.push({x:p.x+10,w:p.width-20,color:accentFor(zoneAt(p.x).id),strength:.3});
  return lights;
}

export function drawPlatforms(ctx,world,f){
  const {t,reduced,visible}=f;
  for(const p of world.platforms){
    if(!visible(p.x,p.width))continue;
    const accent=accentFor(zoneAt(p.x).id);
    for(const tx of [p.x+22,p.x+p.width-22]){
      const strength=reduced?.22:.18+.06*Math.sin(t*9+tx);
      const g=ctx.createLinearGradient(0,p.y+p.height,0,p.y+p.height+46);g.addColorStop(0,rgba(accent,strength));g.addColorStop(1,rgba(accent,0));
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(tx-7,p.y+p.height);ctx.lineTo(tx+7,p.y+p.height);ctx.lineTo(tx+14,p.y+p.height+46);ctx.lineTo(tx-14,p.y+p.height+46);ctx.fill();
    }
    const body=ctx.createLinearGradient(0,p.y,0,p.y+p.height);body.addColorStop(0,'#22263d');body.addColorStop(1,'#111325');
    chamfer(ctx,p.x,p.y,p.width,p.height,6);ctx.fillStyle=body;ctx.fill();ctx.strokeStyle=rgba(accent,.5);ctx.lineWidth=1;ctx.stroke();
    const top=new Path2D();top.moveTo(p.x+6,p.y+1);top.lineTo(p.x+p.width-1,p.y+1);neon(ctx,top,accent,1.5,.9);
    ctx.fillStyle=rgba(accent,.8);ctx.fillRect(p.x+8,p.y+p.height-4,6,1.5);ctx.fillRect(p.x+p.width-14,p.y+p.height-4,6,1.5);
    f.text(p.label,p.x+p.width/2,p.y+4,10,colors.text,{weight:700,align:'center'});
  }
}

export function drawKiosks(ctx,world,f,hovered){
  const {t,reduced,state,visible}=f;
  for(const b of world.blocks){
    if(!visible(b.x-20,b.width+40))continue;
    const accent=accentFor(zoneAt(b.x).id),active=isActive(b,state,hovered),featured=b.id==='morrowlab';
    const age=world.time-b.hitAt,hit=age>=0&&age<.35;
    const bump=!reduced&&hit?-Math.sin(age/.35*Math.PI)*8:0,flash=age>=0&&age<.25?1-age/.25:0;
    const x=b.x,y=b.y+bump,w=b.width,h=b.height,cx=x+w/2,cut=Math.min(12,h*.16);
    // Projector stand (or the terminal's pole) beneath the screen.
    if(b.type==='terminal'){
      ctx.fillStyle='#1a1d30';ctx.fillRect(cx-3,b.y+h,6,600-b.y-h);ctx.fillRect(cx-18,594,36,6);ctx.fillStyle=rgba(accent,.7);ctx.fillRect(cx-18,594,36,1);
    } else {
      const beam=ctx.createLinearGradient(0,588,0,b.y+h);beam.addColorStop(0,rgba(accent,active?.16:.07));beam.addColorStop(1,rgba(accent,active?.05:.015));
      const spread=Math.min(w*.3,90);
      ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(cx-16,588);ctx.lineTo(cx+16,588);ctx.lineTo(cx+spread,b.y+h);ctx.lineTo(cx-spread,b.y+h);ctx.closePath();ctx.fill();
      ctx.fillStyle='#1a1d30';ctx.beginPath();ctx.moveTo(cx-36,600);ctx.lineTo(cx-25,587);ctx.lineTo(cx+25,587);ctx.lineTo(cx+36,600);ctx.closePath();ctx.fill();
      ctx.fillStyle=rgba(accent,active?1:.7);ctx.fillRect(cx-22,587,44,1.5);
    }
    const pulse=reduced?1:.7+.3*Math.sin(t*4.2);
    const frame=new Path2D();
    frame.moveTo(x+cut,y);frame.lineTo(x+w,y);frame.lineTo(x+w,y+h-cut);frame.lineTo(x+w-cut,y+h);frame.lineTo(x,y+h);frame.lineTo(x,y+cut);frame.closePath();
    if(active||featured)neon(ctx,frame,accent,1.2,active?pulse:.45);
    const fill=ctx.createLinearGradient(0,y,0,y+h);fill.addColorStop(0,rgba(accent,active?.22:.14));fill.addColorStop(.55,'rgba(12,13,24,.9)');fill.addColorStop(1,'rgba(10,11,18,.94)');
    ctx.fillStyle='rgba(10,11,18,.86)';ctx.fill(frame);ctx.fillStyle=fill;ctx.fill(frame);
    ctx.save();ctx.clip(frame);
    ctx.fillStyle='rgba(255,255,255,.03)';for(let ly=y+2;ly<y+h;ly+=3)ctx.fillRect(x,ly,w,1);
    if(!reduced){const sy=y+((t*30+b.x)%(h+20))-20;const band=ctx.createLinearGradient(0,sy,0,sy+20);band.addColorStop(0,rgba(accent,0));band.addColorStop(1,rgba(accent,.12));ctx.fillStyle=band;ctx.fillRect(x,sy,w,20);}
    if(flash){ctx.fillStyle=`rgba(255,255,255,${.28*flash})`;ctx.fillRect(x,y,w,h);}
    ctx.restore();
    ctx.strokeStyle=rgba(accent,active?.95:featured?.8:.5);ctx.lineWidth=1.4;ctx.stroke(frame);
    ctx.strokeStyle=rgba(accent,.14);ctx.lineWidth=1;chamfer(ctx,x+5,y+5,w-10,h-10,Math.max(4,cut-4));ctx.stroke();
    // Header ticks and corner brackets.
    ctx.fillStyle=rgba(accent,.9);ctx.fillRect(x+cut+6,y+7,26,2);
    for(let i=0;i<3;i++)ctx.fillRect(x+w-18-i*7,y+7,3,3);
    const brackets=new Path2D();brackets.moveTo(x+w-16,y+h);brackets.lineTo(x+w-cut,y+h);brackets.lineTo(x+w,y+h-cut);brackets.lineTo(x+w,y+h-16-cut);
    neon(ctx,brackets,accent,1.3,active?1:.6);
    const size=b.type==='project'?21:b.type==='terminal'?15:31,family=b.type==='terminal'?'mono':'sans';
    const labelSize=fit(ctx,b.label,w-32,size,b.type==='terminal'?600:700,family,10);
    f.text(b.label,cx,y+h*.47-labelSize*.55,labelSize,'#f4f6ff',{weight:b.type==='terminal'?600:700,family,align:'center'});
    const subSize=fit(ctx,b.subtitle,w-32,10,600,'mono',7);
    f.text(b.subtitle,cx,y+h*.74-subSize*.55,subSize,active?accent:colors.muted,{weight:600,align:'center'});
  }
}
