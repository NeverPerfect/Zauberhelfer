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
        if (!icon) return;
        // Event-Listener hinzufügen
        icon.addEventListener('mouseenter', (e) => {
            const tooltip = container.querySelector('.tooltip-text');
            tooltip.classList.add('visible');
            const rect = icon.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.top = `${rect.bottom + window.scrollY}px`;
            tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
        });
        icon.addEventListener('mouseleave', () => {
            const tooltip = container.querySelector('.tooltip-text');
            tooltip.classList.remove('visible');
        });
    });
}
