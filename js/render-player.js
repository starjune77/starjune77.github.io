// The cyber-runner: helmet with a glowing visor, a jacket with lit trim and a scarf.
// Drawn from jointed limbs; the run cycle is keyframed and advances with distance travelled,
// so feet never slide. Physics stays in player.js; this only reads the player's state.
import {colors} from './palette.js';
import {rgba,puffSprite} from './render-kit.js';

const STRIDE=124;
// Eight run frames, starting at front-foot contact: [thigh, knee] for one leg; the other is half a cycle behind.
const RUN=[[.62,.18],[.38,.4],[.06,.62],[-.3,.38],[-.62,.3],[-.36,1.22],[.18,1.55],[.56,.8]];
const POSES={
  idle:{a:[.13,.1],b:[-.11,.08],arms:[.12,.32,-.1,.3],lean:0,drop:0},
  jump:{a:[.95,1.45],b:[-.38,.62],arms:[2.3,.45,-.95,.7],lean:-.04,drop:-1},
  fall:{a:[.32,.32],b:[-.18,.55],arms:[1.85,.32,-1.45,.4],lean:.05,drop:0},
  land:{a:[.5,1.05],b:[-.28,.95],arms:[.7,.9,-.5,.8],lean:.12,drop:4}
};
// Limb lengths keep the figure inside the 28 × 60 hitbox (helmet top at about -61).
const L1=13.5,L2=12.5,A1=10,A2=10;
const lerp=(a,b,k)=>a+(b-a)*k;

export class RunnerRenderer {
  constructor(){this.pose=null;this.distance=0;this.lastX=null;this.lastTime=null;}
  target(player,t,reduced){
    if(player.animation==='run'){
      const p=(this.distance/STRIDE)%1,f=p*8,i=Math.floor(f),k=f-i,j=(i+1)%8,m=(i+4)%8,n=(i+5)%8;
      const a=[lerp(RUN[i][0],RUN[j][0],k),lerp(RUN[i][1],RUN[j][1],k)],b=[lerp(RUN[m][0],RUN[n][0],k),lerp(RUN[m][1],RUN[n][1],k)];
      const sprint=player.sprinting?1:0;
      return {a,b,arms:[-b[0]*.95-.1,1.25+.2*sprint,-a[0]*.95-.1,1.25+.2*sprint],lean:.13+.08*sprint,drop:Math.abs(Math.sin(p*Math.PI*2))*2.2};
    }
    const pose=POSES[player.animation]||POSES.idle;
    return {...pose,drop:pose.drop+(player.animation==='idle'&&!reduced?Math.sin(t*2.2)*.7:0)};
  }
  draw(ctx,player,t,reduced,{reflection=false}={}){
    const dt=this.lastTime===null?0:Math.max(0,Math.min(.05,t-this.lastTime));
    if(!reflection){
      if(this.lastX!==null&&Math.abs(player.x-this.lastX)<60)this.distance+=Math.abs(player.x-this.lastX);
      this.lastX=player.x;this.lastTime=t;
      // Blend toward the target pose so state changes never pop.
      const goal=this.target(player,t,reduced);
      if(!this.pose||reduced)this.pose=structuredClone(goal);
      else {
        const k=1-Math.exp(-dt*(player.animation==='run'?30:16));
        for(const key of ['a','b','arms'])this.pose[key]=this.pose[key].map((v,i)=>lerp(v,goal[key][i],k));
        this.pose.lean=lerp(this.pose.lean,goal.lean,k);this.pose.drop=lerp(this.pose.drop,goal.drop,k);
      }
    }
    const pose=this.pose;if(!pose)return;
    const cx=player.x+player.width/2,feet=player.y+player.height;
    const squash=!reduced&&player.landing>0?player.landing/.12:0;
    ctx.save();ctx.translate(cx,feet);ctx.scale(player.facing*(1+squash*.06),1-squash*.07);
    if(!reflection&&player.sprinting&&!reduced)speedLines(ctx,t);
    const hipY=-26+pose.drop,trim=colors.cyan;
    // Back arm and leg first, in a darker shade.
    ctx.save();ctx.translate(-1,hipY);ctx.rotate(pose.lean);
    limb(ctx,-1,-16,pose.arms[2],pose.arms[3],A1,A2,'#2a3354','#1a1e30',4.6);
    ctx.restore();
    leg(ctx,1,hipY,pose.b,'#262d48','#151826',false);
    ctx.save();ctx.translate(0,hipY);ctx.rotate(pose.lean);
    // Scarf streams behind, more when moving fast.
    const speed=Math.min(1,Math.abs(player.vx)/500),wave=reduced?0:Math.sin(t*11)*2.2*speed;
    ctx.fillStyle=colors.magenta;ctx.beginPath();ctx.moveTo(-3,-20);ctx.quadraticCurveTo(-12-8*speed,-20+wave-(player.vy>50?6:0),-17-12*speed,-13+wave*1.4+(player.vy<-50?4:0));ctx.lineTo(-14-10*speed,-10+wave);ctx.quadraticCurveTo(-8,-15,-2,-15);ctx.fill();
    // Power pack.
    ctx.fillStyle='#1b2036';ctx.fillRect(-12,-18,5,12);ctx.fillStyle=rgba(colors.magenta,reduced?.9:.6+.4*Math.sin(t*3));ctx.fillRect(-11,-15,3,2);
    // Jacket with glowing trim.
    ctx.fillStyle='#36437a';ctx.beginPath();ctx.moveTo(-8,-19);ctx.lineTo(7,-19);ctx.lineTo(9,2);ctx.lineTo(4,5);ctx.lineTo(-9,3);ctx.closePath();ctx.fill();
    ctx.fillStyle='#2a3463';ctx.fillRect(-8,-5,17,4);
    // Magenta rim light from the street signs separates the back from the city.
    ctx.strokeStyle=rgba(colors.magenta,.75);ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-8,-18);ctx.lineTo(-9,2.5);ctx.stroke();
    ctx.strokeStyle=rgba(trim,.25);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(5,-17);ctx.lineTo(7,3);ctx.moveTo(-9,3);ctx.lineTo(4,5);ctx.stroke();
    ctx.strokeStyle=trim;ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(5,-17);ctx.lineTo(7,3);ctx.moveTo(-9,3);ctx.lineTo(4,5);ctx.stroke();
    ctx.fillStyle='#4a5788';ctx.beginPath();ctx.moveTo(-7,-21);ctx.lineTo(6,-21);ctx.lineTo(4,-17);ctx.lineTo(-6,-17);ctx.closePath();ctx.fill();
    // Helmet and visor.
    ctx.fillStyle='#d6dbee';ctx.beginPath();ctx.ellipse(1,-27,8.2,7.8,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#aab1cb';ctx.beginPath();ctx.ellipse(-2,-24.5,5,4,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#c3c9de';ctx.fillRect(-8.6,-29.5,3,6);
    ctx.fillStyle='#0b0d18';ctx.beginPath();ctx.moveTo(1,-31.5);ctx.lineTo(9.2,-30.5);ctx.quadraticCurveTo(10.2,-26.5,8.6,-24);ctx.lineTo(2,-25);ctx.closePath();ctx.fill();
    const shimmer=reduced?0:(Math.sin(t*1.8)+1)*1.6;
    ctx.fillStyle=rgba(trim,.3);ctx.fillRect(2,-30,7.6,4);ctx.fillStyle=trim;ctx.fillRect(2.5+shimmer,-28.7,4,1.6);
    ctx.fillStyle='#8b93b3';ctx.fillRect(-6,-37,2,3.5);ctx.fillStyle=trim;ctx.fillRect(-6,-38,2,1.5);
    ctx.restore();
    leg(ctx,-1,hipY,pose.a,'#38426a','#1b1e30',true);
    ctx.save();ctx.translate(1,hipY);ctx.rotate(pose.lean);
    limb(ctx,1,-16,pose.arms[0],pose.arms[1],A1,A2,'#46538a','#20243a',4.8);
    ctx.restore();
    ctx.restore();
    if(!reflection&&!reduced&&player.landing>0){
      const k=1-player.landing/.12,s=10+k*22,sprite=puffSprite();ctx.globalAlpha=(1-k)*.5;
      ctx.drawImage(sprite,cx-14-s/2-k*10,feet-s*.55,s,s*.6);ctx.drawImage(sprite,cx+14-s/2+k*10,feet-s*.55,s,s*.6);ctx.globalAlpha=1;
    }
  }
}

