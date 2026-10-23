import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../js/game.js';
import {Input} from '../js/input.js';
import {createState} from '../js/utils.js';

test('game publishes HUD data without DOM mutation and releases all lifecycle resources', () => {
  const saved = new Map();
  const install = (key, value) => {saved.set(key, Object.getOwnPropertyDescriptor(globalThis, key)); Object.defineProperty(globalThis, key, {value, configurable: true, writable: true});};
  const window = new EventTarget(), document = new EventTarget(), media = [];
  document.hidden = false;
  const frames = new Map(); let frameId = 0, disconnected = 0;
  const canvas = Object.assign(new EventTarget(), {style: {}, getContext: () => null});
  try {
    install('document', document);
    install('innerWidth', 1440); install('innerHeight', 900); install('devicePixelRatio', 1);
    install('addEventListener', window.addEventListener.bind(window));
    install('removeEventListener', window.removeEventListener.bind(window));
    install('matchMedia', () => {const query = Object.assign(new EventTarget(), {matches: false}); media.push(query); return query;});
    install('requestAnimationFrame', callback => {frames.set(++frameId, callback); return frameId;});
    install('cancelAnimationFrame', id => frames.delete(id));
    install('ResizeObserver', class {observe() {} disconnect() {disconnected++;}});
    const state = createState(), updates = [], game = new Game(canvas, state, () => {}, null, {onUI: snapshot => updates.push(snapshot)});
    const input = new Input(state, () => {}); game.input = input;
    assert.equal(updates[0].currentZone, 'start');
    game.player.x = 850; game.update(1 / 120);
    assert.equal(updates.at(-1).currentZone, 'about');
    assert.equal(updates.at(-1).nearby.id, 'about');
    assert(updates.at(-1).tutorialMinimized);
    // A paused Canvas-less instance can still be destroyed and remounted safely.
    game.ctx = {}; game.render = () => {}; game.sync(); assert.equal(frames.size, 1);
    const width = canvas.width;
    input.keys.add('KeyA');
    game.destroy();
    assert.equal(frames.size, 0); assert.equal(disconnected, 1); assert(game.events.signal.aborted);
    globalThis.innerWidth = 800; window.dispatchEvent(new Event('resize'));
    assert.equal(canvas.width, width, 'resize listener was removed');
    for (const query of media) query.dispatchEvent(new Event('change'));
    assert.equal(frames.size, 0, 'media-query listeners were removed');
    state.setMode('quick'); assert.equal(frames.size, 0, 'state subscription was removed');
    window.dispatchEvent(new Event('blur')); assert(input.keys.has('KeyA'), 'input blur listener was removed');
    canvas.style.cursor = 'test'; canvas.dispatchEvent(new Event('pointerleave'));
    assert.equal(canvas.style.cursor, 'test', 'Canvas listeners were removed');
  } finally {
    for (const [key, descriptor] of saved) {if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key];}
  }
});
