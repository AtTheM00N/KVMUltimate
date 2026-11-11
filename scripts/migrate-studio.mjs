import { runLocalCLI as runCLI, siteOptions } from './runtime.mjs';
// Stop the persistent preview before using this explicit maintenance command.
const options = await siteOptions(9402, true);
const server = await runCLI(options);
try {
  const response = await server.playground.run({ code: `<?php require '/wordpress/wp-load.php'; $normalized = kvm_normalize_studio_urls(); $result = kvm_migrate_studio(${process.argv.includes('--replace') ? 'true' : 'false'}); if (is_wp_error($result)) throw new Exception($result->get_error_message()); echo wp_json_encode(['asset_urls_normalized' => $normalized, 'migration' => $result]);` });
  console.log(response.text);
} finally { await server[Symbol.asyncDispose](); }
