import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {cpSync} from 'node:fs';

export default defineConfig({
  plugins:[react(),{
    name:'portfolio-static-assets',
    closeBundle(){cpSync('assets','dist/assets',{recursive:true,filter:source=>!/^app-[a-f0-9]+\.js$/.test(source.split(/[\\/]/).at(-1))});}
  }],
  base:'./',
  publicDir:false
});