// Two-segment limb from (x,y): first angle from straight down (positive = forward), then the bend.
function limb(ctx,x,y,angle,bend,l1,l2,color,end,width){
  const jx=x+Math.sin(angle)*l1,jy=y+Math.cos(angle)*l1,second=angle+bend,ex=jx+Math.sin(second)*l2,ey=jy+Math.cos(second)*l2;
  ctx.lineCap='round';ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(jx,jy);ctx.lineTo(ex,ey);ctx.stroke();
  ctx.fillStyle=end;ctx.beginPath();ctx.arc(ex,ey,2.4,0,Math.PI*2);ctx.fill();
}
// Legs bend backward at the knee; the boot stays roughly level with a lit sole.
function leg(ctx,x,y,[thigh,knee],color,boot,front){
  const kx=x+Math.sin(thigh)*L1,ky=y+Math.cos(thigh)*L1,shin=thigh-knee,ax=kx+Math.sin(shin)*L2,ay=ky+Math.cos(shin)*L2;
  ctx.lineCap='round';ctx.strokeStyle=color;ctx.lineWidth=front?6:5.6;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(kx,ky);ctx.lineTo(ax,ay);ctx.stroke();
  if(front){ctx.fillStyle='#56628f';ctx.beginPath();ctx.arc(kx,ky,2.6,0,Math.PI*2);ctx.fill();}
  ctx.save();ctx.translate(ax,ay);ctx.rotate(shin*.35);
  ctx.fillStyle=boot;ctx.beginPath();ctx.roundRect(-3.5,-4,11,5,[2,3,1,1]);ctx.fill();
  ctx.fillStyle=rgba(colors.cyan,front?.85:.45);ctx.fillRect(-3,.4,10,.9);
  ctx.restore();
}
function speedLines(ctx,t){
  ctx.strokeStyle=rgba(colors.cyan,.35);ctx.lineWidth=1.2;ctx.beginPath();
  for(const [i,y] of [-42,-30,-14].entries()){const len=18+((t*40+i*9)%10);ctx.moveTo(-16-i*3,y);ctx.lineTo(-16-i*3-len,y);}
  ctx.stroke();
}
