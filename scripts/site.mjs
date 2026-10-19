// This workshop's part of the tinwright site, which tinwright.github.io builds from a checkout of
// this repo: its nouns, its own words, and what its pages add to the shell there. Each hook gets
// the site, the tool, where the page sits (ctx) and the site's helpers (kit), and returns HTML;
// escape anything that comes from the repo with kit.escapeHTML().

/**
 * @typedef {import('./items.mjs').Item} Item
 * @typedef {import('./items.mjs').SiteConfig} Site
 * @typedef {{ lang: string, root: string, home: string }} Ctx
 * @typedef {{
 *   escapeHTML: (text: string) => string,
 *   commandHTML: (lang: string, command: string) => string,
 *   itemsPath: (site: Site) => string,
 * }} Kit
 */

/** The nouns on this workshop's pages, per language. */
export const nouns = {
  en: {
    item: 'CLI',
    allItems: 'All tools',
    count: (/** @type {number} */ n) => `${n} ${n === 1 ? 'tool' : 'tools'}`,
    emptyTitle: 'No tools yet',
    emptyText: 'The first ones are on their way. Watch the repository on GitHub to hear when they land.',
    back: '← All tools',
    moreItems: 'More tools',
  },
  fr: {
    item: 'CLI',
    allItems: 'Tous les outils',
    count: (/** @type {number} */ n) => `${n} ${n === 1 ? 'outil' : 'outils'}`,
    emptyTitle: 'Pas encore d’outils',
    emptyText: 'Les premiers arrivent bientôt. Suivez le dépôt sur GitHub pour savoir quand ils seront là.',
    back: '← Tous les outils',
    moreItems: 'Autres outils',
  },
  es: {
    item: 'CLI',
    allItems: 'Todas las herramientas',
    count: (/** @type {number} */ n) => `${n} ${n === 1 ? 'herramienta' : 'herramientas'}`,
    emptyTitle: 'Todavía no hay herramientas',
    emptyText: 'Las primeras están en camino. Sigue el repositorio en GitHub para enterarte cuando lleguen.',
    back: '← Todas las herramientas',
    moreItems: 'Más herramientas',
  },
};

/** This workshop's own words, per language. */
const WORDS = {
  en: {
    version: 'Version',
    command: 'Command',
    tryIt: 'Run it without installing (needs Node.js):',
    install: 'Or install it, to run it as',
  },
  fr: {
    version: 'Version',
    command: 'Commande',
    tryIt: 'Lancez-le sans l’installer (Node.js requis) :',
    install: 'Ou installez-le, pour le lancer avec',
  },
  es: {
    version: 'Versión',
    command: 'Comando',
    tryIt: 'Ejecútalo sin instalarlo (necesita Node.js):',
    install: 'O instálalo, para ejecutarlo como',
  },
};
/** @param {string} lang */
const wordsOf = (lang) => WORDS[/** @type {keyof typeof WORDS} */ (lang)] ?? WORDS.en;

/**
 * Extra lines at the bottom of a home card: the command to try it.
 * @param {Site} site
 * @param {Item} item
 * @param {Ctx} ctx
 * @param {Kit} kit
 */
export function card(site, item, ctx, kit) {
  return item.packageName ? `<p class="card-command"><code>npx ${kit.escapeHTML(item.packageName)}</code></p>` : '';
}

/**
 * The CLI's version and command.
 * @param {Site} site
 * @param {Item} item
 * @param {Ctx} ctx
 * @param {Kit} kit
 */
export function facts(site, item, ctx, kit) {
  const words = wordsOf(ctx.lang);
  return `${item.version ? `<dt>${words.version}</dt><dd>${kit.escapeHTML(item.version)}</dd>` : ''}${
    item.command ? `<dt>${words.command}</dt><dd><code>${kit.escapeHTML(item.command)}</code></dd>` : ''
  }`;
}

/**
 * Run it with npx, or install it globally.
 * @param {Site} site
 * @param {Item} item
 * @param {Ctx} ctx
 * @param {Kit} kit
 */
export function install(site, item, ctx, kit) {
  if (!item.packageName) return '';
  const words = wordsOf(ctx.lang);
  return `<div class="install">
              <p>${words.tryIt}</p>
              ${kit.commandHTML(ctx.lang, `npx ${item.packageName} --help`)}
              <p>${words.install} <code>${kit.escapeHTML(item.command ?? item.name)}</code>${ctx.lang === 'fr' ? '\u202f' : ''}:</p>
              ${kit.commandHTML(ctx.lang, `npm install --global ${item.packageName}`)}
            </div>`;
}
