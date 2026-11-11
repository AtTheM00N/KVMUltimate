import { readFile, mkdir } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { spawn } from 'node:child_process';
const { blender } = JSON.parse(await readFile('.tools/paths.json', 'utf8'));
await mkdir('artifacts', { recursive: true });
const log = createWriteStream('artifacts/studio-render.log');
const child = spawn(blender, ['--background', '--factory-startup', '--threads', '6', '--python', 'design-source/build_studio.py'], { windowsHide: true });
let tail = '';
child.stdout.on('data', data => {
  log.write(data); tail = (tail + data).slice(-5000);
  const matches = data.toString().match(/Saved:.*|KONNECT STUDIO COMPLETE|Error:.*|Traceback.*/g);
  if (matches) console.log(matches.join('\n'));
});
child.stderr.on('data', data => { log.write(data); tail = (tail + data).slice(-5000); });
await new Promise((resolve, reject) => {
  child.on('error', reject);
  child.on('exit', code => { log.end(); if (code !== 0 || !tail.includes('KONNECT STUDIO COMPLETE')) reject(new Error(`Blender render failed (${code}): ${tail}`)); else resolve(); });
});
