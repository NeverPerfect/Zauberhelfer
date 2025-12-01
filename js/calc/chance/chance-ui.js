// chance-ui.js
import { calculateZfpProbabilities } from './chance-logic.js';

// Globales Chart-Objekt
let zfpChart = null;

// Berechnung aktualisieren
export function updateResults() {
    const selectedAttributes = Array.from(document.querySelectorAll('.attribute-select')).map(select => select.value);
    if (selectedAttributes.length !== 3) {
        console.log("[CHANCE-UI] Nicht genug Attribute ausgewählt!");
        return;
    }
    const e1 = parseInt(document.getElementById(selectedAttributes[0])?.value) || 0;
    const e2 = parseInt(document.getElementById(selectedAttributes[1])?.value) || 0;
    const e3 = parseInt(document.getElementById(selectedAttributes[2])?.value) || 0;
    const zfw = parseInt(document.getElementById('zfw-neu')?.textContent) || 0;

    if (e1 && e2 && e3 && !isNaN(zfw)) {
        const result = calculateZfpProbabilities(e1, e2, e3, zfw);
        document.getElementById('erfolgswahrscheinlichkeit').textContent = `${result.total.toFixed(2)}%`;

        const ctx = document.getElementById('zfpChart').getContext('2d');
        const labels = result.zfps.map((_, i) => `ZfP* ${i}`);
        const data = result.zfps.map(prob => prob ? prob.toFixed(2) : 0);

        // Chart aktualisieren oder neu erstellen
        if (zfpChart) {
            // Daten aktualisieren, wenn Chart bereits existiert
            zfpChart.data.labels = labels;
            zfpChart.data.datasets[0].data = data;
            zfpChart.update();
        } else {
            // Neues Chart erstellen, wenn es noch keins gibt
            zfpChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                            '#9966FF', '#FF9F40', '#8AC24A', '#E91E63',
                            '#00BCD4', '#673AB7', '#FF5722', '#795548'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    cutout: '70%',
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: true },
                        datalabels: {
                            color: '#fff',
                            formatter: (value, ctx) => `${ctx.chart.data.labels[ctx.dataIndex]}\n${value}%`,
                            font: { weight: 'bold', size: 10 }
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });
        }
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
