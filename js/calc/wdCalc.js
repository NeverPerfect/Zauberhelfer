// wdCalc.js
// Berechnet die Veränderung der Wirkungsdauer (WD) und die neue WD
// Abhängigkeiten: globals.js (MODS), mods.js, modCount.js

// Initialisierung
function initWdCalc() {
    // Event-Listener für Mod-Checkboxen
    document.querySelectorAll(".mod-check").forEach(cb => {
        cb.addEventListener("change", berechneWd);
    });

    // Event-Listener für WD-Input und Buttons
    document.getElementById("wirkungsdauer")?.addEventListener("input", berechneWd);

    // Event-Listener für Plus/Minus-Buttons von WD
    document.querySelectorAll('.number-input button[data-target="wirkungsdauer"]').forEach(button => {
        button.addEventListener("click", () => {
            setTimeout(berechneWd, 10); // Kurze Verzögerung, um den geänderten Wert zu erfassen
        });
    });

    // Event-Listener für dynamische Mod-Optionen
    document.addEventListener("change", (e) => {
        if (e.target.classList.contains("mod-value")) {
            berechneWd();
        }
    });

    // Erstmalige Berechnung
    berechneWd();
}

// Berechnet die Veränderung der WD und die neue WD
function berechneWd() {
    let wdOriginal = parseInt(document.getElementById("wirkungsdauer").value) || 1;
    let wdDiff = 0;
    let wdNeu = wdOriginal;

    // 1. Verdoppelung der Wirkungsdauer
    const dauerxChecked = document.querySelector('.mod-check[data-id="dauerx"]')?.checked;
    if (dauerxChecked) {
        const anzahl = parseInt(document.querySelector('#opt_dauerx .mod-value')?.value) || 1;
        wdDiff += wdOriginal * 1 * anzahl; // +100% pro Anzahl
    }

    // 2. Halbierung der Wirkungsdauer
    const dauerhChecked = document.querySelector('.mod-check[data-id="dauerh"]')?.checked;
    if (dauerhChecked) {
        const anzahl = parseInt(document.querySelector('#opt_dauerh .mod-value')?.value) || 1;
        wdDiff -= wdOriginal * 0.5 * anzahl; // -50% pro Anzahl
    }

    // Berechnung der neuen WD
    wdNeu = wdOriginal + wdDiff;

    // Ausgabe der WD-Veränderung (ohne farbliche Markierung)
    const wdDiffElement = document.getElementById("wd-diff");
    wdDiffElement.textContent = wdDiff >= 0 ? `+${wdDiff}` : wdDiff;

    // Ausgabe der neuen WD
    const wdNeuElement = document.getElementById("wd-neu");
    wdNeuElement.textContent = wdNeu;

    // Aktualisiere globale Variable für weitere Berechnungen
    aktuelleBerechnung.neueWirkungsdauer = wdNeu;
}

// Export für andere Module
window.initWdCalc = initWdCalc;
