import {projects, profile} from '../js/data.js';

export function panelHeading(type, id) {
  if (type === 'project') {
    const index = projects.findIndex(project => project.id === id);
    return index < 0 ? null : {title: projects[index].title, label: `PROJECT MODULE / 0${index + 1}`};
  }
  const headings = {
    about: [profile.name, 'IDENTITY RECORD'], projects: ['Projects', 'FOUR SYSTEMS'],
    ai: ['AI / Experiments', 'COMPUTER VISION'], experience: ['Experience', 'ROBOTICS / LEADERSHIP'],
    skills: ['Skills', 'SYSTEM CAPABILITIES'], resume: [profile.name, 'RESUME ARCHIVE'],
    contact: ['Let’s build something useful.', 'COMMUNICATION NODE'], end: ['Thanks for exploring.', 'JUNYOUNG LAB']
  };
  const heading = Object.hasOwn(headings, type) ? headings[type] : null;
  return heading ? {title: heading[0], label: heading[1]} : null;
}

export function overlayFromLocation(location, coarse = false) {
  const query = new URLSearchParams(location.search);
  if (query.get('view') === 'quick' || location.hash === '#quick' || location.hash.startsWith('#quick-')) return {mode: 'quick'};
  if (location.hash.startsWith('#project-')) {
    const id = location.hash.slice(9);
    if (panelHeading('project', id)) return {mode: 'panel', type: 'project', id};
  }
  return {mode: coarse && !query.has('view') ? 'choice' : 'world'};
}

export function closeOverlay(current, mode) {
  if (mode === 'quick' && current.returnTo === 'quick') return {mode: 'world'};
  return current.mode === mode ? {mode: current.returnTo || 'world'} : current;
}
