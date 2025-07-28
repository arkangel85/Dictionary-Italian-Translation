import { b as e } from "./shared.js";
function t() {
  e(`mausritter`),
    (CONFIG.MAUSRITTER.tables = {
      tables: `Tabelle`,
      birthsign: `Topo - Segno di nascita`,
      physicalDetail: `Topo - Caratteristica fisica`,
      coatPattern: `Topo - Motivo del manto`,
      coatColor: `Topo - Colore del manto`,
      firstName: `Nomi dei topi - Nome alla nascita`,
      lastName: `Nomi dei topi - Matronimico`,
      npcAppearance: `Topi del narratore - Aspetto`,
      npcBirthsign: `Topi del narratore - Segno di nascita e inclinazioni`,
      npcQuirk: `Topi del narratore - Peculiarità`,
      npcSocial: `Topi del narratore - Ruolo sociale e compenso per i servizi`,
      npcWants: `Topi del narratore - Desideri`,
      npcRelationship: `Topi del narratore - Relazioni`,
    });
}
export { t as init };
