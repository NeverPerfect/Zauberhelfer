// ui.js
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
            // Trigger das 'input'-Event, damit chance-ui.js reagieren kann
            input.dispatchEvent(new Event('input', { bubbles: true }));
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
