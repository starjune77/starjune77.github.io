import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {overlayFromLocation, closeOverlay, panelHeading} from '../src/navigation.js';
import {ProjectDetails, Resume, About} from '../src/components/Portfolio.jsx';
import {projects, profile} from '../js/data.js';

const render = (component, props) => renderToStaticMarkup(React.createElement(component, props));
const location = suffix => new URL(suffix, 'https://portfolio.example/');

test('deep links select the expected view and reject unknown projects', () => {
  assert.deepEqual(overlayFromLocation(location('/?view=quick'), true), {mode: 'quick'});
  assert.deepEqual(overlayFromLocation(location('/#quick')), {mode: 'quick'});
  assert.deepEqual(overlayFromLocation(location('/#quick-skills')), {mode: 'quick'});
  for (const project of projects) {
    assert.deepEqual(overlayFromLocation(location('/#project-' + project.id)), {mode: 'panel', type: 'project', id: project.id});
    assert.equal(panelHeading('project', project.id).title, project.title);
  }
  assert.equal(overlayFromLocation(location('/#project-missing')).mode, 'world');
  assert.equal(panelHeading('__proto__'), null);
  assert.equal(overlayFromLocation(location('/'), true).mode, 'choice');
  assert.equal(overlayFromLocation(location('/?view=game'), true).mode, 'world');
});

test('closing a nested project returns to Quick View; queued close events cannot dismiss another view', () => {
  const panel = {mode: 'panel', type: 'project', id: 'morrowlab', returnTo: 'quick'};
  assert.deepEqual(closeOverlay(panel, 'panel'), {mode: 'quick'});
  assert.equal(closeOverlay(panel, 'terminal'), panel);
  assert.deepEqual(closeOverlay(panel, 'quick'), {mode: 'world'});
  assert.deepEqual(closeOverlay({mode: 'panel'}, 'panel'), {mode: 'world'});
});

test('every project preserves its description, contributions and technologies in JSX', () => {
  for (const project of projects) {
    const html = render(ProjectDetails, {project, onOpen() {}});
    assert(html.includes(project.description));
    for (const line of project.contributions) assert(html.includes(line));
    for (const technology of project.technologies) assert(html.includes(technology));
  }
});

test('resume links are disabled until PDF availability is confirmed', () => {
  const pending = render(Resume, {available: false});
  assert.equal((pending.match(/aria-disabled="true"/g) || []).length, 2);
  assert.equal((pending.match(/tabindex="-1"/g) || []).length, 2);
  const available = render(Resume, {available: true});
  assert(!available.includes('aria-disabled'));
  assert(available.includes('Resume PDF available.'));
  assert(available.includes('download=""'));
});

test('portfolio text is escaped by React rather than interpreted as HTML', () => {
  const original = profile.bio;
  try {
    profile.bio = '<img src=x onerror=alert(1)>';
    const html = render(About);
    assert(html.includes('&lt;img'));
    assert(!html.includes('<img'));
  } finally {profile.bio = original;}
});
