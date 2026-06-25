import { b as e, c as t } from "./shared.js";
function n() {
  game.settings.register(`it-IT`, `setupRules`, {
    name: `(SWADE) Traduzione delle impostazioni di sistema`,
    hint: `Traduzione automatica delle abilità standard e di altre impostazioni del sistema SWADE. Disattivalo se desideri modificarle manualmente.`,
    type: Boolean,
    default: !0,
    scope: `world`,
    config: !0,
    restricted: !0,
  }),
    game.modules.get(`swade-core-rules`)?.active
      ? e(`swade/core`)
      : game.modules.get(`swpf-core-rules`)?.active
      ? e(`swade/swpf`)
      : e(`swade/basic`),
    r(),
    Hooks.on(`ready`, () => {
      game.modules.get(`swade-core-rules`)?.active &&
        ui.notifications.info(
          `Rilevato il modulo SWADE Core Rules. La traduzione della libreria di base è stata disattivata per evitare conflitti.`
        ),
        game.modules.get(`swpf-core-rules`)?.active &&
          ui.notifications.info(
            `Rilevato il modulo Savage Pathfinder. La traduzione della libreria di base è stata disattivata per evitare conflitti.`
          ),
        i();
    });
}
function r() {
  game.babele &&
    game.babele.registerConverters({
      convertCategory: (e) => {
        if (e) return t(e, o);
      },
      convertRank: (e) => {
        if (e) return t(e, s);
      },
      convertRange: (e) => {
        if (e) return t(e, c);
      },
      convertDuration: (e) => {
        if (e) return t(e, l);
      },
      convertRequirements: (e) => {
        if (!e) return;
        let t = `swade.edges`,
          n = `swade.hindrances`,
          r = `swade.skills`;
        game.modules.get(`swade-core-rules`)?.active &&
          ((t = `swade-core-rules.swade-edges`),
          (n = `swade-core-rules.swade-hindrances`),
          (r = `swade-core-rules.swade-skills`)),
          game.modules.get(`swpf-core-rules`)?.active &&
            ((t = `swpf-core-rules.swpf-edges`),
            (n = `swpf-core-rules.swpf-hindrances`),
            (r = `swpf-core-rules.swpf-skills`));
        let { packs: i } = game.babele,
          o = i.find((e) => e.metadata.id === t).translations,
          s = i.find((e) => e.metadata.id === n).translations,
          c = i.find((e) => e.metadata.id === r).translations;
        return e.map((e) => {
          if (!e.label) return e;
          let t =
            a[e.label] ||
            o[e.label]?.name ||
            s[e.label]?.name ||
            c[e.label]?.name;
          return t && (e.label = t), e;
        });
      },
    });
}
function i() {
  game.settings.get(`it-IT`, `setupRules`) &&
    (game.settings.set(
      `swade`,
      `coreSkills`,
      `Atletica, Percezione, Conoscenza, Furtività, Persuasione`
    ),
    game.settings.set(
      `swade`,
      `vehicleSkills`,
      `Equitazione, Guida, Pilotaggio, Navigazione`
    ),
    game.modules.get(`swade-core-rules`)?.active &&
      game.settings.set(
        `swade`,
        `coreSkillsCompendium`,
        `swade-core-rules.swade-skills`
      ),
    game.modules.get(`swpf-core-rules`)?.active &&
      (game.settings.set(
        `swade`,
        `coreSkillsCompendium`,
        `swpf-core-rules.swpf-skills`
      ),
      game.settings.set(`swade`, `currencyName`, `zm`)),
    game.modules.get(`deadlands-core-rules`)?.active &&
      game.settings.set(`swade`, `currencyName`, `$`));
}
const a = {
    "Arcane Background (Any)": `Dono mistico (qualsiasi)`,
    "Arcane Background (Gifted)": `Dono mistico (fenomeno)`,
    "Arcane Background (Miracles)": `Dono mistico (miracoli)`,
    "Arcane Background (Magic)": `Dono mistico (magia)`,
    "Arcane Background (Psionics)": `Dono mistico (psionica)`,
    "Arcane Background (Weird Science)": `Dono mistico (scienza bizzarra)`,
    "arcane skill": `abilità mistica`,
    "Tough as Nails": `Duro a morire`,
    "Work the Room": `Trascinatore`,
    "Professional in affected Trait": `Professionista nel tratto selezionato`,
    "Expert in affected Trait": `Professionista+ nel tratto selezionato`,
    "maximum die type possible in affected Trait": `valore massimo del dado nel tratto selezionato`,
  },
  o = {
    Background: `Di background`,
    Combat: `Di combattimento`,
    Professional: `Professionali`,
    Social: `Sociali`,
    Weird: `Soprannaturali`,
    Leadership: `Di comando`,
    Power: `Mistici`,
    Legendary: `Leggendari`,
  },
  s = {
    Novice: `Principiante`,
    Seasoned: `Navigato`,
    Veteran: `Veterano`,
    Heroic: `Eroico`,
  },
  c = {
    Self: `se stesso`,
    Touch: `tocco`,
    "Cone Template": `sagoma a cono`,
    "Small Blast Template": `sagoma esplosione piccola`,
    "Medium Blast Template": `sagoma esplosione media`,
    "Large Blast Template": `sagoma esplosione grande`,
    Sm: `Intelligenza`,
    "Sm x 2": `Intelligenza × 2`,
    "Smarts x5 (Sound); Smarts (Silence)": `Intelligenza × 5 (suono); Intelligenza (silenzio)`,
  },
  l = {
    Instant: `Istantanea`,
    Special: `Speciale`,
    "One Round": `1 round`,
    "One Minute": `1 minuto`,
    5: `5 minuti`,
    "5 minutes": `5 minuti`,
    "10 minutes": `10 minuti`,
    "30 Minutes": `30 minuti`,
    "One hour": `1 ora`,
    "One day": `1 giorno`,
    "Until the end of the victim's next turn": `Fino alla fine del turno successivo della vittima`,
    "5 (detect), one hour (conceal)": `5 (rilevamento); 1 ora (occultamento)`,
    "Instant (Sound); 5 (Silence)": `Istantaneo (suono); 5 (silenzio)`,
    "5 (boost); Instant (lower)": `5 (incrementa); Istantaneo (riduce)`,
    "Instant (slot); 5 (speed)": `Istantaneo (slot); 5 (velocità)`,
    "A brief conversation of about five minutes": `Conversazione breve, circa cinque minuti`,
  };
export { n as init };
