// ---------------------- SPEICHERN/LADEN/EXPORT/IMPORT ----------------------
function initSaveLoadEvents() {
    // Speichern im localStorage
    document.getElementById("save").addEventListener("click", saveData);
    // Export als JSON-Datei
    document.getElementById("export").addEventListener("click", exportData);
    // Import aus JSON-Datei
    document.getElementById("import").addEventListener("click", () => {
        document.getElementById("importFile").click();
    });
    document.getElementById("importFile").addEventListener("change", importData);
    // Zurücksetzen auf Standardwerte
    document.getElementById("reset-button").addEventListener("click", () => {
        if (confirm("Wirlich alle Daten zurücksetzen?")) {
            localStorage.removeItem('zauberhelferData');
            resetAllInputs();
        }
    });
}

// Speichern im localStorage
function saveData() {
    const data = {
        formData: {},
        checkedMods: {},
        gespeicherteZauber: gespeicherteZauber,
        aktuelleBerechnung: aktuelleBerechnung,
        repraesentationValue: document.getElementById('repraesentation-select').value
    };
    // Alle Formularelemente speichern
    document.querySelectorAll('input, select, textarea').forEach(element => {
        if (element.type === 'checkbox') data.formData[element.id] = element.checked;
        else data.formData[element.id] = element.value;
    });
    // Ausgeklappte Modifikationen speichern
    document.querySelectorAll('.mod-check:checked').forEach(checkbox => {
        const id = checkbox.dataset.id;
        const opt = document.getElementById(`opt_${id}`);
        if (opt && !opt.classList.contains('hidden')) {
            data.checkedMods[id] = true;
            // Spezieller Fall für "varianten"
            if (id === 'varianten') {
                data.checkedMods[`${id}-variants`] = [];
                opt.querySelectorAll('.var-item').forEach(item => {
                    const variant = {
                        zfw: item.querySelector('.var-zfw').value,
                        zd: item.querySelector('.var-zd').value,
                        asp: item.querySelector('.var-asp').value,
                        asp: item.querySelector('.var-aspx').value,
                        wd: item.querySelector('.var-wd').value
                    };
                    data.checkedMods[`${id}-variants`].push(variant);
                });
            }
            // Für alle anderen Mod-Typen (z. B. "sonstigemods", "miss" etc.)
            else {
                opt.querySelectorAll('input, select').forEach(input => {
                    data.checkedMods[`${id}-${input.className}`] = input.value;
                });
            }
        }
    });
    localStorage.setItem('zauberhelferData', JSON.stringify(data));
    alert("Daten gespeichert!");
}

// Export als JSON-Datei
function exportData() {
    const data = JSON.parse(localStorage.getItem('zauberhelferData')) || {};
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zauberhelfer_export.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Import aus JSON-Datei
function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            // Formularelemente wiederherstellen
            for (const id in data.formData) {
                const element = document.getElementById(id);
                if (element) {
                    if (element.type === 'checkbox') element.checked = data.formData[id];
                    else element.value = data.formData[id];
                }
            }
            // Repräsentation wiederherstellen
            //BUG: INFOTEXT WIRD AKTUELL NICHT WIEDER HERGESTELLT
            if (data.repraesentationValue) {
                const select = document.getElementById('repraesentation-select');
                select.value = data.repraesentationValue;
                const event = new Event('change');
                select.dispatchEvent(event);
            }
            // Ausgeklappte Modifikationen wiederherstellen
            for (const id in data.checkedMods) {
                if (id.endsWith('-variants')) continue;
                if (id.includes('-')) {
                    const [modId, className] = id.split('-');
                    const checkbox = document.querySelector(`.mod-check[data-id="${modId}"]`);
                    const opt = document.getElementById(`opt_${modId}`);
                    if (checkbox && opt) {
                        checkbox.checked = true;
                        opt.classList.remove('hidden');
                        if (className) {
                            const input = opt.querySelector(`.${className}`);
                            if (input) input.value = data.checkedMods[id];
                        }
                    }
                } else {
                    const checkbox = document.querySelector(`.mod-check[data-id="${id}"]`);
                    if (checkbox) checkbox.checked = true;
                    const opt = document.getElementById(`opt_${id}`);
                    if (opt) {
                        opt.classList.remove('hidden');
                        showOptions(id, opt);
                        if (id === 'varianten' && data.checkedMods[`${id}-variants`]) {
                            data.checkedMods[`${id}-variants`].forEach((value) => {
                                const button = opt.querySelector('.add-var');
                                if (button) button.click();
                                const selects = opt.querySelectorAll('.var-value');
                                const lastSelect = selects[selects.length - 1];
                                if (lastSelect) lastSelect.value = value;
                            });
                        }
                    }
                }
            }
            // Globale Variablen wiederherstellen
            gespeicherteZauber = data.gespeicherteZauber || [];
            aktuelleBerechnung = data.aktuelleBerechnung || { neueZauberdauer: 0, neueKosten: 0, neueWirkungsdauer: 0 };
            aktualisiereZauberListe();
            alert("Daten importiert!");
        } catch (error) {
            alert("Fehler beim Import: " + error.message);
        }
    };
    reader.readAsText(file);
}

