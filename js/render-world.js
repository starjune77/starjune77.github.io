// Composes the Rain District frame: sky and skyline (screen space), districts, street, kiosks
// and the player (world space), then rain and the foreground railing on top.
import {zones} from './world.js';
import {accentFor} from './palette.js';
import {mix,font} from './render-kit.js';
import {Skyline} from './render-sky.js';
import {Effects} from './render-fx.js';
import {Districts} from './render-district.js';
import {drawPlatforms,drawKiosks,kioskLights} from './render-blocks.js';

// Blends accents across district borders so the city tint shifts smoothly as you travel.
export function accentAt(x){
  let i=zones.findIndex(z=>x>=z.start&&x<z.end);if(i<0)i=zones.length-1;
  const zone=zones[i],accent=accentFor(zone.id),blend=160;
  if(zone.end-x<blend&&zones[i+1])return mix(accent,accentFor(zones[i+1].id),(1-(zone.end-x)/blend)*.5);
  if(x-zone.start<blend&&i>0)return mix(accent,accentFor(zones[i-1].id),(1-(x-zone.start)/blend)*.5);
  return accent;
}

export class WorldRenderer {
  constructor(world){this.skyline=new Skyline();this.fx=new Effects();this.districts=new Districts(world);this.lastTime=null;this.renderMs=0;}
  resize(view){this.skyline.build(view,view.lowQuality);this.fx.configure(view,view.lowQuality);}
  get particles(){return this.fx.count;}
  render(ctx,world,player,camera,view,state,reduced,hovered,labels){
    const started=performance.now(),{width:W,height:H,dpr}=view;
    if(this.skyline.W!==W||this.skyline.H!==H)this.resize(view);
    const scale=camera.scale,cameraPx=camera.x*scale,t=world.time;
    const dt=this.lastTime===null?0:Math.min(.05,Math.max(0,t-this.lastTime));this.lastTime=t;
    const accent=accentAt(camera.x+camera.width/2),safeTop=view.safeTop||0;
    // Boxes are recorded in CSS pixels. kind: text (world labels), bg (background signage), actor (the player).
    const record=(text,x,y,w,h,kind='text')=>labels?.push({text,x,y,w,h,kind});
    const worldRecord=(text,x,y,w,h,kind)=>record(text,(x-camera.x)*scale,(y-camera.y)*scale,w*scale,h*scale,kind);
    const visible=(x,w)=>x+w>=camera.x-100&&x<camera.x+camera.width+100;
    const below=y=>Math.max(y,camera.y+(safeTop+14)/scale);
    const text=(label,x,y,size,color,{weight=400,family='mono',align='left'}={})=>{
      ctx.font=font(size,weight,family);ctx.textAlign=align;ctx.textBaseline='top';ctx.fillStyle=color;ctx.fillText(label,x,y);
      const w=ctx.measureText(label).width;worldRecord(label,align==='center'?x-w/2:align==='right'?x-w:x,y,w,size);
    };
    ctx.setTransform(dpr,0,0,dpr,0,0);
    this.fx.update(dt,{t,cameraPx,camera,reduced,emitters:this.districts.visibleEmitters(camera)});
    this.skyline.drawBack(ctx,cameraPx,t,reduced,accent,safeTop,record,depth=>this.fx.drawCars(ctx,depth,cameraPx,t));
    ctx.save();ctx.scale(scale,scale);ctx.translate(-camera.x,-camera.y);
    const frame={camera,view,t,reduced,state,world,visible,below,accentAt,text,record:worldRecord};
    this.districts.drawBack(ctx,frame);
    this.districts.drawSigns(ctx,frame);
    this.districts.drawStreet(ctx,frame,[...this.districts.lightsIn(visible),...kioskLights(world,state,hovered,visible)]);
    this.fx.drawRipples(ctx);
    drawPlatforms(ctx,world,frame);
    drawKiosks(ctx,world,frame,hovered);
    this.fx.drawSteam(ctx);
    ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.ellipse(player.x+player.width/2,world.ground+4,22,4,0,0,Math.PI*2);ctx.fill();
    player.draw(ctx,reduced);
    worldRecord('player',player.x,player.y,player.width,player.height,'actor');
    ctx.restore();
    this.fx.drawRain(ctx);
    this.districts.drawForeground(ctx,view,cameraPx,reduced,accent);
    this.skyline.drawFront(ctx);
    this.renderMs=this.renderMs*.9+(performance.now()-started)*.1;
  }
}
