# Example

🇫🇷 [Français](README.fr.md) · 🇪🇸 [Español](README.es.md)

Counts the words, lines and characters in some text, a file, or whatever is piped in.

## Install

You need [Node.js](https://nodejs.org) 22 or newer. Then run it straight away:

```sh
npx @tinwright/example "Hello there, world"
```

Or install it, to type just `example`:

```sh
npm install --global @tinwright/example
```

## How to use it

```sh
example "Hello there, world"          # 3 words, 1 line, 18 characters
example --file notes.txt --json       # {"words":120,"lines":14,"characters":702}
cat notes.txt | example               # counts what's piped in
```

It exits 0 when it counted, 1 when a file couldn't be read, and 2 when it was used wrongly.
`example --help` says the same.

## Feedback

Found a bug or have an idea? [Open an issue](https://github.com/tinwright/cli-toolroll/issues/new/choose).
