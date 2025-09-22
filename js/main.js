import { ChatManager } from './modules/chat.js';
import { UIManager } from './modules/ui.js';

window.addEventListener('error', function(e) {
    console.error('Error de carga:', e.message);
    // Implementar fallback o mostrar mensaje de error amigable
});

// Verificar si los recursos críticos están cargados
document.addEventListener('DOMContentLoaded', function() {
    const criticalResources = ['base.css', 'main.js', 'logo_brujula_electoral_ani.gif'];
    criticalResources.forEach(resource => {
        const el = document.querySelector(`[href*="${resource}"], [src*="${resource}"]`);
        if (!el || !el.complete) {
            console.error(`Recurso crítico no cargado: ${resource}`);
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const chatManager = new ChatManager();
    const uiManager = new UIManager();
});