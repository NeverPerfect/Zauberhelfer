// ---------------------- GLOBALE VARIABLEN ----------------------
let gespeicherteZauber = [];
let aktuelleBerechnung = {
    neueZauberdauer: 0,
    neueKosten: 0,
    neueWirkungsdauer: 0
};

// ---------------------- INIT ----------------------
document.addEventListener("DOMContentLoaded", () => {
    // Standardwerte laden oder zurücksetzen
    if (!localStorage.getItem('zauberhelferData')) {
        resetAllInputs();
    } else {
        loadFromLocalStorage();
    }

    // Event-Listener initialisieren
    initEventsForNumberInputs();
    initModEvents();
    initStabEvents();
    initRepraesentationEvents();
    initSaveLoadEvents();
});

// ---------------------- REPRÄSENTATION ----------------------
function initRepraesentationEvents() {
    const select = document.getElementById('repraesentation-select');
    select.addEventListener('change', function () {
        document.querySelectorAll('.repr-content').forEach(content => {
            content.classList.remove('visible');
        });
        if (this.value) {
            const content = document.getElementById(`${this.value}-content`);
            if (content) content.classList.add('visible');
        }
    });
}

// ---------------------- MODIFIKATIONEN ----------------------
const MODS = [
    { id: "tech", name: "Veränderte Technik", type: "multi_fixed", cost: 7, dauer: 3, dropdown: [1, 2, 3, 4] },
    { id: "techz", name: "Veränderte Technik (zentral)", type: "multi_fixed", cost: 12, dauer: 3, dropdown: [1, 2, 3, 4] },
    { id: "halbdauer", name: "Zauberdauer halbieren", type: "multi_var", cost: 5, dauer: "-50%" },
    { id: "doppeldauer", name: "Zauberdauer verdoppeln", type: "single", cost: -4, dauer: "+100%" },
    { id: "erzwingen", name: "Erzwingen (AsP)", type: "asp", dauer: "+1 je", noCombo: "kosten" },
    { id: "kosten", name: "Kosten einsparen", type: "kosten", cost: 3, dauer: "+1", noCombo: "erzwingen" },
    { id: "unfreiw", name: "Unfreiwillig statt freiwillig", type: "ziel", base: 5 },
    { id: "freiw", name: "Freiwillig statt unfreiwillig", type: "ziel_frei", base: 2 },
    { id: "reichweitex", name: "Reichweite/Wirkungsradius erhöhen", type: "stufe", cost: 5 },
    { id: "reichweitek", name: "Reichweite/Wirkungsradius verkleinern", type: "stufe", cost: 3 },
    { id: "dauerx", name: "Wirkungsdauer verdoppeln", type: "multi", cost: 7, dauer: "+1" },
    { id: "dauerh", name: "Wirkungsdauer halbieren", type: "multi", cost: 3, dauer: "+1" },
    { id: "auf_fest", name: "Aufrechterhalten ➜ feste Dauer", type: "single", cost: 7, dauer: "+1" },
    { id: "varianten", name: "Varianten", type: "varianten" },
    { id: "stab", name: "Zauber in Stab speichern", type: "single", cost: 2 },
    { id: "fremdrepraesentation", name: "Zauber in fremder Repräsentation", type: "single", cost: 4, dauer: 0 },
    { id: "miss", name: "Zauber misslungen?", type: "multi_var", cost: 3, dauer: 1, dropdown: [1, 2, 3, 4] },
    { id: "sonstigemods", name: "Sonstige Modifikationen", type: "sonstiges" }
];

// ---------------------- MOD-EVENTS ----------------------
function initModEvents() {
    document.querySelectorAll(".mod-check").forEach(cb => {
        cb.addEventListener("change", e => {
            const id = e.target.dataset.id;
            const opt = document.getElementById("opt_" + id);
            if (!opt) return;
            if (e.target.checked) showOptions(id, opt);
            else {
                opt.innerHTML = "";
                opt.classList.add("hidden");
            }
        });
    });
}

// ---------------------- STAB-EVENTS ----------------------
function initStabEvents() {
    const zauberSpeichernBtn = document.getElementById("zauber-speichern");
    if (zauberSpeichernBtn) zauberSpeichernBtn.addEventListener("click", speichereZauber);
}

