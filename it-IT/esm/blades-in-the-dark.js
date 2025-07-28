import { b as e, c as t } from "./shared.js";
function n() {
  e(`blades-in-the-dark`),
    r(),
    Hooks.on(`ready`, () => {
      game.system.version.startsWith(`4`) &&
        ui.notifications.warn(
          `Stai utilizzando una versione obsoleta del sistema. Per il corretto funzionamento, aggiorna il sistema alla versione 5.0 o superiore.`
        );
    });
}
function r() {
  game.babele &&
    game.babele.registerConverters({
      convertClass: (e) => {
        if (e) return t(e, i);
      },
    });
}
const i = {
  Cutter: `Tagliagole`,
  Ghost: `Fantasma`,
  Hound: `Segugio`,
  Hull: `Automa`,
  Leech: `Esperto`,
  Lurk: `Furtivo`,
  Slide: `Attore`,
  Spider: `Burattinaio`,
  Vampire: `Vampiro`,
  Whisper: `Mistico`,
  Assassins: `Assassini`,
  Bravos: `Bravi`,
  Cult: `Cultisti`,
  Hawkers: `Spacciatori`,
  Shadows: `Ombre`,
  Smugglers: `Contrabbandieri`,
};
export { n as init };
