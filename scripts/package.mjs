import { mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
await mkdir('artifacts', { recursive: true });
for (const [source, output] of [
  ['wp-content/themes/konnect', 'artifacts/konnect-theme.zip'],
  ['wp-content/plugins/konnect-site', 'artifacts/konnect-site-plugin.zip']
]) {
  const split = source.lastIndexOf('/');
  execFileSync('tar', ['-a', '-c', '-f', output, '-C', source.slice(0, split), source.slice(split + 1)], { stdio: 'inherit', windowsHide: true });
}
console.log('Theme and plugin ZIPs created in artifacts/.');
