// ---------------------- STAB-EVENTS ----------------------
function initStabEvents() {
    const zauberSpeichernBtn = document.getElementById("zauber-speichern");
    if (zauberSpeichernBtn) zauberSpeichernBtn.addEventListener("click", speichereZauber);
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
