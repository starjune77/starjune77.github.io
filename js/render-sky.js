// Sky, three parallax skyline layers and the lower city below the street, in screen space.
// Static pixels are painted once per viewport size into offscreen tiles; only neon, billboards
// and warning lights are drawn live on top of them.
import {colors} from './palette.js';
import {surface,random,hash,rgba,signSprite,flicker,fit,chamfer} from './render-kit.js';

const LAYERS=[
  {id:'far',factor:.07,band:.6,scale:.75,seed:11},
  {id:'mid',factor:.2,band:.56,scale:1.5,seed:23},
  {id:'near',factor:.42,band:.7,scale:1.5,seed:37}
];
const SIGN_WORDS={vertical:['OPEN','HOTEL','LAB','24H','CAFE','BYTE','VOLT','NEON','PIXEL'],horizontal:['JY/LAB','MADISON','NOODLE BAR','ARCADE','KIOSK 07','ORBIT','NIGHT MARKET','LAB 07']};
const SIGN_COLORS=[colors.magenta,colors.cyan,colors.amber,colors.violet,colors.mint,colors.coral];
// Billboards show the owner's own names and invented words only.
const BILLBOARD_WORDS=['JY/LAB','MORROWLAB','MADISON, WI','RAIN DISTRICT','NIGHT MARKET','OBJECT DETECTION','OPEN LATE'];
// Mostly warm and ice-white windows; neon colours stay rare so the foreground reads first.
const WINDOW_COLORS=['#ffcf8a','#ffcf8a','#ffd9a8','#cfe0ff','#cfe0ff','#9fdcff','#ffb0d4'];

