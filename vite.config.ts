import { legalReleaseIssues } from './src/config/legalValidation.ts';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
export default defineConfig(({command})=>{const preview=command==='serve'||process.env.IRONCYCLE_PREVIEW==='1';if(command==='build'&&!preview&&legalReleaseIssues().length)throw Error('Production release blocked: legal placeholders or reviews remain. Use build:preview only for explicit preview.');return {define:{__LEGAL_PREVIEW__:JSON.stringify(preview)},base:'./',plugins:[react(),tailwind()],test:{include:['src/**/*.test.ts']}};});
