import {profile,projects,skills,education,experience,contact} from './data.js';
export function setupTerminal(overlays,openPanel){
  const dialog=document.querySelector('#terminal-dialog'),output=document.querySelector('#terminal-output'),input=document.querySelector('#terminal-input');
  const commands={
    help:'help · about · projects · skills · education · experience · resume · contact · clear',
    about:`${profile.name}\n${profile.bio}`,
    projects:projects.map((p,i)=>`0${i+1} ${p.title}`).join('\n'),
    skills:Object.values(skills).flat().join(' / '),
    education:Object.values(education).join('\n'),
    experience:experience.map(e=>`${e.title} · ${e.role} · ${e.dates}`).join('\n'),
    contact:`${contact.email}\n${contact.github}`
  };
  function print(text){const p=document.createElement('p');p.textContent=text;output.append(p);while(output.children.length>60)output.firstElementChild.remove();output.scrollTop=output.scrollHeight;}
  document.querySelector('#terminal-form').addEventListener('submit',event=>{
    event.preventDefault();const command=input.value.trim().toLowerCase();input.value='';if(!command)return;
    if(command==='clear'){output.replaceChildren();return;}
    print(`jy:~$ ${command}`);
    if(command==='resume'){dialog.close();openPanel('resume');}else print(commands[command]||'Unknown command. Type help.');
  });
  return ()=>{if(dialog.open)dialog.close();else{overlays.closeOthers(dialog);overlays.open(dialog,'terminal');input.focus();}};
}
