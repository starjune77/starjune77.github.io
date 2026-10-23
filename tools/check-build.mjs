import assert from 'node:assert/strict';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {resolve} from 'node:path';

const html = readFileSync('dist/index.html', 'utf8');
assert(!html.includes('src/main.jsx'), 'production HTML must load compiled JavaScript');
assert(!html.includes('assets/app-'), 'the retired bundle must not be loaded');
assert(html.includes('<noscript>'), 'the semantic fallback must survive the build');
const assets = [...html.matchAll(/(?:src|href)="(\.\/assets\/[^"#?]+)"/g)].map(match => match[1]);
assert(assets.some(asset => asset.endsWith('.js')));
assert(assets.some(asset => asset.endsWith('.css')));
for (const asset of assets) assert(existsSync(resolve('dist', asset)), `missing asset: ${asset}`);
for (const file of ['resume/Junyoung_Oh_Resume.pdf', 'skills/LICENSE', 'accents/skyline.svg', 'favicon.svg']) {
  assert(readFileSync('assets/' + file).equals(readFileSync('dist/assets/' + file)), `static asset changed: ${file}`);
}
assert(!readdirSync('dist/assets').some(file => /^app-[a-f0-9]+\.js$/.test(file)));
assert(existsSync('dist/react-test.html'), 'the existing test-page URL remains supported');
console.log('PASS production entry point, compiled assets, static PDFs/icons, fallback and test-page compatibility.');
