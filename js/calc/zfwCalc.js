// zfwCalc.js
// Abhängigkeiten: globals.js (MODS), mods.js, modCount.js

// DOM-Elemente
const zfwDiffElement = document.getElementById("zfw-diff");
const zfwNeuElement = document.getElementById("zfw-neu");
const zfwWarnungElement = document.getElementById("zfw-warnung"); // Neuer Container

// Globale Variablen
let zfwOriginal = parseInt(zfwInput.value) || 10;
zauberroutine = false;

// Initialisierung
function initZfwCalc() {
    // Event-Listener für Mod-Checkboxen
    document.querySelectorAll(".mod-check").forEach(cb => {
        cb.addEventListener("change", berechneZfw);
    });

    // Event-Listener für Sonderfertigkeiten
    document.getElementById("sf_routine")?.addEventListener("change", (e) => {
        zauberroutine = e.target.checked;
        berechneZfw();
    });

    // Event-Listener für Repräsentation (Dropdown)
    repraesentationSelect?.addEventListener("change", berechneZfw);

    // Event-Listener für ZfW-Input
    zfwInput?.addEventListener("input", (e) => {
        zfwOriginal = parseInt(e.target.value) || 0;
        berechneZfw();
    });

    // Event-Listener für BE-Input (inkl. Plus/Minus-Buttons)
    const beInput = document.getElementById("be");
    beInput?.addEventListener("input", berechneZfw);
    // Plus/Minus-Buttons für BE
    document.querySelectorAll('.number-input button[data-target="be"]')?.forEach(button => {
        button.addEventListener("click", berechneZfw);
    });

    // Event-Listener für dynamische Mod-Optionen
    document.addEventListener("change", (e) => {
        if (
            e.target.classList.contains("mod-value") ||
            e.target.classList.contains("mod-ziele") ||
            e.target.classList.contains("mod-mr") ||
            e.target.classList.contains("mod-start") ||
            e.target.classList.contains("mod-ziel") ||
            e.target.classList.contains("mod-zfw") ||
            e.target.classList.contains("var-zfw")
        ) {
            berechneZfw();
        }
    });

    // Event-Listener für Varianten (Hinzufügen/Entfernen)
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-var") || e.target.classList.contains("remove-var")) {
            setTimeout(berechneZfw, 50);
        }
    });

    // Erstmalige Berechnung
    berechneZfw();
}

