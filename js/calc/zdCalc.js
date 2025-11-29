// zdCalc.js
// Berechnet die modifikation und aktuelle Zauberdauer

// Initialisierung
function initZdCalc() {
    // Event-Listener für INI-Input (automatische Checkbox-Aktivierung bei INI < 0)
    function handleIniChange() {
        const ini = parseInt(iniInput.value) || 0;
        const iniModCheckbox = document.querySelector('.mod-check[data-id="inimod"]');
        if (iniModCheckbox) {
            iniModCheckbox.checked = ini < 0;
            if (ini < 0) iniModCheckbox.dispatchEvent(new Event('change'));
        }
    }

    // Event-Listener für INI-Input und Buttons
    iniInput?.addEventListener("input", () => {
        handleIniChange();
        berechneZd();
    });
    document.querySelectorAll('.number-input button[data-target="ini"]')?.forEach(button => {
        button.addEventListener("click", () => {
            setTimeout(handleIniChange, 10);
            berechneZd();
        });
    });

    // Event-Listener für Mod-Checkboxen
    document.querySelectorAll(".mod-check").forEach(cb => {
        cb.addEventListener("change", berechneZd);
    });

    // Event-Listener für Sonderfertigkeiten (Zauberroutine)
    document.getElementById("sf_routine")?.addEventListener("change", (e) => {
        zauberroutine = e.target.checked;
        berechneZd();
    });

    // Event-Listener für Repräsentation (Dropdown)
    repraesentationSelect?.addEventListener("change", berechneZd);

    // Event-Listener für Zauberdauer-Input und Buttons
    zauberdauerInput?.addEventListener("input", (e) => {
        zauberdauerOriginal = parseInt(e.target.value) || 0;
        zauberdauerNeu = zauberdauerOriginal; // Zurücksetzen
        berechneZd();
    });

    // Event-Listener für Plus/Minus-Buttons von Zauberdauer
    document.querySelectorAll('.number-input button[data-target="zauberdauer"]')?.forEach(button => {
        button.addEventListener("click", () => {
            setTimeout(() => {
                zauberdauerOriginal = parseInt(zauberdauerInput.value) || 0;
                zauberdauerNeu = zauberdauerOriginal; // Zurücksetzen
                berechneZd();
            }, 10); // Kurze Verzögerung, um den geänderten Wert zu erfassen
        });
    });

    // Event-Listener für BE-Input (inkl. Plus/Minus-Buttons)
    const beInput = document.getElementById("be");
    beInput?.addEventListener("input", berechneZd);
    document.querySelectorAll('.number-input button[data-target="be"]')?.forEach(button => {
        button.addEventListener("click", berechneZd);
    });

    // Event-Listener für dynamische Mod-Optionen
    document.addEventListener("change", (e) => {
        if (
            e.target.classList.contains("mod-value") ||
            e.target.classList.contains("mod-ziele") ||
            e.target.classList.contains("mod-mr") ||
            e.target.classList.contains("mod-start") ||
            e.target.classList.contains("mod-ziel") ||
            e.target.classList.contains("mod-zd") ||
            e.target.classList.contains("var-zd")
        ) {
            berechneZd();
        }
    });

    // Event-Listener für Varianten (Hinzufügen/Entfernen)
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-var") || e.target.classList.contains("remove-var")) {
            setTimeout(berechneZd, 50);
        }
    });

    // Erstmalige Berechnung
    berechneZd();
}

