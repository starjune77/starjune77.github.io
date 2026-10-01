import {resumePath} from './data.js';
export function setupResume(){
  let available=false;
  const refresh=()=>{
    document.querySelectorAll('[data-resume]').forEach(link=>{
      if(available){link.removeAttribute('aria-disabled');link.removeAttribute('tabindex');}
    });
    document.querySelectorAll('.resume-status').forEach(status=>status.textContent=available?'Resume PDF available.':'Resume PDF pending. The full portfolio is available in Quick View.');
  };
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-resume][aria-disabled="true"]'))event.preventDefault();
  });
  // A missing optional PDF is expected during development; never fabricate a replacement.
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),5000);
  fetch(resumePath,{method:'HEAD',signal:controller.signal}).then(response=>{
    available=response.ok&&response.headers.get('content-type')?.includes('pdf');refresh();
  }).catch(()=>refresh()).finally(()=>clearTimeout(timeout));
  return refresh;
}
