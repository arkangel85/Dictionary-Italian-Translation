import { b as e } from "./shared.js";

/*
  async function t() {
  n(),
  game.settings.get(`it-IT`, `compendiumTranslation`) && game.babele && (
    i(),
    game.settings.get(`it-IT`, `altTranslation`) ? e(`dnd5e/ds`) : e(`dnd5e/ag`),
    game.settings.get(`it-IT`, `translateCPR`) && (
      game.modules.get(`chris-premades`) && e(`dnd5e/chris`),
      game.modules.get(`gambits-premades`) && e(`dnd5e/gambit`)
    )
  ),
  r()
}
*/

async function t() {
  n();

  game.settings.get(`it-IT`, `compendiumTranslation`) &&
  game.babele &&
  i();

  game.settings.get(`it-IT`, `compendiumTranslation`) &&
  game.babele &&
  game.settings.get(`it-IT`, `altTranslation`) &&
  e(`dnd5e/ds`);

  game.settings.get(`it-IT`, `compendiumTranslation`) &&
  game.babele &&
  game.settings.get(`it-IT`, `translateCPR`) &&
  game.modules.get(`chris-premades`) &&
  e(`dnd5e/chris`);

  game.settings.get(`it-IT`, `compendiumTranslation`) &&
  game.babele &&
  game.settings.get(`it-IT`, `translateCPR`) &&
  game.modules.get(`gambits-premades`) &&
  e(`dnd5e/gambit`);

  r();
}

function n() {
  game.settings.register(`it-IT`, `compendiumTranslation`, {
    name: `(D&D5E) Traduzione dei compendi 5e SRD`,
    hint: `I compendi del sistema D&D5E saranno tradotti. La traduzione dei compendi è necessaria per una corretta traduzione di tipi di armi, armature, lingue e altri elementi (è richiesto il modulo Babele)`,
    type: Boolean,
    default: !0,
    scope: `world`,
    config: !0,
    restricted: !0,
    onChange: () => { window.location.reload() }
  }),
  game.settings.register(`it-IT`, `translateCPR`, {
    name: `(D&D5E) Traduzione dei compendi Cauldron of Plentiful Resources e Gambit's Premades`,
    hint: `Traduzione dei compendi dei moduli Cauldron of Plentiful Resources e Gambit's Premades. Disattiva se hai problemi con il funzionamento dei moduli.`,
    type: Boolean,
    default: !0,
    scope: `world`,
    config: !0,
    restricted: !0,
    onChange: () => { window.location.reload() }
  })
}

function r() {
  Hooks.on(`renderSettingsConfig`, (e, t, n) => {
    if (!game.user.isGM) return;
    let r;
    r = game.release.generation < 13
      ? t.find(`input[name="it-IT.translateCPR"]`).closest(`.form-group`)
      : t.querySelector(`section[data-tab="it-IT"] > div:last-child`);
    let i = $(`
  <label>
    Prima della traduzione delle animazioni è necessario abilitare i moduli Automated Animations, D&D5E Animations, JB2A Patreon
  </label>
  <div class="form-group">
      <button type="button">
          <i class="fas fa-cogs"></i>
          <label>Traduci animazioni</label>
      </button>
  </div>
  `);
    i.find(`button`).click(async e => {
      e.preventDefault(),
      await a()
    }),
    i.insertAfter(r)
  })
}

function i() {
  game.babele.registerConverters({
    dndpages(e, t) {
      return e.map(e => {
        if (!t) return e;
        let n;
        n = Array.isArray(t)
          ? t.find(t => t.id === e._id || t.id === e.name)
          : t[e.name];
        return n
          ? foundry.utils.mergeObject(e, {
              name: n.name,
              image: { caption: n.caption ?? e.image.caption },
              src: n.src ?? e.src,
              text: { content: n.text ?? e.text.content },
              video: {
                width: n.width ?? e.video.width,
                height: n.height ?? e.video.height
              },
              system: { tooltip: n.tooltip ?? e.system.tooltip },
              translated: !0
            })
          : e
      })
    }
  })
}

async function a() {
  if (!game.modules.get(`autoanimations`)?.active) {
    ui.notifications.error(`Il modulo Automated Animations non è attivo`);
    return;
  }
  try {
    let e = await foundry.utils.fetchJsonWithTimeout(`/modules/it-IT/i18n/modules/aa-autorec.json`),
        t = AutomatedAnimations.AutorecManager.getAutorecEntries();
    if (!t) throw Error(`Impossibile ottenere le impostazioni attuali delle animazioni. Assicurati che il modulo D&D5E Animations sia attivo e le animazioni siano installate.`);
    let n = {
      melee: o(t.melee, e.melee),
      range: o(t.range, e.range),
      ontoken: o(t.ontoken, e.ontoken),
      templatefx: o(t.templatefx, e.templatefx),
      aura: o(t.aura, e.aura),
      preset: o(t.preset, e.preset),
      aefx: o(t.aefx, e.aefx),
      version: `5`
    };
    await AutomatedAnimations.AutorecManager.overwriteMenus(JSON.stringify(n), { submitAll: !0 }),
    ui.notifications.info(`Impostazioni delle animazioni aggiornate`)
  } catch (e) {
    console.error(`Impossibile aggiornare le impostazioni delle animazioni:`, e),
    ui.notifications.error(`Impossibile aggiornare le impostazioni delle animazioni`)
  }
}

function o(e, t) {
  let n = new Map(t.map(e => [e.metaData.label, e]));
  return e.map(e => {
    let t = n.get(e.metaData.label);
    return t ? { ...e, ...t } : e
  })
}

export { t as init };