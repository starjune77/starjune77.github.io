import {projects,profile,contact} from '../js/data.js';
import {aboutHTML,educationHTML,experienceHTML,skillsHTML,honorsHTML,resumeHTML,contactLinks,projectCards,projectHTML,aiDemo,chips} from '../js/templates.js';


export function panelContent(type,id){
    let title,html,label;
    if(type==='project'){
      const project=projects.find(p=>p.id===id);if(!project)return;
      title=project.title;label=`PROJECT MODULE / 0${projects.indexOf(project)+1}`;html=projectHTML(project);
    } else {
      const pages={
        about:[profile.name,'IDENTITY RECORD',`${aboutHTML()}<h3>Education</h3>${educationHTML()}<h3>Honors</h3>${honorsHTML()}`],
        projects:['Projects','FOUR SYSTEMS',`<p>Applications, interactive learning, and computer vision experiments.</p><div class="project-grid">${projectCards()}</div>`],
        ai:['AI / Experiments','COMPUTER VISION',`<p>Computer vision and machine learning exploration through MorrowLab and the Object Detection Prototype.</p>${chips(['MediaPipe','YOLO','PyTorch','NumPy'])}${aiDemo()}<div class="actions"><button class="button" data-open="project" data-id="morrowlab">MorrowLab ↗</button><button class="button" data-open="project" data-id="detection">Object Detection ↗</button></div>`],
        experience:['Experience','ROBOTICS / LEADERSHIP',experienceHTML()],
        skills:['Skills','SYSTEM CAPABILITIES',skillsHTML()],
        resume:[profile.name,'RESUME ARCHIVE',`${educationHTML()}${resumeHTML()}`],
        contact:['Let’s build something useful.','COMMUNICATION NODE',`<p>${profile.location}<br>${contact.email}</p><div class="actions">${contactLinks()}</div>`],
        end:['Thanks for exploring.','JUNYOUNG LAB',`<p>${profile.tagline}</p><div class="actions"><button class="button" data-quick="">Quick View</button>${contactLinks()}<button class="button" data-start>Return to start</button></div>`]
      };
      if(!pages[type])return;[title,label,html]=pages[type];
    }
return {title,label,html};
}
