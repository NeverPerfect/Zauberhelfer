// chance-init.js
import {
    setupAttributeSelectListeners,
    setupAttributeInputListeners,
    updateResults
} from './chance-ui.js';

document.addEventListener('DOMContentLoaded', () => {
    setupAttributeSelectListeners();
    setupAttributeInputListeners();
    updateResults(); // Initialberechnung
});
