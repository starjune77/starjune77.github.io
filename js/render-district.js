// District landmarks, zone signs, the identity board and the wet street, in world space.
// Every district has one original landmark in its own accent colour. Text is never drawn
// below the ground line, which belongs to the interaction prompt and touch controls.
import {zones} from './world.js';
import {colors,accentFor} from './palette.js';
import {rgba,mix,chamfer,neon,flicker,fit,font,hash} from './render-kit.js';

const STRUCT='#121426',EDGE='#24283f',DARK='#0c0d18';
const TAU=Math.PI*2;

function catenary(path,x0,y0,x1,y1,sag){path.moveTo(x0,y0);path.quadraticCurveTo((x0+x1)/2,(y0+y1)/2+sag*2,x1,y1);}
const pointOn=(x0,y0,x1,y1,sag,k)=>{const cx=(x0+x1)/2,cy=(y0+y1)/2+sag*2,u=1-k;return [u*u*x0+2*u*k*cx+k*k*x1,u*u*y0+2*u*k*cy+k*k*y1];};

export class Districts {
  constructor(world){
    this.world=world;
    const kiosks=world.blocks.filter(b=>b.type==='project');
    this.kiosks=kiosks;
    this.anchors=[1700,...kiosks.map(k=>k.x-16),kiosks.at(-1).x+kiosks.at(-1).width+16];
    this.lights=new Path2D();
    for(let i=0;i<this.anchors.length-1;i++)catenary(this.lights,this.anchors[i],226,this.anchors[i+1],226,22);
    this.bulbs=[];
    for(let i=0;i<this.anchors.length-1;i++)for(let k=.04;k<1;k+=.07)this.bulbs.push(pointOn(this.anchors[i],226,this.anchors[i+1],226,22,k));
    this.arch=new Path2D();this.arch.moveTo(783,600);this.arch.lineTo(783,250);this.arch.quadraticCurveTo(990,110,1197,250);this.arch.lineTo(1197,600);
    this.archNeon=new Path2D();this.archNeon.moveTo(799,590);this.archNeon.lineTo(799,262);this.archNeon.quadraticCurveTo(990,136,1181,262);this.archNeon.lineTo(1181,590);
    this.vaultCable=new Path2D();catenary(this.vaultCable,8600,170,9160,205,30);catenary(this.vaultCable,8600,200,9160,240,24);
    // Puddles sit at fixed, irregular spots along the street.
    this.puddles=[];for(let x=120;x<world.width;x+=260+hash(x)*320)this.puddles.push({x,w:70+hash(x+1)*120});
    this.reflections=[
      {x:60,w:440,color:colors.cyan,strength:.45},{x:779,w:22,color:colors.azure,strength:.8},{x:1179,w:22,color:colors.azure,strength:.8},
      ...kiosks.map(k=>({x:k.x-18,w:k.width+36,color:colors.magenta,strength:.35})),
      {x:5340,w:60,color:colors.violet,strength:.5},{x:5960,w:520,color:colors.amber,strength:.9},{x:6630,w:20,color:colors.amber,strength:.6},
      {x:9196,w:128,color:colors.ice,strength:.45},{x:10420,w:60,color:colors.coral,strength:.4},
      ...zones.filter(z=>z.start>0).map(z=>({x:z.start-6,w:12,color:accentFor(z.id),strength:.7}))
    ];
    this.emitters=[
      ...kiosks.map(k=>({id:'pot-'+k.id,x:k.x+40,y:540,width:16,rate:3.2})),
      ...[1020,4320,5900,7040,9020,10620].map(x=>({id:'vent-'+x,x,y:604,width:26,rate:2.4}))
    ];
  }
  // Light sources the wet street reflects, besides the kiosks.
  lightsIn(visible){return this.reflections.filter(l=>visible(l.x,l.w));}
  visibleEmitters(camera){return this.emitters.filter(e=>e.x>camera.x-80&&e.x<camera.x+camera.width+80);}
  // Text boxes for layout checks; world coordinates in, recorded by the caller.
  drawBack(ctx,f){
    const {t,reduced,visible}=f;
    for(const zone of zones){if(zone.start>0&&visible(zone.start-40,80))this.gateway(ctx,zone,t,reduced);}
    if(visible(0,660))this.rooftop(ctx,t,reduced);
    if(visible(740,520))this.archway(ctx,t,reduced);
    if(visible(1560,2560))this.market(ctx,f);
    if(visible(4470,1100))this.lensTower(ctx,f);
    if(visible(5740,1100))this.workshop(ctx,f);
    if(visible(6560,2100))this.station(ctx,t,reduced);
    if(visible(8420,960))this.vault(ctx,t,reduced);
    if(visible(9600,1600))this.mast(ctx,t,reduced);
  }
  gateway(ctx,zone,t,reduced){
    const x=zone.start,accent=accentFor(zone.id);
    ctx.fillStyle='#1a1d30';ctx.fillRect(x-3,440,6,160);ctx.fillStyle=EDGE;ctx.fillRect(x-3,440,1,160);
    ctx.fillStyle=rgba(accent,.18);ctx.beginPath();ctx.arc(x,436,11,0,TAU);ctx.fill();
    ctx.fillStyle=accent;ctx.beginPath();ctx.arc(x,436,3.5,0,TAU);ctx.fill();
    const chevrons=new Path2D();for(const dx of [12,24])chevrons.moveTo(x+dx,462),chevrons.lineTo(x+dx+7,470),chevrons.lineTo(x+dx,478);
    neon(ctx,chevrons,accent,1.6,flicker(x,t,reduced));
  }
  rooftop(ctx,t,reduced){
    const cyan=colors.cyan;
    ctx.fillStyle=STRUCT;ctx.fillRect(20,60,16,540);ctx.fillRect(20,120,480,12);
    ctx.fillStyle=EDGE;ctx.fillRect(20,120,480,1);ctx.fillRect(35,60,1,540);
    for(let y=150;y<600;y+=36){ctx.fillStyle=DARK;ctx.fillRect(22,y,12,2);}
    ctx.strokeStyle='#22263b';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(36,62);ctx.lineTo(500,122);ctx.stroke();
    const tube=new Path2D();tube.moveTo(40,136);tube.lineTo(496,136);neon(ctx,tube,cyan,1.6,flicker(3,t,reduced));
    for(const x of [150,300,450]){
      ctx.fillStyle='#22263b';ctx.fillRect(x-.5,132,1,48);ctx.fillStyle=STRUCT;ctx.beginPath();ctx.moveTo(x-9,186);ctx.lineTo(x-4,178);ctx.lineTo(x+4,178);ctx.lineTo(x+9,186);ctx.fill();
      const cone=ctx.createLinearGradient(0,186,0,330);cone.addColorStop(0,rgba(cyan,.16));cone.addColorStop(1,rgba(cyan,0));
      ctx.fillStyle=cone;ctx.beginPath();ctx.moveTo(x-8,186);ctx.lineTo(x+8,186);ctx.lineTo(x+46,330);ctx.lineTo(x-46,330);ctx.fill();
    }
    const blink=reduced||Math.sin(t*2.4)>.1;ctx.fillStyle=rgba(colors.red,blink?.9:.25);ctx.fillRect(25,54,6,4);
    // Rooftop clutter behind the start line.
    ctx.fillStyle='#14172a';ctx.fillRect(330,568,52,32);ctx.fillRect(392,578,40,22);ctx.fillStyle=EDGE;ctx.fillRect(330,568,52,1);ctx.fillRect(392,578,40,1);
    ctx.strokeStyle='#1f2338';ctx.lineWidth=1;ctx.beginPath();for(let x=336;x<380;x+=6){ctx.moveTo(x,574);ctx.lineTo(x,594);}ctx.stroke();
  }
  archway(ctx,t,reduced){
    const azure=colors.azure;
    ctx.save();ctx.lineJoin='round';ctx.strokeStyle=STRUCT;ctx.lineWidth=26;ctx.stroke(this.arch);ctx.strokeStyle=EDGE;ctx.lineWidth=1;ctx.stroke(this.arch);ctx.restore();
    neon(ctx,this.archNeon,azure,1.8,.85*flicker(8,t,reduced));
    for(let y=290;y<590;y+=28){ctx.fillStyle=rgba(azure,.55);ctx.fillRect(779,y,8,2);ctx.fillRect(1193,y,8,2);}
    const print=new Path2D();for(const r of [5,9,13])print.arc(990,190,r,Math.PI*.15,Math.PI*1.75);
    neon(ctx,print,azure,1.2,.9);
    // The ID scanner sweeps the arch; reduced motion parks it below the module.
    const y=reduced?476:440+Math.sin(t*1.1)*150;
    const band=ctx.createLinearGradient(0,y-18,0,y+18);band.addColorStop(0,rgba(azure,0));band.addColorStop(.5,rgba(azure,.16));band.addColorStop(1,rgba(azure,0));
    ctx.fillStyle=band;ctx.fillRect(812,y-18,356,36);
    const line=new Path2D();line.moveTo(812,y);line.lineTo(1168,y);neon(ctx,line,azure,1,.8);
    // A residential block behind the arch.
    ctx.fillStyle=STRUCT;ctx.fillRect(1250,190,250,410);ctx.fillStyle=EDGE;ctx.fillRect(1250,190,250,1);
    for(let r=0;r<13;r++)for(let c=0;c<7;c++){const on=hash(r*13+c*7+5)<.32;ctx.fillStyle=on?rgba(hash(r+c)<.5?'#ffcf8a':'#cfe0ff',.5):'#171a2e';ctx.fillRect(1266+c*33,212+r*28,16,12);}
    ctx.fillStyle='#1b1e33';for(let r=1;r<13;r+=3)ctx.fillRect(1256,236+r*28,238,3);
  }
  market(ctx,f){
    const {t,reduced,visible}=f,magenta=colors.magenta;
    // Market gate and the tall poles that carry the string lights.
    ctx.fillStyle=STRUCT;ctx.fillRect(1584,190,10,410);ctx.fillRect(1690,190,10,410);
    chamfer(ctx,1576,176,132,38,6);ctx.fillStyle='#10121f';ctx.fill();ctx.strokeStyle=rgba(magenta,.6);ctx.lineWidth=1.2;ctx.stroke();
    const lanterns=new Path2D();for(const x of [1612,1642,1672])lanterns.moveTo(x+8,195),lanterns.arc(x,195,8,0,TAU);
    neon(ctx,lanterns,colors.amber,1.4,flicker(17,t,reduced));
    for(const x of this.anchors.slice(1)){ctx.fillStyle=STRUCT;ctx.fillRect(x-4,226,8,374);}
    ctx.strokeStyle='#2a2d44';ctx.lineWidth=1;ctx.stroke(this.lights);
    const bulbColors=[magenta,colors.amber,colors.cyan,colors.amber];
    for(const [ci,color] of bulbColors.entries()){
      if(ci===3)continue;
      const glow=new Path2D(),core=new Path2D();
      this.bulbs.forEach(([x,y],i)=>{if(i%3!==ci||!visible(x-6,12))return;glow.moveTo(x+6,y+2);glow.arc(x,y+2,6,0,TAU);core.moveTo(x+2,y+2);core.arc(x,y+2,2,0,TAU);});
      ctx.globalAlpha=reduced?.9:.65+.35*Math.sin(t*2.6+ci*2);
      ctx.fillStyle=rgba(color,.22);ctx.fill(glow);ctx.fillStyle=color;ctx.fill(core);
    }
    ctx.globalAlpha=1;
    for(const k of this.kiosks){
      if(!visible(k.x-40,k.width+80))continue;
      const x0=k.x,x1=k.x+k.width;
      ctx.fillStyle=STRUCT;ctx.fillRect(x1+12,300,8,300);
      // Striped awning with a scalloped edge over each project stall.
      ctx.save();ctx.beginPath();ctx.moveTo(x0-30,298);ctx.lineTo(x1+30,298);ctx.lineTo(x1+18,330);ctx.lineTo(x0-18,330);ctx.closePath();
      ctx.fillStyle='#1a1426';ctx.fill();ctx.clip();ctx.fillStyle=rgba(magenta,.42);
      for(let x=x0-30;x<x1+30;x+=36)ctx.fillRect(x,298,18,32);ctx.restore();
      ctx.fillStyle='#1a1426';ctx.beginPath();for(let x=x0-18;x<x1+18;x+=24){ctx.moveTo(x+24,330);ctx.arc(x+12,330,12,0,Math.PI);}ctx.fill();
      const hem=new Path2D();hem.moveTo(x0-18,331);hem.lineTo(x1+18,331);neon(ctx,hem,magenta,1.3,flicker(k.x,t,reduced));
      for(const lx of [x0-8,x1+8]){
        ctx.fillStyle='#2a2d44';ctx.fillRect(lx-.5,331,1,10);
        ctx.fillStyle=rgba(colors.amber,.2);ctx.beginPath();ctx.arc(lx,350,13,0,TAU);ctx.fill();
        chamfer(ctx,lx-6,341,12,18,3);ctx.fillStyle=rgba(colors.amber,.85);ctx.fill();
      }
      // Low counter: darker than the foreground so it reads as background.
      ctx.fillStyle='#141626';ctx.fillRect(x0-6,552,k.width+12,48);ctx.fillStyle='#22263d';ctx.fillRect(x0-6,552,k.width+12,2);
      ctx.fillStyle='#1a1d30';for(let x=x0+20;x<x1-10;x+=60)ctx.fillRect(x,562,40,30);
      ctx.fillStyle='#262a40';ctx.fillRect(x0+30,536,22,16);ctx.fillRect(x0+28,534,26,3);
      ctx.fillStyle='#1d2034';ctx.fillRect(x1-60,528,26,24);ctx.fillRect(x1-30,538,18,14);
    }
  }
  lensTower(ctx,f){
    const {t,reduced,state}=f,violet=colors.violet,cx=5370,cy=160;
    ctx.fillStyle=STRUCT;ctx.beginPath();ctx.moveTo(5300,600);ctx.lineTo(5440,600);ctx.lineTo(5394,60);ctx.lineTo(5346,60);ctx.closePath();ctx.fill();
    ctx.strokeStyle=EDGE;ctx.lineWidth=1;ctx.stroke();
    for(let y=260;y<590;y+=56){const w=40+(y-60)*.09;ctx.fillStyle=rgba(violet,.5);ctx.fillRect(cx-w/2,y,w,2);}
    // Scan beam from the lens, sweeping the district.
    const angle=Math.PI*(.69+(reduced?0:.1*Math.sin(t*.45)));
    ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);
    const beam=ctx.createLinearGradient(0,0,900,0);beam.addColorStop(0,rgba(violet,.24));beam.addColorStop(1,rgba(violet,0));
    ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(30,-8);ctx.lineTo(900,-70);ctx.lineTo(900,70);ctx.lineTo(30,8);ctx.closePath();ctx.fill();ctx.restore();
    ctx.fillStyle='#0e0f1c';ctx.beginPath();ctx.arc(cx,cy,62,0,TAU);ctx.fill();ctx.strokeStyle='#2c2f4c';ctx.lineWidth=3;ctx.stroke();
    const ring=new Path2D();ring.arc(cx,cy,50,0,TAU);neon(ctx,ring,violet,1.6,flicker(41,t,reduced));
    const turn=reduced?0:t*.2,blades=new Path2D();
    for(let i=0;i<6;i++){const a=turn+i*TAU/6;blades.moveTo(cx+Math.cos(a)*18,cy+Math.sin(a)*18);blades.lineTo(cx+Math.cos(a+.9)*44,cy+Math.sin(a+.9)*44);}
    ctx.strokeStyle=rgba(violet,.55);ctx.lineWidth=1.2;ctx.stroke(blades);
    const pulse=reduced?1:.75+.25*Math.sin(t*2);
    const pupil=ctx.createRadialGradient(cx,cy,0,cx,cy,20);pupil.addColorStop(0,rgba('#ffffff',.9*pulse));pupil.addColorStop(.35,rgba(violet,.8*pulse));pupil.addColorStop(1,rgba(violet,0));
    ctx.fillStyle=pupil;ctx.beginPath();ctx.arc(cx,cy,20,0,TAU);ctx.fill();
    // Decorative detection demo: abstract shapes only, no camera or inference.
    const active=state.currentZone==='ai',shapes=[[4512,'square'],[4612,'circle'],[4712,'triangle']];
    for(const [i,[x,kind]] of shapes.entries()){
      const y=508+(reduced?0:Math.sin(t+i)*4);
      const g=ctx.createLinearGradient(x-20,y-20,x+20,y+20);g.addColorStop(0,'#59608f');g.addColorStop(1,'#1f2340');ctx.fillStyle=g;
      ctx.beginPath();
      if(kind==='square'){ctx.save();ctx.translate(x,y);ctx.rotate(-.2);ctx.rect(-19,-19,38,38);ctx.restore();}
      else if(kind==='circle')ctx.arc(x,y,20,0,TAU);
      else {ctx.moveTo(x,y-22);ctx.lineTo(x+22,y+18);ctx.lineTo(x-22,y+18);ctx.closePath();}
      ctx.fill();
      if(active){
        ctx.strokeStyle=violet;ctx.lineWidth=1.2;ctx.strokeRect(x-29,y-29,58,58);
        f.text(`OBJECT ${String.fromCharCode(65+i)}`,x-29,y-41,8,violet);
      }
    }
    if(active&&!reduced){const sx=4484+((t*60)%280);ctx.fillStyle=rgba(violet,.4);ctx.fillRect(sx,474,1,68);}
    f.text('DECORATIVE SIMULATION / NO CAMERA ACCESS',4484,578,8,'#8f95b8');
  }
  workshop(ctx,f){
    const {t,reduced}=f,amber=colors.amber;
    ctx.fillStyle=STRUCT;ctx.beginPath();ctx.moveTo(5760,600);ctx.lineTo(5760,250);
    for(let i=0;i<3;i++){const x=5760+i*254;ctx.lineTo(x,206);ctx.lineTo(x+254,250);}
    ctx.lineTo(6522,600);ctx.closePath();ctx.fill();ctx.strokeStyle=EDGE;ctx.lineWidth=1;ctx.stroke();
    for(let i=0;i<3;i++){const x=5760+i*254;ctx.fillStyle=rgba(amber,.3);ctx.fillRect(x+1,208,3,40);}
    // Half-open shutter with warm light spilling onto the street.
    const door=ctx.createLinearGradient(0,470,0,600);door.addColorStop(0,rgba(amber,.36));door.addColorStop(1,rgba(amber,.14));
    ctx.fillStyle=door;ctx.fillRect(5960,470,520,130);
    ctx.fillStyle='#1a1c2f';ctx.fillRect(5960,446,520,26);ctx.fillStyle='#262a40';for(let y=450;y<472;y+=5)ctx.fillRect(5960,y,520,1);
    // Workbench, tool rack and a robot chassis silhouetted against the light.
    ctx.fillStyle='#0f1020';ctx.fillRect(5990,556,150,8);ctx.fillRect(6000,564,8,36);ctx.fillRect(6124,564,8,36);
    ctx.fillRect(6180,500,6,100);ctx.fillRect(6180,500,90,4);for(let x=6192;x<6266;x+=16)ctx.fillRect(x,504,3,20+hash(x)*16);
    ctx.fillRect(6320,560,110,26);ctx.beginPath();ctx.arc(6340,590,10,0,TAU);ctx.arc(6410,590,10,0,TAU);ctx.fill();ctx.fillRect(6360,530,30,30);
    chamfer(ctx,5780,442,166,22,5);ctx.fillStyle='rgba(10,11,18,.85)';ctx.fill();ctx.strokeStyle=rgba(amber,.6);ctx.lineWidth=1;ctx.stroke();
    f.text('ROBOTICS / CAD / JAVA',5792,448,10,amber);
    // A gear sign on the roof mast turns slowly.
    ctx.fillStyle=STRUCT;ctx.fillRect(6416,150,8,100);
    const gear=new Path2D(),spin=reduced?0:t*.35,gx=6420,gy=138;
    for(let i=0;i<20;i++){const a=spin+i*TAU/20,r=i%2?27:21;const px=gx+Math.cos(a)*r,py=gy+Math.sin(a)*r;i?gear.lineTo(px,py):gear.moveTo(px,py);}
    gear.closePath();gear.moveTo(gx+9,gy);gear.arc(gx,gy,9,0,TAU);neon(ctx,gear,amber,1.5,flicker(52,t,reduced));
    // Robotic arm: two segments with a claw, gently working.
    const a1=-1.25+(reduced?0:.22*Math.sin(t*.55)),a2=a1+1.45+(reduced?0:.3*Math.sin(t*.8+1));
    const bx=6640,by=470,ex=bx+Math.cos(a1)*92,ey=by+Math.sin(a1)*92,hx=ex+Math.cos(a2)*72,hy=ey+Math.sin(a2)*72;
    ctx.fillStyle='#181b2e';ctx.fillRect(6610,556,60,44);ctx.fillRect(6630,470,20,90);
    ctx.lineCap='round';ctx.strokeStyle='#2a2e48';ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(ex,ey);ctx.lineTo(hx,hy);ctx.stroke();
    ctx.strokeStyle=rgba(amber,.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(ex,ey);ctx.lineTo(hx,hy);ctx.stroke();ctx.lineCap='butt';
    ctx.fillStyle='#2a2e48';for(const [px,py] of [[bx,by],[ex,ey]]){ctx.beginPath();ctx.arc(px,py,8,0,TAU);ctx.fill();}
    ctx.strokeStyle='#3a3f60';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(hx+8,hy+12);ctx.moveTo(hx,hy);ctx.lineTo(hx-8,hy+12);ctx.stroke();
    const warn=reduced||Math.sin(t*3)>0;ctx.fillStyle=rgba(amber,warn?.95:.3);ctx.fillRect(6634,462,12,6);
  }
  station(ctx,t,reduced){
    const mint=colors.mint;
    ctx.fillStyle=STRUCT;for(const x of [6940,7395,7690,8105,8360])ctx.fillRect(x-4,160,8,440);
    ctx.fillStyle='#151829';ctx.fillRect(6930,150,1440,10);ctx.fillStyle=EDGE;ctx.fillRect(6930,150,1440,1);
    const strip=new Path2D();strip.moveTo(6936,163);strip.lineTo(8364,163);neon(ctx,strip,mint,1.4,flicker(61,t,reduced));
    // Elevated rail with a tram that glides through every few seconds.
    ctx.fillStyle='#181b2d';ctx.fillRect(6640,228,1980,10);ctx.fillStyle=EDGE;ctx.fillRect(6640,228,1980,1);
    for(let x=6700;x<8620;x+=240){ctx.fillStyle=STRUCT;ctx.fillRect(x,238,6,22);}
    const head=reduced?7700:6200+((t*240)%3600);
    ctx.save();ctx.beginPath();ctx.rect(6640,150,1980,90);ctx.clip();
    for(let i=0;i<3;i++){
      const x=head-i*148;if(x<6500||x-140>8700)continue;
      chamfer(ctx,x-140,190,140,36,8);ctx.fillStyle='#1b1e33';ctx.fill();ctx.strokeStyle='#2c3150';ctx.lineWidth=1;ctx.stroke();
      ctx.fillStyle=rgba(mint,.55);for(let wx=x-128;wx<x-14;wx+=22)ctx.fillRect(wx,198,14,10);
      ctx.fillStyle=rgba(mint,.9);ctx.fillRect(x-140,218,140,2);
    }
    ctx.restore();
  }
  vault(ctx,t,reduced){
    const ice=colors.ice;
    const tower=(x,top,w)=>{
      ctx.fillStyle=STRUCT;ctx.fillRect(x,top,w,600-top);ctx.fillStyle=rgba(ice,.25);ctx.fillRect(x,top,w,1);ctx.fillRect(x,top,1,600-top);
      const scan=reduced?-999:600-((t*70)%(600-top));
      for(let y=top+26,row=0;y<584;y+=14,row++){
        const near=Math.abs(y-scan)<18;
        for(let c=0;c<3;c++){const sw=(w-30)/3;ctx.fillStyle=rgba(ice,near?.6:.07+hash(row*3+c+x)*.27);ctx.fillRect(x+10+c*(sw+5),y,sw,5);}
      }
    };
    tower(8440,60,160);tower(9160,110,200);
    ctx.strokeStyle=rgba(ice,.3);ctx.lineWidth=1.2;ctx.stroke(this.vaultCable);
    if(!reduced)for(let i=0;i<3;i++){const k=((t*.25)+i/3)%1,[x,y]=pointOn(8600,170,9160,205,30,k);ctx.fillStyle=ice;ctx.fillRect(x-2,y-1,4,2);}
    const cx=9260,cy=470;
    ctx.fillStyle='#0d0f1d';ctx.beginPath();ctx.arc(cx,cy,64,0,TAU);ctx.fill();
    const rings=new Path2D();rings.arc(cx,cy,60,0,TAU);rings.moveTo(cx+44,cy);rings.arc(cx,cy,44,0,TAU);
    neon(ctx,rings,ice,1.4,.75);
    ctx.strokeStyle=rgba(ice,.4);ctx.lineWidth=2;ctx.beginPath();
    for(let i=0;i<8;i++){const a=i*TAU/8;ctx.moveTo(cx+Math.cos(a)*14,cy+Math.sin(a)*14);ctx.lineTo(cx+Math.cos(a)*42,cy+Math.sin(a)*42);}ctx.stroke();
    ctx.fillStyle=ice;ctx.beginPath();ctx.arc(cx,cy,6,0,TAU);ctx.fill();
  }
  mast(ctx,t,reduced){
    const coral=colors.coral;
    ctx.strokeStyle='#2a2e48';ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(10360,600);ctx.lineTo(10440,40);ctx.moveTo(10540,600);ctx.lineTo(10460,40);
    for(let y=60;y<600;y+=48){const k=(y-40)/560,l=10440-80*k,r=10460+80*k,k2=Math.min(1,(y+48-40)/560),l2=10440-80*k2,r2=10460+80*k2;ctx.moveTo(l,y);ctx.lineTo(r2,Math.min(600,y+48));ctx.moveTo(r,y);ctx.lineTo(l2,Math.min(600,y+48));}
    ctx.stroke();
    ctx.fillStyle='#1a1d30';ctx.beginPath();ctx.ellipse(10400,220,12,30,0,Math.PI*.5,Math.PI*1.5);ctx.fill();ctx.beginPath();ctx.ellipse(10500,330,12,30,0,-Math.PI*.5,Math.PI*.5);ctx.fill();
    ctx.strokeStyle=rgba(coral,.6);ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(10400,220,12,30,0,Math.PI*.5,Math.PI*1.5);ctx.stroke();ctx.beginPath();ctx.ellipse(10500,330,12,30,0,-Math.PI*.5,Math.PI*.5);ctx.stroke();
    const bx=10450,by=34,pulse=reduced?.8:.55+.45*Math.sin(t*2.2);
    ctx.fillStyle=rgba(coral,.25*pulse);ctx.beginPath();ctx.arc(bx,by,16,0,TAU);ctx.fill();ctx.fillStyle=coral;ctx.beginPath();ctx.arc(bx,by,4.5,0,TAU);ctx.fill();
    // Signal rings travel outward from the beacon.
    ctx.lineWidth=1.4;
    for(let i=0;i<3;i++){
      const k=reduced?(i+1)/4:((t/2.4)+i/3)%1;
      ctx.strokeStyle=rgba(coral,(1-k)*.45);ctx.beginPath();ctx.arc(bx,by,12+k*230,Math.PI*.1,Math.PI*.9);ctx.stroke();
    }
    // The rooftop ends here.
    ctx.fillStyle=STRUCT;for(let x=11100;x<11200;x+=24)ctx.fillRect(x,540,4,60);ctx.fillRect(11096,540,104,4);
    ctx.fillStyle=rgba(coral,.7);for(let x=11104;x<11200;x+=24)ctx.fillRect(x,548,10,3);
  }
  // Zone title plates and the identity board, placed below the HUD band.
  drawSigns(ctx,f){
    const {camera,visible,below}=f,T=below(270),firstView=Math.max(0,194-camera.width*.38);
    for(const [index,zone] of zones.entries()){
      // The first title follows the identity board so narrow screens never clip it.
      const x=index?zone.start+60:Math.max(60,firstView+24);if(!visible(x-10,700))continue;
      const accent=accentFor(zone.id),number=String(index).padStart(2,'0'),name=zone.label.toUpperCase();
      ctx.font=font(12,600);const nw=ctx.measureText(number).width,sep=ctx.measureText(' / ').width,lw=ctx.measureText(name).width,w=nw+sep+lw;
      chamfer(ctx,x-10,T-5,w+20,24,6);ctx.fillStyle='rgba(10,11,18,.8)';ctx.fill();ctx.strokeStyle=rgba(accent,.45);ctx.lineWidth=1;ctx.stroke();
      ctx.fillStyle=accent;ctx.fillRect(x-10,T-1,2,16);
      ctx.textBaseline='top';ctx.textAlign='left';
      ctx.fillStyle=accent;ctx.fillText(number,x,T+1);ctx.fillStyle=colors.muted;ctx.fillText(' / ',x+nw,T+1);ctx.fillStyle='#d9ddf0';ctx.fillText(name,x+nw+sep,T+1);
      f.record(number+' / '+name,x,T,w,14);
      const line=Math.min(650,zone.end-zone.start-120);
      const g=ctx.createLinearGradient(x,0,x+line,0);g.addColorStop(0,rgba(accent,.55));g.addColorStop(1,rgba(accent,0));
      ctx.fillStyle=g;ctx.fillRect(x-10,T+25,line,1);
    }
    if(visible(40,480))this.identity(ctx,f,T);
  }
  identity(ctx,f,T){
    const {camera,t,reduced}=f,cyan=colors.cyan;
    // Fit the board inside the first view, whatever the screen width.
    const start=Math.max(0,194-camera.width*.38);
    const left=Math.max(60,start+14),right=Math.min(500,start+camera.width-14),w=right-left,top=T+36,pad=w<330?12:18;
    const inner=w-pad*2;
    ctx.font=font(34,700,'sans');
    const lines=[
      ['JUNYOUNG OH',fit(ctx,'JUNYOUNG OH',inner,34,700,'sans',18),700,'sans',colors.text],
      ['COMPUTER SCIENCE · INTERACTIVE SYSTEMS · AI',fit(ctx,'COMPUTER SCIENCE · INTERACTIVE SYSTEMS · AI',inner,11,600,'mono',8),600,'mono',cyan],
      ['UW–MADISON / MADISON, WI',fit(ctx,'UW–MADISON / MADISON, WI',inner,11,400,'mono',8),400,'mono',colors.muted],
      ['I build software people can experience.',fit(ctx,'I build software people can experience.',inner,15,400,'sans',10),400,'sans','#dfe3f5']
    ];
    const route='ABOUT → PROJECTS → AI → EXPERIENCE → SKILLS → RESUME → CONTACT',routeSize=fit(ctx,route,inner,9,400,'mono',7);
    ctx.font=font(routeSize);
    if(ctx.measureText(route).width<=inner)lines.push([route,routeSize,400,'mono','#8f95b8']);
    else {lines.push(['ABOUT → PROJECTS → AI → EXPERIENCE',9,400,'mono','#8f95b8']);lines.push(['→ SKILLS → RESUME → CONTACT',9,400,'mono','#8f95b8']);}
    const gaps=[12,10,16,12,6];
    const height=pad+lines.reduce((sum,[,size],i)=>sum+size+gaps[i],0)+pad-6;
    // Two slim poles carry the board.
    ctx.fillStyle=STRUCT;ctx.fillRect(left+24,top+height,5,600-top-height);ctx.fillRect(right-29,top+height,5,600-top-height);
    const g=ctx.createLinearGradient(0,top,0,top+height);g.addColorStop(0,rgba(cyan,.12));g.addColorStop(1,'rgba(10,11,18,.88)');
    chamfer(ctx,left,top,w,height,12);ctx.fillStyle='rgba(10,11,18,.78)';ctx.fill();ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=rgba(cyan,.5);ctx.lineWidth=1;ctx.stroke();
    ctx.save();ctx.clip();ctx.fillStyle='rgba(255,255,255,.025)';for(let y=top;y<top+height;y+=4)ctx.fillRect(left,y,w,1);
    if(!reduced){const sy=top+((t*36)%height);ctx.fillStyle=rgba(cyan,.08);ctx.fillRect(left,sy,w,14);}
    ctx.restore();
    const bracket=new Path2D();bracket.moveTo(left,top+22);bracket.lineTo(left,top+12);bracket.lineTo(left+12,top);bracket.lineTo(left+30,top);
    bracket.moveTo(right,top+height-22);bracket.lineTo(right,top+height-12);bracket.lineTo(right-12,top+height);bracket.lineTo(right-30,top+height);
    neon(ctx,bracket,cyan,1.4,.9);
    let y=top+pad;ctx.textAlign='left';ctx.textBaseline='top';
    for(const [i,[text,size,weight,family,color]] of lines.entries()){
      f.text(text,left+pad,y,size,color,{weight,family});y+=size+gaps[i];
    }
  }
  // The wet street deck, reflections and the structure under the street.
  drawStreet(ctx,f,lights){
    const {camera,t,reduced,accentAt}=f,x0=camera.x-40,x1=camera.x+camera.width+40,w=x1-x0;
    this.deck||=(()=>{const g=ctx.createLinearGradient(0,600,0,640);g.addColorStop(0,'#1a1d30');g.addColorStop(1,'#0e1019');return g;})();
    ctx.fillStyle=this.deck;ctx.fillRect(x0,600,w,40);
    for(const p of this.puddles){if(p.x+p.w<x0||p.x>x1)continue;ctx.fillStyle='rgba(120,130,210,.07)';ctx.beginPath();ctx.ellipse(p.x,618,p.w/2,7,0,0,TAU);ctx.fill();ctx.fillStyle='rgba(200,210,255,.08)';ctx.fillRect(p.x-p.w*.3,613,p.w*.45,1);}
    // Reflections: broken vertical streaks of nearby light, rippling with the rain.
    for(const light of lights){
      if(light.x+light.w<x0||light.x>x1)continue;
      for(let y=602,i=0;y<638;y+=4,i++){
        const wobble=reduced?0:Math.sin(i*1.3+t*3.2+light.x*.01)*2.5,k=1-i/9;
        ctx.fillStyle=rgba(light.color,light.strength*.34*k);ctx.fillRect(light.x+wobble+i*.6,y,light.w-i*1.2,2.2);
      }
    }
    // District-coloured edge light along the street.
    for(const zone of zones){
      if(zone.end<x0||zone.start>x1)continue;
      const a=Math.max(x0,zone.start),b=Math.min(x1,zone.end),accent=accentFor(zone.id);
      ctx.fillStyle=accent;ctx.fillRect(a,598.5,b-a,2.5);ctx.fillStyle=rgba(accent,.12);ctx.fillRect(a,601,b-a,7);
    }
    ctx.fillStyle='#2a2e48';ctx.fillRect(x0,640,w,6);ctx.fillStyle='#3a4062';ctx.fillRect(x0,640,w,1);
    ctx.fillStyle=DARK;ctx.fillRect(x0,646,w,46);ctx.fillStyle='#1c1f33';ctx.fillRect(x0,688,w,4);
    const truss=new Path2D(),first=Math.floor(x0/80)*80;
    for(let x=first;x<x1;x+=80){truss.moveTo(x,648);truss.lineTo(x+80,688);truss.moveTo(x,688);truss.lineTo(x+80,648);}
    ctx.strokeStyle='#1b1e33';ctx.lineWidth=1.5;ctx.stroke(truss);
    // Under-street lamps and sagging cables.
    for(let x=Math.floor(x0/320)*320+160;x<x1;x+=320){
      const accent=accentAt(x);
      ctx.fillStyle='#22263b';ctx.fillRect(x-.5,692,1,18);ctx.fillStyle=STRUCT;ctx.beginPath();ctx.moveTo(x-10,718);ctx.lineTo(x-5,710);ctx.lineTo(x+5,710);ctx.lineTo(x+10,718);ctx.fill();
      const cone=ctx.createLinearGradient(0,718,0,860);cone.addColorStop(0,rgba(accent,.2));cone.addColorStop(1,rgba(accent,0));
      ctx.fillStyle=cone;ctx.beginPath();ctx.moveTo(x-9,718);ctx.lineTo(x+9,718);ctx.lineTo(x+60,860);ctx.lineTo(x-60,860);ctx.fill();
      ctx.fillStyle=mix(accent,'#ffffff',.5);ctx.fillRect(x-4,717,8,2);
    }
    const cables=new Path2D();
    for(let x=Math.floor(x0/640)*640;x<x1;x+=640){catenary(cables,x,694,x+640,694,28);catenary(cables,x+200,694,x+840,694,40);}
    ctx.strokeStyle='#1d2033';ctx.lineWidth=2;ctx.stroke(cables);
  }
  // Screen-space railing in front of the lower street, moving a little faster than the world.
  drawForeground(ctx,view,cameraPx,reduced,accent){
    const {width:W,height:H}=view,G=Math.round(H*.76),top=G+(H-G)*.66;
    if(H-top<14)return;
    const offset=reduced?0:cameraPx*1.25,spacing=170,first=-(((offset%spacing)+spacing)%spacing);
    ctx.fillStyle='#05050a';for(let x=first;x<W+spacing;x+=spacing)ctx.fillRect(x,top,7,H-top);
    ctx.fillRect(0,top,W,5);ctx.fillRect(0,top+(H-top)*.48,W,3);
    ctx.fillStyle=rgba(accent,.4);ctx.fillRect(0,top,W,1);
  }
}