// Berechnet die Modifikationen für die Zauberdauer (ZD)
function berechneZd() {
    let zdMod = 0; // Modifikator für ZD
    zauberdauerNeu = zauberdauerOriginal; // Globale Variable zurücksetzen

    // 1. Veränderte Technik
    const techChecked = document.querySelector('.mod-check[data-id="tech"]')?.checked;
    if (techChecked) {
        const anzahl = parseInt(document.querySelector('#opt_tech .mod-value')?.value) || 1;
        zdMod += 3 * anzahl;
    }

    // 2. Veränderte Technik (zentral)
    const techzChecked = document.querySelector('.mod-check[data-id="techz"]')?.checked;
    if (techzChecked) {
        const anzahl = parseInt(document.querySelector('#opt_techz .mod-value')?.value) || 1;
        zdMod += 3 * anzahl;
    }

    // 3. Halbierte Zauberdauer
    const halbdauerChecked = document.querySelector('.mod-check[data-id="halbdauer"]')?.checked;
    if (halbdauerChecked) {
        const anzahl = parseInt(document.querySelector('#opt_halbdauer .mod-value')?.value) || 1;
        for (let i = 0; i < anzahl; i++) {
            zauberdauerNeu = Math.max(1, Math.floor(zauberdauerNeu / 2));
        }
    }

    // 4. Verdoppelte Zauberdauer
    const doppeldauerChecked = document.querySelector('.mod-check[data-id="doppeldauer"]')?.checked;
    if (doppeldauerChecked && !zauberroutine) { // Keine Verdopplung bei Zauberroutine
        zauberdauerNeu *= 2;
    }

    // 5. Erzwingen
    const erzwingenChecked = document.querySelector('.mod-check[data-id="erzwingen"]')?.checked;
    if (erzwingenChecked) {
        const aspWert = parseInt(document.querySelector('#opt_erzwingen .mod-value')?.value) || 1;
        const kategorien = Math.log2(aspWert);
        zdMod += 1 * kategorien;
    }

    // 6. Kosten einsparen
    const kostenChecked = document.querySelector('.mod-check[data-id="kosten"]')?.checked;
    if (kostenChecked) {
        const prozent = parseInt(document.querySelector('#opt_kosten .mod-value')?.value) || 0;
        zdMod += 1 * (prozent / 10);
    }

    // 7. Unfreiwillig statt freiwillig
    const unfreiwChecked = document.querySelector('.mod-check[data-id="unfreiw"]')?.checked;
    if (unfreiwChecked) {
        zdMod += 1;
    }

    // 8. Freiwillig statt unfreiwillig
    const freiwChecked = document.querySelector('.mod-check[data-id="freiw"]')?.checked;
    if (freiwChecked) {
        zdMod += 1;
    }

    // 9. Vergrößerung der Reichweite
    const reichweitexChecked = document.querySelector('.mod-check[data-id="reichweitex"]')?.checked;
    if (reichweitexChecked) {
        const start = parseInt(document.querySelector('#opt_reichweitex .mod-start')?.value) || 1;
        const ziel = parseInt(document.querySelector('#opt_reichweitex .mod-ziel')?.value) || 1;
        zdMod += 1 * (ziel - start);
    }

    // 10. Verkleinerung der Reichweite
    const reichweitekChecked = document.querySelector('.mod-check[data-id="reichweitek"]')?.checked;
    if (reichweitekChecked) {
        const start = parseInt(document.querySelector('#opt_reichweitek .mod-start')?.value) || 1;
        const ziel = parseInt(document.querySelector('#opt_reichweitek .mod-ziel')?.value) || 1;
        zdMod += 1 * (start - ziel);
    }

    // 11. Verdoppelung der Wirkungsdauer
    const dauerxChecked = document.querySelector('.mod-check[data-id="dauerx"]')?.checked;
    if (dauerxChecked) {
        const anzahl = parseInt(document.querySelector('#opt_dauerx .mod-value')?.value) || 1;
        zdMod += 1 * anzahl;
    }

    // 12. Halbierung der Wirkungsdauer
    const dauerhChecked = document.querySelector('.mod-check[data-id="dauerh"]')?.checked;
    if (dauerhChecked) {
        const anzahl = parseInt(document.querySelector('#opt_dauerh .mod-value')?.value) || 1;
        zdMod += 1 * anzahl;
    }

    // 13. Aufrechterhalten ➜ feste Dauer
    const aufFestChecked = document.querySelector('.mod-check[data-id="auf_fest"]')?.checked;
    if (aufFestChecked) {
        zdMod += 1;
    }

    // 14. Varianten (ZD-Wert aus Varianten-Feldern)
    const variantenChecked = document.querySelector('.mod-check[data-id="varianten"]')?.checked;
    if (variantenChecked) {
        const varItems = document.querySelectorAll('#opt_varianten .var-item');
        varItems.forEach(item => {
            const zd = parseInt(item.querySelector('.var-zd')?.value) || 0;
            zdMod += zd;
        });
    }

    // 15. Sonstige Modifikationen (ZD-Wert)
    const sonstigemodsChecked = document.querySelector('.mod-check[data-id="sonstigemods"]')?.checked;
    if (sonstigemodsChecked) {
        const zd = parseInt(document.querySelector('#opt_sonstigemods .mod-zd')?.value) || 0;
        zdMod += zd;
    }

    // 16. BE > 2
    const beChecked = document.querySelector('.mod-check[data-id="bemod"]')?.checked;
    if (beChecked) {
        const be = parseInt(document.getElementById("be")?.value) || 0;
        if (be > 2) {
            zdMod += be - 2;
        }
    }

    // 17. Zauber misslungen
    const missChecked = document.querySelector('.mod-check[data-id="miss"]')?.checked;
    if (missChecked && !zauberroutine) { // Keine Erhöhung bei Zauberroutine
        const anzahl = parseInt(document.querySelector('#opt_miss .mod-value')?.value) || 1;
        zdMod += 1 * anzahl;
    }

    // 18. INI < 0
    const ini = parseInt(iniInput.value) || 0;
    if (ini < 0) {
        zauberdauerNeu *= 2; // Verdopplung der ZD
    }

    // Sonderfall: Gildenmagie
    if (repraesentationSelect.value === "gildenmagisch" && doppeldauerChecked) {
        zauberdauerNeu = Math.floor(zauberdauerNeu * 0.75); // 25% Erleichterung
    }

    // Berechnung der finalen ZD
    zauberdauerNeu += zdMod;

    // Ausgabe der Differenz (ZD +/-)
    const diff = zauberdauerNeu - zauberdauerOriginal;
    zdDiffElement.innerHTML = diff >= 0
        ? `<span style="color: red;">+${diff}</span>`
        : `<span style="color: green;">${diff}</span>`;

    // Ausgabe der neuen ZD
    zdNeuElement.textContent = zauberdauerNeu;

    // Warnmeldungen
    let warnungen = [];
    if (zauberdauerNeu <= 0) {
        warnungen.push("Die Zauberdauer darf nicht 0 oder negativ sein!");
    }
    zdWarnungElement.innerHTML = warnungen.join("<br>") || "";
}

// Export für andere Module
window.initZdCalc = initZdCalc;
