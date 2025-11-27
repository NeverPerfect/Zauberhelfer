// ---------------------- INIT ----------------------
document.addEventListener("DOMContentLoaded", () => {
    // Checkboxen deaktivieren
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    initEventsForNumberInputs();
    initModEvents();
    initStabEvents();
    initRepraesentationEvents();
});

// Mod-Fokus-Logik (falls benötigt)
const modfokusCheckbox = document.getElementById("sf_modfokus");
const modfokusDropdown = document.getElementById("sf_modfokus_anzahl");
if (modfokusCheckbox && modfokusDropdown) {
    modfokusCheckbox.addEventListener("change", function () {
        modfokusDropdown.classList.toggle("hidden", !this.checked);
        if (!modfokusDropdown.classList.contains("hidden")) {
            modfokusDropdown.innerHTML = "";
            for (let i = 1; i <= 5; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = `Anzahl ${i}`;
                modfokusDropdown.appendChild(option);
            }
        }
    });
}

// ---------------------- GLOBALE VARIABLEN ----------------------
let gespeicherteZauber = [];
let aktuelleBerechnung = {
    neueZauberdauer: 0,
    neueKosten: 0,
    neueWirkungsdauer: 0
};

// ---------------------- REPRÄSENTATION ----------------------
function initRepraesentationEvents() {
    const select = document.getElementById('repraesentation-select');

    select.addEventListener('change', function() {
        document.querySelectorAll('.repr-content').forEach(content => {
            content.classList.remove('visible');
        });
        if (this.value) {
            const content = document.getElementById(`${this.value}-content`);
            if (content) {
                content.classList.add('visible');
            }
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
            if (e.target.checked) {
                showOptions(id, opt);
            } else {
                opt.innerHTML = "";
                opt.classList.add("hidden");
            }
        });
    });
}

// ---------------------- STAB-EVENTS ----------------------
function initStabEvents() {
    const zauberSpeichernBtn = document.getElementById("zauber-speichern");
    if (zauberSpeichernBtn) {
        zauberSpeichernBtn.addEventListener("click", speichereZauber);
    }
}

