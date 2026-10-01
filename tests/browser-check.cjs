// Optional integration check using the installed Chrome and its DevTools protocol.
// No npm packages are needed. Screenshots/profile stay in the OS temporary folder.
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const {createServer}=require('../tools/preview.cjs');
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function main(){
  const chrome=process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe';
  if(!fs.existsSync(chrome))throw new Error('Set CHROME_PATH to your installed Chrome executable.');
  const output=fs.mkdtempSync(path.join(os.tmpdir(),'junyoung-browser-'));
  const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url=`http://127.0.0.1:${server.address().port}`;
  const processHandle=spawn(chrome,['--headless=new','--remote-debugging-port=0',`--user-data-dir=${path.join(output,'profile')}`,'--no-first-run','--no-default-browser-check','about:blank'],{windowsHide:true,stdio:'ignore'});
  let socket;
  try{
    const portFile=path.join(output,'profile','DevToolsActivePort');
    for(let i=0;i<100&&!fs.existsSync(portFile);i++)await wait(100);
    assert(fs.existsSync(portFile),'Chrome started');
    const port=fs.readFileSync(portFile,'utf8').split('\n')[0];
    const targets=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    socket=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
    await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('Chrome WebSocket timed out')),8000);socket.onopen=()=>{clearTimeout(timeout);resolve();};socket.onerror=reject;});
    console.log('Chrome connected.');
    let nextId=0;const pending=new Map(),errors=[];
    socket.onmessage=event=>{
      const message=JSON.parse(event.data);
      if(message.id){const item=pending.get(message.id);if(!item)return;pending.delete(message.id);clearTimeout(item.timeout);message.error?item.reject(new Error(JSON.stringify(message.error))):item.resolve(message.result);}
      else if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text+': '+message.params.exceptionDetails.exception?.description);
      else if(message.method==='Runtime.consoleAPICalled'&&message.params.type==='error')errors.push(JSON.stringify(message.params.args));
      else if(message.method==='Fetch.requestPaused')send('Fetch.fulfillRequest',{requestId:message.params.requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'application/pdf'}]}).catch(error=>errors.push(error.message));
    };
    socket.onclose=()=>{for(const item of pending.values()){clearTimeout(item.timeout);item.reject(new Error('Chrome connection closed'));}pending.clear();};
    const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++nextId;const timeout=setTimeout(()=>{pending.delete(id);reject(new Error('Chrome command timed out: '+method));},8000);pending.set(id,{resolve,reject,timeout});socket.send(JSON.stringify({id,method,params}));});
    const evaluate=async expression=>{
      const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
      if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);
      return result.result.value;
    };
    const until=async expression=>{for(let i=0;i<100;i++){if(await evaluate(expression))return;await wait(50);}throw new Error('Timed out: '+expression);};
    const key=async(code,key,down=true)=>send('Input.dispatchKeyEvent',{type:down?'keyDown':'keyUp',code,key,windowsVirtualKeyCode:{KeyQ:81,KeyE:69,KeyD:68,KeyA:65,ArrowLeft:37,ArrowRight:39,Space:32,Escape:27,F2:113,Backquote:192}[code]});
    const press=async(code,label)=>{await key(code,label);await key(code,label,false);await wait(100);};
    const click=selector=>evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
    const metrics=(width,height,mobile=false)=>send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
    const navigate=async suffix=>{await send('Page.navigate',{url:url+suffix});await until("document.documentElement.classList.contains('ready')");await wait(200);};
    const screenshot=async name=>{const result=await send('Page.captureScreenshot',{format:'png'});const file=path.join(output,name+'.png');fs.writeFileSync(file,Buffer.from(result.data,'base64'));console.log('Screenshot: '+file);};
    const debugPosition=async()=>{
      const content=await evaluate("document.querySelector('#debug-panel').textContent");
      const match=content.match(/PLAYER ([\d.]+) \/ ([\d.]+)/);return {x:Number(match[1]),y:Number(match[2])};
    };
    await send('Page.enable');await send('Runtime.enable');
    await metrics(1440,900);await navigate('/');await screenshot('world-desktop');
    await press('F2','F2');const initial=await debugPosition();
    await key('KeyD','d');await wait(400);await key('KeyD','d',false);await wait(250);
    const moved=await debugPosition();assert(moved.x>initial.x+70,'D moves right');
    await key('Space',' ');await wait(200);const jumped=await debugPosition();assert(jumped.y<540,'Space jumps');
    await key('Space',' ',false);await wait(700);assert.equal((await debugPosition()).y,540,'lands on ground');
    await key('KeyA','a');await wait(250);await key('KeyA','a',false);await wait(200);assert((await debugPosition()).x<moved.x,'A moves left');
    await key('KeyD','d');await wait(2450);await key('KeyD','d',false);await wait(250);
    assert.equal(await evaluate("document.querySelector('#interaction-name').textContent"),'ABOUT');
    await key('Space',' ');await until("document.querySelector('#info-panel').open");await key('Space',' ',false);
    assert.equal(await evaluate("document.querySelector('#panel-title').textContent"),'Junyoung Oh','underside hit opens About');
    const paused=await debugPosition();await key('KeyD','d');await wait(250);await key('KeyD','d',false);assert.deepEqual(await debugPosition(),paused,'panel freezes player');
    await press('Escape','Escape');await wait(850);await press('KeyE','e');assert(await evaluate("document.querySelector('#info-panel').open"),'E opens nearby block');
    await press('Escape','Escape');const arrowBefore=await debugPosition();
    await key('ArrowRight','ArrowRight');await wait(220);await key('ArrowRight','ArrowRight',false);await wait(200);assert((await debugPosition()).x>arrowBefore.x+30,'right arrow moves');
    await key('ArrowLeft','ArrowLeft');await wait(220);await key('ArrowLeft','ArrowLeft',false);await wait(200);assert((await debugPosition()).x<arrowBefore.x+25,'left arrow moves');
    await press('KeyQ','q');assert(await evaluate("document.querySelector('#quick-view').open"));
    const quickPosition=await debugPosition();await wait(300);assert.deepEqual(await debugPosition(),quickPosition,'Quick View preserves position');
    assert.equal(await evaluate("document.querySelector('.quick-view').getBoundingClientRect().height"),900);
    await click('#quick-projects [data-id="morrowlab"]');assert.equal(await evaluate("document.querySelector('#panel-title').textContent"),'MorrowLab');
    await evaluate("document.querySelector('#study-hours').value=6;document.querySelector('#study-hours').dispatchEvent(new Event('input',{bubbles:true}))");
    assert.equal(await evaluate("document.querySelector('#cs-plan').textContent"),'4h 00m');
    await press('Escape','Escape');assert(await evaluate("document.querySelector('#quick-view').open"),'nested panel returns to Quick View');
    await press('KeyQ','q');assert(!await evaluate("document.querySelector('#quick-view').open"));
    await press('Backquote','`');assert(await evaluate("document.querySelector('#terminal-dialog').open"));
    await evaluate("document.querySelector('#terminal-input').value='projects';document.querySelector('#terminal-form').requestSubmit()");
    assert(await evaluate("document.querySelector('#terminal-output').textContent.includes('MorrowLab')"));
    await evaluate("document.querySelector('#terminal-input').value='resume';document.querySelector('#terminal-form').requestSubmit()");
    assert.equal(await evaluate("document.querySelector('#panel-label').textContent"),'RESUME ARCHIVE');await press('Escape','Escape');
    for(const [width,height] of [[1920,1080],[1440,900],[1366,768],[1280,720],[1024,768],[768,1024],[430,932],[390,844]]){
      await metrics(width,height);await wait(100);
      assert.equal(await evaluate("document.querySelector('#world').width"),width);
      const quick=await evaluate("(()=>{const r=document.querySelector('.quick-control').getBoundingClientRect();return {right:r.right,top:r.top,bottom:r.bottom}})()");
      assert(quick.right<=width&&quick.top>=0&&quick.bottom<height,'HUD fits '+width);
      await press('KeyQ','q');assert(await evaluate("document.querySelector('#quick-view').scrollWidth<=document.querySelector('#quick-view').clientWidth+1"),'Quick View no horizontal overflow '+width);
      await evaluate("document.querySelector('#quick-view').scrollTop=1200");assert(await evaluate("document.querySelector('#quick-view').scrollTop>0"));
      if(width===390){await evaluate("document.querySelector('#quick-view').scrollTop=0");await screenshot('quick-mobile');}
      await press('KeyQ','q');console.log('PASS viewport '+width+' × '+height);
    }
    await navigate('/?view=quick');assert(await evaluate("document.querySelector('#quick-view').open"),'direct Quick View URL');
    await press('Escape','Escape');assert(!await evaluate("document.querySelector('#quick-view').open"),'Escape closes Quick View');
    await navigate('/#project-detection');assert.equal(await evaluate("document.querySelector('#panel-title').textContent"),'Object Detection Prototype');
    await click('#detection-toggle');assert(await evaluate("document.querySelector('.detection-scene').classList.contains('off')"));
    await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await navigate('/');
    assert(await evaluate("matchMedia('(prefers-reduced-motion:reduce)').matches"));
    await send('Emulation.setEmulatedMedia',{features:[]});await metrics(390,844,true);await send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});await navigate('/');
    assert(await evaluate("document.querySelector('#mobile-choice').open"),'mobile choice');await click('#explore-choice');await wait(100);await press('F2','F2');
    const mobileBefore=await debugPosition();
    const point=selector=>evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
    const right=await point('[data-touch="right"]'),jump=await point('[data-touch="jump"]');
    await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...right,id:1}]});await wait(200);
    await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...right,id:1},{...jump,id:2}]});await wait(200);
    const mobileMoving=await debugPosition();assert(mobileMoving.x>mobileBefore.x+30,'touch moves');assert(mobileMoving.y<540,'multi-touch jump');
    await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await wait(800);await press('F2','F2');await screenshot('world-mobile');
    await click('.quick-control');assert(await evaluate("document.querySelector('#quick-view').open"),'touch Quick View');
    assert(await evaluate("[...document.querySelectorAll('[data-resume]')].every(a=>a.getAttribute('aria-disabled')==='true')"),'missing PDF has graceful TODO state');
    assert(await evaluate("document.querySelector('a[href=\"mailto:starjune07@gmail.com\"]')!==null"));
    assert(await evaluate("document.querySelector('a[href=\"https://github.com/starjune77\"]').rel.includes('noopener')"));
    await metrics(844,390,true);await wait(100);assert(await evaluate("document.querySelector('#quick-view').scrollWidth<=document.querySelector('#quick-view').clientWidth+1"),'landscape Quick View');
    await click('.return-button');assert(await evaluate("document.querySelector('[data-touch=\"jump\"]').getBoundingClientRect().bottom<=innerHeight"),'landscape controls');
    const fallback=await send('Page.addScriptToEvaluateOnNewDocument',{source:"HTMLCanvasElement.prototype.getContext=()=>null"});
    await navigate('/');assert(await evaluate("document.querySelector('#quick-view').open"),'Canvas unavailable opens complete semantic portfolio');
    await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:fallback.identifier});
    // Mock only the HEAD response in this isolated test. No PDF is generated or added to the site.
    await send('Fetch.enable',{patterns:[{urlPattern:'*Junyoung_Oh_Resume.pdf',requestStage:'Request'}]});
    await navigate('/?view=quick');await until("document.querySelector('.resume-status').textContent==='Resume PDF available.'");
    assert(await evaluate("[...document.querySelectorAll('[data-resume]')].every(a=>!a.hasAttribute('aria-disabled'))"),'existing PDF activates links automatically');
    await send('Fetch.disable');
    assert.deepEqual(errors,[],'no runtime console errors or uncaught exceptions');
    console.log('PASS gameplay, jump-hit, E interaction, pause/resume, nested dialogs, Quick View, terminal, demos, touch/multi-touch, reduced motion, deep links, viewport checks.');
    console.log('Optional missing resume PDF returns HTTP 404 by design; no JavaScript exception.');
  } finally {socket?.close();processHandle.kill();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
