import { runLocalCLI as runCLI, siteOptions } from './runtime.mjs';
await runCLI(await siteOptions(9400, true));