// ---------------------- OPTIONEN RENDERN ----------------------
function showOptions(id, opt) {
    opt.classList.remove("hidden");
    const mod = MODS.find(m => m.id === id);
    if (!mod) return;

    if (mod.type === "multi_fixed") {
        opt.innerHTML = `<label>Anzahl: <select class="mod-value">${mod.dropdown.map(v => `<option value="${v}">${v}</option>`).join("")}</select></label>`;
    } else if (mod.type === "multi_var") {
        opt.innerHTML = `<label>Anzahl: <select class="mod-value">${(mod.dropdown || [1, 2, 3, 4]).map(v => `<option value="${v}">${v}</option>`).join("")}</select></label>`;
    } else if (mod.type === "single") {
        opt.innerHTML = `<span>Keine Optionen</span>`;
    } else if (mod.type === "asp") {
        opt.innerHTML = `<label>AsP: <input type="number" min="1" max="20" class="mod-value" value="1"></label>`;
    } else if (mod.type === "kosten") {
        opt.innerHTML = `<label>Anzahl: <select class="mod-value">${[1, 2, 3, 4].map(v => `<option value="${v}">${v}</option>`).join("")}</select></label>`;
    } else if (mod.type === "ziel") {
        opt.innerHTML = `<label>Ziele: <input type="number" min="1" value="1" class="mod-ziele"></label><label>MR (höchste): <select class="mod-mr">${[...Array(20)].map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}</select></label>`;
    } else if (mod.type === "ziel_frei") {
        opt.innerHTML = `<label>Ziele: <input type="number" min="1" value="1" class="mod-ziele"></label><label>MR: <select class="mod-mr">${[...Array(20)].map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}</select></label>`;
    } else if (mod.type === "stufe") {
        opt.innerHTML = `<label>Startstufe: <input type="number" min="0" max="7" class="mod-start" value="0"></label><label>Zielstufe: <input type="number" min="0" max="7" class="mod-ziel" value="1"></label>`;
    } else if (mod.type === "sonstiges") {
        opt.innerHTML = `
            <div class="sonstige-mods-container">
                <div class="sonstige-mod-input"><label>ZfW:</label><input type="number" class="mod-zfw" value="0" placeholder="+/-"></div>
                <div class="sonstige-mod-input"><label>ZD:</label><input type="number" class="mod-zd" value="0" placeholder="+/-"></div>
                <div class="sonstige-mod-input"><label>AsP:</label><input type="number" class="mod-asp" value="0" placeholder="+/-"></div>
                <div class="sonstige-mod-input"><label>AsP/X:</label><input type="number" class="mod-aspx" value="0" placeholder="+/-"></div>
                <div class="sonstige-mod-input"><label>WD:</label><input type="number" class="mod-wd" value="0" placeholder="+/-"></div>
            </div>
        `;
    } else if (mod.type === "multi") {
        opt.innerHTML = `<label>Anzahl: <select class="mod-value">${[1, 2, 3, 4].map(v => `<option value="${v}">${v}</option>`).join("")}</select></label>`;
    } else if (mod.type === "varianten") {
        opt.innerHTML = `
        <div class="add-var-header">
            <span>Varianten</span>
            <button class="add-var">Variante hinzufügen</button>
        </div>
        <div class="var-list"></div>
    `;
        opt.querySelector(".add-var").onclick = () => {
            const div = document.createElement("div");
            div.className = "var-item";
            div.innerHTML = `
            <div class="sonstige-mods-container">
                <div class="sonstige-mod-input">
                    <label>ZfW:</label>
                    <input type="number" class="var-zfw" value="0" placeholder="+/-">
                </div>
                <div class="sonstige-mod-input">
                    <label>ZD:</label>
                    <input type="number" class="var-zd" value="0" placeholder="+/-">
                </div>
                <div class="sonstige-mod-input">
                    <label>AsP:</label>
                    <input type="number" class="var-asp" value="0" placeholder="+/-">
                </div>
                <div class="sonstige-mod-input">
                    <label>AsP/X:</label>
                    <input type="number" class="var-aspx" value="0" placeholder="+/-">
                </div>
                <div class="sonstige-mod-input">
                    <label>WD:</label>
                    <input type="number" class="var-wd" value="0" placeholder="+/-">
                </div>
            </div>
            <button class="remove-var">Entfernen</button>
        `;
            opt.querySelector(".var-list").appendChild(div);
            div.querySelector(".remove-var").onclick = () => div.remove();
        };
    }




}

