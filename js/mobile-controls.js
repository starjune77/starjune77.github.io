export function setupMobileControls(input,state,overlays,toggleQuick,onInteract){
  const media=matchMedia('(pointer:coarse)'),choice=document.querySelector('#mobile-choice');
  const setTouchUI=()=>{document.body.classList.toggle('touch-device',media.matches);};setTouchUI();media.addEventListener('change',setTouchUI);
  // Each held button belongs to its own pointer, so moving and jumping work together.
  document.querySelectorAll('[data-touch]').forEach(button=>{
    button.addEventListener('pointerdown',event=>{
      if(state.mode!=='world')return;event.preventDefault();button.setPointerCapture(event.pointerId);button.classList.add('held');input.setTouch(event.pointerId,button.dataset.touch);
    });
    const release=event=>{input.releaseTouch(event.pointerId);button.classList.remove('held');};
    button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);
  });
  document.querySelector('#touch-open').addEventListener('click',onInteract);
  document.querySelector('#explore-choice').addEventListener('click',()=>choice.close());
  document.querySelector('#quick-choice').addEventListener('click',toggleQuick);
  state.subscribe(()=>document.querySelectorAll('[data-touch]').forEach(button=>button.classList.remove('held')));
  if(media.matches&&!new URLSearchParams(location.search).has('view'))overlays.open(choice,'choice');
}
