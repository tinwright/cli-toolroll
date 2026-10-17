#!/usr/bin/env node
// __NAME__: __DESCRIPTION__
// Like every CLI here: --help, --json, and exit codes that mean the same thing every time, so a
// script or an AI agent can call it as easily as a person.

import { parseArgs } from 'node:util';
import pkg from './package.json' with { type: 'json' };

const HELP = `Usage: __NAME__ [options] [input...]

__DESCRIPTION__

Options:
      --json     print JSON instead of text
  -h, --help     show this help
  -v, --version  show the version

Exit codes: 0 done, 1 it failed, 2 wrong usage.
`;

/** @param {string} message */
const usageError = (message) => {
  process.stderr.write(`__NAME__: ${message}\nRun __NAME__ --help for usage.\n`);
  process.exit(2);
};

let parsed;
try {
  parsed = parseArgs({
    allowPositionals: true,
    options: {
      json: { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
      version: { type: 'boolean', short: 'v' },
    },
  });
} catch (error) {
  usageError(/** @type {Error} */ (error).message);
}
const { values, positionals } = /** @type {NonNullable<typeof parsed>} */ (parsed);

if (values.help) {
  process.stdout.write(HELP);
  process.exit(0);
}
if (values.version) {
  process.stdout.write(`${pkg.version}\n`);
  process.exit(0);
}

// The tool's work goes here. Keep the result a plain object, so --json is just JSON.stringify.
const result = { input: positionals };
process.stdout.write(values.json ? `${JSON.stringify(result)}\n` : `${positionals.join(' ') || 'Nothing given.'}\n`);
