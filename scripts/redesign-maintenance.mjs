import { runLocalCLI, siteOptions } from './runtime.mjs';
import { writeFile, mkdir } from 'node:fs/promises';
const capture = process.argv.includes('--capture');
const server = await runLocalCLI(await siteOptions(9402, true));
try {
  if (capture) {
    const response = await server.playground.run({ code: `<?php require '/wordpress/wp-load.php'; $data=[]; foreach(['home','work','services','about','contact','campaign'] as $slug) { $p=get_page_by_path($slug); if($p) $data[$slug]=['id'=>$p->ID,'content'=>$p->post_content,'default'=>kvm_page_content($slug)]; } echo wp_json_encode($data);` });
    await mkdir('.backups/sculptural-20261112', { recursive: true });
    await writeFile('.backups/sculptural-20261112/pages.json', response.text);
    console.log('Page baselines captured.');
  } else {
    const response = await server.playground.run({ code: `<?php require '/wordpress/wp-load.php'; kvm_normalize_studio_urls(); echo wp_json_encode(kvm_migrate_studio());` });
    console.log(response.text);
  }
} finally { await server[Symbol.asyncDispose](); }
