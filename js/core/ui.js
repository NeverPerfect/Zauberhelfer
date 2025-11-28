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

// Mod-Fokus-Logik
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

// Logik für die "Angewandt?"-Checkboxen
const sfCheckboxMappings = [
    { mainCheckboxId: "sf_krftkontr", containerId: "sf_krftkontr_used_container" },
    { mainCheckboxId: "sf_krftfokus", containerId: "sf_krftfokus_used_container" },
    { mainCheckboxId: "sf_kugel", containerId: "sf_kugel_used_container" }
];

function setupSfCheckboxToggle(mainCheckboxId, containerId) {
    const mainCheckbox = document.getElementById(mainCheckboxId);
    const container = document.getElementById(containerId);
    if (mainCheckbox && container) {
        mainCheckbox.addEventListener("change", function () {
            // Immer zuerst den Container leeren
            container.innerHTML = '';
            // Nur wenn aktiviert, Checkbox und Text erstellen
            if (this.checked) {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = containerId.replace('_container', '_used');
                container.appendChild(checkbox);
                const labelText = document.createTextNode(" Angewandt?");
                container.appendChild(labelText);
            }
            // Container ausblenden/zeigen
            container.classList.toggle("hidden", !this.checked);
        });
    }
}

// Initialisiere alle Sonderfertigkeiten
sfCheckboxMappings.forEach(mapping => {
    setupSfCheckboxToggle(mapping.mainCheckboxId, mapping.containerId);
});
