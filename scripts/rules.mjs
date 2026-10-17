// This workshop's rules for npm run check. Each CLI is its own npm package, @tinwright/<folder>,
// with one command, and must answer --help, --json and --version the same way as the others.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT_DIR } from './workshop.mjs';
import config from '../site.config.js';

export const SCOPE = '@tinwright';

export default {
  /**
   * @param {import('./items.mjs').Item} item
   * @param {string[]} files
   */
  check(item, files) {
    if (!files.includes('package.json')) return ['no package.json'];
    /** @type {string[]} */
    const problems = [];
    const pkg = JSON.parse(fs.readFileSync(path.join(item.dir, 'package.json'), 'utf8'));
    const expect = (/** @type {boolean} */ ok, /** @type {string} */ message) => ok || problems.push(message);

    expect(pkg.name === `${SCOPE}/${item.name}`, `package.json's name should be ${SCOPE}/${item.name}`);
    expect(/^\d+\.\d+\.\d+$/.test(pkg.version ?? ''), 'version should look like 1.2.3');
    expect(Boolean(pkg.description), 'package.json needs a description');
    expect(pkg.license === 'MIT', 'license should be MIT');
    expect(pkg.publishConfig?.access === 'public' && pkg.publishConfig?.provenance === true, 'publishConfig needs access: public and provenance: true');
    expect(pkg.repository?.directory === `${config.itemsDir}/${item.name}`, `repository.directory should be ${config.itemsDir}/${item.name}`);
    if (Object.keys(pkg.dependencies ?? {}).length) problems.push('it has dependencies; keep CLIs to Node itself, or say why in the README');

    const bins = Object.entries(pkg.bin ?? {});
    if (bins.length !== 1) return [...problems, 'bin should name exactly one command'];
    const [[command, file]] = bins;
    const script = path.join(item.dir, file);
    if (!fs.existsSync(script)) return [...problems, `bin points to ${file}, which doesn't exist`];
    expect(fs.readFileSync(script, 'utf8').startsWith('#!/usr/bin/env node'), `${file} should start with #!/usr/bin/env node`);
    expect((pkg.files ?? []).some((/** @type {string} */ entry) => path.normalize(entry) === path.normalize(file)), `files should include ${file}`);

    const run = (/** @type {string[]} */ args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', input: '' });
    const help = run(['--help']);
    expect(help.status === 0, `${command} --help should exit 0`);
    expect(/--json/.test(help.stdout) && /--help/.test(help.stdout), `${command} --help should list --json and --help`);
    expect(/exit codes?/i.test(help.stdout), `${command} --help should say what its exit codes mean`);
    expect(run(['--version']).stdout.trim() === pkg.version, `${command} --version should print ${pkg.version}`);
    expect(run(['--no-such-option']).status === 2, `${command} should exit 2 on an unknown option`);
    return problems;
  },

  /** Adds the new package to the workspace's lockfile, which CI's npm ci needs. */
  afterCreate() {
    const install = spawnSync('npm', ['install', '--silent'], { cwd: ROOT_DIR, stdio: 'inherit' });
    if (install.status !== 0) console.warn('npm install failed; run it before committing.');
  },
};
