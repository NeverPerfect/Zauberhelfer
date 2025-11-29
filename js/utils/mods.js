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

// Mod-Fokus-Logik
const modfokusCheckbox = document.getElementById("sf_modfokus");
const modfokusContainer = document.getElementById("sf_modfokus_used_container");
if (modfokusCheckbox && modfokusContainer) {
    modfokusCheckbox.addEventListener("change", function () {
        modfokusContainer.innerHTML = '';
        if (this.checked) {
            const labelText = document.createTextNode("Anzahl: ");
            modfokusContainer.appendChild(labelText);
            const dropdown = document.createElement("select");
            dropdown.id = "sf_modfokus_anzahl_dynamic";
            for (let i = 1; i <= 5; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = i;
                dropdown.appendChild(option);
            }
            modfokusContainer.appendChild(dropdown);
        }
        modfokusContainer.classList.toggle("hidden", !this.checked);
    });
}

// Logik für die "Angewandt?"-Checkboxen
const sfCheckboxMappings = [
    { mainCheckboxId: "sf_krftkontr", containerId: "sf_krftkontr_used_container" },
    { mainCheckboxId: "sf_krftfokus", containerId: "sf_krftfokus_used_container" }
];

function setupSfCheckboxToggle(mainCheckboxId, containerId) {
    const mainCheckbox = document.getElementById(mainCheckboxId);
    const container = document.getElementById(containerId);
    if (mainCheckbox && container) {
        // Standardmäßig ausblenden
        container.classList.add("hidden");

        mainCheckbox.addEventListener("change", function () {
            container.innerHTML = '';
            if (this.checked) {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = containerId.replace('_container', '');
                const labelText = document.createTextNode(" Angewandt?");
                container.appendChild(checkbox);
                container.appendChild(labelText);
                checkbox.addEventListener("change", berechneAsp);
                container.classList.remove("hidden"); // Nur einblenden, wenn aktiviert
            } else {
                container.classList.add("hidden"); // Ausblenden, wenn deaktiviert
            }
            berechneAsp();
        });
    }
}


// Initialisiere alle Sonderfertigkeiten
sfCheckboxMappings.forEach(mapping => {
    setupSfCheckboxToggle(mapping.mainCheckboxId, mapping.containerId);
    const mainCheckbox = document.getElementById(mapping.mainCheckboxId);
    if (mainCheckbox && mainCheckbox.checked) {
        const container = document.getElementById(mapping.containerId);
        if (container) {
            container.innerHTML = '';
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = mapping.containerId.replace('_container', '_used');
            const labelText = document.createTextNode(" Angewandt?");
            container.appendChild(checkbox);
            container.appendChild(labelText);
            checkbox.addEventListener("change", berechneAsp);
            container.classList.remove("hidden");
        }
    }
});
