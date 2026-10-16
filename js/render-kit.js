// Small drawing helpers shared by the world renderers. Nothing here touches game state.
import {fonts} from './palette.js';

export function surface(width,height,scale=1) {
  const canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.ceil(width*scale));canvas.height=Math.max(1,Math.ceil(height*scale));
  const ctx=canvas.getContext('2d');ctx.scale(scale,scale);
  return {canvas,ctx,width,height,scale};
}
// Deterministic pseudo-random numbers so the city looks the same on every visit.
export function random(seed) {
  let a=seed>>>0;
  return ()=>{a=a+0x6D2B79F5>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};
}
export const hash=n=>{let t=Math.imul((n|0)^0x9e3779b9,0x85ebca6b);t^=t>>>13;t=Math.imul(t,0xc2b2ae35);t^=t>>>16;return (t>>>0)/4294967296;};
const rgbCache=new Map();
function rgb(hex){
  let value=rgbCache.get(hex);
  if(!value){const n=parseInt(hex.slice(1),16);value=[n>>16&255,n>>8&255,n&255];rgbCache.set(hex,value);}
  return value;
}
export const rgba=(hex,alpha)=>{const [r,g,b]=rgb(hex);return `rgba(${r},${g},${b},${alpha})`;};
export function mix(a,b,t){
  const x=rgb(a),y=rgb(b);
  return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('');
}
export function chamfer(ctx,x,y,w,h,c){
  ctx.beginPath();ctx.moveTo(x+c,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w,y+h-c);ctx.lineTo(x+w-c,y+h);ctx.lineTo(x,y+h);ctx.lineTo(x,y+c);ctx.closePath();
}
// Neon is steady most of the time, with brief irregular dips. Reduced motion keeps it steady.
export function flicker(seed,t,reduced){
  if(reduced)return 1;
  const hum=.9+.1*Math.sin(t*2.3+seed*7.1)*Math.sin(t*3.7+seed*3.3);
  const slot=Math.floor(t*9);
  return hash(slot*131+seed*977)<.03?.28+.3*hash(slot+seed):hum;
}
export const font=(size,weight=400,family='mono')=>`${weight} ${size}px ${fonts[family]}`;
// Shrinks the font until the text fits; returns the size used.
export function fit(ctx,text,maxWidth,size,weight=400,family='mono',min=7){
  ctx.font=font(size,weight,family);const width=ctx.measureText(text).width;
  if(width<=maxWidth)return size;
  const fitted=Math.max(min,Math.floor(size*maxWidth/width*10)/10);ctx.font=font(fitted,weight,family);return fitted;
}
// Three strokes of falling width give a cheap glow without shadowBlur on every frame.
export function neon(ctx,path,color,width=2,intensity=1){
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=color;
  ctx.globalAlpha=.12*intensity;ctx.lineWidth=width*5;ctx.stroke(path);
  ctx.globalAlpha=.3*intensity;ctx.lineWidth=width*2.4;ctx.stroke(path);
  ctx.globalAlpha=Math.min(1,intensity);ctx.lineWidth=width;ctx.stroke(path);
  ctx.restore();
}
// Neon sign sprites are rendered once with real blur and reused every frame.
const signs=new Map();
export function signSprite(text,color,{vertical=false,size=16,dpr=1}={}){
  const key=`${text}|${color}|${vertical}|${size}|${dpr}`;
  let sprite=signs.get(key);if(sprite)return sprite;
  const probe=surface(1,1).ctx;probe.font=font(size,700,'sans');
  const glyph=size*1.05,pad=size*.9;
  const width=vertical?glyph+pad*2:probe.measureText(text).width+pad*2,height=vertical?text.length*glyph+pad*2:size+pad*2;
  const s=surface(width,height,dpr),ctx=s.ctx;
  ctx.fillStyle='rgba(8,9,16,.82)';chamfer(ctx,pad*.45,pad*.45,width-pad*.9,height-pad*.9,size*.35);ctx.fill();
  ctx.strokeStyle=rgba(color,.55);ctx.lineWidth=1.2;ctx.stroke();
  ctx.font=font(size,700,'sans');ctx.textAlign='center';ctx.textBaseline='middle';
  const draw=fill=>{
    ctx.fillStyle=fill;
    if(vertical)[...text].forEach((ch,i)=>ctx.fillText(ch,width/2,pad+glyph*(i+.5)));
    else ctx.fillText(text,width/2,height/2+size*.04);
  };
  ctx.shadowColor=color;ctx.shadowBlur=size*.9;draw(color);ctx.shadowBlur=size*.35;draw(color);
  ctx.shadowBlur=0;draw('rgba(255,255,255,.72)');
  sprite={canvas:s.canvas,width,height};
  if(signs.size>160)signs.clear();
  signs.set(key,sprite);return sprite;
}
// A soft round puff used for steam and glows.
let puff=null;
export function puffSprite(){
  if(puff)return puff;
  const s=surface(64,64),g=s.ctx.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,'rgba(220,226,255,.55)');g.addColorStop(.5,'rgba(200,206,240,.2)');g.addColorStop(1,'rgba(200,206,240,0)');
  s.ctx.fillStyle=g;s.ctx.fillRect(0,0,64,64);puff=s.canvas;return puff;
}
