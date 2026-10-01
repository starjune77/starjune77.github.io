export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const approach = (value, target, amount) => value < target ? Math.min(target, value + amount) : Math.max(target, value - amount);
export const overlaps = (a,b) => a.x < b.x+b.width && a.x+a.width > b.x && a.y < b.y+b.height && a.y+a.height > b.y;
export const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function createState() {
  const listeners = new Set();
  return {
    mode: 'world', paused: false, currentZone: 'start', activePanel: null,
    quickViewOpen: false, nearestInteraction: null, discovered: new Set(['start']),
    setMode(mode, activePanel = null) {
      this.mode = mode; this.paused = mode !== 'world'; this.activePanel = activePanel;
      listeners.forEach(listener => listener(this));
    },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }
  };
}
