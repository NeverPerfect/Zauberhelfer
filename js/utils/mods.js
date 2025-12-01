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

    // Template klonen
    const template = document.getElementById(`template_${mod.type}`);
    if (!template) return;

    const clone = template.content.cloneNode(true);
    opt.innerHTML = "";
    opt.appendChild(clone);

    // Dropdowns füllen
    if (mod.type === "multi_fixed" || mod.type === "multi_var" || mod.type === "multi") {
        const select = opt.querySelector(".mod-value");
        const values = mod.type === "multi_fixed" ? mod.dropdown : (mod.dropdown || [1, 2, 3, 4]);
        values.forEach(v => {
            const option = document.createElement("option");
            option.value = v;
            option.textContent = v;
            select.appendChild(option);
        });
    } else if (mod.type === "asp") {
        const select = opt.querySelector(".mod-value");
        [1, 2, 4, 8, 16, 32, 64].forEach(v => {
            const option = document.createElement("option");
            option.value = v;
            option.textContent = v;
            select.appendChild(option);
        });
    } else if (mod.type === "kosten") {
        const select = opt.querySelector(".mod-value");
        [10, 20, 30, 40, 50].forEach(v => {
            const option = document.createElement("option");
            option.value = v;
            option.textContent = `${v}%`;
            select.appendChild(option);
        });
    } else if (mod.type === "ziel" || mod.type === "ziel_frei") {
        const zieleSelect = opt.querySelector(".mod-ziele");
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(v => {
            const option = document.createElement("option");
            option.value = v;
            option.textContent = v;
            zieleSelect.appendChild(option);
        });
        const mrSelect = opt.querySelector(".mod-mr");
        [...Array(20)].forEach((_, i) => {
            const option = document.createElement("option");
            option.value = i + 1;
            option.textContent = i + 1;
            mrSelect.appendChild(option);
        });
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
        const startSelect = opt.querySelector(".mod-start");
        startStufen.forEach(s => {
            const option = document.createElement("option");
            option.value = s.value;
            option.textContent = s.text;
            startSelect.appendChild(option);
        });
        const zielSelect = opt.querySelector(".mod-ziel");
        zielStufen.forEach(s => {
            const option = document.createElement("option");
            option.value = s.value;
            option.textContent = s.text;
            zielSelect.appendChild(option);
        });
    } else if (mod.type === "varianten") {
        const varItemTemplate = document.getElementById("template_var_item");
        opt.querySelector(".add-var").onclick = () => {
            // Klone den Inhalt des Templates
            const cloneContent = varItemTemplate.content.cloneNode(true);
            // Packe den Inhalt in ein div, damit wir ihn später entfernen können
            const wrapper = document.createElement("div");
            wrapper.className = "var-item-wrapper";
            wrapper.appendChild(cloneContent);
            // Füge das div zur Liste hinzu
            const varList = opt.querySelector(".var-list");
            varList.appendChild(wrapper);
            // Event-Listener für den "Entfernen"-Button setzen
            const removeButton = wrapper.querySelector(".remove-var");
            removeButton.onclick = () => {
                wrapper.remove();
            };
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
