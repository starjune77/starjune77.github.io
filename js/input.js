const leftKeys=new Set(['KeyA','ArrowLeft']), rightKeys=new Set(['KeyD','ArrowRight']), jumpKeys=new Set(['Space','KeyW','ArrowUp']);
export class Input {
  constructor(state,onAction) {
    this.state=state;this.onAction=onAction;this.keys=new Set();this.touch=new Map();this.jumpQueued=false;
    this.keydown=this.keydown.bind(this);this.keyup=this.keyup.bind(this);this.clear=this.clear.bind(this);
    addEventListener('keydown',this.keydown);addEventListener('keyup',this.keyup);addEventListener('blur',this.clear);
  }
  keydown(event) {
    if(event.ctrlKey||event.altKey||event.metaKey||event.target.closest?.('input,textarea,select,[contenteditable]'))return;
    if(event.code==='KeyQ'||event.code==='F2'||event.code==='Backquote') {
      if(!event.repeat){event.preventDefault();this.onAction(event.code);}return;
    }
    if(this.state.mode!=='world')return;
    if(leftKeys.has(event.code)||rightKeys.has(event.code)||jumpKeys.has(event.code)) {
      event.preventDefault();this.keys.add(event.code);
      if(jumpKeys.has(event.code)&&!event.repeat)this.jumpQueued=true;
    }
    if(event.code==='KeyE'&&!event.repeat){event.preventDefault();this.onAction('interact');}
  }
  keyup(event) { this.keys.delete(event.code); }
  setTouch(pointerId,action) {this.touch.set(pointerId,action);if(action==='jump')this.jumpQueued=true;}
  releaseTouch(pointerId) {this.touch.delete(pointerId);}
  sample() {
    const touches=[...this.touch.values()];
    const left=[...leftKeys].some(key=>this.keys.has(key))||touches.includes('left');
    const right=[...rightKeys].some(key=>this.keys.has(key))||touches.includes('right');
    const sample={axis:Number(right)-Number(left),jumpHeld:[...jumpKeys].some(key=>this.keys.has(key))||touches.includes('jump'),jumpPressed:this.jumpQueued};
    this.jumpQueued=false;return sample;
  }
  clear() { this.keys.clear();this.touch.clear();this.jumpQueued=false; }
  destroy() { removeEventListener('keydown',this.keydown);removeEventListener('keyup',this.keyup);removeEventListener('blur',this.clear); }
}
