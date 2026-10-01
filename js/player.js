import {approach,clamp} from './utils.js';
import {moveAndCollide} from './physics.js';
export class Player {
  constructor(x=180,y=540) {
    Object.assign(this,{x,y,width:28,height:60,vx:0,vy:0,grounded:true,facing:1,animation:'idle',animationTime:0,coyote:0,jumpBuffer:0,landing:0});
  }
  update(input,dt,world) {
    const wasGrounded=this.grounded;
    this.coyote=this.grounded ? .09 : Math.max(0,this.coyote-dt);
    this.jumpBuffer=input.jumpPressed ? .12 : Math.max(0,this.jumpBuffer-dt);
    this.vx=approach(this.vx,input.axis*320,(input.axis?2700:3400)*dt);
    if(input.axis) this.facing=Math.sign(input.axis);
    if(this.jumpBuffer>0 && this.coyote>0) {
      this.vy=-700; this.grounded=false; this.coyote=0; this.jumpBuffer=0;
    }
    this.vy=Math.min(this.vy+1700*dt,1000);
    // Releasing jump early gives a shorter, more controllable arc.
    if(!input.jumpHeld && this.vy < -280) this.vy=approach(this.vy,-280,2400*dt);
    const hit=moveAndCollide(this,world.solids,dt);
    this.x=clamp(this.x,0,world.width-this.width);
    if(!wasGrounded && this.grounded) this.landing=.1;
    this.landing=Math.max(0,this.landing-dt);
    this.animation=!this.grounded?(this.vy<0?'jump':'fall'):this.landing>0?'land':Math.abs(this.vx)>10?'run':'idle';
    this.animationTime+=dt;
    if(this.y>world.height+100) this.respawn(world.checkpoint);
    return hit;
  }
  respawn(checkpoint) {
    this.x=checkpoint.x;this.y=checkpoint.y;this.vx=0;this.vy=0;this.grounded=true;this.jumpBuffer=0;this.coyote=0;
  }
  // Replace only this renderer with a sprite-sheet renderer later; physics stays independent.
  draw(ctx,reducedMotion=false) {
    const run=this.animation==='run', phase=this.animationTime*14;
    const stride=run?Math.sin(phase)*8:0;
    const bob=reducedMotion?0:run?Math.abs(Math.sin(phase))*2:this.animation==='idle'?Math.sin(this.animationTime*2)*.7:0;
    ctx.save();ctx.translate(this.x+this.width/2,this.y+this.height-bob);ctx.scale(this.facing,1);
    if(this.animation==='land'&&!reducedMotion) ctx.scale(1.06,.94);
    ctx.fillStyle='#142a42';ctx.fillRect(-12,-39,24,25);
    ctx.strokeStyle='#58a6ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(4,-36);ctx.lineTo(4,-19);ctx.stroke();
    ctx.strokeStyle='#263e59';ctx.lineWidth=7;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(-6,-17);ctx.lineTo(-6+stride,-4);ctx.moveTo(6,-17);ctx.lineTo(6-stride,-4);ctx.stroke();
    ctx.strokeStyle='#e5f2ff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-8+stride,-2);ctx.lineTo(-1+stride,-2);ctx.moveTo(3-stride,-2);ctx.lineTo(11-stride,-2);ctx.stroke();
    ctx.strokeStyle='#38546f';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-9,-33);ctx.lineTo(-12-stride*.4,-20);ctx.moveTo(9,-33);ctx.lineTo(12+stride*.4,-20);ctx.stroke();
    ctx.fillStyle='#c7c5bf';ctx.beginPath();ctx.roundRect(-8,-58,17,19,5);ctx.fill();
    ctx.fillStyle='#17202b';ctx.beginPath();ctx.roundRect(-9,-61,19,9,[5,5,1,1]);ctx.fill();ctx.fillRect(-9,-54,4,6);
    ctx.fillStyle='#132030';ctx.fillRect(5,-50,2,2);
    ctx.restore();
  }
}
