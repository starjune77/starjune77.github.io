import {overlaps} from './utils.js';
// Resolve each axis separately. The game uses fixed 120 Hz steps to prevent tunneling.
export function moveAndCollide(body, solids, dt) {
  let headHit = null;
  body.x += body.vx * dt;
  for (const solid of solids) {
    if (!overlaps(body,solid)) continue;
    if (body.vx > 0) body.x = solid.x-body.width;
    else if (body.vx < 0) body.x = solid.x+solid.width;
    body.vx = 0;
  }
  body.grounded = false;
  body.y += body.vy * dt;
  for (const solid of solids) {
    if (!overlaps(body,solid)) continue;
    if (body.vy > 0) { body.y = solid.y-body.height; body.grounded = true; }
    else if (body.vy < 0) { body.y = solid.y+solid.height; if(solid.type) headHit = solid; }
    body.vy = 0;
  }
  return headHit;
}
