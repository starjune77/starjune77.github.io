export function setupDebug(state){
  const panel=document.querySelector('#debug-panel');let enabled=false,last=0;
  return {
    toggle(){enabled=!enabled;panel.hidden=!enabled;},
    update(game){
      if(!enabled)return;const now=performance.now();if(now-last<150&&!state.paused)return;last=now;
      const p=game.player,c=game.camera;
      panel.textContent=`DEBUG / F2\nFPS ${state.paused?'PAUSED':game.fps||'SAMPLING'}\nPLAYER ${p.x.toFixed(1)} / ${p.y.toFixed(1)}\nVELOCITY ${p.vx.toFixed(1)} / ${p.vy.toFixed(1)}\nGROUNDED ${p.grounded}\nCAMERA ${c.x.toFixed(1)} / ${c.y.toFixed(1)}\nZONE ${state.currentZone}\nNEAREST ${state.nearestInteraction?.id||'none'}\nMODE ${state.mode}\nVIEWPORT ${game.view.width} × ${game.view.height}`;
    }
  };
}
