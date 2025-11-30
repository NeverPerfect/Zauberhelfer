// globals.js
// Speichert alle global genutzen Variablen und DOM Elemente

// ---------------------- GLOBALE VARIABLEN ----------------------
let gespeicherteZauber = [];
let zauberroutine = false;
let matrixVerstaendnis = false;
let modFokusAnzahl = 0;
let modFokusAngewandt = false;
let kugelAnzahl = 0;
let kugelAngewandt = false;
let merkFokusAnzahl = 0;
let merkFokusAngewandt = false;
let zauberdauerOriginal = 1;
let zfwOriginal = 0;
let zauberdauerNeu = 0;
let aktuelleBerechnung = {
    neueZauberdauer: 0,
    neueKosten: 0,
    neueWirkungsdauer: 0
};

// DOM-Elemente
const repraesentationSelect = document.getElementById("repraesentation-select");
const zfwInput = document.getElementById("zfw");
const zauberdauerInput = document.getElementById("zauberdauer");
const iniInput = document.getElementById("ini");
const beInput = document.getElementById("be");
const zfwDiffElement = document.getElementById("zfw-diff");
const zfwNeuElement = document.getElementById("zfw-neu");
const zfwWarnungElement = document.getElementById("zfw-warnung");
const modsAnzahlElement = document.getElementById("mods-anzahl");
const modsWarnungElement = document.getElementById("modcount-warnung");
const zdDiffElement = document.getElementById("zd-diff");
const zdNeuElement = document.getElementById("zd-neu");
const zdWarnungElement = document.getElementById("zd-warnung");

// Modifikationen
const MODS = [
    { id: "tech", name: "Veränderte Technik", type: "multi_fixed", cost: 7, dauer: 3, dropdown: [1, 2, 3, 4] },
    { id: "techz", name: "Veränderte Technik (zentral)", type: "multi_fixed", cost: 12, dauer: 3, dropdown: [1, 2, 3, 4] },
    { id: "halbdauer", name: "Zauberdauer halbieren", type: "multi_var", cost: 5, dauer: "-50%" },
    { id: "doppeldauer", name: "Zauberdauer verdoppeln", type: "single", cost: -4, dauer: "+100%" },
    { id: "erzwingen", name: "Erzwingen (AsP)", type: "asp", dauer: "+1 je", noCombo: "kosten" },
    { id: "kosten", type: "kosten" },
    { id: "unfreiw", type: "ziel" },
    { id: "freiw", type: "ziel_frei" },
    { id: "reichweitex", type: "reichweite" },
    { id: "reichweitek", type: "reichweite" },
    { id: "dauerx", name: "Wirkungsdauer verdoppeln", type: "multi", cost: 7, dauer: "+1" },
    { id: "dauerh", name: "Wirkungsdauer halbieren", type: "multi", cost: 3, dauer: "+1" },
    { id: "auf_fest", name: "Aufrechterhalten ➜ feste Dauer", type: "single", cost: 7, dauer: "+1" },
    { id: "varianten", name: "Varianten", type: "varianten" },
    { id: "stab", name: "Zauber in Stab speichern", type: "single", cost: 2 },
    { id: "fremdrepraesentation", name: "Zauber in fremder Repräsentation", type: "single", cost: 4, dauer: 0 },
    { id: "miss", name: "Zauber misslungen?", type: "multi_var", cost: 3, dauer: 1, dropdown: [1, 2, 3, 4] },
    { id: "sonstigemods", name: "Sonstige Modifikationen", type: "sonstiges" }
];