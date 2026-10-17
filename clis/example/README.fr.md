# Example

🇬🇧 [English](README.md) · 🇪🇸 [Español](README.es.md)

Compte les mots, les lignes et les caractères d’un texte, d’un fichier ou de ce qu’on lui transmet par un tube.

## Installation

Il vous faut [Node.js](https://nodejs.org) 22 ou plus récent. Lancez-le ensuite directement :

```sh
npx @tinwright/example "Hello there, world"
```

Ou installez-le, pour taper simplement `example` :

```sh
npm install --global @tinwright/example
```

## Comment l’utiliser

```sh
example "Hello there, world"          # 3 words, 1 line, 18 characters
example --file notes.txt --json       # {"words":120,"lines":14,"characters":702}
cat notes.txt | example               # compte ce qui arrive par le tube
```

Il se termine avec le code 0 quand il a compté, 1 quand un fichier n’a pas pu être lu, et 2 quand
il a été mal utilisé. `example --help` le rappelle.

## Retours

Un bug ou une idée ? [Ouvrez un ticket](https://github.com/tinwright/cli-toolroll/issues/new/choose).
