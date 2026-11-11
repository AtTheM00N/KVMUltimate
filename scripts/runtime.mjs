import { mkdir, access, copyFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
export async function siteOptions(port = 9400, persist = false) {
  if (persist) await mkdir('.local', { recursive: true });
  // Use an exact official release URL to avoid an API lookup on every offline boot.
  const release = 'https://wordpress.org/wordpress-6.8.12.zip';
  const cache = path.join(os.homedir(), '.wordpress-playground');
  const customZip = path.join(cache, `custom-${createHash('sha1').update(release).digest('hex').slice(0, 8)}.zip`);
  try { await access(customZip); } catch {
    try { await copyFile(path.join(cache, '6.8.12.zip'), customZip); } catch { /* Playground downloads the official archive on a fresh machine. */ }
  }
  return { command: 'server', port, php: '8.3', wp: release, workers: 1,
    ...(persist ? { 'mount-before-install': [{ hostPath: path.resolve('.local'), vfsPath: '/wordpress' }] } : {}),
    mount: [
      { hostPath: path.resolve('wp-content/themes/konnect'), vfsPath: '/wordpress/wp-content/themes/konnect' },
      { hostPath: path.resolve('wp-content/plugins/konnect-site'), vfsPath: '/wordpress/wp-content/plugins/konnect-site' }
    ],
    blueprint: { steps: [
      { step: 'defineWpConfigConsts', consts: { WP_ENVIRONMENT_TYPE: 'local', WP_DEBUG: true, WP_DEBUG_LOG: true, WP_DEBUG_DISPLAY: false, AUTOMATIC_UPDATER_DISABLED: true, WP_AUTO_UPDATE_CORE: false, DISABLE_WP_CRON: true } },
      { step: 'activatePlugin', pluginPath: 'konnect-site/konnect-site.php' },
      { step: 'activateTheme', themeFolderName: 'konnect' },
      { step: 'runPHP', code: "<?php require '/wordpress/wp-load.php'; kvm_seed_site();" }
    ] }
  };
}