export class Skyline {
  constructor(){this.key='';this.layers=[];}
  build(view,lowQuality){
    const {width:W,height:H}=view,dpr=Math.min(view.dpr,lowQuality?1.25:2);
    const key=`${W}x${H}@${dpr}`;if(key===this.key)return false;
    this.key=key;this.W=W;this.H=H;this.G=Math.round(H*.76);
    this.sky=paintSky(W,H,this.G);
    this.layers=LAYERS.map(spec=>paintLayer(spec,W,H,this.G,Math.min(spec.scale,dpr)));
    this.lower=paintLower(W,H,this.G,Math.min(1.25,dpr));
    this.signScale=dpr;
    return true;
  }
  // Draws everything behind the street. Returns nothing; text boxes go to record().
  drawBack(ctx,cameraPx,t,reduced,accent,safeTop,record,between){
    const {W,H,G}=this;
    ctx.drawImage(this.sky.canvas,0,0,W,H);
    // District tint near the horizon: one band-sized fill, not a full-screen pass.
    const band=H*.42,horizon=ctx.createLinearGradient(0,G-band,0,G);
    horizon.addColorStop(0,rgba(accent,0));horizon.addColorStop(1,rgba(accent,.15));
    ctx.fillStyle=horizon;ctx.fillRect(0,G-band,W,band);
    for(const layer of this.layers){
      const offset=reduced?0:cameraPx*layer.factor;
      this.drawTiles(ctx,layer,offset);
      if(layer.id==='far')this.drawWarningLights(ctx,layer,offset,t,reduced);
      if(layer.id==='mid')this.drawBillboards(ctx,layer,offset,t,reduced,safeTop,record);
      if(layer.id==='near')this.drawSigns(ctx,layer,offset,t,reduced,safeTop,record);
      if(layer.id==='far')between?.(0);else if(layer.id==='mid')between?.(1);
    }
    const lowerOffset=reduced?0:cameraPx*.3;
    this.drawTiles(ctx,this.lower,lowerOffset);
  }
  drawTiles(ctx,layer,offset){
    const width=layer.width,start=-(((offset%width)+width)%width);
    for(let x=start;x<this.W;x+=width)ctx.drawImage(layer.canvas,x,layer.y,width,layer.height);
  }
  // Calls fn for each slot of each visible tile copy; the copy index varies live content.
  eachSlot(layer,offset,fn){
    const width=layer.width,first=Math.floor(offset/width)-1;
    for(let copy=first;copy*width-offset<this.W;copy++){
      const base=copy*width-offset;
      for(const [i,slot] of layer.slots.entries()){const x=base+slot.x;if(x+slot.w>-40&&x<this.W+40)fn(slot,x,layer.y+slot.y,copy,i);}
    }
  }
  drawWarningLights(ctx,layer,offset,t,reduced){
    this.eachSlot(layer,offset,(slot,x,y,copy,i)=>{
      const on=reduced?1:(Math.sin(t*2.1+i*1.7+copy)>.2?1:.25);
      ctx.fillStyle=rgba(colors.red,.75*on);ctx.fillRect(x-1.5,y-1.5,3,3);
      ctx.fillStyle=rgba(colors.red,.16*on);ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.fill();
    });
  }
  drawBillboards(ctx,layer,offset,t,reduced,safeTop,record){
    this.eachSlot(layer,offset,(slot,x,y,copy,i)=>{
      y=Math.max(y,safeTop+8);
      const seed=copy*17+i*5,color=SIGN_COLORS[Math.floor(hash(seed)*SIGN_COLORS.length)];
      const message=BILLBOARD_WORDS[(Math.floor(hash(seed+3)*BILLBOARD_WORDS.length)+(reduced?0:Math.floor(t/5)))%BILLBOARD_WORDS.length];
      const light=flicker(seed,t,reduced);
      ctx.save();ctx.globalAlpha=.5*light;
      const g=ctx.createLinearGradient(0,y,0,y+slot.h);g.addColorStop(0,rgba(color,.26));g.addColorStop(1,rgba(color,.06));
      chamfer(ctx,x,y,slot.w,slot.h,6);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=rgba(color,.7);ctx.lineWidth=1;ctx.stroke();
      ctx.clip();
      // Scanlines drift slowly; reduced motion holds them still.
      const drift=reduced?0:(t*14)%4;ctx.fillStyle=rgba('#ffffff',.06);
      for(let ly=y+drift;ly<y+slot.h;ly+=4)ctx.fillRect(x,ly,slot.w,1);
      const size=fit(ctx,message,slot.w-16,Math.min(18,slot.h*.36),700,'sans',8);
      const glitch=!reduced&&hash(Math.floor(t*6)+seed)<.06?(hash(seed+Math.floor(t*30))-.5)*6:0;
      ctx.textAlign='center';ctx.textBaseline='middle';const cx=x+slot.w/2,cy=y+slot.h/2;
      if(glitch){ctx.fillStyle=rgba(colors.cyan,.6);ctx.fillText(message,cx+glitch,cy);ctx.fillStyle=rgba(colors.magenta,.6);ctx.fillText(message,cx-glitch,cy);}
      ctx.fillStyle=rgba('#ffffff',.88);ctx.fillText(message,cx,cy);
      const w=ctx.measureText(message).width;
      ctx.restore();
      record?.(message,cx-w/2,cy-size/2,w,size,'bg');
    });
  }
  drawSigns(ctx,layer,offset,t,reduced,safeTop,record){
    this.eachSlot(layer,offset,(slot,x,y,copy,i)=>{
      const seed=copy*7919+i*104729,words=SIGN_WORDS[slot.vertical?'vertical':'horizontal'];
      const text=words[Math.floor(hash(seed)*words.length)],color=SIGN_COLORS[Math.floor(hash(seed+1)*SIGN_COLORS.length)];
      const sprite=signSprite(text,color,{vertical:slot.vertical,size:slot.vertical?12:13,dpr:this.signScale});
      const sx=slot.vertical?x:x+slot.w/2-sprite.width/2,sy=Math.max(y,safeTop+6);
      if(sy+sprite.height>this.G-6)return;
      // Background signage stays at half strength so it never competes with kiosks.
      ctx.globalAlpha=.48*flicker(seed%97,t,reduced);ctx.drawImage(sprite.canvas,sx,sy,sprite.width,sprite.height);ctx.globalAlpha=1;
      record?.(text,sx,sy,sprite.width,sprite.height,'bg');
    });
  }
}

