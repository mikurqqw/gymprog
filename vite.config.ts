import { legalReleaseIssues } from './src/config/legalValidation.ts';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
export default defineConfig(({command})=>{
 const preview=command==='serve'||process.env.IRONCYCLE_PREVIEW==='1';
 if(command==='build'&&!preview&&legalReleaseIssues().length)throw Error('Production release blocked: legal placeholders or reviews remain. Use build:preview only for explicit preview.');
 return {define:{__LEGAL_PREVIEW__:JSON.stringify(preview)},base:'./',build:{manifest:true},plugins:[react(),tailwind(),{name:'dev-only-websocket-csp',transformIndexHtml(html,context){return context.server?html.replace("connect-src 'self'","connect-src 'self' ws://127.0.0.1:*"):html;}}],test:{include:['src/**/*.test.ts']}};
});
