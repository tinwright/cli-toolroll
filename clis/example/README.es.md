# Example

🇬🇧 [English](README.md) · 🇫🇷 [Français](README.fr.md)

Cuenta las palabras, las líneas y los caracteres de un texto, un archivo o lo que le llegue por una tubería.

## Instalación

Necesitas [Node.js](https://nodejs.org) 22 o posterior. Después, ejecútalo directamente:

```sh
npx @tinwright/example "Hello there, world"
```

O instálalo, para escribir solo `example`:

```sh
npm install --global @tinwright/example
```

## Cómo usarlo

```sh
example "Hello there, world"          # 3 words, 1 line, 18 characters
example --file notes.txt --json       # {"words":120,"lines":14,"characters":702}
cat notes.txt | example               # cuenta lo que llega por la tubería
```

Termina con el código 0 cuando ha contado, 1 cuando no ha podido leer un archivo y 2 cuando se ha
usado mal. `example --help` lo recuerda.

## Comentarios

¿Has encontrado un error o tienes una idea? [Abre una incidencia](https://github.com/tinwright/cli-toolroll/issues/new/choose).
