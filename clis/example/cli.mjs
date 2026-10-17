#!/usr/bin/env node
// example: counts the words, lines and characters in text from its arguments, files or stdin.
// Like every CLI here: --help, --json, and exit codes that mean the same thing every time, so a
// script or an AI agent can call it as easily as a person.

import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import pkg from './package.json' with { type: 'json' };

const HELP = `Usage: example [options] [text...]

Counts the words, lines and characters in text: the arguments, the files
given with --file, or what's piped in.

Options:
  -f, --file <path>  count a file instead (repeat for several)
      --json         print JSON: {"words":…,"lines":…,"characters":…}
  -h, --help         show this help
  -v, --version      show the version

Exit codes: 0 counted, 1 a file couldn't be read, 2 wrong usage.

Examples:
  example "Hello there, world"
  example --file notes.txt --json
  cat notes.txt | example
`;

/** @param {string} text */
export const count = (text) => ({
  words: (text.match(/\S+/g) ?? []).length,
  lines: text === '' ? 0 : text.split(/\r\n|\r|\n/).length - (/(\r\n|\r|\n)$/.test(text) ? 1 : 0),
  characters: [...text].length,
});

/** @param {string} message */
const usageError = (message) => {
  process.stderr.write(`example: ${message}\nRun example --help for usage.\n`);
  process.exit(2);
};

let parsed;
try {
  parsed = parseArgs({
    allowPositionals: true,
    options: {
      file: { type: 'string', short: 'f', multiple: true },
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
if (positionals.length && values.file) usageError('give text or --file, not both');

let text;
if (values.file) {
  try {
    text = values.file.map((file) => readFileSync(file, 'utf8')).join('');
  } catch (error) {
    process.stderr.write(`example: ${/** @type {Error} */ (error).message}\n`);
    process.exit(1);
  }
} else if (positionals.length) {
  text = positionals.join(' ');
} else if (!process.stdin.isTTY) {
  text = readFileSync(0, 'utf8');
} else {
  usageError('nothing to count: give some text, a --file, or pipe text in');
}

const result = count(/** @type {string} */ (text));
const plural = (/** @type {number} */ n, /** @type {string} */ word) => `${n} ${word}${n === 1 ? '' : 's'}`;
process.stdout.write(
  values.json
    ? `${JSON.stringify(result)}\n`
    : `${plural(result.words, 'word')}, ${plural(result.lines, 'line')}, ${plural(result.characters, 'character')}\n`,
);