// ---------------------- OPTIONEN RENDERN ----------------------
function showOptions(id, opt) {
    opt.classList.remove("hidden");
    const mod = MODS.find(m => m.id === id);
    if (!mod) return;

    if (mod.type === "multi_fixed") {
        opt.innerHTML = `<label>Anzahl:
            <select class="mod-value">
            ${mod.dropdown.map(v => `<option value="${v}">${v}</option>`).join("")}
            </select>
        </label>`;
    } else if (mod.type === "multi_var") {
        opt.innerHTML = `
            <label>Anzahl:
                <select class="mod-value">
                    ${mod.dropdown ? mod.dropdown.map(v => `<option value="${v}">${v}</option>`).join("") : [1, 2, 3, 4].map(v => `<option value="${v}">${v}</option>`).join("")}
                </select>
            </label>
        `;
    } else if (mod.type === "single") {
        opt.innerHTML = `<span>Keine Optionen</span>`;
    } else if (mod.type === "asp") {
        opt.innerHTML = `
            <label>AsP:
                <input type="number" min="1" max="20" class="mod-value" value="1">
            </label>`;
    } else if (mod.type === "kosten") {
        opt.innerHTML = `
            <label>Anzahl:
                <select class="mod-value">
                    ${[1, 2, 3, 4].map(v => `<option value="${v}">${v}</option>`).join("")}
                </select>
            </label>`;
    } else if (mod.type === "ziel") {
        opt.innerHTML = `
        <label>Ziele:
            <input type="number" min="1" value="1" class="mod-ziele">
        </label>
        <label>MR (höchste):
            <select class="mod-mr">
                ${[...Array(20)].map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}
            </select>
        </label>
        `;
    } else if (mod.type === "ziel_frei") {
        opt.innerHTML = `
        <label>Ziele:
            <input type="number" min="1" value="1" class="mod-ziele">
        </label>
        <label>MR:
            <select class="mod-mr">
                ${[...Array(20)].map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}
            </select>
        </label>
        `;
    } else if (mod.type === "stufe") {
        opt.innerHTML = `
            <label>Startstufe:
                <input type="number" min="0" max="7" class="mod-start" value="0">
            </label>
            <label>Zielstufe:
                <input type="number" min="0" max="7" class="mod-ziel" value="1">
            </label>
        `;
    } else if (mod.type === "sonstiges") {
        opt.innerHTML = `
            <div class="sonstige-mods-container">
                <div class="sonstige-mod-input">
                    <label>ZfW:</label>
                    <input type="number" class="mod-zfw" value="0" placeholder="+/-">
                </div>
                <div class="sonstige-mod-input">
                    <label>ZD:</label>
                    <input type="number" class="mod-zd" value="0" placeholder="+/-">
                </div>
                <div class="sonstige-mod-input">
                    <label>AsP:</label>
                    <input type="number" class="mod-asp" value="0" placeholder="+/-">
                </div>
                <div class="sonstige-mod-input">
                    <label>WD:</label>
                    <input type="number" class="mod-wd" value="0" placeholder="+/-">
                </div>
            </div>
        `;
    } else if (mod.type === "multi") {
        opt.innerHTML = `
            <label>Anzahl:
                <select class="mod-value">
                    ${[1, 2, 3, 4].map(v => `<option value="${v}">${v}</option>`).join("")}
                </select>
            </label>
        `;
    } else if (mod.type === "varianten") {
        opt.innerHTML = `
            <button class="add-var">Variante hinzufügen</button>
            <div class="var-list"></div>
        `;
        opt.querySelector(".add-var").onclick = () => {
            const div = document.createElement("div");
            div.className = "var-item";
            div.innerHTML = `
                <label>Erschwernis:
                    <select class="var-value">
                        ${[...Array(12)].map((_, i) => `<option>${i + 1}</option>`).join("")}
                    </select>
                </label>
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
    gespeicherteZauber.push({
        name: name,
        komplexitaet: komplexitaet,
        komplexitaetText: komplexitaetText,
        zd: 0,
        kosten: 0,
        wd: 0
    });
    aktualisiereZauberListe();
    document.getElementById("zauber-name").value = "";
}

// ---------------------- ZAUBERLISTE AKTUALISIEREN ----------------------
function aktualisiereZauberListe() {
    const liste = document.getElementById("stab-zauber-liste");
    if (!liste) return;
    liste.innerHTML = "";
    gespeicherteZauber.forEach((zauber, index) => {
        const div = document.createElement("div");
        div.className = "stab-zauber";
        div.innerHTML = `
            <div class="zauber-info">
                ${zauber.name} (${zauber.komplexitaetText})<br>
                <small>ZD: ${zauber.zd}, Kosten: ${zauber.kosten}, WD: ${zauber.wd}</small>
            </div>
            <div class="zauber-ausloese">
                <button class="ausloesen-btn" data-index="${index}">Auslösen (0)</button>
            </div>
        `;
        liste.appendChild(div);
    });
    document.querySelectorAll(".ausloesen-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.getAttribute("data-index"));
            entferneZauber(index);
        });
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
            const isMinus = e.target.classList.contains("minus");
            const step = isMinus ? -1 : 1;
            const min = parseInt(input.min) || 0;
            const max = parseInt(input.max) || 100;
            const newValue = Math.max(min, Math.min(max, parseInt(input.value) + step));
            input.value = newValue;
        });
    });
    document.querySelectorAll(".number-input input").forEach(input => {
        input.addEventListener("change", () => { });
    });
}

// ---------------------- LEITEIGENSCHAFT-EVENTS ----------------------
document.querySelectorAll('input[name="leiteigenschaft"]').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            document.querySelectorAll('input[name="leiteigenschaft"]').forEach(otherCheckbox => {
                if (otherCheckbox !== this) otherCheckbox.checked = false;
            });
            const attribute = this.getAttribute('data-attribute');
            const leiteigenschaftInput = document.getElementById('leiteigenschaft');
            const attributeInput = document.getElementById(attribute);
            if (leiteigenschaftInput && attributeInput) {
                leiteigenschaftInput.value = attributeInput.value;
            }
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
            if (leiteigenschaftInput) {
                leiteigenschaftInput.value = input.value;
            }
        }
    });
});
