import {useEffect,useRef} from 'react';

export default function Dialog({id,mode,active,onClose,children,...props}){
  const ref=useRef(null);
  useEffect(()=>{
    const dialog=ref.current;
    if(active){
      if(!dialog.open)dialog.showModal();
      dialog.scrollTop=0;
      dialog.querySelector(id==='terminal-dialog'?'input':'#panel-title')?.focus({preventScroll:true});
    }else if(dialog.open)dialog.close();
  },[active,id]);
  function backdrop(event){
    if(event.target!==ref.current||id==='quick-view'||id==='mobile-choice')return;
    const r=ref.current.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)onClose(mode);
  }
  return <dialog {...props} id={id} ref={ref} data-mode={mode} onCancel={event=>{event.preventDefault();onClose(mode);}} onClose={()=>{if(!ref.current.open)onClose(mode);}} onClick={backdrop}>{children}</dialog>;
}
