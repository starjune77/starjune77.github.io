import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {cpSync} from 'node:fs';
import {resolve} from 'node:path';

// Keep the existing static asset URLs in both development and production.
export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [react(), {
    name: 'portfolio-static-assets',
    closeBundle() {cpSync('assets', 'dist/assets', {recursive: true});}
  }],
  build: {
    rolldownOptions: {input: {index: resolve('index.html'), 'react-test': resolve('react-test.html')}}
  }
});
