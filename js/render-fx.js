// Rain, puddle ripples, flying vehicles and steam. Counts are capped (lower on touch and small
// screens) and everything is switched off when reduced motion is requested.
import {colors} from './palette.js';
import {random,rgba,puffSprite} from './render-kit.js';

const WIND=-.2;
const CAR_COLORS=[colors.cyan,colors.magenta,colors.amber,colors.violet];

export class Effects {
  constructor(){this.rand=random(4242);this.rain=[];this.ripples=[];this.cars=[];this.steam=[];this.nextCar=1.5;this.emitTimers=new Map();this.W=1;this.H=1;}
  configure(view,low){
    this.W=view.width;this.H=view.height;this.G=Math.round(view.height*.76);this.low=low;
    this.rainCap=low?90:Math.round(Math.min(260,110+view.width*view.height/12000));
    this.rippleCap=low?10:24;this.steamCap=low?16:40;this.carCap=low?2:3;
    while(this.rain.length<this.rainCap)this.rain.push(this.drop(this.rand()*this.H));
    this.rain.length=this.rainCap;
  }
  get count(){return this.active?this.rain.length+this.ripples.length+this.cars.length+this.steam.length:0;}
  drop(y=-20-this.rand()*this.H*.3){
    const near=this.rand()<.45;
    return {x:this.rand()*(this.W+80)-40,y,near,len:near?14+this.rand()*9:7+this.rand()*5,speed:near?950+this.rand()*300:620+this.rand()*180};
  }
  update(dt,{t,cameraPx,camera,reduced,emitters}){
    this.active=!reduced;
    if(reduced){this.ripples.length=0;this.cars.length=0;this.steam.length=0;this.lastPx=cameraPx;return;}
    const shift=this.lastPx===undefined?0:cameraPx-this.lastPx;this.lastPx=cameraPx;
    const rand=this.rand,bottom=this.G+40*camera.scale;
    for(const d of this.rain){
      d.y+=d.speed*dt;d.x+=d.speed*dt*WIND-shift*(d.near?.6:.25);
      if(d.y>(d.near?bottom:this.G)){
        if(d.near&&this.ripples.length<this.rippleCap&&rand()<.3)this.ripples.push({x:camera.x+d.x/camera.scale,y:camera.y+(this.G+2+rand()*(bottom-this.G-4))/camera.scale,age:0,life:.35+rand()*.25,size:5+rand()*7});
        Object.assign(d,this.drop());
      }
      if(d.x<-40)d.x+=this.W+80;else if(d.x>this.W+40)d.x-=this.W+80;
    }
    for(const r of this.ripples)r.age+=dt;
    this.ripples=this.ripples.filter(r=>r.age<r.life);
    // Flying vehicles cross the sky every few seconds, at two depths.
    if(t>=this.nextCar&&this.cars.length<this.carCap){
      const depth=rand()<.55?0:1,dir=rand()<.5?1:-1,factor=depth?.26:.1,speed=(depth?190:110)+rand()*90;
      this.cars.push({depth,dir,factor,speed,y:this.H*(depth?.12+rand()*.2:.08+rand()*.16),x:cameraPx*factor+(dir>0?-120:this.W+120),size:depth?1:.55,color:CAR_COLORS[Math.floor(rand()*CAR_COLORS.length)],seed:rand()*10});
      this.nextCar=t+3+rand()*6;
    }
    if(t<this.nextCar-20)this.nextCar=t+2;
    for(const c of this.cars)c.x+=c.dir*c.speed*dt;
    this.cars=this.cars.filter(c=>{const sx=c.x-cameraPx*c.factor;return c.dir>0?sx<this.W+200:sx>-200;});
    // Steam rises from visible vents only.
    for(const e of emitters){
      const timer=(this.emitTimers.get(e.id)||0)+dt*e.rate;
      let n=Math.floor(timer);this.emitTimers.set(e.id,timer-n);
      while(n-->0&&this.steam.length<this.steamCap)this.steam.push({x:e.x+(rand()-.5)*e.width,y:e.y,vx:-8+rand()*10,vy:-(26+rand()*26),age:0,life:2+rand()*1.4,size:10+rand()*8});
    }
    for(const p of this.steam){p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy*=1-.25*dt;}
    this.steam=this.steam.filter(p=>p.age<p.life);
  }
  drawCars(ctx,depth,cameraPx,t){
    if(!this.active)return;
    for(const c of this.cars){
      if(c.depth!==depth)continue;
      const x=c.x-cameraPx*c.factor,y=c.y+Math.sin(t*1.6+c.seed)*2;
      ctx.save();ctx.translate(x,y);ctx.scale(c.dir*c.size,c.size);
      const trail=ctx.createLinearGradient(-130,0,-24,0);trail.addColorStop(0,rgba(colors.red,0));trail.addColorStop(1,rgba(colors.red,.4));
      ctx.fillStyle=trail;ctx.fillRect(-130,-1,106,2.5);
      const beam=ctx.createLinearGradient(26,0,110,0);beam.addColorStop(0,'rgba(230,240,255,.22)');beam.addColorStop(1,'rgba(230,240,255,0)');
      ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(25,-2);ctx.lineTo(110,-12);ctx.lineTo(110,10);ctx.lineTo(25,2);ctx.fill();
      ctx.fillStyle=rgba(c.color,.3);ctx.beginPath();ctx.ellipse(0,8,22,3,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#1a1d30';ctx.beginPath();ctx.moveTo(-26,0);ctx.lineTo(-19,-7);ctx.lineTo(7,-9);ctx.lineTo(23,-4);ctx.lineTo(26,1);ctx.lineTo(18,5);ctx.lineTo(-22,5);ctx.closePath();ctx.fill();
      ctx.strokeStyle='#3a4062';ctx.lineWidth=1;ctx.stroke();
      ctx.fillStyle=rgba(colors.cyan,.85);ctx.beginPath();ctx.moveTo(-2,-8);ctx.lineTo(8,-8);ctx.lineTo(17,-4);ctx.lineTo(-1,-4);ctx.closePath();ctx.fill();
      ctx.fillStyle=rgba(c.color,.9);ctx.fillRect(-18,-1,30,1.5);
      ctx.fillStyle='#ffffff';ctx.fillRect(23,-2,3,2);ctx.fillStyle=colors.red;ctx.fillRect(-26,-1,3,2);
      ctx.restore();
    }
  }
  drawRain(ctx){
    if(!this.active)return;
    for(const near of [false,true]){
      ctx.beginPath();
      for(const d of this.rain){if(d.near!==near)continue;ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-d.len*WIND,d.y-d.len);}
      ctx.strokeStyle=near?'rgba(190,205,255,.34)':'rgba(160,170,235,.2)';ctx.lineWidth=near?1.2:1;ctx.stroke();
    }
  }
  // World-space: drawn inside the camera transform so ripples and steam stay put on the street.
  drawRipples(ctx){
    if(!this.active)return;
    ctx.lineWidth=1;
    for(const r of this.ripples){
      const k=r.age/r.life;ctx.strokeStyle=`rgba(190,200,255,${(1-k)*.5})`;
      ctx.beginPath();ctx.ellipse(r.x,r.y,r.size*k+1,(r.size*k+1)*.28,0,0,Math.PI*2);ctx.stroke();
    }
  }
  drawSteam(ctx){
    if(!this.active||!this.steam.length)return;
    const sprite=puffSprite();
    for(const p of this.steam){
      const k=p.age/p.life,size=p.size+k*46;
      ctx.globalAlpha=Math.min(1,p.age*3)*(1-k)*.55;ctx.drawImage(sprite,p.x-size/2,p.y-size/2,size,size);
    }
    ctx.globalAlpha=1;
  }
}
