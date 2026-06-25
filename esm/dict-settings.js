/**
 * dict-settings.js — Dictionary Italian Translation (it-IT)
 * Pannello impostazioni: Patch Note (da server, con auto-mostra all'aggiornamento e storico),
 * Bug Report (repo arkangel85/Dictionary-Italian-Translation) e gestione Traduzioni Attive
 * (attiva/disattiva le singole traduzioni dei moduli/sistemi attivi nel mondo, core escluso).
 *
 * Patch Note e Bug Report sono replicati dal sistema di Arkangel Compendium.
 */

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const DICT_ID = 'it-IT';
const DICT_PATCH_URL = 'https://php.arkadnd.site/patchNoteDictionary.php';
const DICT_BUG_ENDPOINT = 'https://php.arkadnd.site/bugReporter.php';
const DICT_REPO = 'arkangel85/Dictionary-Italian-Translation';

/* ---- utilità ------------------------------------------------------------- */

/** Confronta due versioni "a.b.c" → -1, 0, 1 */
function dictCompareVersions(a, b) {
   const pa = String(a).split('.').map(n => parseInt(n, 10) || 0);
   const pb = String(b).split('.').map(n => parseInt(n, 10) || 0);
   const len = Math.max(pa.length, pb.length);
   for (let i = 0; i < len; i++) {
      const x = pa[i] || 0, y = pb[i] || 0;
      if (x > y) return 1;
      if (x < y) return -1;
   }
   return 0;
}

/** Scarica le patch note dal server, ordinate dalla più recente alla più vecchia. */
async function dictFetchPatchNotes() {
   try {
      const res = await fetch(DICT_PATCH_URL, { cache: 'no-store' });
      const data = await res.json();
      const versions = Array.isArray(data?.versions) ? data.versions : [];
      return [...versions].sort((a, b) => dictCompareVersions(b.version, a.version));
   } catch (e) {
      console.warn('Dictionary | patch note non disponibili', e);
      return [];
   }
}

/** Legge l'elenco delle lingue dal manifest del modulo (a runtime). */
async function dictFetchModuleLanguages() {
   try {
      const route = foundry.utils.getRoute('/');
      const manifest = await foundry.utils.fetchJsonWithTimeout(`${route}modules/${DICT_ID}/module.json`, { cache: 'no-store' });
      return Array.isArray(manifest?.languages) ? manifest.languages : [];
   } catch (e) {
      console.warn('Dictionary | impossibile leggere il manifest', e);
      return [];
   }
}

/** Chiave di gruppo per una voce di lingua (core / sistema / modulo). */
function dictEntryKey(entry) {
   if (entry.system) return 'system:' + entry.system;
   if (entry.module) return 'module:' + entry.module;
   return 'core';
}

/** Una voce di lingua è attiva nel mondo corrente? */
function dictEntryActive(entry) {
   if (entry.lang && entry.lang !== 'it') return false;
   if (entry.system) return entry.system === game.system.id;
   if (entry.module) return !!game.modules.get(entry.module)?.active;
   return true; // core
}

/** Cancella ricorsivamente da `target` le sole chiavi presenti in `source`. */
function dictDeepDelete(target, source) {
   if (!target || !source) return;
   for (const k of Object.keys(source)) {
      if (!(k in target)) continue;
      if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k]) &&
          target[k] && typeof target[k] === 'object') {
         dictDeepDelete(target[k], source[k]);
         if (Object.keys(target[k]).length === 0) delete target[k];
      } else {
         delete target[k];
      }
   }
}

/* ---- registrazione impostazioni e menu ----------------------------------- */

