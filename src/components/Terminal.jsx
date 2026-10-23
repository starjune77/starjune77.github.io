import {useEffect, useRef, useState} from 'react';
import {profile, projects, skills, education, experience, contact} from '../../js/data.js';
import Dialog from './Dialog.jsx';

const commands = {
  help: 'help · about · projects · skills · education · experience · resume · contact · clear',
  about: `${profile.name}\n${profile.bio}`,
  projects: projects.map((project, index) => `0${index + 1} ${project.title}`).join('\n'),
  skills: Object.values(skills).flat().join(' / '), education: Object.values(education).join('\n'),
  experience: experience.map(item => `${item.title} · ${item.role} · ${item.dates}`).join('\n'),
  contact: `${contact.email}\n${contact.github}`
};

export default function Terminal({active, onClose, onResume}) {
  const [command, setCommand] = useState('');
  const [lines, setLines] = useState(['Portfolio console. Type help for commands.']);
  const output = useRef(null);
  useEffect(() => {output.current.scrollTop = output.current.scrollHeight;}, [lines]);
  function submit(event) {
    event.preventDefault();
    const value = command.trim().toLowerCase(); setCommand('');
    if (!value) return;
    if (value === 'clear') {setLines([]); return;}
    const response = Object.hasOwn(commands, value) ? commands[value] : 'Unknown command. Type help.';
    setLines(previous => [...previous, `jy:~$ ${value}`, ...(value === 'resume' ? [] : [response])].slice(-60));
    if (value === 'resume') onResume();
  }
  return <Dialog id="terminal-dialog" className="terminal-dialog" mode="terminal" active={active} onClose={onClose} aria-labelledby="terminal-title">
    <div className="dialog-toolbar"><h2 id="terminal-title" className="eyebrow">JUNYOUNG@PORTFOLIO:~</h2><button className="button" onClick={() => onClose('terminal')} aria-label="Close terminal">Close ×</button></div>
    <div id="terminal-output" ref={output} role="log" aria-live="polite">{lines.map((line, index) => <p key={index}>{line}</p>)}</div>
    <form id="terminal-form" onSubmit={submit}><label htmlFor="terminal-input">jy:~$</label><input id="terminal-input" autoComplete="off" spellCheck={false} aria-label="Terminal command" value={command} onChange={event => setCommand(event.target.value)} /></form>
  </Dialog>;
}
