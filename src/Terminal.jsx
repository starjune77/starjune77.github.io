import {useEffect,useRef,useState} from 'react';
import {profile,projects,skills,education,experience,contact} from '../js/data.js';

export default function Terminal({onResume}){
  const [lines,setLines]=useState(['Portfolio console. Type help for commands.']);
  const [command,setCommand]=useState('');
  const output=useRef(null);
  useEffect(()=>{output.current.scrollTop=output.current.scrollHeight;},[lines]);
  function submit(event){
    event.preventDefault();
    const value=command.trim().toLowerCase();setCommand('');if(!value)return;
    if(value==='clear'){setLines([]);return;}
    const commands={
      help:'help · about · projects · skills · education · experience · resume · contact · clear',
      about:`${profile.name}\n${profile.bio}`,
      projects:projects.map((p,i)=>`0${i+1} ${p.title}`).join('\n'),
      skills:Object.values(skills).flat().join(' / '),
      education:Object.values(education).join('\n'),
      experience:experience.map(e=>`${e.title} · ${e.role} · ${e.dates}`).join('\n'),
      contact:`${contact.email}\n${contact.github}`
    };
    setLines(previous=>[...previous,`jy:~$ ${value}`,...(value==='resume'?[]:[commands[value]||'Unknown command. Type help.'])].slice(-60));
    if(value==='resume')onResume();
  }
  return <><div id="terminal-output" ref={output} role="log" aria-live="polite">{lines.map((line,i)=><p key={i}>{line}</p>)}</div><form id="terminal-form" onSubmit={submit}><label htmlFor="terminal-input">jy:~$</label><input id="terminal-input" value={command} onChange={event=>setCommand(event.target.value)} autoComplete="off" spellCheck={false} aria-label="Terminal command" /></form></>;
}
