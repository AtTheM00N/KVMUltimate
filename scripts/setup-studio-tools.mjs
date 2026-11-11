import { mkdir, access, readFile, writeFile, stat, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const root = path.resolve('.tools');
await mkdir(root, { recursive: true });
async function exists(file) { try { await access(file); return true; } catch { return false; } }
async function download(url, target) {
  if (await exists(target) && (await stat(target)).size > 0) return;
  console.log(`Downloading ${path.basename(target)}`);
  execFileSync('curl.exe', ['--fail', '--location', '--silent', '--show-error', '--retry', '2', '--connect-timeout', '20', '--max-time', '900', '--continue-at', '-', '--output', target + '.partial', url], { windowsHide: true, stdio: 'inherit' });
  await rename(target + '.partial', target);
}
const blenderVersion = '4.5.16';
const blenderName = `blender-${blenderVersion}-windows-x64`;
const blender = path.join(root, blenderName, 'blender.exe');
if (!(await exists(blender))) {
  const base = 'https://download.blender.org/release/Blender4.5/';
  const archive = path.join(root, `${blenderName}.zip`);
  if (await exists(archive) && (await stat(archive)).size !== 398426797) await rename(archive, archive + '.partial');
  await download(`${base}${blenderName}.zip`, archive);
  const checksums = await (await fetch(`${base}blender-${blenderVersion}.sha256`)).text();
  const expected = checksums.split('\n').find(line => line.includes(`${blenderName}.zip`))?.split(/\s+/)[0];
  const actual = createHash('sha256').update(await readFile(archive)).digest('hex');
  if (!expected || actual !== expected) throw new Error('Blender checksum mismatch');
  execFileSync('tar', ['-xf', archive, '-C', root], { windowsHide: true });
}
await writeFile(path.join(root, 'paths.json'), JSON.stringify({ blender }, null, 2));
console.log('Studio tools ready.');