// Berechnet die Erschwernis/Erleichterung
function berechneZfw() {
    let erschwernis = 0;
    let erleichterung = 0;

    // 1. Veränderte Technik
    const techChecked = document.querySelector('.mod-check[data-id="tech"]')?.checked;
    if (techChecked) {
        const anzahl = parseInt(document.querySelector('#opt_tech .mod-value')?.value) || 1;
        erschwernis += 7 * anzahl;
    }

    // 2. Veränderte Technik (zentral)
    const techzChecked = document.querySelector('.mod-check[data-id="techz"]')?.checked;
    if (techzChecked) {
        const anzahl = parseInt(document.querySelector('#opt_techz .mod-value')?.value) || 1;
        erschwernis += 12 * anzahl;
    }

    // 3. Halbierte Zauberdauer
    const halbdauerChecked = document.querySelector('.mod-check[data-id="halbdauer"]')?.checked;
    if (halbdauerChecked) {
        const anzahl = parseInt(document.querySelector('#opt_halbdauer .mod-value')?.value) || 1;
        erschwernis += 5 * anzahl;
    }

    // 4. Verdoppelte Zauberdauer
    const doppeldauerChecked = document.querySelector('.mod-check[data-id="doppeldauer"]')?.checked;
    if (doppeldauerChecked) {
        erleichterung += -3; // Standard-Erleichterung
        // Gildenmagie: zusätzliche Erleichterung
        if (repraesentationSelect.value === "gildenmagisch") {
            erleichterung += -1; // Gesamt: -4
        }
    }

    // 5. Erzwingen
    const erzwingenChecked = document.querySelector('.mod-check[data-id="erzwingen"]')?.checked;
    if (erzwingenChecked) {
        const aspWert = parseInt(document.querySelector('#opt_erzwingen .mod-value')?.value) || 1;
        const kategorien = Math.log2(aspWert);
        erleichterung += -1 * kategorien;
    }

    // 6. Kosten einsparen
    const kostenChecked = document.querySelector('.mod-check[data-id="kosten"]')?.checked;
    if (kostenChecked) {
        const prozent = parseInt(document.querySelector('#opt_kosten .mod-value')?.value) || 0;
        erschwernis += 3 * (prozent / 10);
    }

    // 7. Unfreiwillig statt freiwillig
    const unfreiwChecked = document.querySelector('.mod-check[data-id="unfreiw"]')?.checked;
    if (unfreiwChecked) {
        const ziele = parseInt(document.querySelector('#opt_unfreiw .mod-ziele')?.value) || 1;
        const mr = parseInt(document.querySelector('#opt_unfreiw .mod-mr')?.value) || 1;
        if (ziele > 1) {
            erschwernis += 5 + mr + (ziele - 1);
        } else {
            erschwernis += 5 + mr;
        }
    }

    // 8. Freiwillig statt unfreiwillig
    const freiwChecked = document.querySelector('.mod-check[data-id="freiw"]')?.checked;
    if (freiwChecked) {
        const ziele = parseInt(document.querySelector('#opt_freiw .mod-ziele')?.value) || 1;
        const mr = parseInt(document.querySelector('#opt_freiw .mod-mr')?.value) || 1;
        if (ziele > 1) {
            erleichterung += -3 - Math.floor(mr / 2) - (ziele - 1);
        } else {
            erleichterung += -2 - Math.floor(mr / 2);
        }
    }

    // 9. Vergrößerung der Reichweite
    const reichweitexChecked = document.querySelector('.mod-check[data-id="reichweitex"]')?.checked;
    if (reichweitexChecked) {
        const start = parseInt(document.querySelector('#opt_reichweitex .mod-start')?.value) || 1;
        const ziel = parseInt(document.querySelector('#opt_reichweitex .mod-ziel')?.value) || 1;
        erschwernis += 5 * (ziel - start);
    }

    // 10. Verkleinerung der Reichweite
    const reichweitekChecked = document.querySelector('.mod-check[data-id="reichweitek"]')?.checked;
    if (reichweitekChecked) {
        const start = parseInt(document.querySelector('#opt_reichweitek .mod-start')?.value) || 1;
        const ziel = parseInt(document.querySelector('#opt_reichweitek .mod-ziel')?.value) || 1;
        erschwernis += 3 * (ziel - start);
    }

    // 11. Verdoppelung der Wirkungsdauer
    const dauerxChecked = document.querySelector('.mod-check[data-id="dauerx"]')?.checked;
    if (dauerxChecked) {
        const anzahl = parseInt(document.querySelector('#opt_dauerx .mod-value')?.value) || 1;
        erschwernis += 7 * anzahl;
    }

    // 12. Halbierung der Wirkungsdauer
    const dauerhChecked = document.querySelector('.mod-check[data-id="dauerh"]')?.checked;
    if (dauerhChecked) {
        const anzahl = parseInt(document.querySelector('#opt_dauerh .mod-value')?.value) || 1;
        erschwernis += 3 * anzahl; // Erschwernis pro ausgewählter Anzahl
    }


    // 13. Aufrechterhalten ➜ feste Dauer
    const aufFestChecked = document.querySelector('.mod-check[data-id="auf_fest"]')?.checked;
    if (aufFestChecked) {
        erschwernis += 7;
    }

    // 14. Varianten
    const variantenChecked = document.querySelector('.mod-check[data-id="varianten"]')?.checked;
    if (variantenChecked) {
        const varItems = document.querySelectorAll('#opt_varianten .var-item');
        varItems.forEach(item => {
            const zfw = parseInt(item.querySelector('.var-zfw')?.value) || 0;
            erschwernis += zfw;
        });
    }

    // 15. Sonstige Modifikationen
    const sonstigemodsChecked = document.querySelector('.mod-check[data-id="sonstigemods"]')?.checked;
    if (sonstigemodsChecked) {
        const zfw = parseInt(document.querySelector('#opt_sonstigemods .mod-zfw')?.value) || 0;
        erschwernis += zfw;
    }

    // 16. BE > 2
    const beChecked = document.querySelector('.mod-check[data-id="bemod"]')?.checked;
    if (beChecked) {
        const be = parseInt(document.getElementById("be")?.value) || 0;
        if (be > 2) {
            erschwernis += be - 2;
        }
    }

    // 17. Zauber misslungen
    const missChecked = document.querySelector('.mod-check[data-id="miss"]')?.checked;
    if (missChecked && !zauberroutine) {
        const anzahl = parseInt(document.querySelector('#opt_miss .mod-value')?.value) || 1;
        erschwernis += 3 * anzahl;
    }

    // Sonderfall: Gildenmagie
    if (repraesentationSelect.value === "gildenmagisch") {
        // Erschwernisse halbieren (außer Varianten, Sonstige Modifikationen, BE>2, Zauber misslungen)
        const nichtHalbierbareErschwernis =
            (variantenChecked ? getVariantenErschwernis() : 0) +
            (sonstigemodsChecked ? (parseInt(document.querySelector('#opt_sonstigemods .mod-zfw')?.value) || 0) : 0) +
            (beChecked && be > 2 ? (be - 2) : 0) +
            (missChecked && !zauberroutine ? (3 * (parseInt(document.querySelector('#opt_miss .mod-value')?.value) || 1)) : 0);

        const halbierbareErschwernis = erschwernis - nichtHalbierbareErschwernis;
        erschwernis = nichtHalbierbareErschwernis + Math.round(halbierbareErschwernis / 2);
    }

    // Berechnung der Differenz
    const diff = erleichterung - erschwernis;
    zfwDiffElement.innerHTML = diff >= 0
        ? `<span style="color: green;">${diff}</span>`
        : `<span style="color: red;">${diff}</span>`;

    // Berechnung des neuen ZfW
    const zfwNeu = zfwOriginal + diff;
    zfwNeuElement.textContent = zfwNeu;

    // Warnmeldungen (nur ZfW-spezifisch)
    let warnungen = [];
    if (erschwernis - erleichterung > zfwOriginal) {
        warnungen.push("Die Summe der Erschwernisse (nach Abzug der Erleichterungen) darf nicht höher sein als der ursprüngliche ZfW!");
    }
    zfwWarnungElement.innerHTML = warnungen.join("<br>") || "";
}

// Hilfsfunktion: Erschwernis aus Varianten berechnen
function getVariantenErschwernis() {
    let erschwernis = 0;
    const varItems = document.querySelectorAll('#opt_varianten .var-item');
    varItems.forEach(item => {
        const zfw = parseInt(item.querySelector('.var-zfw')?.value) || 0;
        erschwernis += zfw;
    });
    return erschwernis;
}

// Export für andere Module
window.initZfwCalc = initZfwCalc;