// ---------------------- ZURÜCKSETZEN ----------------------
function resetAllInputs() {
    // Formularelemente zurücksetzen
    document.querySelectorAll('input, select, textarea').forEach(element => {
        if (element.type === 'checkbox') element.checked = false;
        else if (element.defaultValue !== undefined) element.value = element.defaultValue;
    });
    // Repräsentation zurücksetzen
    const repraesentationSelect = document.getElementById('repraesentation-select');
    repraesentationSelect.value = '';
    document.querySelectorAll('.repr-content').forEach(content => {
        content.classList.remove('visible');
    });
    // Zauber-Auswahl zurücksetzen
    const zauberSelect = document.getElementById('zauber-select');
    zauberSelect.value = '';
    // Reichweite-Dropdown zurücksetzen
    const reichweiteSelect = document.getElementById('reichweite-select');
    reichweiteSelect.value = '';
    // Ausgeklappte Optionen verstecken
    document.querySelectorAll('.mod-options').forEach(opt => {
        opt.classList.add('hidden');
        opt.innerHTML = '';
    });
    // Globale Variablen zurücksetzen
    gespeicherteZauber = [];
    aktuelleBerechnung = { neueZauberdauer: 0, neueKosten: 0, neueWirkungsdauer: 0 };
    aktualisiereZauberListe();
}

// ---------------------- AUS LOCALSTORAGE LADEN ----------------------
function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('zauberhelferData'));
    if (!data) return;
    // Formularelemente wiederherstellen
    for (const id in data.formData) {
        const element = document.getElementById(id);
        if (element) {
            if (element.type === 'checkbox') element.checked = data.formData[id];
            else element.value = data.formData[id];
        }
    }
    // Repräsentation wiederherstellen
    if (data.repraesentationValue) {
        const select = document.getElementById('repraesentation-select');
        select.value = data.repraesentationValue;
        const event = new Event('change');
        select.dispatchEvent(event);
    }
    // Ausgeklappte Modifikationen wiederherstellen
    for (const id in data.checkedMods) {
        if (id.endsWith('-variants')) continue;
        if (id.includes('-')) {
            const [modId, className] = id.split('-');
            const checkbox = document.querySelector(`.mod-check[data-id="${modId}"]`);
            const opt = document.getElementById(`opt_${modId}`);
            if (checkbox && opt) {
                checkbox.checked = true;
                opt.classList.remove('hidden');
                if (className) {
                    const input = opt.querySelector(`.${className}`);
                    if (input) input.value = data.checkedMods[id];
                }
            }
        } else {
            const checkbox = document.querySelector(`.mod-check[data-id="${id}"]`);
            if (checkbox) checkbox.checked = true;
            const opt = document.getElementById(`opt_${id}`);
            if (opt) {
                opt.classList.remove('hidden');
                showOptions(id, opt);
                if (id === 'varianten' && data.checkedMods[`${id}-variants`]) {
                    data.checkedMods[`${id}-variants`].forEach((value) => {
                        const button = opt.querySelector('.add-var');
                        if (button) button.click();
                        const selects = opt.querySelectorAll('.var-value');
                        const lastSelect = selects[selects.length - 1];
                        if (lastSelect) lastSelect.value = value;
                    });
                }
            }
        }
    }
    // Globale Variablen wiederherstellen
    gespeicherteZauber = data.gespeicherteZauber || [];
    aktuelleBerechnung = data.aktuelleBerechnung || { neueZauberdauer: 0, neueKosten: 0, neueWirkungsdauer: 0 };
    aktualisiereZauberListe();
}
