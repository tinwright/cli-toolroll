# cli-toolroll

Small command-line tools, one npm package each (`@tinwright/<name>`) in an npm workspace, one
folder each under `clis/`, with a catalog site built from their READMEs. This file has two halves:
helping someone install a tool, and building a new one.

## Helping someone install a tool

Assume the person has never opened a terminal.

1. Open a terminal: **Terminal** on a Mac (Spotlight, then type "Terminal"), **Windows Terminal**
   or **PowerShell** on Windows.
2. Check for Node.js: type `node --version` and press Enter. A number of 22 or more is fine. An
   error, or a lower number, means installing the LTS version from https://nodejs.org first, then
   opening a new terminal.
3. Run the tool without installing it: `npx @tinwright/<name> --help`. The first time, npx asks to
   download it: answer `y`.
4. To keep it, `npm install --global @tinwright/<name>`, and from then on just `<name>`.

The tool's README shows a first command to try. If a command isn't found after a global install,
open a new terminal.

## Building a tool

### Start

```sh
npm run create -- <name> --description "What it does, in one sentence."
```

This copies `template/` to `clis/<name>/` and adds it to the workspace. The name is lowercase with
hyphens, and it's also the command.

### What every tool does the same way

- `--help` (and `-h`): usage, options, what the exit codes mean, and examples. Exit 0.
- `--version` (and `-v`): the package's version alone. Exit 0.
- `--json`: the result as one JSON value on stdout and nothing else, so a script can parse it.
  Keep the result a plain object and print it with `JSON.stringify`.
- Exit codes: 0 it worked, 1 it failed (a file it couldn't read, a network error), 2 wrong usage
  (an unknown option, a missing argument). Errors go to stderr, prefixed with the command's name,
  and a usage error ends with "Run <name> --help for usage."
- Input from arguments, files or stdin, whichever fits; stdin when something is piped in.
- Node itself only: `node:util`'s `parseArgs` for options, no dependencies unless there's no
  other way. Plain ESM with JSDoc types.

`npm run check` runs each tool to hold it to this.

### package.json

`name` `@tinwright/<name>`, a `version`, a `description`, one `bin`, `files` listing what ships,
`license` MIT, `repository.directory` `clis/<name>`, `engines.node`, and `publishConfig` with
`access: public` and `provenance: true`.

### Tests

Each `*.test.mjs` spawns the real CLI with `node:child_process` and checks its stdout, stderr and
exit code, including `--json`, `--help` and a usage error. CI runs them on Linux, macOS and Windows.

### Before a pull request

```sh
npm run check   # the shared CLI rules, package.json, READMEs, tests, template leftovers, secrets
npm test        # the site, and every tool as a real process
```

CI runs both, and the private-data guard, which fails on company hosts, internal IDs and work
email addresses anywhere in the change or its commits. Use `example.com` in examples and tests.

Commit messages are conventional commits scoped to the tool: `feat(example): count bytes`.

### Releasing

Bump `version` in the tool's `package.json`, merge, then tag `<name>@<version>` (`example@0.2.0`) on
`main` and push the tag. The release workflow runs the tests, publishes the package to npm with
provenance through npm's trusted publishing (no token), and makes a GitHub release with notes from
the commits.

A brand-new package can't use trusted publishing until it exists on npm, so a maintainer publishes
its first version by hand (`npm publish --workspace clis/<name>`, signed in to npm as a member of
the `tinwright` organization). Then, on the package's settings page on npmjs.com, add the trusted
publisher (GitHub Actions, `tinwright/cli-toolroll`, `release.yml`), and every later version goes
through the release workflow.

### Site

`npm run build` writes the catalog site to `dist/`; `npm run dev` serves it at
http://localhost:3000. The npx command on each card and page comes from `scripts/page.js`'s
extension points, fed by each package.json. The build also writes `items.json`, which the
org-wide gallery at https://tinwright.github.io reads.
