// chance-logic.js
// Berechnet die Erfolgswahrscheinlichkeit für Zauberproben
// Kritische Erfolge / Patzer
export function isCriticalSuccess(w1, w2, w3) {
    return (w1 === 1 && w2 === 1) || (w2 === 1 && w3 === 1) || (w1 === 1 && w3 === 1);
}

export function isCriticalFailure(w1, w2, w3) {
    return (w1 === 20 && w2 === 20) || (w2 === 20 && w3 === 20) || (w1 === 20 && w3 === 20);
}

// Berechnung aller ZfP* Wahrscheinlichkeiten
export function calculateZfpProbabilities(e1, e2, e3, zfw) {
    const counts = new Array(zfw + 1).fill(0);
    let successTotal = 0;

    for (let w1 = 1; w1 <= 20; w1++) {
        for (let w2 = 1; w2 <= 20; w2++) {
            for (let w3 = 1; w3 <= 20; w3++) {
                let zfp = null;

                // Kritische Erfolge → volle ZfP*
                if (isCriticalSuccess(w1, w2, w3)) {
                    zfp = zfw;
                }
                // Kritische Fehlschläge → Probe gescheitert
                else if (isCriticalFailure(w1, w2, w3)) {
                    continue;
                }
                else {
                    const over1 = Math.max(0, w1 - e1);
                    const over2 = Math.max(0, w2 - e2);
                    const over3 = Math.max(0, w3 - e3);
                    const totalOver = over1 + over2 + over3;

                    if (totalOver > zfw) continue; // Probe gescheitert
                    zfp = zfw - totalOver;
                }

                counts[zfp]++;
                successTotal++;
            }
        }
    }

    return {
        total: (successTotal / 8000) * 100,
        zfps: counts.map(c => (c / 8000) * 100)
    };
}
