import {clamp} from './utils.js';
export function nearestInteraction(player,blocks) {
  const x=player.x+player.width/2,y=player.y+player.height/2;
  let nearest=null,best=Infinity;
  for(const block of blocks) {
    const distance=Math.hypot(x-clamp(x,block.x,block.x+block.width),y-clamp(y,block.y,block.y+block.height));
    if(distance<=block.radius && distance<best) { nearest=block;best=distance; }
  }
  return nearest;
}
export function blockAt(point,blocks) {
  return blocks.find(b=>point.x>=b.x&&point.x<=b.x+b.width&&point.y>=b.y&&point.y<=b.y+b.height)||null;
}
export class Interactions {
  constructor(open) {this.open=open;this.cooldowns=new Map();}
  activate(block,time) {
    if(!block || time-(this.cooldowns.get(block.id)??-Infinity)<.6) return false;
    this.cooldowns.set(block.id,time);block.hitAt=time-.06;this.open(block);return true;
  }
}
