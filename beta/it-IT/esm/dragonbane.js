import { b as e } from "./shared.js";
function t() {
  e(`dragonbane`), n();
}
function n() {
  let e = null,
    t = () => {
      if (e) return e;
      try {
        let t = game.babele.translations;
        if (!t || t.length < 1)
          return console.warn(`Dragonbane: Nessuna traduzione Babele trovata`), null;
        let n = {};
        return (
          t.forEach((e, t) => {
            if (!e.entries) {
              console.log(`Dragonbane: La traduzione ${t} non contiene voci`);
              return;
            }
            Object.keys(e.entries).forEach((t) => {
              let r = e.entries[t];
              r?.items &&
                (console.log(`Dragonbane: Elementi trovati nel pacchetto "${t}"`),
                Object.keys(r.items).forEach((e) => {
                  let t = r.items[e];
                  t?.name && (n[e] = t.name);
                }));
            });
          }),
          Object.keys(n).length === 0
            ? (console.warn(
                `Dragonbane: Nessuna corrispondenza di traduzione trovata in nessuna delle traduzioni Babele`
              ),
              null)
            : (console.log(
                `Dragonbane: Cached ${
                  Object.keys(n).length
                } mappature di traduzione da ${t.length} pacchetti di traduzione`
              ),
              (e = n),
              n)
        );
      } catch (e) {
        return (
          console.error(`Dragonbane: Errore durante la creazione della mappa di traduzione:`, e), null
        );
      }
    };
  game.babele.registerConverters({
    translateItemList(e) {
      if (!e || typeof e != `string`) return e || ``;
      let n = t();
      return n
        ? e
            .split(`,`)
            .map((e) => {
              let t = e.trim();
              return n[t] || t;
            })
            .sort((e, t) => e.localeCompare(t))
            .join(`, `)
        : e;
    },
  });
}
export { t as init };
