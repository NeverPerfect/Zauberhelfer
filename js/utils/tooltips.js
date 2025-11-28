// Funktion zum Ein-/Ausblenden aller Tooltips
function updateTooltipVisibility(disabled) {
    const toggle = document.getElementById('toggle-tooltips');
    const infoIcons = document.querySelectorAll('.info-icon');
    toggle.checked = !disabled;
    if (disabled) {
        // Tooltips deaktivieren: Event-Listener entfernen
        document.querySelectorAll('.tooltip-container').forEach(container => {
            const icon = container.querySelector('.info-icon');
            if (icon) {
                icon.style.cursor = 'default';
                icon.style.opacity = '0.3';
                // Entferne Event-Listener durch Klonen
                const newIcon = icon.cloneNode(true);
                icon.parentNode.replaceChild(newIcon, icon);
            }
        });
    } else {
        // Tooltips aktivieren: Event-Listener hinzufügen
        initTooltips();
        infoIcons.forEach(icon => {
            icon.style.cursor = 'help';
            icon.style.opacity = '1';
        });
    }
}

// Initialisiere Tooltips
function initTooltips() {
    // Entferne alle bestehenden Event-Listener
    document.querySelectorAll('.tooltip-container').forEach(container => {
        const icon = container.querySelector('.info-icon');
        const tooltip = container.querySelector('.tooltip-text');
        if (!icon || !tooltip) return;
        // Event-Listener hinzufügen
        icon.addEventListener('mouseenter', (e) => {
            // Positioniere den Tooltip rechts neben dem Icon (mit Versatz)
            const rect = icon.getBoundingClientRect();
            tooltip.style.left = `${rect.right + window.scrollX + 10}px`; // 10px Abstand rechts
            tooltip.style.top = `${rect.top + window.scrollY}px`; // Ausrichtung oben
            tooltip.classList.add('visible');
        });

        icon.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });
}
