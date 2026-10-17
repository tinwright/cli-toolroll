// The real CLI, spawned as a process: its output, its JSON, its help and its exit codes.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const CLI = path.join(path.dirname(fileURLToPath(import.meta.url)), 'cli.mjs');
const run = (/** @type {string[]} */ args, input = '') =>
  spawnSync(process.execPath, [CLI, ...args], { input, encoding: 'utf8' });

test('answers with its input, as text and as JSON', () => {
  assert.equal(run(['a', 'b']).stdout, 'a b\n');
  assert.deepEqual(JSON.parse(run(['a', '--json']).stdout), { input: ['a'] });
});

test('--help exits 0, and wrong usage exits 2', () => {
  const help = run(['--help']);
  assert.equal(help.status, 0);
  assert.match(help.stdout, /^Usage: __NAME__/);
  assert.equal(run(['--nope']).status, 2);
});
