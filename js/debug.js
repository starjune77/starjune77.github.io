export function setupDebug(state,publish){
  let enabled=false,last=0;
  return {
    get enabled(){return enabled;},
    toggle(){enabled=!enabled;publish({enabled,text:'',labels:'[]'});},
    update(game){
      if(!enabled)return;const now=performance.now();if(now-last<150&&!state.paused)return;last=now;
      const p=game.player,c=game.camera;
      const text=`DEBUG / F2\nFPS ${state.paused?'PAUSED':game.fps||'SAMPLING'}\nPLAYER ${p.x.toFixed(1)} / ${p.y.toFixed(1)}\nVELOCITY ${p.vx.toFixed(1)} / ${p.vy.toFixed(1)}\nGROUNDED ${p.grounded}\nCAMERA ${c.x.toFixed(1)} / ${c.y.toFixed(1)}\nZONE ${state.currentZone}\nNEAREST ${state.nearestInteraction?.id||'none'}\nMODE ${state.mode}\nRENDER ${game.renderer?game.renderer.renderMs.toFixed(2):'-'} ms · PARTICLES ${game.renderer?.particles??0}\nVIEWPORT ${game.view.width} × ${game.view.height}\nKEYS 1–8 JUMP TO DISTRICT`;
      const labels=JSON.stringify(game.labels.map(l=>({text:l.text,kind:l.kind,x:Math.round(l.x),y:Math.round(l.y),w:Math.round(l.w),h:Math.round(l.h)})));
      publish({enabled,text,labels});
    }
  };
}
