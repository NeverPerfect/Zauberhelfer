// Aktiviert/Deaktiviert Dropdowns basierend auf Checkboxen
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        let selectId = this.id.replace('Check', '');
        // Füge die Logik für die zweite ID hinzu
        if (this.id === 'eagleEyesCheck' || this.id === 'repeatRollCheck') {
            selectId += 'Value';
        }
        const selectElement = document.getElementById(selectId);
        if (selectElement) {
            selectElement.disabled = !this.checked;
        }

        // Nur eine Checkbox in der "visionCheck"-Gruppe kann ausgewählt sein
        if (this.classList.contains('visionCheck') && this.checked) {
            document.querySelectorAll('.visionCheck').forEach(otherCheckbox => {
                if (otherCheckbox !== this) {
                    otherCheckbox.checked = false;
                }
            });
        }
    });
});

// Berechnet die Erschwernis
function calculate() {
    // Basiswerte
    let distance = parseInt(document.getElementById('distance').value) || 0;
    let targetSize = parseInt(document.getElementById('targetSize').value) || 0;

    // Umwelt
    let cover = document.getElementById('coverCheck').checked ?
        parseInt(document.getElementById('cover').value) : 0;
    let light = document.getElementById('lightCheck').checked ?
        parseInt(document.getElementById('light').value) : 0;
    let fog = document.getElementById('fogCheck').checked ?
        parseInt(document.getElementById('fog').value) : 0;

    // Bewegung
    let movement = document.getElementById('movementCheck').checked ?
        parseInt(document.getElementById('movement').value) : 0;
    let fixedTarget = document.getElementById('fixedTargetCheck').checked ?
        parseInt(document.getElementById('fixedTarget').value) : 0;

    // Sonstiges
    let eagleEyesValue = document.getElementById('eagleEyesCheck').checked ?
        parseInt(document.getElementById('eagleEyesValue').value) : 0;
    let sixthSense = document.getElementById('sixthSenseCheck').checked ? -3 : 0;
    let veiledAura = document.getElementById('veiledAuraCheck').checked ? 3 : 0;
    let repeatRoll = document.getElementById('repeatRollCheck').checked ?
        parseInt(document.getElementById('repeatRollValue').value) : 0;

    // Vor- und Nachteile
    let twilightVision = document.getElementById('twilightVisionCheck').checked;
    let nightVision = document.getElementById('nightVisionCheck').checked;
    let nightBlind = document.getElementById('nightBlindCheck').checked;
    let distanceSense = document.getElementById('distanceSenseCheck').checked ? -2 : 0;
    let shortSighted = document.getElementById('shortSightedCheck').checked ?
        parseInt(document.getElementById('shortSighted').value) : 0;

    // SF Fernzauberei
    let longRangeMagic = document.getElementById('longRangeMagicCheck').checked;

    // Lichtverhältnisse anpassen
    if (twilightVision) {
        light = Math.max(0, Math.round(light / 2));
    } else if (nightVision) {
        light = Math.max(0, light - 5);
    } else if (nightBlind) {
        light = Math.min(8, light * 2);
    }

    // Summe berechnen
    let sum = distance + targetSize + cover + light + fog + movement + fixedTarget +
        sixthSense + veiledAura + distanceSense + shortSighted + repeatRoll + 7;

    // Zauber ADLERAUGE
    if (document.getElementById('eagleEyesCheck').checked) {
        sum -= Math.round(eagleEyesValue / 2);
    }

    // SF Fernzauberei
    if (longRangeMagic) {
        sum = Math.round(sum / 2);
    }

    // Ausgabe
    document.getElementById('result').textContent =
        `Summe aller Zuschläge: ${sum}`;
}
