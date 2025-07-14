async function e() {
  game.settings.register(`it-IT`, `altTranslation`, {
    name: `(D&D5E) Traduzione alternativa`,
    hint: `Usa la traduzione alternativa di Arkangel. Altrimenti verrà usata la traduzione ufficiale (richiede il modulo libWrapper).`,
    type: Boolean,
    default: false,
    scope: `world`,
    config: true,
    restricted: true,
    onChange: () => {
      window.location.reload();
    }
  });

  if (typeof libWrapper == `function` && game.settings.get(`it-IT`, `altTranslation`)) {
    libWrapper.register(`it-IT`, `game.i18n.setLanguage`, t, `MIXED`);
  }
}

async function t(e, ...t) {
  await e(...t);

  let n = foundry.utils.getRoute(`/`);
  let r = `modules/it-IT/i18n/modules/alt/`;
  let i = `modules/it-IT/i18n/systems/alt/`;

  let a = [`dnd5e.json`, `dnd5e-plural.json`];
  let o = [
    `action-pack.json`, `activeauras.json`, `always-hp.json`, `arbron-hp-bar.json`,
    `autoanimations.json`, `bossbar.json`, `combat-utility-belt.json`, `combatbooster.json`,
    `compendium-browser.json`, `damage-log.json`, `dnd5e-system-customizer.json`,
    `enhancedcombathud-dnd5e.json`, `enhancedcombathud.json`, `epic-rolls-5e.json`,
    `gatherer.json`, `health-monitor.json`, `healthestimate.json`, `lmrtfy.json`,
    `midi-qol.json`, `ready-set-roll-5e.json`, `splatter.json`, `tidy5e-sheet.json`,
    `token-action-hud-dnd5e.json`, `vision-5e.json`
  ];

  let s = [...a.map(e => `${n}${i}${e}`), ...o.map(e => `${n}${r}${e}`)];
  let c = {};

  for (let e of s) {
    try {
      let t = await foundry.utils.fetchJsonWithTimeout(e);
      foundry.utils.mergeObject(c, foundry.utils.expandObject(t));
    } catch (t) {
      console.warn(`Impossibile caricare il file: ${e}`, t);
    }
  }

  foundry.utils.mergeObject(game.i18n.translations, c);
}

const n = Object.assign({
  "./systems/band-of-blades.js": () => import(`./band-of-blades.js`),
  "./systems/blades-in-the-dark.js": () => import(`./blades-in-the-dark.js`),
  "./systems/city-of-mist.js": () => import(`./city-of-mist.js`),
  "./systems/coc7.js": () => import(`./coc7.js`),
  "./systems/cy-borg.js": () => import(`./cy-borg.js`),
  "./systems/deltagreen.js": () => import(`./deltagreen.js`),
  "./systems/dnd5e.js": () => import(`./dnd5e.js`),
  "./systems/dragonbane.js": () => import(`./dragonbane.js`),
  "./systems/dune.js": () => import(`./dune.js`),
  "./systems/dungeonworld.js": () => import(`./dungeonworld.js`),
  "./systems/forbidden-lands.js": () => import(`./forbidden-lands.js`),
  "./systems/investigator.js": () => import(`./investigator.js`),
  "./systems/mausritter.js": () => import(`./mausritter.js`),
  "./systems/mouseguard.js": () => import(`./mouseguard.js`),
  "./systems/pbta.js": () => import(`./pbta.js`),
  "./systems/swade.js": () => import(`./swade.js`),
  "./systems/yzecoriolis.js": () => import(`./yzecoriolis.js`)
});

Hooks.once(`init`, async () => {
  let t = game.system.id.toLowerCase();
  let r = foundry.utils.getRoute(`/`);
  let i = document.createElement(`link`);
  i.rel = `stylesheet`;
  i.href = `${r}modules/it-IT/styles/${t}.css`;
  document.head.appendChild(i);

  let a = {
    Beaufort: { editor: true, fonts: [] },
    Exocet: { editor: true, fonts: [] },
    GWENT: { editor: true, fonts: [] },
    Manuskript: { editor: true, fonts: [] },
    "Marck Script": { editor: true, fonts: [] },
    "OCR-A": { editor: true, fonts: [] },
    "Roboto Condensed": { editor: true, fonts: [] },
    "Roboto Serif": { editor: true, fonts: [] },
    Roboto: { editor: true, fonts: [] }
  };

  CONFIG.fontDefinitions = foundry.utils.mergeObject(CONFIG.fontDefinitions, a);
  CONFIG.defaultFontFamily = `Roboto`;

  game.settings.register(`it-IT`, `sceneLabelFont`, {
    name: `Font delle etichette sulla scena`,
    hint: `Il font utilizzato per i nomi dei token e le annotazioni nella scena.`,
    type: Number,
    default: Object.keys(CONFIG.fontDefinitions).indexOf(CONFIG.defaultFontFamily),
    choices: Object.keys(CONFIG.fontDefinitions),
    scope: `world`,
    config: true,
    restricted: true,
    onChange: () => {
      window.location.reload();
    }
  });

  CONFIG.canvasTextStyle.fontFamily = Object.keys(CONFIG.fontDefinitions)[game.settings.get(`it-IT`, `sceneLabelFont`)];
  CONFIG.Token.adjectivesPrefix = `TOKEN.ItalianAdjectivesM`;

  if (t === `dnd5e`) await e();

  for (let r in n) {
    n[r]().then(e => {
      if (r.includes(`${t}.js`)) e.init();
    });
  }
});
