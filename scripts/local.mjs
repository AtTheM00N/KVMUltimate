import { runLocalCLI as runCLI, siteOptions } from './runtime.mjs';
const server = await runCLI(await siteOptions(9400, true));
// An explicit maintenance launch only; ordinary preview requests never migrate content.
if (process.argv.includes('--migrate')) {
  const result = await server.playground.run({ code: `<?php require '/wordpress/wp-load.php'; kvm_normalize_studio_urls(); $result=kvm_migrate_studio(); if(is_wp_error($result)) throw new Exception($result->get_error_message()); echo wp_json_encode($result);` });
  console.log('Explicit studio migration:', result.text);
}