Hooks.once('init', () => {
   game.settings.register(DICT_ID, 'version', { scope: 'world', config: false, type: String, default: '' });
   // ultima versione di note già vista da QUESTO client
   game.settings.register(DICT_ID, 'dictLastSeenVersion', { scope: 'client', config: false, type: String, default: '' });
   // elenco delle traduzioni disattivate (chiavi "system:<id>" / "module:<id>")
   game.settings.register(DICT_ID, 'disabledTranslations', { scope: 'world', config: false, type: Array, default: [] });

   // Pulsante "Mostra Patch Note" (per tutti)
   game.settings.registerMenu(DICT_ID, 'dictMostraPatchNote', {
      name: 'Note di versione',
      label: 'Mostra Patch Note',
      hint: 'Rileggi le note di versione di Dictionary Italian Translation.',
      icon: 'fa-solid fa-scroll',
      type: DictPatchNotes,
      restricted: false
   });

   // Pulsante "Traduzioni Attive" (solo GM: la scelta è a livello di mondo)
   game.settings.registerMenu(DICT_ID, 'dictTraduzioniAttive', {
      name: 'Traduzioni attive',
      label: 'Gestisci Traduzioni',
      hint: 'Attiva o disattiva le singole traduzioni dei sistemi e moduli attivi nel tuo mondo (il core non è disattivabile).',
      icon: 'fa-solid fa-language',
      type: DictActiveTranslations,
      restricted: true
   });

   // Pulsante "Segnala" (solo GM)
   game.settings.registerMenu(DICT_ID, 'dictBugReporter', {
      name: 'Segnalazioni',
      label: 'Segnala',
      hint: 'Segnala un errore di traduzione o suggerisci una traduzione.',
      icon: 'fa-solid fa-bug',
      type: DictBugReporter,
      restricted: true
   });
});

/* ---- disattivazione selettiva delle traduzioni --------------------------- */
Hooks.once('i18nInit', async () => {
   let disabled = [];
   try { disabled = game.settings.get(DICT_ID, 'disabledTranslations') || []; } catch (e) { return; }
   if (!disabled.length) return;

   const langs = await dictFetchModuleLanguages();
   const route = foundry.utils.getRoute('/');
   for (const entry of langs) {
      if (entry.lang && entry.lang !== 'it') continue;
      const key = dictEntryKey(entry);
      if (key === 'core' || !disabled.includes(key)) continue;
      try {
         const data = await foundry.utils.fetchJsonWithTimeout(`${route}modules/${DICT_ID}/${entry.path}`, { cache: 'no-store' });
         dictDeepDelete(game.i18n.translations, data);
      } catch (e) {
         console.warn(`Dictionary | impossibile disattivare ${entry.path}`, e);
      }
   }
});

/* ---- auto-mostra patch note all'aggiornamento ---------------------------- */
Hooks.once('ready', () => {
   if (game.user.isGM) {
      try { game.settings.set(DICT_ID, 'version', game.modules.get(DICT_ID)?.version ?? ''); } catch (e) {}
   }
   dictFetchPatchNotes().then(versions => {
      if (!versions.length) return;
      const latest = versions[0].version; // lista già ordinata dalla più recente
      const seen = game.settings.get(DICT_ID, 'dictLastSeenVersion');
      if (!seen) {
         // prima volta con questo sistema: memorizzo senza inondare di storico
         game.settings.set(DICT_ID, 'dictLastSeenVersion', latest);
         return;
      }
      if (dictCompareVersions(latest, seen) > 0) {
         new DictPatchNotes({ daVersione: seen }).render(true);
         game.settings.set(DICT_ID, 'dictLastSeenVersion', latest);
      }
   });
});

/* =========================================================================
 *  FINESTRA "PATCH NOTE" (note di versione dal server)
 * ========================================================================= */
class DictPatchNotes extends HandlebarsApplicationMixin(ApplicationV2) {
   constructor(options = {}) {
      super(options);
      // se valorizzata, mostra solo le note PIÙ RECENTI di questa versione; altrimenti tutte
      this.daVersione = options?.daVersione ?? null;
   }

   static DEFAULT_OPTIONS = {
      id: 'dictPatchNotes',
      tag: 'div',
      classes: ['dictionary-settings'],
      position: { width: 560, height: 'auto' },
      window: { title: 'Note di versione', icon: 'fa-solid fa-scroll', resizable: true }
   };

   static PARTS = {
      body: { template: `modules/${DICT_ID}/templates/dictPatchNotes.html` }
   };

   async _prepareContext(options) {
      let versions = await dictFetchPatchNotes();
      if (this.daVersione) {
         versions = versions.filter(v => dictCompareVersions(v.version, this.daVersione) > 0);
      }
      return { blocchi: versions, vuoto: versions.length === 0 };
   }
}
window.DictPatchNotes = DictPatchNotes;

