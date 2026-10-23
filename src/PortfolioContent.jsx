import {useEffect,useRef,useState} from 'react';
import {resumePath} from '../js/data.js';

// Existing escaped portfolio templates stay shared with the no-framework content tests.
// Only this boundary owns their DOM; React owns navigation, dialogs and application state.
export default function PortfolioContent({html,id}){
  const ref=useRef(null);
  const [available,setAvailable]=useState(false);
  useEffect(()=>{
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),5000);
    fetch(resumePath,{method:'HEAD',signal:controller.signal})
      .then(response=>{if(!controller.signal.aborted)setAvailable(response.ok&&!!response.headers.get('content-type')?.includes('pdf'));})
      .catch(()=>{}).finally(()=>clearTimeout(timeout));
    return ()=>{controller.abort();clearTimeout(timeout);};
  },[]);
  useEffect(()=>{
    ref.current.querySelectorAll('[data-resume]').forEach(link=>{
      if(available){link.removeAttribute('aria-disabled');link.removeAttribute('tabindex');}
    });
    ref.current.querySelectorAll('.resume-status').forEach(status=>{status.textContent=available?'Resume PDF available.':'Resume PDF pending. The full portfolio is available in Quick View.';});
  },[html,available]);
  function input(event){
    if(event.target.id!=='study-hours')return;
    const hours=Number(event.target.value),format=minutes=>`${Math.floor(minutes/60)}h ${String(minutes%60).padStart(2,'0')}m`;
    const root=ref.current;
    root.querySelector('#hours-output').textContent=`${hours} hour${hours===1?'':'s'}`;
    root.querySelector('#cs-plan').textContent=format(hours*40);
    root.querySelector('#reading-plan').textContent=format(hours*20);
  }
  function click(event){
    if(event.target.closest('[data-resume][aria-disabled="true"]'))event.preventDefault();
    const button=event.target.closest('#detection-toggle');if(!button)return;
    const on=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(on));
    button.textContent=`Detection overlay: ${on?'ON':'OFF'}`;
    ref.current.querySelector('.detection-scene').classList.toggle('off',!on);
  }
  return <div id={id} ref={ref} onInput={input} onClick={click} dangerouslySetInnerHTML={{__html:html}} />;
}
