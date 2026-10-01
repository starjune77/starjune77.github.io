import {projects,skills} from './data.js';
export function setupTerminal(toggleDev){
  const dialog=document.querySelector('#terminal-dialog'),output=document.querySelector('#terminal-output'),input=document.querySelector('#terminal-input');
  const toggle=()=>{if(dialog.open)dialog.close();else{document.querySelectorAll('dialog[open]').forEach(d=>d.close());dialog.showModal();input.focus();}};
  document.querySelector('#terminal-open').addEventListener('click',toggle);
  const commands={help:'help · about · projects · skills · education · experience · resume · contact · dev · clear',about:'Junyoung Oh — CS student at UW–Madison. Software, interactive systems, and applied AI.',projects:projects.map((p,i)=>`0${i+1} ${p.title}`).join('\n'),skills:Object.values(skills).flat().join(' / '),education:'UW–Madison · Fall 2026–Present\nB.S. student · Intended Computer Science\nCS 300: Programming II (Java)\nLIKELION Wisconsin member',experience:'FIRST Robotics — TechnoKats · Mechanical and Software Member · 2024–2026\nStudent Council — Publicity and Club Affairs · 2022–2024',contact:'starjune07@gmail.com\nhttps://github.com/starjune77'};
  function print(text){const p=document.createElement('p');p.textContent=text;output.append(p);while(output.children.length>60)output.firstElementChild.remove();output.scrollTop=output.scrollHeight;}
  document.querySelector('#terminal-form').addEventListener('submit',e=>{e.preventDefault();const command=input.value.trim().toLowerCase();input.value='';if(!command)return;if(command==='clear'){output.replaceChildren();return;}print(`jy:~$ ${command}`);if(command==='dev'){toggleDev();print('Developer mode toggled.');}else if(command==='resume'){dialog.close();document.querySelector('#resume').scrollIntoView();}else print(commands[command]||'Unknown command. Type help.');});
  return toggle;
}