/* =========================================================================
 *  FINESTRA "TRADUZIONI ATTIVE" (attiva/disattiva le singole traduzioni)
 * ========================================================================= */
class DictActiveTranslations extends HandlebarsApplicationMixin(ApplicationV2) {

   static DEFAULT_OPTIONS = {
      id: 'dictActiveTranslations',
      tag: 'div',
      classes: ['dictionary-settings'],
      position: { width: 600, height: 'auto' },
      window: { title: 'Traduzioni attive', icon: 'fa-solid fa-language', resizable: true },
      actions: { salva: DictActiveTranslations._onSalva }
   };

   static PARTS = {
      body: { template: `modules/${DICT_ID}/templates/dictActiveTranslations.html` }
   };

   async _prepareContext(options) {
      const langs = await dictFetchModuleLanguages();
      const disabled = game.settings.get(DICT_ID, 'disabledTranslations') || [];

      // Raggruppa per chiave (un sistema/modulo può avere più file)
      const gruppi = new Map();
      for (const entry of langs) {
         if (entry.lang && entry.lang !== 'it') continue;
         if (!dictEntryActive(entry)) continue;        // solo ciò che è attivo nel mondo
         const key = dictEntryKey(entry);
         if (!gruppi.has(key)) gruppi.set(key, { key, files: [], entry });
         gruppi.get(key).files.push(entry.path);
      }

      const nomeLeggibile = (g) => {
         if (g.key === 'core') return 'Foundry Core (Italiano)';
         if (g.entry.name) return g.entry.name;
         if (g.entry.system) return game.system?.title || g.entry.system;
         if (g.entry.module) return game.modules.get(g.entry.module)?.title || g.entry.module;
         return g.key;
      };

      const core = [];
      const sistemi = [];
      const moduli = [];
      for (const g of gruppi.values()) {
         const riga = {
            key: g.key,
            nome: nomeLeggibile(g),
            tipo: g.key.startsWith('system:') ? 'Sistema' : (g.key.startsWith('module:') ? 'Modulo' : 'Core'),
            attivo: !disabled.includes(g.key),
            bloccato: g.key === 'core',
            nFile: g.files.length
         };
         if (g.key === 'core') core.push(riga);
         else if (g.key.startsWith('system:')) sistemi.push(riga);
         else moduli.push(riga);
      }
      const collator = new Intl.Collator('it');
      sistemi.sort((a, b) => collator.compare(a.nome, b.nome));
      moduli.sort((a, b) => collator.compare(a.nome, b.nome));

      return {
         core, sistemi, moduli,
         vuoto: (sistemi.length + moduli.length) === 0,
         nSistemi: sistemi.length,
         nModuli: moduli.length
      };
   }

   _onRender(context, options) {
      // aggiorna dal vivo la scritta Acceso/Spento accanto all'interruttore
      this.element.querySelectorAll('input.dict-switch__input:not([disabled])').forEach(inp => {
         inp.addEventListener('change', () => {
            const stato = inp.parentElement.querySelector('.dict-switch__state');
            if (stato) stato.textContent = inp.checked ? 'Acceso' : 'Spento';
         });
      });
   }

   static async _onSalva(event, target) {
      const root = this.element;
      const disabled = [];
      root.querySelectorAll('input.dict-switch__input[data-key]').forEach(inp => {
         if (!inp.checked && inp.dataset.locked !== 'true') disabled.push(inp.dataset.key);
      });
      await game.settings.set(DICT_ID, 'disabledTranslations', disabled);
      ui.notifications.info('Dictionary | Traduzioni aggiornate. Ricarico Foundry per applicare le modifiche.');
      foundry.utils.debouncedReload();
   }
}
window.DictActiveTranslations = DictActiveTranslations;

/* =========================================================================
 *  FINESTRA "SEGNALA" (Bug Report → GitHub via server)
 * ========================================================================= */

