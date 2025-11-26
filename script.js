// ---------------------- INIT ----------------------
document.addEventListener("DOMContentLoaded", () => {
    initEventsForNumberInputs();
    initModEvents();
    initEvents();
    initStabEvents();
    initRepräsentationEvents();
});

// Globale Variable für gespeicherte Zauber
let gespeicherteZauber = [];
let aktuelleBerechnung = {
    neueZauberdauer: 0,
    neueKosten: 0,
    neueWirkungsdauer: 0
};

// ---------------------- REPRÄSENTATION ----------------------
function initRepräsentationEvents() {
    const repräsentationSelect = document.getElementById('repräsentation-select');
    repräsentationSelect.addEventListener('change', function() {
        const gildenmagischInfo = document.getElementById('gildenmagisch-info');
        if (repräsentationSelect.value === 'gildenmagisch') {
            gildenmagischInfo.classList.remove('hidden');
        } else {
            gildenmagischInfo.classList.add('hidden');
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
];

// ---------------------- MOD-EVENTS ----------------------
function initModEvents() {
    document.querySelectorAll(".mod-check").forEach(cb => {
        cb.addEventListener("change", e => {
            const id = e.target.dataset.id;
            const opt = document.getElementById("opt_" + id);
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
    document.getElementById("zauber-speichern").addEventListener("click", speichereZauber);
}

// ---------------------- EVENT HANDLING ----------------------
function initEvents() {
    document.getElementById("inputs").addEventListener("input", () => {});
    document.getElementById("save").onclick = saveData;
    document.getElementById("export").onclick = exportData;
    document.getElementById("import").onclick = () =>
        document.getElementById("importFile").click();
    document.getElementById("importFile").addEventListener("change", importData);
    document.getElementById("sf_modfokus").addEventListener("change", () => {
        const sel = document.getElementById("sf_modfokus_stufen");
        sel.classList.toggle("hidden");
        if (!sel.classList.contains("hidden")) {
            sel.innerHTML = "";
            for (let i = 1; i <= 5; i++) {
                const o = document.createElement("option");
                o.value = i;
                o.textContent = `Stufe ${i}`;
                sel.appendChild(o);
            }
        }
    });
}

// ---------------------- OPTIONEN RENDERN ----------------------
function showOptions(id, opt) {
    opt.classList.remove("hidden");
    const mod = MODS.find(m => m.id === id);
    if (mod.type === "multi_fixed") {
        opt.innerHTML = `<label>Stufen:
            <select class="mod-value">
            ${mod.dropdown.map(v => `<option value="${v}">${v}</option>`).join("")}
            </select>
        </label>`;
    }
    if (mod.type === "multi_var") {
        opt.innerHTML = `
            <label>Anzahl:
                <select class="mod-value">
                    ${[1, 2, 3, 4].map(v => `<option value="${v}">${v}</option>`).join("")}
                </select>
            </label>
        `;
    }
    if (mod.type === "single") {
        opt.innerHTML = `<span>Keine Optionen</span>`;
    }
    if (mod.type === "asp") {
        opt.innerHTML = `
            <label>AsP:
                <input type="number" min="1" max="20" class="mod-value" value="1">
            </label>`;
    }
    if (mod.type === "kosten") {
        opt.innerHTML = `
            <label>Anzahl:
                <select class="mod-value">
                    ${[1, 2, 3, 4].map(v => `<option value="${v}">${v}</option>`).join("")}
                </select>
            </label>`;
    }
    if (mod.type === "ziel") {
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
    }
    if (mod.type === "ziel_frei") {
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
    }
    if (mod.type === "stufe") {
        opt.innerHTML = `
            <label>Startstufe:
                <input type="number" min="0" max="7" class="mod-start" value="0">
            </label>
            <label>Zielstufe:
                <input type="number" min="0" max="7" class="mod-ziel" value="1">
            </label>
        `;
    }
    if (mod.type === "multi") {
        opt.innerHTML = `
            <label>Anzahl:
                <select class="mod-value">
                    ${[1, 2, 3, 4].map(v => `<option value="${v}">${v}</option>`).join("")}
                </select>
            </label>
        `;
    }
    if (mod.type === "varianten") {
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

            // Event-Listener für den "Entfernen"-Button
            div.querySelector(".remove-var").onclick = () => {
                div.remove();
            };
        };
    }
}

// ---------------------- ZAUBER SPEICHERN ----------------------
function speichereZauber() {
    const name = document.getElementById("zauber-name").value.trim();
    if (!name) return;
    const komplexitaetSelect = document.getElementById("komplexitaet");
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

// ---------------------- SAVE / LOAD / IMPORT / EXPORT ----------------------
function saveData() {
    const data = collectData();
    localStorage.setItem("gildenmagier", JSON.stringify(data));
}

function exportData() {
    const data = JSON.stringify(collectData(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gildenmagier.json";
    a.click();
}

function importData(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const data = JSON.parse(reader.result);
        applyData(data);
    };
    reader.readAsText(file);
}

function collectData() {
    const o = {};
    o.leiteigenschaft = document.getElementById("leiteigenschaft").value;
    o.zfw = document.getElementById("zfw").value;
    o.zauberdauer = document.getElementById("zauberdauer").value;
    o.kosten = document.getElementById("kosten").value;
    o.wirkungsdauer = document.getElementById("wirkungsdauer").value;
    o.sf_matrix = document.getElementById("sf_matrix").checked;
    o.sf_modfokus = document.getElementById("sf_modfokus").checked;
    o.sf_modfokus_stufen = document.getElementById("sf_modfokus_stufen").value;
    o.mods = {};
    document.querySelectorAll(".mod-check").forEach(cb => {
        const id = cb.dataset.id;
        o.mods[id] = cb.checked;
    });
    o.gespeicherteZauber = gespeicherteZauber;
    return o;
}

function applyData(d) {
    document.getElementById("leiteigenschaft").value = d.leiteigenschaft;
    document.getElementById("zfw").value = d.zfw;
    document.getElementById("zauberdauer").value = d.zauberdauer;
    document.getElementById("kosten").value = d.kosten;
    document.getElementById("wirkungsdauer").value = d.wirkungsdauer;
    document.getElementById("sf_matrix").checked = d.sf_matrix;
    document.getElementById("sf_modfokus").checked = d.sf_modfokus;
    if (d.sf_modfokus) {
        document.getElementById("sf_modfokus_stufen").classList.remove("hidden");
        document.getElementById("sf_modfokus_stufen").value = d.sf_modfokus_stufen;
    }
    for (const id in d.mods) {
        const cb = document.querySelector(`.mod-check[data-id='${id}']`);
        if (cb) {
            cb.checked = d.mods[id];
            const opt = document.getElementById("opt_" + id);
            if (cb.checked) showOptions(id, opt);
        }
    }
    if (d.gespeicherteZauber) {
        gespeicherteZauber = d.gespeicherteZauber;
    }
    aktualisiereZauberListe();
}

// ---------------------- NUMBER INPUT EVENTS ----------------------
function initEventsForNumberInputs() {
    document.querySelectorAll(".number-input button").forEach(button => {
        button.addEventListener("click", (e) => {
            const targetId = e.target.getAttribute("data-target");
            const input = document.getElementById(targetId);
            const isMinus = e.target.classList.contains("minus");
            const step = isMinus ? -1 : 1;
            const min = parseInt(input.min);
            const max = parseInt(input.max);
            const newValue = Math.max(min, Math.min(max, parseInt(input.value) + step));
            input.value = newValue;
        });
    });
    document.querySelectorAll(".number-input input").forEach(input => {
        input.addEventListener("change", () => {});
    });
}

// Event-Listener für Leiteigenschaft-Checkboxen
document.querySelectorAll('input[name="leiteigenschaft"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            document.querySelectorAll('input[name="leiteigenschaft"]').forEach(otherCheckbox => {
                if (otherCheckbox !== this) otherCheckbox.checked = false;
            });
            // Aktualisiere die Leiteigenschaft im Eingabefeld
            const attribute = this.getAttribute('data-attribute');
            document.getElementById('leiteigenschaft').value = document.getElementById(attribute).value;
        }
    });
});

// Event-Listener für Attribute-Inputs
document.querySelectorAll('.attribute-group .number-input button').forEach(button => {
    button.addEventListener('click', (e) => {
        const targetId = e.target.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const isMinus = e.target.classList.contains('minus');
        const step = isMinus ? -1 : 1;
        const min = parseInt(input.min);
        const max = parseInt(input.max);
        const newValue = Math.max(min, Math.min(max, parseInt(input.value) + step));
        input.value = newValue;

        // Aktualisiere die Leiteigenschaft, falls das geänderte Attribut die Leiteigenschaft ist
        const checkbox = document.querySelector(`input[name="leiteigenschaft"][data-attribute="${targetId}"]`);
        if (checkbox && checkbox.checked) {
            document.getElementById('leiteigenschaft').value = newValue;
        }
    });
});

// Event-Listener für manuelle Eingabe in Attribute-Inputs
document.querySelectorAll('.attribute-group .number-input input').forEach(input => {
    input.addEventListener('change', () => {
        const targetId = input.id;
        // Aktualisiere die Leiteigenschaft, falls das geänderte Attribut die Leiteigenschaft ist
        const checkbox = document.querySelector(`input[name="leiteigenschaft"][data-attribute="${targetId}"]`);
        if (checkbox && checkbox.checked) {
            document.getElementById('leiteigenschaft').value = input.value;
        }
    });
});

// Event-Listener für den Zurücksetzen-Button
document.getElementById('reset-button').addEventListener('click', function() {
    // Setze alle Eingabefelder zurück
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = input.id === 'be' ? '0' : '8';
    });
    // Setze alle Checkboxen zurück
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    // Setze die Leiteigenschaft zurück
    document.getElementById('leiteigenschaft').value = '8';
    // Leere die gespeicherten Zauber
    gespeicherteZauber = [];
    aktualisiereZauberListe();
    // Leere die Modifikationen
    document.querySelectorAll('.mod-check').forEach(checkbox => {
        checkbox.checked = false;
        const opt = document.getElementById("opt_" + checkbox.dataset.id);
        opt.innerHTML = "";
        opt.classList.add("hidden");
    });
});