// ---------------------- ZAUBER IM STAB SPEICHERN ----------------------
function speichereZauber() {
    const name = document.getElementById("zauber-name").value.trim();
    if (!name) return;
    const komplexitaetSelect = document.getElementById("komplexitaet");
    if (!komplexitaetSelect) return;
    const komplexitaet = parseInt(komplexitaetSelect.value);
    const komplexitaetText = komplexitaetSelect.options[komplexitaetSelect.selectedIndex].text;
    gespeicherteZauber.push({ name, komplexitaet, komplexitaetText, zd: 0, kosten: 0, wd: 0 });
    aktualisiereZauberListe();
    document.getElementById("zauber-name").value = "";
}

// ---------------------- ZAUBERLISTE AKTUALISIEREN ----------------------
function aktualisiereZauberListe() {
    const liste = document.getElementById("stab-zauber-liste");
    if (!liste) return;
    liste.innerHTML = gespeicherteZauber.map((zauber, index) => `
        <div class="stab-zauber">
            <div class="zauber-info">${zauber.name} (${zauber.komplexitaetText})<br><small>ZD: ${zauber.zd}, Kosten: ${zauber.kosten}, WD: ${zauber.wd}</small></div>
            <div class="zauber-ausloese"><button class="ausloesen-btn" data-index="${index}">Auslösen (0)</button></div>
        </div>
    `).join("");
    document.querySelectorAll(".ausloesen-btn").forEach(btn => {
        btn.addEventListener("click", (e) => entferneZauber(parseInt(e.target.getAttribute("data-index"))));
    });
}

// ---------------------- ZAUBER ENTFERNEN ----------------------
function entferneZauber(index) {
    gespeicherteZauber.splice(index, 1);
    aktualisiereZauberListe();
}

// ---------------------- NUMBER INPUT EVENTS ----------------------
function initEventsForNumberInputs() {
    document.querySelectorAll(".number-input button").forEach(button => {
        button.addEventListener("click", (e) => {
            const targetId = e.target.getAttribute("data-target");
            const input = document.getElementById(targetId);
            if (!input) return;
            const step = e.target.classList.contains("minus") ? -1 : 1;
            const min = parseInt(input.min) || 0;
            const max = parseInt(input.max) || 100;
            input.value = Math.max(min, Math.min(max, parseInt(input.value) + step));
        });
    });
}

// ---------------------- LEITEIGENSCHAFT-EVENTS ----------------------
document.querySelectorAll('input[name="leiteigenschaft"]').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            document.querySelectorAll('input[name="leiteigenschaft"]').forEach(other => {
                if (other !== this) other.checked = false;
            });
            const attribute = this.getAttribute('data-attribute');
            const leiteigenschaftInput = document.getElementById('leiteigenschaft');
            const attributeInput = document.getElementById(attribute);
            if (leiteigenschaftInput && attributeInput) leiteigenschaftInput.value = attributeInput.value;
        }
    });
});

// ---------------------- ATTRIBUTE-EVENTS ----------------------
document.querySelectorAll('.attribute-group .number-input input').forEach(input => {
    input.addEventListener('change', () => {
        const targetId = input.id;
        const checkbox = document.querySelector(`input[name="leiteigenschaft"][data-attribute="${targetId}"]`);
        if (checkbox && checkbox.checked) {
            const leiteigenschaftInput = document.getElementById('leiteigenschaft');
            if (leiteigenschaftInput) leiteigenschaftInput.value = input.value;
        }
    });
});

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

// Mod-Fokus-Logik (falls benötigt)
const modfokusCheckbox = document.getElementById("sf_modfokus");
const modfokusDropdown = document.getElementById("sf_modfokus_anzahl");
if (modfokusCheckbox && modfokusDropdown) {
    modfokusCheckbox.addEventListener("change", function () {
        modfokusDropdown.classList.toggle("hidden", !this.checked);
        if (!this.checked) return;
        modfokusDropdown.innerHTML = "";
        for (let i = 1; i <= 5; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `Anzahl ${i}`;
            modfokusDropdown.appendChild(option);
        }
    });
}
