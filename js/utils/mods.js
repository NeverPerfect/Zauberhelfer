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