function paintSky(W,H,G){
  const s=surface(W,H,.5),ctx=s.ctx;
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#05060d');g.addColorStop(.38,'#0b0c1c');g.addColorStop(.62,'#191230');g.addColorStop(G/H,'#2c1538');g.addColorStop(1,'#0a0b12');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const glow=(x,y,r,color,a)=>{const rg=ctx.createRadialGradient(x,y,0,x,y,r);rg.addColorStop(0,rgba(color,a));rg.addColorStop(1,rgba(color,0));ctx.fillStyle=rg;ctx.fillRect(0,0,W,H);};
  glow(W*.28,G,W*.55,colors.magenta,.16);glow(W*.82,G*.96,W*.45,colors.cyan,.08);
  // A pale moon behind the smog.
  const mx=W*.8,my=H*.15,mr=Math.max(14,H*.045);
  glow(mx,my,mr*5,'#c9c4ff',.08);ctx.fillStyle='rgba(222,220,255,.5)';ctx.beginPath();ctx.arc(mx,my,mr,0,Math.PI*2);ctx.fill();
  const rand=random(5);
  for(let i=0;i<14;i++){
    const y=H*(.06+rand()*.5),w=W*(.25+rand()*.5),x=rand()*W-w*.3,h=6+rand()*18;
    ctx.fillStyle=`rgba(${42+rand()*20|0},${30+rand()*14|0},${66+rand()*20|0},${.18+rand()*.22})`;
    ctx.beginPath();ctx.ellipse(x+w/2,y,w/2,h,0,0,Math.PI*2);ctx.fill();
  }
  return s;
}

function paintLayer(spec,W,H,G,scale){
  const width=Math.round(Math.min(Math.max(W*(spec.id==='near'?1.3:1.5),1300),3000)),height=Math.round(H*spec.band);
  const s=surface(width,height,scale),ctx=s.ctx,rand=random(spec.seed+width),slots=[];
  // Each building is painted at x and x-width so the tile wraps seamlessly.
  const twice=(x,w,paint)=>{paint(x);if(x+w>width)paint(x-width);};
  const cfg={far:{min:40,max:130,low:.3,high:.95,fill:'#17142b',edge:'#211c3a'},mid:{min:70,max:190,low:.32,high:1,fill:'#10111f',edge:'#1d2036'},near:{min:120,max:250,low:.34,high:.98,fill:'#0b0c16',edge:'#1a1c2e'}}[spec.id];
  for(let x=-10;x<width;){
    const w=cfg.min+rand()*(cfg.max-cfg.min),top=height*(1-(cfg.low+rand()*(cfg.high-cfg.low)));
    const windows=rand()<.85,lit=spec.id==='mid'?.08+rand()*.22:.1+rand()*.3,signs=spec.id==='near'?Math.floor(rand()*2.2):0,billboard=spec.id==='mid'&&rand()<.28&&height-top>height*.45;
    const antenna=spec.id!=='near'&&rand()<.45,stripe=rand()<.35,stripeColor=SIGN_COLORS[Math.floor(rand()*SIGN_COLORS.length)];
    const seed=Math.floor(rand()*1e9);
    twice(x,w,bx=>paintBuilding(ctx,spec.id,cfg,bx,top,w,height,{windows,lit,antenna,stripe,stripeColor,seed}));
    if(antenna&&spec.id==='far')slots.push({x:x+w*.5,y:top-26,w:2});
    if(billboard){const bw=Math.min(w-16,90+rand()*60),bh=40+rand()*26;slots.push({x:x+(w-bw)/2,y:top+18+rand()*20,w:bw,h:bh});}
    for(let i=0;i<signs;i++){
      // Two signs on one facade use separate bands so they never stack.
      const band=(height-top)*.4,vertical=rand()<.55,y=top+20+i*band+rand()*band*.6;
      slots.push(vertical?{x:x+(rand()<.5?4:w-34),y,w:30,vertical:true}:{x:x+10,y,w:w-20,vertical:false});
    }
    x+=w+(spec.id==='far'?rand()*6:rand()*14-2);
  }
  // Atmospheric haze: farther layers sink into purple fog near the horizon.
  const fog={far:[.0,'rgba(44,24,70,0)',.55,'rgba(44,24,70,.32)',1,'rgba(52,26,72,.7)'],mid:[.0,'rgba(26,18,48,0)',.6,'rgba(26,18,48,.2)',1,'rgba(30,20,50,.58)'],near:[.0,'rgba(20,16,36,0)',.75,'rgba(20,16,36,.08)',1,'rgba(26,20,44,.45)']}[spec.id];
  // Haze is baked into the tile, which saves a full-width fill per layer every frame.
  ctx.fillStyle=hazeGradient(ctx,fog,0,height);ctx.fillRect(0,0,width,height);
  return {...spec,canvas:s.canvas,width,height,y:G-height,slots};
}