/** Genera l'elenco dei Moduli Attivi da allegare alla segnalazione. */
const dictGeneraElModuliAttivi = (separatore = '--', prefissoVer = 'v') => {
   let schema = `<details>§nl§<summary>Moduli Attivi</summary>§nl§§nl§{REPL_MODULES}§nl§</details>`;
   let data = [];
   [...game.modules].forEach(m => { if (m.active) data.push(`${m.title}${separatore}${prefissoVer}${m.version};`); });
   return schema.replace(/{REPL_MODULES}/gi, data.join('§nl§'));
};

class DictBugReporter extends HandlebarsApplicationMixin(ApplicationV2) {

   static REPO = DICT_REPO;
   endpoint = DICT_BUG_ENDPOINT;
   modulo = game.modules.get(DICT_ID);
   campiForm = { titolo: '', spione: '', tipo: '', descrizione: '' };
   onAir = false;
   bugSegnalato = undefined;
   bugURL = undefined;

   static async _onSubmit(event, form, formData) {
      const dati = foundry.utils.expandObject(formData.object);
      const { titolo, descrizione, spione, tipo } = dati.campiForm ?? {};

      if (!titolo || !descrizione) {
         ui.notifications.error('Dictionary | Compila almeno Titolo e Descrizione.');
         return;
      }

      const strDescrizione = `**Descrizione**:§nl§${descrizione}`;
      const strSpione = spione ? `**Inviato da**: ${spione}` : '';
      const datiVersioni = [
         `**Core:** ${game.version}`,
         `**System:** ${game.system.id} v${game.system.version}`,
         `**Dictionary Version:** ${this.modulo.version}`,
      ];
      const descrizioneCompleta = [strSpione, datiVersioni.join('§nl§'), strDescrizione, dictGeneraElModuliAttivi()]
         .join('§nl§ §nl§');

      this.onAir = true;
      await this.render();

      try {
         const res = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8', 'Accept': 'application/json' },
            body: JSON.stringify({
               title: titolo,
               tipo: tipo,
               body: descrizioneCompleta,
               repo: this.endpoints.bugs
            })
         });

         if (res.status === 201) {
            const message = await res.json();
            const messaggioJSON = (typeof message === 'string') ? JSON.parse(message) : message;
            this.bugSegnalato = true;
            this.bugURL = messaggioJSON.html_url;
         } else {
            ui.notifications.error('Dictionary | Invio della segnalazione non riuscito.');
            console.error('Dictionary | errore lato server', res);
         }
      } catch (err) {
         ui.notifications.error('Dictionary | Invio della segnalazione non riuscito.');
         console.error(err);
      } finally {
         this.onAir = false;
         await this.render();
      }
   }

   static DEFAULT_OPTIONS = {
      id: 'dictBugReporter',
      tag: 'form',
      classes: ['dictionary-settings', 'dictionary-bugReporter'],
      position: { width: 600, height: 'auto' },
      window: { title: 'Segnala', icon: 'fa-solid fa-bug', resizable: true },
      form: { handler: DictBugReporter._onSubmit, submitOnChange: false, closeOnSubmit: false }
   };

   static PARTS = {
      form: { template: `modules/${DICT_ID}/templates/dictBugReporter.html` }
   };

   get endpoints() {
      const repo = DictBugReporter.REPO;
      return {
         bugs: `https://api.github.com/repos/${repo}/issues`,
         search: `https://api.github.com/search/issues?q=repo:${repo}`
      };
   }

   async _prepareContext(options) {
      // Tipi specifici di Dictionary
      const tipiBase = [
         { value: 'Errore di traduzione', label: 'Errore di traduzione' },
         { value: 'Suggerisci traduzioni', label: 'Suggerisci traduzioni' }
      ];
      const tipi = tipiBase.map(t => ({ ...t, selected: this.campiForm.tipo === t.value }));
      return {
         campiForm: this.campiForm,
         tipi,
         onAir: this.onAir,
         bugSegnalato: this.bugSegnalato,
         versione: this.modulo.version,
         bugURL: this.bugURL
      };
   }

   _onRender(context, options) {
      this.element.querySelectorAll('a[href]').forEach(a =>
         a.addEventListener('click', () => this.close())
      );
   }
}
window.DictBugReporter = DictBugReporter;
