import Dialog from './Dialog.jsx';
import {profile, education} from '../../js/data.js';
import {About, Education, Experience, Skills, Honors, Resume, ContactLinks, ProjectCards, SkillsMarquee} from './Portfolio.jsx';

export default function QuickView({active, onClose, onOpen, resumeAvailable}) {
  const sections = [
    ['quick-about', 'About', <About />],
    ['quick-projects', 'Featured projects', <div className="project-grid"><ProjectCards onOpen={onOpen} /></div>],
    ['quick-experience', 'Experience', <div className="experience-grid"><Experience /></div>],
    ['quick-skills', 'Skills', <div className="skills-grid"><Skills /></div>],
    ['quick-education', 'Education', <Education />],
    ['quick-honors', 'Honors', <Honors />],
    ['quick-resume', 'Resume', <Resume available={resumeAvailable} />],
    ['quick-contact', 'Let’s build something useful.', <div className="actions"><ContactLinks /></div>]
  ];
  function navigate(event) {
    const anchor = event.target.closest('a[href^="#quick-"]');
    if (!anchor) return;
    const target = event.currentTarget.querySelector(anchor.getAttribute('href'));
    if (target) {event.preventDefault(); target.scrollIntoView({block: 'start', behavior: 'auto'});}
  }
  return <Dialog id="quick-view" className="quick-view" mode="quick" active={active} onClose={onClose} aria-labelledby="quick-title">
    <div onClick={navigate}>
      <header className="quick-header"><a className="brand" href="#quick-main">{profile.name}</a>
        <nav aria-label="Portfolio navigation">{[['projects', 'Work'], ['experience', 'Experience'], ['skills', 'Skills'], ['resume', 'Resume'], ['contact', 'Contact']].map(([id, label]) => <a href={`#quick-${id}`} key={id}>{label}</a>)}</nav>
        <button className="button return-button" onClick={() => onClose('quick')}>Return to game <span>×</span></button>
      </header>
      <div id="quick-content"><main className="portfolio" id="quick-main">
        <section className="quick-hero" aria-labelledby="quick-title"><img className="hero-skyline" src="assets/accents/skyline.svg" width="640" height="170" alt="" />
          <p className="eyebrow">{profile.location}</p><h1 id="quick-title">{profile.name}</h1><p className="quick-role">{profile.role}<br />{education.university}</p>
          <p className="identity">{profile.identity}</p><p className="tagline">{profile.tagline}</p>
          <div className="actions"><a className="button" href="#quick-resume">View resume ↗</a><ContactLinks /><button className="button" onClick={() => onClose('quick')}>Return to game</button></div>
        </section>
        {sections.map(([id, title, body], index) => <section id={id} key={id}><div className="section-title"><p className="eyebrow">{String(index + 1).padStart(2, '0')}</p><h2>{title}</h2></div>{body}</section>)}
        <SkillsMarquee /><footer>© {new Date().getFullYear()} {profile.name} · Built as an interactive portfolio.</footer>
      </main></div>
    </div>
  </Dialog>;
}
