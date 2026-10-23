import Dialog from './Dialog.jsx';
import {panelHeading} from '../navigation.js';
import {profile, contact, projects} from '../../js/data.js';
import {About, Education, Experience, Skills, Honors, Resume, ContactLinks, ProjectCards, ProjectDetails, DetectionDemo, Chips} from './Portfolio.jsx';

function PanelBody({type, id, onOpen, onQuick, onStart, resumeAvailable}) {
  switch (type) {
    case 'project': return <ProjectDetails project={projects.find(project => project.id === id)} onOpen={onOpen} />;
    case 'about': return <><About /><h3>Education</h3><Education /><h3>Honors</h3><Honors /></>;
    case 'projects': return <><p>Applications, interactive learning, and computer vision experiments.</p><div className="project-grid"><ProjectCards onOpen={onOpen} /></div></>;
    case 'ai': return <><p>Computer vision and machine learning exploration through MorrowLab and the Object Detection Prototype.</p><Chips items={['MediaPipe', 'YOLO', 'PyTorch', 'NumPy']} /><DetectionDemo /><div className="actions"><button className="button" onClick={() => onOpen('project', 'morrowlab')}>MorrowLab ↗</button><button className="button" onClick={() => onOpen('project', 'detection')}>Object Detection ↗</button></div></>;
    case 'experience': return <Experience />;
    case 'skills': return <Skills />;
    case 'resume': return <><Education /><Resume available={resumeAvailable} /></>;
    case 'contact': return <><p>{profile.location}<br />{contact.email}</p><div className="actions"><ContactLinks /></div></>;
    case 'end': return <><p>{profile.tagline}</p><div className="actions"><button className="button" onClick={onQuick}>Quick View</button><ContactLinks /><button className="button" onClick={onStart}>Return to start</button></div></>;
    default: return null;
  }
}

export default function InfoPanel({overlay, onClose, onOpen, onQuick, onStart, resumeAvailable}) {
  const heading = overlay.mode === 'panel' ? panelHeading(overlay.type, overlay.id) : null;
  return <Dialog id="info-panel" className="info-panel" mode="panel" active={!!heading} revision={`${overlay.type}:${overlay.id}`} onClose={onClose} aria-labelledby="panel-title">
    <div className="dialog-toolbar"><p id="panel-label" className="eyebrow">{heading?.label || 'INFORMATION MODULE'}</p>
      <div className="panel-tools"><button className="text-button" onClick={onQuick}>Quick View</button><button className="button" onClick={() => onClose('panel')} aria-label="Close information panel">Close ×</button></div>
    </div>
    <div className="panel-body"><h2 id="panel-title" tabIndex={-1}>{heading?.title}</h2><div id="panel-content">
      {heading && <PanelBody key={`${overlay.type}:${overlay.id}`} {...overlay} onOpen={onOpen} onQuick={onQuick} onStart={onStart} resumeAvailable={resumeAvailable} />}
    </div></div>
  </Dialog>;
}
