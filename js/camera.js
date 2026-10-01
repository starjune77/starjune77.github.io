import {clamp} from './utils.js';
export class Camera {
  constructor() { this.x=0;this.y=0;this.width=1;this.height=1;this.scale=1; }
  resize(width,height) {
    this.scale=clamp((height-160)/600,.65,1.2);
    this.width=width/this.scale;this.height=height/this.scale;
    this.y=600-this.height*.76;
  }
  update(player,worldWidth,dt,reduced=false) {
    const ahead=player.facing>0?.38:.62;
    const target=clamp(player.x+player.width/2-this.width*ahead,0,Math.max(0,worldWidth-this.width));
    this.x=reduced?target:this.x+(target-this.x)*(1-Math.exp(-8*dt));
    this.x=clamp(this.x,0,Math.max(0,worldWidth-this.width));
  }
  toWorld(x,y) { return {x:x/this.scale+this.x,y:y/this.scale+this.y}; }
}
