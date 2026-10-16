import {clamp} from './utils.js';
// Follows the player with a critically damped spring: no overshoot, no velocity jumps, and it
// keeps up at sprint speed. The look-ahead eases too, so turning around pans instead of snapping.
const SMOOTH_TIME=.14,LEAD_RATE=3.2;
export class Camera {
  constructor() { this.x=0;this.y=0;this.width=1;this.height=1;this.scale=1;this.vx=0;this.lead=.38; }
  resize(width,height) {
    this.scale=clamp((height-160)/600,.65,1.2);
    this.width=width/this.scale;this.height=height/this.scale;
    this.y=600-this.height*.76;
  }
  update(player,worldWidth,dt,reduced=false) {
    const limit=Math.max(0,worldWidth-this.width),desired=player.facing>0?.38:.62;
    this.lead=reduced?desired:this.lead+(desired-this.lead)*(1-Math.exp(-LEAD_RATE*dt));
    const target=clamp(player.x+player.width/2-this.width*this.lead,0,limit);
    if(reduced){this.x=target;this.vx=0;return;}
    const omega=2/SMOOTH_TIME,k=omega*dt,decay=1/(1+k+.48*k*k+.235*k*k*k);
    const offset=this.x-target,carry=(this.vx+omega*offset)*dt;
    this.vx=(this.vx-omega*carry)*decay;this.x=target+(offset+carry)*decay;
    if(this.x<0||this.x>limit){this.x=clamp(this.x,0,limit);this.vx=0;}
  }
  toWorld(x,y) { return {x:x/this.scale+this.x,y:y/this.scale+this.y}; }
}