function paintBuilding(ctx,layer,cfg,x,top,w,height,o){
  const rand=random(o.seed);
  ctx.fillStyle=cfg.fill;ctx.fillRect(x,top,w,height-top);
  ctx.fillStyle=cfg.edge;ctx.fillRect(x,top,w,2);ctx.fillRect(x,top,1,height-top);
  // Rooftop silhouettes: stepped crowns, tanks and antennas.
  if(rand()<.5){const cw=w*(.3+rand()*.4);ctx.fillStyle=cfg.fill;ctx.fillRect(x+(w-cw)/2,top-8-rand()*18,cw,30);}
  if(o.antenna){ctx.fillStyle=cfg.edge;ctx.fillRect(x+w*.5-1,top-26,2,26);}
  if(layer==='near'&&rand()<.4){ctx.fillStyle='#14162a';ctx.fillRect(x+w*.15,top-14,22,14);ctx.fillRect(x+w*.15+4,top-18,14,4);}
  if(o.windows){
    const size={far:[2,3,6,8],mid:[3,5,9,12],near:[6,9,16,20]}[layer];
    const [ww,wh,sx,sy]=size,cols=Math.floor((w-8)/sx),rows=Math.floor((height-top-14)/sy);
    const left=x+(w-cols*sx)/2+(sx-ww)/2;
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
      const on=rand()<o.lit;if(!on&&layer==='far')continue;
      const color=on?WINDOW_COLORS[Math.floor(rand()*WINDOW_COLORS.length)]:'#171a2e';
      ctx.fillStyle=on?rgba(color,(layer==='far'?.2:layer==='mid'?.2:.3)+rand()*(layer==='mid'?.32:.42)):color;
      ctx.fillRect(left+c*sx,top+10+r*sy,ww,wh);
    }
  }
  if(layer==='near'){
    // Fire escapes and pipes give the closest buildings some depth.
    if(rand()<.45){
      ctx.strokeStyle='#1e2136';ctx.lineWidth=1.5;ctx.beginPath();
      const fx=x+w*.6,fw=w*.3;for(let y=top+30;y<height-30;y+=34){ctx.moveTo(fx,y);ctx.lineTo(fx+fw,y);ctx.moveTo(fx,y);ctx.lineTo(fx+fw,y+34);}
      ctx.stroke();
    }
    if(rand()<.5){ctx.fillStyle='#161829';ctx.fillRect(x+w-10,top+6,4,height-top);}
  }
  if(o.stripe){ctx.fillStyle=rgba(o.stripeColor,layer==='far'?.25:.45);ctx.fillRect(x+w-2,top+4,1.5,height-top-4);}
}

function hazeGradient(ctx,stops,top,bottom){
  const g=ctx.createLinearGradient(0,top,0,bottom);
  for(let i=0;i<stops.length;i+=2)g.addColorStop(stops[i],stops[i+1]);
  return g;
}

function paintLower(W,H,G,scale){
  const width=Math.round(Math.max(W*1.4,1200)),height=H-G+2;
  const s=surface(width,height,scale),ctx=s.ctx,rand=random(91+width);
  const g=ctx.createLinearGradient(0,0,0,height);
  g.addColorStop(0,'#120f22');g.addColorStop(.4,'#0b0a17');g.addColorStop(1,'#050509');
  ctx.fillStyle=g;ctx.fillRect(0,0,width,height);
  // Far below the street: tiny windows and a few columns of light in the fog.
  for(let i=0;i<width/9;i++){
    const x=rand()*width,y=height*(.35+rand()*.6),color=WINDOW_COLORS[Math.floor(rand()*WINDOW_COLORS.length)];
    ctx.fillStyle=rgba(color,.12+rand()*.3);ctx.fillRect(x,y,1.5+rand()*2,1.5+rand()*2);
  }
  for(let i=0;i<width/260;i++){
    const x=rand()*width,color=SIGN_COLORS[Math.floor(rand()*SIGN_COLORS.length)],cg=ctx.createLinearGradient(0,height*.3,0,height);
    cg.addColorStop(0,rgba(color,0));cg.addColorStop(1,rgba(color,.12));ctx.fillStyle=cg;ctx.fillRect(x,height*.3,2+rand()*3,height*.7);
  }
  const fog=ctx.createLinearGradient(0,0,0,height);fog.addColorStop(0,'rgba(40,26,64,.5)');fog.addColorStop(.5,'rgba(40,26,64,0)');
  ctx.fillStyle=fog;ctx.fillRect(0,0,width,height);
  return {canvas:s.canvas,width,height,y:G-2,slots:[]};
}
