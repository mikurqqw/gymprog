import { spawnSync } from 'node:child_process';
if (!process.env.npm_execpath) throw Error('Run through npm run build:preview');
const result = spawnSync(process.execPath, [process.env.npm_execpath, 'run', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, IRONCYCLE_PREVIEW: '1' },
});
process.exitCode = result.status ?? 1;
