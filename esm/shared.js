function e(e) {
  let t = game.system.title;
  game.babele
    ? (game.babele.register({
        module: `it-IT`,
        lang: `it`,
        dir: `compendium/${e}`,
      }),
      game.settings.set(`babele`, `showOriginalName`, !0))
    : new Dialog({
        title: `Traduzione dei compendi`,
        content: `<p>Per tradurre i compendi di <b>${t}</b> è necessario attivare i moduli <b>Babele e libWrapper</b><p>`,
        buttons: { done: { label: `Ok` } },
      }).render(!0);
}
function t(e, t) {
  return t[e.trim()] || e;
}
export { e as b, t as c };
