import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {transformWithOxc} from 'vite';

// Reuse Vite's JSX transformer for Node's built-in test runner; no extra test framework.
export async function load(url, context, nextLoad) {
  if (!url.endsWith('.jsx')) return nextLoad(url, context);
  const filename = fileURLToPath(url);
  const {code} = await transformWithOxc(await readFile(filename, 'utf8'), filename, {jsx: {runtime: 'automatic'}});
  return {format: 'module', source: code, shortCircuit: true};
}
