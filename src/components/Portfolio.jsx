import {Fragment, useState} from 'react';
import {profile, education, experience, skills, honors, contact, projects, resumePath} from '../../js/data.js';

export function Chips({items}) {
  return <div className="chips">{items.map(item => <span key={item}>{item}</span>)}</div>;
}

function Icon({name}) {
  return <span className={`icon icon-${name}`} aria-hidden="true" />;
}

export function ContactLinks() {
  return <>
    <a className="button primary" href={`mailto:${contact.email}`}><Icon name="mail" />Email me ↗</a>
    <a className="button" href={contact.github} target="_blank" rel="noopener"><Icon name="code" />GitHub ↗</a>
    <a className="button" href={contact.linkedin} target="_blank" rel="noopener"><Icon name="network" />LinkedIn ↗</a>
  </>;
}

export function About() {
  return <><p>{profile.bio}</p><p className="muted">{profile.location}</p><h3>Professional interests</h3><Chips items={profile.interests} /></>;
}

export function Education() {
  return <><h3>{education.university}</h3><p>{education.dates}</p><p>{education.degree}<br />{education.major}</p><p>{education.coursework}<br />{education.campus}</p></>;
}

export function Experience() {
  return experience.map(item => <article className="experience-record" key={item.title}>
    <p className="eyebrow">{item.dates}</p><h3>{item.title}</h3>
    <p>{item.role}<br /><span className="muted">{item.organization}</span></p>
    <ul>{item.work.map(line => <li key={line}>{line}</li>)}</ul><Chips items={item.tags} />
  </article>);
}

export function Skills() {
  return Object.entries(skills).map(([category, items]) => <div key={category}><h3>{category}</h3><Chips items={items} /></div>);
}

export function SkillsMarquee() {
  return <div className="skills-marquee" aria-hidden="true"><div className="skills-track">
    {[0, 1].map(copy => <ul className="skills-train" key={copy}>{skills.Languages.map(name =>
      <li className="skill-item" key={name}><img src={`assets/skills/${name.toLowerCase()}.svg`} width="30" height="30" alt="" /><span>{name}</span></li>
    )}</ul>)}
  </div></div>;
}

export function Honors() {
  return <ul className="honors-list">{honors.map(honor => <li key={honor}>{honor}</li>)}</ul>;
}

export function Resume({available}) {
  const disabled = available ? {} : {'aria-disabled': true, tabIndex: -1, onClick: event => event.preventDefault()};
  return <><p>Education, projects, experience, skills, and honors in one document.</p><div className="actions">
    <a className="button" data-resume="" href={resumePath} target="_blank" rel="noopener" {...disabled}><Icon name="file" />View resume ↗</a>
    <a className="button" data-resume="" href={resumePath} download {...disabled}><Icon name="file" />Download PDF ↓</a>
  </div><p className="resume-status muted" role="status">{available ? 'Resume PDF available.' : 'Resume PDF pending. The full portfolio is available in Quick View.'}</p></>;
}

export function ProjectCards({onOpen}) {
  return projects.map((project, index) => <article className={`project-card ${index === 0 ? 'featured' : ''}`} key={project.id}>
    <p className="eyebrow">0{index + 1} / {project.type}</p><h3>{project.title}</h3>
    <p className="context">{project.context}{project.role && <><br />{project.role}</>}</p><p>{project.description}</p>
    <Chips items={project.technologies} /><button className="text-button" data-open="project" data-id={project.id} onClick={() => onOpen('project', project.id)}>Read project details ↗</button>
  </article>);
}

export function StudyDemo() {
  const [hours, setHours] = useState(3);
  const format = minutes => `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`;
  return <div className="demo"><p className="eyebrow">REPRESENTATIVE PORTFOLIO INTERFACE / SAMPLE DATA</p><h3>Today → Tomorrow</h3>
    <div className="sample-stats"><div>Study time<strong>4h 21m</strong></div><div>Focus sessions<strong>5</strong></div><div>Tasks<strong>6 / 8</strong></div></div>
    <label htmlFor="study-hours">Available time <output id="hours-output">{hours} hour{hours === 1 ? '' : 's'}</output></label>
    <input id="study-hours" type="range" min="1" max="6" value={hours} onInput={event => setHours(Number(event.currentTarget.value))} />
    <div className="plan"><span>CS 300 <strong id="cs-plan">{format(hours * 40)}</strong></span><span>Reading <strong id="reading-plan">{format(hours * 20)}</strong></span></div>
    <p className="demo-note">Fictional sample data and illustrative allocation. This is not the original application or its recommendation algorithm.</p>
  </div>;
}

export function DetectionDemo() {
  const [enabled, setEnabled] = useState(true);
  return <div className="demo"><p className="eyebrow">ABSTRACT DETECTION / PORTFOLIO SIMULATION</p>
    <div className={`detection-scene${enabled ? '' : ' off'}`}>
      {['a', 'b', 'c'].map(letter => <div className={`shape shape-${letter}`} key={letter} />)}
      {['a', 'b', 'c'].map(letter => <div className={`bounding box-${letter}`} key={letter}><span>OBJECT {letter.toUpperCase()}</span></div>)}<div className="scan-line" />
    </div>
    <button className="button" id="detection-toggle" aria-pressed={enabled} onClick={() => setEnabled(value => !value)}>Detection overlay: {enabled ? 'ON' : 'OFF'}</button>
    <p className="demo-note">Abstract shapes and illustrative bounding boxes. No inference, camera access, or performance claims.</p>
  </div>;
}

function Flow({items}) {
  return <div className="architecture">{items.map((item, index) => <Fragment key={item}>{index > 0 && <b aria-hidden="true">→</b>}<span>{item}</span></Fragment>)}</div>;
}

export function ProjectDetails({project, onOpen}) {
  return <><p className="context">{project.context}</p>{project.role && <p className="eyebrow">{project.role}</p>}
    <h3>Overview</h3><p>{project.description}</p>
    {project.contributions.length > 0 && <><h3>My contribution</h3><ul>{project.contributions.map(line => <li key={line}>{line}</li>)}</ul></>}
    <h3>Technology</h3><Chips items={project.technologies} />
    {project.id === 'morrowlab' && <><h3>Conceptual system flow</h3>
      <Flow items={['Activity + self-evaluation', 'Study context', 'Next-day plan']} />
      <Flow items={['Camera', 'MediaPipe', 'On-device processing']} /><StudyDemo /></>}
    {project.id === 'detection' && <DetectionDemo />}
    <div className="actions"><button className="button" data-open="projects" onClick={() => onOpen('projects')}>All projects ↗</button>
      {project.repository && <a className="button" href={project.repository} target="_blank" rel="noopener">Project GitHub ↗</a>}
    </div>
  </>;
}
