import { ChatManager } from './modules/chat.js';
import { UIManager } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', function () {
    const chatManager = new ChatManager();
    const uiManager = new UIManager();
});