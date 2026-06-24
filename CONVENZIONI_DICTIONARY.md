# CONVENZIONI — Modulo "Dictionary Italian Translation" (it-IT)

> Documento gemello di quello di Arkangel Compendium. Raccoglie decisioni, metodo e
> glossari per la manutenzione del modulo di traduzione **Dictionary** per FoundryVTT.

---

## 1. COS'È DICTIONARY E COSA NON DEVE FARE

- **Dictionary** (id modulo: `it-IT`) è un modulo di traduzione multi-sistema per FoundryVTT,
  derivato dal modulo russo **ru-ru** (di phenomen) con permesso del proprietario.
- Traduce in italiano l'interfaccia di **decine di sistemi di gioco** (Blades, SWADE, Dragonbane,
  Coriolis, ecc.) e di **molti moduli** di terze parti.
- **REGOLA FONDAMENTALE: Dictionary NON traduce il sistema dnd5e.**
  Di tutto ciò che è D&D 5e (interfaccia + compendi) se ne occupa **esclusivamente** il modulo
  **Arkangel Compendium**. Questo evita conflitti/sovrapposizioni tra i due moduli.

### Cosa è stato RIMOSSO da Dictionary (per non toccare dnd5e)
- File sistema dnd5e: `i18n/systems/dnd5e-plural.json`, `i18n/systems/alt/dnd5e.json`,
  `i18n/systems/alt/dnd5e-plural.json`.
- Compendi dnd5e: tutta la cartella `compendium/dnd5e/` (48 file: ag, ds, chris, gambit).
- Esmodule: `esm/dnd5e.js`.
- Logica nel codice: in `esm/index.js` svuotato l'array dei file alt di sistema
  (`let a = []`), rimosso l'import dinamico di `dnd5e.js`, rimossa la chiamata
  `if (t === "dnd5e") await e();` (che registrava l'impostazione "Traduzione alternativa D&D5E").
- Voce `languages` dnd5e rimossa dal `module.json`.

### Cosa RESTA in Dictionary (anche se "dnd-correlato")
- I **moduli** di terze parti che girano attorno a D&D ma sono moduli a sé:
  midi-qol, dae, tidy5e-sheet, dnd5e-system-customizer, vision-5e, ecc.
  Questi NON sono "il sistema dnd5e" e restano tradotti da Dictionary.

---

## 2. STRUTTURA DEL MODULO

```
it-IT/
├── module.json            # manifest: id, version, compatibility, languages[]
├── esm/
│   ├── index.js           # loader principale (registra impostazioni, carica i sistemi)
│   ├── shared.js          # helper Babele per i compendi
│   └── <sistema>.js       # un esmodule per sistema con logica dedicata (plurali, hook)
├── i18n/
│   ├── core/              # foundry.json, extras.json, aggettivi
│   ├── modules/           # traduzioni dei moduli di terze parti
│   │   └── alt/           # versioni alternative (NON più usate dopo rimozione dnd5e)
│   └── systems/           # traduzioni dei SISTEMI di gioco  <-- QUI vanno i nuovi sistemi
│       └── alt/           # versioni alternative
├── compendium/            # traduzioni Babele dei contenuti (per sistema)
├── styles/                # CSS per sistema
└── fonts/                 # font tematici
```

### Come si dichiara un sistema/modulo tradotto
Nel `module.json`, array `languages`, una voce per file:
```json
{ "lang": "it", "name": "Italiano", "path": "i18n/systems/<id-sistema>.json" }
```
Il nome del file segue l'**id del sistema** su Foundry (es. `coriolis-tgd.json`).

---

## 3. METODO DI TRADUZIONE (REGOLA DI QUALITÀ)

- **Si traduce SEMPRE dall'INGLESE ORIGINALE del sistema**, MAI dal russo.
  Il russo è già una traduzione: tradurre dal russo = traduzione-di-traduzione = errori.
  Il file inglese si trova in `Data/systems/<id>/lang/en.json` o sul repo GitHub del sistema.
- Procedere **un sistema per volta**, una sessione per sistema (i file sono grandi).
- Mantenere nel file italiano la **struttura annidata IDENTICA all'inglese** (stesse chiavi),
  così ai futuri aggiornamenti del sistema si può rifare il confronto pulito.
- **Preservare i placeholder** `{xxx}` e l'HTML inline esattamente come nell'originale.
- Verificare sempre la copertura (tutte le chiavi EN devono avere la traduzione IT) e
  validare il JSON prima della consegna.

---

## 4. COMPATIBILITÀ FOUNDRY

- Target: **V13 + V14**. Nel `module.json`:
  ```json
  "compatibility": { "minimum": "13", "verified": "14", "maximum": "14" }
  ```
- Il modulo russo di riferimento (ru-ru) è su V14: utile per allineare nomi file e struttura.

---

## 5. SISTEMI NUOVI DA AGGIUNGERE (dal russo, ma tradotti da EN)

Stato di avanzamento dell'allineamento al modulo russo. Sistemi che il russo ha e
Dictionary no, da tradurre **dall'inglese originale**:

| Sistema | id / file | n. stringhe (EN) | Stato |
|---|---|---|---|
| Coriolis: The Great Dark | `coriolis-tgd.json` | 426 | ✅ FATTO (da EN) |
| Cosmere RPG | `cosmere-rpg.json` | ~965 | ⏳ da fare |
| Crucible | `crucible.json` | ~1707 | ⏳ da fare |
| Mothership | `mosh.json` | ~635 | ⏳ da fare |
| Scum and Villainy | `scum-and-villainy.json` | ~342 | ⏳ da fare |
| Slugblaster | `slugblaster.json` | 203 | ⚠️ fatto dal RUSSO, da rifare da EN |
| Warhammer: The Old World | `whtow.json` | ~376 | ⏳ da fare |

> NOTA: i sistemi GIÀ esistenti in Dictionary andranno anch'essi rivisti dall'inglese
> per massima qualità (lavoro futuro, su richiesta).

---

## 6. GLOSSARIO TERMINI — Coriolis: The Great Dark (Year Zero Engine)

| Inglese | Italiano |
|---|---|
| Blight | Corruzione |
| Despair | Disperazione |
| Hope | Speranza |
| Heart | Cuore |
| Supply | Scorta |
| Delve | Incursione |
| Explorer | Esploratore |
| Gear | Equipaggiamento |
| Bird | Uccello |
| Crew | Equipaggio |
| Talent | Talento |
| Affliction | Afflizione |
| Strength/Agility/Empathy/Logic/Insight/Perception | Forza/Agilità/Empatia/Logica/Intuito/Percezione |
| Push (roll) | Forza il Tiro |
| Armor Rating | Valore di Armatura |
| Containment Protocol | Protocollo di Contenimento |

> I nomi propri dei veicoli (Kite, Rover) e i termini di ambientazione senza resa
> consolidata si lasciano invariati (Kite, Rukh).

---

## 7. CONSEGNA / INSTALLAZIONE

- Per ogni sistema tradotto: il file `.json` va in `it-IT/i18n/systems/<id>.json`
  e va aggiunta la voce in `module.json` (sezione `languages`).
- Per evitare modifiche manuali al `module.json`, alla fine si ricostruisce l'intero
  pacchetto Dictionary con tutti i nuovi sistemi già integrati e dichiarati.
- Caricamento via WinSCP; sostituzione dell'intera cartella `it-IT` consigliata per i
  cambiamenti strutturali (fare sempre backup della versione precedente).

---

_Ultimo aggiornamento: rimozione dnd5e completata, compatibilità V14, Coriolis tradotto da EN._
