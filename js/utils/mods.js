// Verwaltet Modifikations-Dropdowns, hidden containers und mehr

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
        const aspValues = [1, 2, 4, 8, 16, 32, 64];
        opt.innerHTML = `<label>AsP: <select class="mod-value">${aspValues.map(v => `<option value="${v}">${v}</option>`).join("")}</select></label>`;
    } else if (mod.type === "kosten") {
        opt.innerHTML = `<label>Prozent: <select class="mod-value">${[10, 20, 30, 40, 50].map(v => `<option value="${v}">${v}%</option>`).join("")}</select></label>`;
    } else if (mod.type === "ziel" || mod.type === "ziel_frei") {
        opt.innerHTML = `
        <label>Ziele:
            <select class="mod-ziele">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => `<option value="${v}">${v}</option>`).join("")}
            </select>
        </label>
        <label>MR (höchste):
            <select class="mod-mr">
                ${[...Array(20)].map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}
            </select>
        </label>
    `;
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
    } else if (mod.type === "reichweite") {
        const startStufen = [
            { value: 1, text: "Selbst" },
            { value: 2, text: "Berührung" },
            { value: 3, text: "1 Schritt" },
            { value: 4, text: "3 Schritt" },
            { value: 5, text: "7 Schritt" },
            { value: 6, text: "21 Schritt" },
            { value: 7, text: "49 Schritt" }
        ];
        const zielStufen = [
            { value: 2, text: "Berührung" },
            { value: 3, text: "1 Schritt" },
            { value: 4, text: "3 Schritt" },
            { value: 5, text: "7 Schritt" },
            { value: 6, text: "21 Schritt" },
            { value: 7, text: "49 Schritt" },
            { value: 8, text: "Horizont" }
        ];
        opt.innerHTML = `
        <label>Startstufe:
            <select class="mod-start">
                ${startStufen.map(s => `<option value="${s.value}">${s.text}</option>`).join("")}
            </select>
        </label>
        <label>Zielstufe:
            <select class="mod-ziel">
                ${zielStufen.map(s => `<option value="${s.value}">${s.text}</option>`).join("")}
            </select>
        </label>
    `;
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

//SONDERFERTIGKEITEN
// Sonderfertigkeiten mit "Angewandt?"-Checkbox
const sfCheckboxMappings = [
    { mainCheckboxId: "sf_krftkontr", containerId: "sf_krftkontr_used_container" },
    { mainCheckboxId: "sf_krftfokus", containerId: "sf_krftfokus_used_container" },
    { mainCheckboxId: "sf_kugel", containerId: "sf_kugel_used_container" }
];
function setupSfCheckboxToggle(mainCheckboxId, containerId) {
    const mainCheckbox = document.getElementById(mainCheckboxId);
    const container = document.getElementById(containerId);
    if (mainCheckbox && container) {
        container.classList.add("hidden");
        mainCheckbox.addEventListener("change", function () {
            container.innerHTML = '';
            if (this.checked) {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = containerId.replace('_container', '_used');
                const labelText = document.createTextNode(" Angewandt?");
                container.appendChild(checkbox);
                container.appendChild(labelText);
                checkbox.addEventListener("change", berechneAsp);
                container.classList.remove("hidden");
            } else {
                container.classList.add("hidden");
            }
        });
    }
}
// Initialisiere Sonderfertigkeiten mit "Angewandt?"-Checkbox
sfCheckboxMappings.forEach(mapping => {
    setupSfCheckboxToggle(mapping.mainCheckboxId, mapping.containerId);
});

// Logik für Merkmalsfokus
const sfDropdownMappings = [
    { mainCheckboxId: "sf_merkfokus", containerId: "sf_merkfokus_used_container" }
];
function setupSfDropdownToggle(mainCheckboxId, containerId) {
    const mainCheckbox = document.getElementById(mainCheckboxId);
    const container = document.getElementById(containerId);
    if (mainCheckbox && container) {
        container.classList.add("hidden");
        mainCheckbox.addEventListener("change", function () {
            container.innerHTML = '';
            if (this.checked) {
                const labelText = document.createTextNode("Anzahl: ");
                container.appendChild(labelText);
                const dropdown = document.createElement("select");
                dropdown.id = `${mainCheckboxId}_anzahl_dynamic`;
                for (let i = 1; i <= 5; i++) {
                    const option = document.createElement("option");
                    option.value = i;
                    option.textContent = i;
                    dropdown.appendChild(option);
                }
                container.appendChild(dropdown);

                // Standardwert setzen und Event auslösen
                dropdown.value = "1";
                if (mainCheckboxId === "sf_merkfokus") {
                    merkFokusAnzahl = 1;
                    dropdown.dispatchEvent(new Event("change"));
                }

                const appliedCheckbox = document.createElement("input");
                appliedCheckbox.type = "checkbox";
                appliedCheckbox.id = `${mainCheckboxId}_used`;
                const appliedLabel = document.createTextNode(" Angewandt?");
                container.appendChild(document.createElement("br"));
                container.appendChild(appliedCheckbox);
                container.appendChild(appliedLabel);
                appliedCheckbox.addEventListener("change", () => {
                    if (mainCheckboxId === "sf_merkfokus") {
                        merkFokusAngewandt = appliedCheckbox.checked;
                    }
                });
            }
            container.classList.toggle("hidden", !this.checked);
        });
    }
}

// Initialisiere Sonderfertigkeiten mit Dropdown
sfDropdownMappings.forEach(mapping => {
    setupSfDropdownToggle(mapping.mainCheckboxId, mapping.containerId);
});

// Funktion für UI des Modifikationsfokus (Dropdown + "Angewandt?"-Checkbox)
function setupModFokusUI() {
    const modFokusCheckbox = document.getElementById("sf_modfokus");
    const modFokusContainer = document.getElementById("sf_modfokus_used_container");
    if (modFokusCheckbox && modFokusContainer) {
        modFokusCheckbox.addEventListener("change", function () {
            modFokusContainer.innerHTML = '';
            if (this.checked) {
                const labelText = document.createTextNode("Anzahl: ");
                modFokusContainer.appendChild(labelText);
                const dropdown = document.createElement("select");
                dropdown.id = "sf_modfokus_anzahl_dynamic";
                for (let i = 1; i <= 5; i++) {
                    const option = document.createElement("option");
                    option.value = i;
                    option.textContent = i;
                    dropdown.appendChild(option);
                }
                modFokusContainer.appendChild(dropdown);

                const appliedCheckbox = document.createElement("input");
                appliedCheckbox.type = "checkbox";
                appliedCheckbox.id = "sf_modfokus_used_dynamic";
                const appliedLabel = document.createTextNode(" Angewandt?");
                modFokusContainer.appendChild(document.createElement("br"));
                modFokusContainer.appendChild(appliedCheckbox);
                modFokusContainer.appendChild(appliedLabel);

                // Standardwert setzen und Event manuell auslösen (wie beim Merkmalsfokus)
                dropdown.value = "1";
                modFokusAnzahl = 1;
                dropdown.dispatchEvent(new Event("change"));
            } else {
                modFokusContainer.innerHTML = "";
            }
        });
    }
}

// Initialisiere die UI (z. B. in einer initSonderfertigkeiten()-Funktion)
setupModFokusUI();

// Funktion für UI der Kugel des Hellsehers
function setupKugelDesHellsehersUI() {
    const kugelCheckbox = document.getElementById("sf_kugel");
    const kugelContainer = document.getElementById("sf_kugel_used_container");
    if (kugelCheckbox && kugelContainer) {
        kugelCheckbox.addEventListener("change", function () {
            kugelContainer.innerHTML = '';
            if (this.checked) {
                const labelText = document.createTextNode("Erleichterung: ");
                kugelContainer.appendChild(labelText);
                const dropdown = document.createElement("select");
                dropdown.id = "sf_kugel_anzahl_dynamic";
                // Nur Werte 1 und 2
                [1, 2].forEach(i => {
                    const option = document.createElement("option");
                    option.value = i;
                    option.textContent = i;
                    dropdown.appendChild(option);
                });
                kugelContainer.appendChild(dropdown);

                const appliedCheckbox = document.createElement("input");
                appliedCheckbox.type = "checkbox";
                appliedCheckbox.id = "sf_kugel_used";
                const appliedLabel = document.createTextNode(" Angewandt?");
                kugelContainer.appendChild(document.createElement("br"));
                kugelContainer.appendChild(appliedCheckbox);
                kugelContainer.appendChild(appliedLabel);

                // Standardwert setzen und Event manuell auslösen
                dropdown.value = "1";
                kugelAnzahl = 1; // Globale Variable (siehe globals.js)
                dropdown.dispatchEvent(new Event("change"));
            } else {
                kugelContainer.innerHTML = "";
            }
        });
    }
}

// Initialisiere die UI (z. B. in initSonderfertigkeiten())
setupKugelDesHellsehersUI();
