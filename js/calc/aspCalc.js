// aspCalc.js
// Berechnet die AsP-Kosten für einen Zauber
// Abhängigkeiten: globals.js (MODS), mods.js, modCount.js

// Initialisierung
function initAspCalc() {
    // Event-Listener für Inputs und Buttons
    document.getElementById("kosten")?.addEventListener("input", berechneAsp);
    document.getElementById("kosteneinheit")?.addEventListener("input", berechneAsp);
    document.getElementById("anzahl-einheiten")?.addEventListener("input", berechneAsp);
    document.querySelectorAll('.number-input button[data-target="kosten"], .number-input button[data-target="kosteneinheit"], .number-input button[data-target="anzahl-einheiten"]').forEach(button => {
        button.addEventListener("click", () => {
            setTimeout(berechneAsp, 10);
        });
    });
    // Event-Listener für Mod-Checkboxen
    document.querySelectorAll(".mod-check").forEach(cb => {
        cb.addEventListener("change", berechneAsp);
    });
    // Event-Listener für Erzwingen-Dropdown
    document.getElementById("opt_erzwingen")?.addEventListener("change", berechneAsp);
    // Event-Listener für Kosten einsparen
    document.querySelector('.mod-check[data-id="kosten"]')?.addEventListener("change", berechneAsp);
    document.getElementById("opt_kosten")?.addEventListener("change", berechneAsp);
    // Event-Listener für Sonderfertigkeiten (Kraftfokus/Kraftkontrolle)
    document.addEventListener("change", (e) => {
        if (e.target.id === "sf_krftkontr_used" || e.target.id === "sf_krftfokus_used") {
            berechneAsp();
        }
    });
    // Event-Listener für Varianten und Sonstige Modifikationen
    document.addEventListener("change", (e) => {
        if (
            e.target.classList.contains("mod-value") ||
            e.target.classList.contains("var-asp") ||
            e.target.classList.contains("mod-asp") ||
            e.target.classList.contains("var-aspx") ||
            e.target.classList.contains("mod-aspx")
        ) {
            berechneAsp();
        }
    });
    // Event-Listener für Varianten (Hinzufügen/Entfernen)
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-var") || e.target.classList.contains("remove-var")) {
            setTimeout(berechneAsp, 50);
        }
    });
    // Erstmalige Berechnung
    berechneAsp();
}

// Berechnet die AsP-Kosten
function berechneAsp() {
    // 1. Grundkosten (inkl. Erzwingen, Varianten, Sonstige Modifikationen)
    let grundkosten = parseInt(document.getElementById("kosten")?.value) || 0;
    let erzwingenWert = 0;
    const erzwingenChecked = document.querySelector('.mod-check[data-id="erzwingen"]')?.checked;
    if (erzwingenChecked) {
        erzwingenWert = parseInt(document.querySelector('#opt_erzwingen .mod-value')?.value) || 0;
    }

    // 2. Varianten: AsP und AsP/X summieren
    let variantenAsp = 0;
    let variantenAspX = 0;
    const variantenChecked = document.querySelector('.mod-check[data-id="varianten"]')?.checked;
    if (variantenChecked) {
        const varItems = document.querySelectorAll('#opt_varianten .var-item');
        varItems.forEach(item => {
            const asp = parseInt(item.querySelector('.var-asp')?.value) || 0;
            const aspx = parseInt(item.querySelector('.var-aspx')?.value) || 0;
            variantenAsp += asp;
            variantenAspX += aspx;
        });
    }

    // 3. Sonstige Modifikationen: AsP und AsP/X summieren
    let sonstigeAsp = 0;
    let sonstigeAspX = 0;
    const sonstigemodsChecked = document.querySelector('.mod-check[data-id="sonstigemods"]')?.checked;
    if (sonstigemodsChecked) {
        const asp = parseInt(document.querySelector('#opt_sonstigemods .mod-asp')?.value) || 0;
        const aspx = parseInt(document.querySelector('#opt_sonstigemods .mod-aspx')?.value) || 0;
        sonstigeAsp += asp;
        sonstigeAspX += aspx;
    }

    // 4. Grundkosten (inkl. Erzwingen, Varianten, Sonstige Modifikationen)
    let grundkostenGesamt = grundkosten + erzwingenWert + variantenAsp + sonstigeAsp;

    // 5. Kraftfokus/Kraftkontrolle (jeweils -1 auf Grundkosten)
    const krftfokusAngewandt = document.getElementById("sf_krftfokus_used")?.checked;
    const krftkontrAngewandt = document.getElementById("sf_krftkontr_used")?.checked;
    if (krftfokusAngewandt) grundkostenGesamt = Math.max(1, grundkostenGesamt - 1);
    if (krftkontrAngewandt) grundkostenGesamt = Math.max(1, grundkostenGesamt - 1);

    // 6. Kosten einsparen (10%, 20%, etc. aus Dropdown, echt gerundet)
    const kostenEinsparenChecked = document.querySelector('.mod-check[data-id="kosten"]')?.checked;
    if (kostenEinsparenChecked) {
        const prozent = parseInt(document.querySelector('#opt_kosten .mod-value')?.value) || 0;
        const reduktion = Math.round(grundkostenGesamt * (prozent / 100));
        grundkostenGesamt = Math.max(1, grundkostenGesamt - reduktion);
    }

    // 7. AsP pro Einheit (inkl. Varianten und Sonstige Modifikationen)
    const kosteneinheit = parseInt(document.getElementById("kosteneinheit")?.value) || 0;
    const anzahlEinheiten = parseInt(document.getElementById("anzahl-einheiten")?.value) || 0;
    let aspProEinheit = kosteneinheit * anzahlEinheiten + variantenAspX + sonstigeAspX;

    // 8. Gesamtkosten (Grundkosten + AsP/X)
    let aspGesamt = grundkostenGesamt + aspProEinheit;

    // 9. Kosten bei Misslingen (nur Grundkosten halbiert, AsP/X bleiben)
    const aspMiss = Math.round(grundkostenGesamt / 2) + aspProEinheit;

    // Ausgabe in die richtigen Boxen
    const grundkostenBox = document.querySelector('.results-grid .result-box:nth-child(4)');
    const aspGesamtBox = document.querySelector('.results-grid .result-box:nth-child(8)');

    if (grundkostenBox) {
        grundkostenBox.innerHTML = `
            <div>Grundkosten: ${grundkostenGesamt}</div>
            <div>AsP/X: ${aspProEinheit}</div>
        `;
    }
    if (aspGesamtBox) {
        aspGesamtBox.innerHTML = `
            <div>AsP gesamt: ${aspGesamt}</div>
            <div>AsP 1/2 miss: ${aspMiss}</div>
        `;
    }
}

// Export für andere Module
window.initAspCalc = initAspCalc;
