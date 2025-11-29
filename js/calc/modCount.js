// modCount.js
// Abhängigkeiten: globals.js (MODS), mods.js (.mod-check-Checkboxen)

// Globale Variablen
let matrixVerstaendnis = false;
let modFokusAnzahl = 0;
let modFokusAngewandt = false;

// DOM-Elemente
const modsAnzahlElement = document.getElementById("mods-anzahl");
const modsWarnungElement = document.getElementById("modcount-warnung");

// Initialisierung
function initModCount() {
    // Event-Listener für Mod-Checkboxen
    document.querySelectorAll(".mod-check").forEach(cb => {
        cb.addEventListener("change", updateModCount);
    });

    // Event-Listener für Sonderfertigkeiten
    document.getElementById("sf_matrix")?.addEventListener("change", (e) => {
        matrixVerstaendnis = e.target.checked;
        updateModCount();
    });

    // Event-Listener für Modifikationsfokus (dynamisch erstellt)
    const modFokusCheckbox = document.getElementById("sf_modfokus");
    modFokusCheckbox?.addEventListener("change", (e) => {
        const modFokusContainer = document.getElementById("sf_modfokus_used_container");
        if (e.target.checked) {
            modFokusContainer.innerHTML = `
                <label>Anzahl:
                    <select id="sf_modfokus_anzahl_dynamic">
                        ${[1, 2, 3, 4, 5].map(i => `<option value="${i}">${i}</option>`).join("")}
                    </select>
                </label>
                <label>
                    <input type="checkbox" id="sf_modfokus_used_dynamic"> Angewandt?
                </label>
            `;
            document.getElementById("sf_modfokus_anzahl_dynamic")?.addEventListener("change", updateModCount);
            document.getElementById("sf_modfokus_used_dynamic")?.addEventListener("change", updateModCount);
        } else {
            modFokusContainer.innerHTML = "";
            modFokusAngewandt = false;
            modFokusAnzahl = 0;
            updateModCount();
        }
    });

    // Event-Listener für Leiteigenschaft (KL/IN)
    document.querySelectorAll('input[name="leiteigenschaft"]').forEach(checkbox => {
        checkbox.addEventListener("change", updateModCount);
    });

    // Event-Listener für Attribute (KL/IN) - input-Event für Live-Berechnung
    document.querySelectorAll('.attribute-group .number-input input').forEach(input => {
        input.addEventListener("input", updateModCount);
    });

    // Event-Listener für alle Plus/Minus-Buttons der Attribute
    document.querySelectorAll(".number-input button").forEach(button => {
        button.addEventListener("click", updateModCount);
    });

    // Event-Listener für alle dynamischen Mod-Optionen
    document.addEventListener("change", (e) => {
        if (e.target.classList.contains("mod-value") ||
            e.target.classList.contains("mod-ziele") ||
            e.target.classList.contains("mod-start") ||
            e.target.classList.contains("mod-ziel")) {
            updateModCount();
        }
    });

    // Event-Listener für Varianten (Hinzufügen/Entfernen)
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-var") || e.target.classList.contains("remove-var")) {
            setTimeout(updateModCount, 50); // Kurze Verzögerung, um DOM-Änderungen abzuwarten
        }
    });

    // Erstmalige Berechnung
    updateModCount();
}

// Berechnet die maximale Anzahl an Modifikationen
function getMaxMods() {
    let maxMods = 0;
    const leiteigenschaftValue = getLeiteigenschaftValue();

    // Für jeden Wert ab 13 eine zusätzliche Modifikation
    if (leiteigenschaftValue >= 13) {
        maxMods += leiteigenschaftValue - 12;
    }

    if (matrixVerstaendnis) maxMods += 1;
    if (modFokusAngewandt) maxMods += modFokusAnzahl;

    return maxMods;
}

// Liest den aktuellen Wert der Leiteigenschaft (KL oder IN)
function getLeiteigenschaftValue() {
    const klCheckbox = document.querySelector('input[name="leiteigenschaft"][data-attribute="kl"]');
    const inCheckbox = document.querySelector('input[name="leiteigenschaft"][data-attribute="in"]');

    if (klCheckbox?.checked) {
        return parseInt(document.getElementById("kl").value) || 8;
    } else if (inCheckbox?.checked) {
        return parseInt(document.getElementById("in").value) || 8;
    } else {
        return 8;
    }
}

