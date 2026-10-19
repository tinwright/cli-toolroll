# cli-toolroll

Small command-line tools, one job each, published on npm under `@tinwright`. Part of
[tinwright](https://github.com/tinwright).

| Tool | What it does |
|---|---|
| [**example**](clis/example) | Counts the words, lines and characters in text. |

Each has a page on the [catalog site](https://tinwright.github.io/cli-toolroll), in English, French
and Spanish.

## Install

With [Node.js](https://nodejs.org) 22 or newer, run any tool without installing it:

```sh
npx @tinwright/example --help
```

Or install it for good: `npm install --global @tinwright/example`.

Every tool has `--help`, prints JSON with `--json`, and exits 0 when it worked, 1 when it failed and
2 when it was used wrongly, so scripts and AI agents can call it as easily as people can.

## Make one

```sh
npm install
npm run create -- my-tool --description "What it does, in one sentence."
npm run check   # this workshop's rules (--help, --json, exit codes, package.json) and a scan for secrets
npm test        # every tool run as a real process
```

[`CLAUDE.md`](CLAUDE.md) is the full guide, written so Claude can follow it too.

## Licence

[MIT](LICENSE)
