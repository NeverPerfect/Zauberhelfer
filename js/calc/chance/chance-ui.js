// chance-ui.js
import { calculateZfpProbabilities } from './chance-logic.js';

// Berechnung aktualisieren
export function updateResults() {
    const selectedAttributes = Array.from(document.querySelectorAll('.attribute-select')).map(select => select.value);
    // Prüfe, ob alle benötigten Werte vorhanden sind
    if (selectedAttributes.length !== 3) {
        console.log("[CHANCE-UI] Nicht genug Attribute ausgewählt!");
        return;
    }
    const e1 = parseInt(document.getElementById(selectedAttributes[0])?.value) || 0;
    const e2 = parseInt(document.getElementById(selectedAttributes[1])?.value) || 0;
    const e3 = parseInt(document.getElementById(selectedAttributes[2])?.value) || 0;
    const zfw = parseInt(document.getElementById('zfw-neu')?.textContent) || 0;
    // Nur berechnen, wenn alle Werte gültig sind
    if (e1 && e2 && e3 && !isNaN(zfw)) {
        const result = calculateZfpProbabilities(e1, e2, e3, zfw);
        document.getElementById('erfolgswahrscheinlichkeit').textContent = `${result.total.toFixed(2)}%`;
        document.getElementById('zfp-results').innerHTML = '<h4>ZfP*-Wahrscheinlichkeiten:</h4><ul>' +
            result.zfps.map((prob, i) => `<li><strong>ZfP* ${i}:</strong> ${prob ? prob.toFixed(2) : 0}%</li>`).join('') +
            '</ul>';
    } else {
        console.log("[CHANCE-UI] Ungültige Werte für Berechnung!");
    }
}

// Listener für Attribute-Dropdowns und Input-Änderungen
export function setupAttributeSelectListeners() {
    document.querySelectorAll('.attribute-select').forEach(select => {
        select.addEventListener('change', updateResults);
    });
}

export function setupAttributeInputListeners() {
    document.querySelectorAll('.number-input input').forEach(input => {
        input.addEventListener('input', updateResults);
    });
}