// Berechnet die aktuelle Anzahl an Modifikationen
function getCurrentMods() {
    let currentMods = 0;

    // Veränderte Technik
    const techChecked = document.querySelector('.mod-check[data-id="tech"]')?.checked;
    if (techChecked) {
        const value = parseInt(document.querySelector('#opt_tech .mod-value')?.value) || 1;
        currentMods += value;
    }

    // Veränderte Technik (zentral)
    const techzChecked = document.querySelector('.mod-check[data-id="techz"]')?.checked;
    if (techzChecked) {
        const value = parseInt(document.querySelector('#opt_techz .mod-value')?.value) || 1;
        currentMods += value;
    }

    // Unfreiwillig statt freiwillig
    const unfreiwChecked = document.querySelector('.mod-check[data-id="unfreiw"]')?.checked;
    if (unfreiwChecked) {
        const ziele = parseInt(document.querySelector('#opt_unfreiw .mod-ziele')?.value) || 1;
        currentMods += ziele;
    }

    // Freiwillig statt unfreiwillig
    const freiwChecked = document.querySelector('.mod-check[data-id="freiw"]')?.checked;
    if (freiwChecked) {
        const ziele = parseInt(document.querySelector('#opt_freiw .mod-ziele')?.value) || 1;
        currentMods += ziele;
    }

    // Zauberdauer halbieren (mit Anzahl)
    const halbdauerChecked = document.querySelector('.mod-check[data-id="halbdauer"]')?.checked;
    if (halbdauerChecked) {
        const valueElement = document.querySelector('#opt_halbdauer .mod-value');
        const value = valueElement ? parseInt(valueElement.value) || 1 : 1;
        currentMods += value;
    }

    // Zauberdauer verdoppeln
    const doppeldauerChecked = document.querySelector('.mod-check[data-id="doppeldauer"]')?.checked;
    if (doppeldauerChecked) currentMods += 1;

    // Erzwingen
    const erzwingenChecked = document.querySelector('.mod-check[data-id="erzwingen"]')?.checked;
    if (erzwingenChecked) currentMods += 1;

    // Kosten einsparen
    const kostenChecked = document.querySelector('.mod-check[data-id="kosten"]')?.checked;
    if (kostenChecked) {
        const prozent = parseInt(document.querySelector('#opt_kosten .mod-value')?.value) || 0;
        currentMods += Math.floor(prozent / 10);
    }

    // Reichweite/Wirkungsradius erhöhen/verkleinern
    const reichweitexChecked = document.querySelector('.mod-check[data-id="reichweitex"]')?.checked;
    if (reichweitexChecked) {
        const start = parseInt(document.querySelector('#opt_reichweitex .mod-start')?.value) || 1;
        const ziel = parseInt(document.querySelector('#opt_reichweitex .mod-ziel')?.value) || 1;
        currentMods += Math.abs(ziel - start);
    }

    const reichweitekChecked = document.querySelector('.mod-check[data-id="reichweitek"]')?.checked;
    if (reichweitekChecked) {
        const start = parseInt(document.querySelector('#opt_reichweitek .mod-start')?.value) || 1;
        const ziel = parseInt(document.querySelector('#opt_reichweitek .mod-ziel')?.value) || 1;
        currentMods += Math.abs(ziel - start);
    }

    // Wirkungsdauer verdoppeln/halbieren
    const dauerxChecked = document.querySelector('.mod-check[data-id="dauerx"]')?.checked;
    if (dauerxChecked) {
        const value = parseInt(document.querySelector('#opt_dauerx .mod-value')?.value) || 1;
        currentMods += value;
    }

    const dauerhChecked = document.querySelector('.mod-check[data-id="dauerh"]')?.checked;
    if (dauerhChecked) {
        const value = parseInt(document.querySelector('#opt_dauerh .mod-value')?.value) || 1;
        currentMods += value;
    }

    // Aufrechterhalten ➜ feste Dauer
    const aufFestChecked = document.querySelector('.mod-check[data-id="auf_fest"]')?.checked;
    if (aufFestChecked) currentMods += 1;

    // Varianten
    const variantenChecked = document.querySelector('.mod-check[data-id="varianten"]')?.checked;
    if (variantenChecked) {
        const varItems = document.querySelectorAll('#opt_varianten .var-item');
        currentMods += varItems.length;
    }

    // Modifikationsfokus (dynamisch)
    modFokusAngewandt = document.getElementById("sf_modfokus_used_dynamic")?.checked || false;
    modFokusAnzahl = parseInt(document.getElementById("sf_modfokus_anzahl_dynamic")?.value) || 0;

    return currentMods;
}

// Aktualisiert den Zähler und die Warnung
function updateModCount() {
    const currentMods = getCurrentMods();
    const maxMods = getMaxMods();

    modsAnzahlElement.textContent = `${currentMods}/${maxMods}`;
    modsAnzahlElement.style.color = currentMods > maxMods ? "red" : "inherit";

    if (currentMods > maxMods) {
        modsWarnungElement.textContent = "Anzahl an Modifikationen überschritten!";
        modsWarnungElement.style.display = "block";
    } else {
        modsWarnungElement.textContent = "";
        modsWarnungElement.style.display = "none";
    }
}

// Export für andere Module
window.initModCount = initModCount;
