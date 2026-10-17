// The real CLI, spawned as a process: its counts, its JSON, its help and its exit codes.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const CLI = path.join(path.dirname(fileURLToPath(import.meta.url)), 'cli.mjs');
const run = (/** @type {string[]} */ args, input = '') =>
  spawnSync(process.execPath, [CLI, ...args], { input, encoding: 'utf8' });

test('counts its arguments', () => {
  const { stdout, status } = run(['Hello there,', 'world']);
  assert.equal(status, 0);
  assert.equal(stdout, '3 words, 1 line, 18 characters\n');
});

test('counts what is piped in, as JSON', () => {
  const { stdout, status } = run(['--json'], 'one two\nthree\n');
  assert.equal(status, 0);
  assert.deepEqual(JSON.parse(stdout), { words: 3, lines: 2, characters: 14 });
});

test('counts files, and exits 1 on one it cannot read', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'example-'));
  fs.writeFileSync(path.join(dir, 'a.txt'), 'a b c');
  assert.equal(run(['-f', path.join(dir, 'a.txt'), '--json']).stdout, '{"words":3,"lines":1,"characters":5}\n');
  const missing = run(['--file', path.join(dir, 'missing.txt')]);
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /ENOENT/);
});

test('--help and --version exit 0', () => {
  const help = run(['--help']);
  assert.equal(help.status, 0);
  assert.match(help.stdout, /^Usage: example/);
  assert.match(help.stdout, /--json/);
  assert.equal(run(['-v']).stdout, `${JSON.parse(fs.readFileSync(path.join(path.dirname(CLI), 'package.json'), 'utf8')).version}\n`);
});

test('wrong usage exits 2 and says how to get help', () => {
  const unknown = run(['--nope']);
  assert.equal(unknown.status, 2);
  assert.match(unknown.stderr, /example --help/);
  assert.equal(run(['text', '--file', 'x']).status, 2);
});
