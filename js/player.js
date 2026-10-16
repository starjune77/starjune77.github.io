import {approach,clamp} from './utils.js';
import {moveAndCollide} from './physics.js';
// Movement tuning in world units per second. Rendering lives in render-player.js.
export const MOVE = {run:500, sprint:1.35, accel:4200, decel:5300, jump:-820, gravity:2300, maxFall:1250, cutSpeed:-330, cutRate:3200};
export class Player {
  constructor(x=180,y=540) {
    Object.assign(this,{x,y,width:28,height:60,vx:0,vy:0,grounded:true,facing:1,animation:'idle',animationTime:0,coyote:0,jumpBuffer:0,landing:0,sprinting:false});
  }
  update(input,dt,world) {
    const wasGrounded=this.grounded;
    this.coyote=this.grounded ? .09 : Math.max(0,this.coyote-dt);
    this.jumpBuffer=input.jumpPressed ? .12 : Math.max(0,this.jumpBuffer-dt);
    const top=MOVE.run*(input.sprint?MOVE.sprint:1);
    this.vx=approach(this.vx,input.axis*top,(input.axis?MOVE.accel:MOVE.decel)*dt);
    if(input.axis) this.facing=Math.sign(input.axis);
    if(this.jumpBuffer>0 && this.coyote>0) {
      this.vy=MOVE.jump; this.grounded=false; this.coyote=0; this.jumpBuffer=0;
    }
    this.vy=Math.min(this.vy+MOVE.gravity*dt,MOVE.maxFall);
    // Releasing jump early gives a shorter, more controllable arc.
    if(!input.jumpHeld && this.vy < MOVE.cutSpeed) this.vy=approach(this.vy,MOVE.cutSpeed,MOVE.cutRate*dt);
    const hit=moveAndCollide(this,world.solids,dt);
    this.x=clamp(this.x,0,world.width-this.width);
    if(!wasGrounded && this.grounded) this.landing=.12;
    this.landing=Math.max(0,this.landing-dt);
    this.sprinting=Math.abs(this.vx)>MOVE.run*1.05;
    this.animation=!this.grounded?(this.vy<0?'jump':'fall'):this.landing>0?'land':Math.abs(this.vx)>10?'run':'idle';
    this.animationTime+=dt;
    if(this.y>world.height+100) this.respawn(world.checkpoint);
    return hit;
  }
  respawn(checkpoint) {
    this.x=checkpoint.x;this.y=checkpoint.y;this.vx=0;this.vy=0;this.grounded=true;this.jumpBuffer=0;this.coyote=0;this.landing=0;
  }
}
