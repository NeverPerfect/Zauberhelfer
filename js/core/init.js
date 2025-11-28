// ---------------------- INIT ----------------------
document.addEventListener("DOMContentLoaded", () => {
    // Standardwerte laden oder zurücksetzen
    if (!localStorage.getItem('zauberhelferData')) {
        resetAllInputs();
    } else {
        loadFromLocalStorage();
    }
    // Event-Listener initialisieren
    initEventsForNumberInputs();
    initModEvents();
    initStabEvents();
    initRepraesentationEvents();
    initSaveLoadEvents();
    // Tooltip-Logik
    const tooltipsDisabled = localStorage.getItem('tooltipsDisabled') === 'true';
    updateTooltipVisibility(tooltipsDisabled);
    // Toggle-Switch Event-Listener
    document.getElementById('toggle-tooltips').addEventListener('change', function () {
        const disabled = !this.checked;
        localStorage.setItem('tooltipsDisabled', disabled);
        updateTooltipVisibility(disabled);
    });
    // Initialisiere Tooltips nur, wenn sie nicht deaktiviert sind
    if (!tooltipsDisabled) {
        initTooltips();
    }
});
