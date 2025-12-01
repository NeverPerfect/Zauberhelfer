// chance-ui.js
import { calculateZfpProbabilities } from './chance-logic.js';

window.__chanceListenersSetup = false;
let isUpdating = false;

// Handler-Funktionen
function inputChangeHandler() {
    if (isUpdating) return;
    isUpdating = true;
    updateResults();
    isUpdating = false;
}

function handlePlusMinusClick(e) {
    const numberInput = e.target.closest('.number-input');
    if (!numberInput) return;

    if (e.target.matches('.plus, .minus')) {
        e.preventDefault();
        e.stopImmediatePropagation();

        const targetId = e.target.getAttribute('data-target');
        const input = document.getElementById(targetId);
        let value = parseInt(input.value);

        if (e.target.classList.contains('plus')) {
            value = Math.min(value + 1, parseInt(input.max));
        } else {
            value = Math.max(value - 1, parseInt(input.min));
        }

        input.value = value;
        console.log(`[DEBUG] Neuer Wert für ${targetId}: ${value}`);
    }
}

// Exportierte Funktionen
export function updateResults() {
    const selectedAttributes = Array.from(document.querySelectorAll('.attribute-select')).map(select => select.value);
    const e1 = parseInt(document.getElementById(selectedAttributes[0]).value);
    const e2 = parseInt(document.getElementById(selectedAttributes[1]).value);
    const e3 = parseInt(document.getElementById(selectedAttributes[2]).value);
    const zfw = parseInt(document.getElementById('zfw-neu').textContent);
    const result = calculateZfpProbabilities(e1, e2, e3, zfw);

    document.getElementById('erfolgswahrscheinlichkeit').textContent = `${result.total.toFixed(2)}%`;
    document.getElementById('zfp-results').innerHTML = '<h4>ZfP*-Wahrscheinlichkeiten:</h4><ul>' +
        result.zfps.map((prob, i) => `<li><strong>ZfP* ${i}:</strong> ${prob ? prob.toFixed(2) : 0}%</li>`).join('') +
        '</ul>';
}

export function setupAttributeSelectListeners() {
    if (window.__chanceSelectListenersSetup) return;
    document.querySelectorAll('.attribute-select').forEach(select => {
        select.addEventListener('change', updateResults);
    });
    window.__chanceSelectListenersSetup = true;
}

export function setupAttributeInputListeners() {
    if (window.__chanceListenersSetup) return;

    document.removeEventListener('click', handlePlusMinusClick);
    document.addEventListener('click', handlePlusMinusClick);

    document.querySelectorAll('.number-input input').forEach(input => {
        input.removeEventListener('input', inputChangeHandler);
        input.addEventListener('input', inputChangeHandler);
    });

    window.__chanceListenersSetup = true;
}
