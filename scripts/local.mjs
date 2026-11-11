import { runCLI } from '@wp-playground/cli';
import { siteOptions } from './runtime.mjs';
await runCLI(await siteOptions(9400, true));
