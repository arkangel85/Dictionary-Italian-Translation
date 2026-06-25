import { b as e, c as t } from "./shared.js";
function n() {
  e(`band-of-blades`), r();
}
function r() {
  game.babele &&
    game.babele.registerConverters({
      classConverter: (e) => {
        if (e) return t(e, i);
      },
      effectsConverter: (e, t) => {
        if (!(!e || !t))
          return e.map((e) => (e.name && t[e.name] && (e.name = t[e.name]), e));
      },
    });
}
const i = {
  Heavy: `Oplita`,
  Medic: `Medico`,
  Officer: `Ufficiale`,
  Rookie: `Recluta`,
  Scout: `Esploratore`,
  Sniper: `Cecchino`,
  Soldier: `Soldato`,
  Panyar: `Panyar`,
  Bartan: `Bartan`,
  Orite: `Orite`,
  Zemyati: `Zemyati`,
  General: `Generale`,
};
export { n as init };
