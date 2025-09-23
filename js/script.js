document.addEventListener('DOMContentLoaded', function () {
    // --- Lógica del Menú ---
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    const body = document.body;
    const mainContent = document.querySelector('.main-content');
    const mobileNewThreadBtn = document.getElementById('mobile-new-thread-btn');

    const closeMenu = () => {
        sidebar.classList.remove('visible');
        overlay.classList.remove('visible');
        body.classList.remove('body-no-scroll');
        menuToggle.classList.remove('is-active');
    };
    const openMenu = () => {
        sidebar.classList.add('visible');
        overlay.classList.add('visible');
        body.classList.add('body-no-scroll');
        menuToggle.classList.add('is-active');
    };

    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            if (sidebar.classList.contains('visible')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        overlay.addEventListener('click', () => closeMenu());
    }

    // --- Lógica de la Bienvenida Animada ---
    const welcomeHeading = document.getElementById('welcome-heading');
    if (welcomeHeading) {
        animateWelcomeHeading();
    }

    async function animateWelcomeHeading() {
        if (!welcomeHeading) return;
        
        const logo = document.querySelector('#welcome-view .logo-brujula');
        if (logo) {
            logo.classList.add('visible');
        }

        const originalHTML = welcomeHeading.innerHTML;
        const lines = originalHTML.split('<br>').map(line => line.trim());
        
        welcomeHeading.innerHTML = '';
        
        const typingSpeed = 50;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            for (const char of line) {
                welcomeHeading.innerHTML += char;
                await new Promise(r => setTimeout(r, typingSpeed));
            }
            if (i < lines.length - 1) {
                welcomeHeading.innerHTML += '<br>';
            }
        }
        
        welcomeHeading.classList.add('animation-complete');
        
        const elementsToAnimate = document.querySelectorAll('#welcome-view .fade-in-item:not(.logo-brujula)');
        elementsToAnimate.forEach(el => {
            el.classList.add('visible');
        });
    }

    // --- Lógica de la Vista de Chat ---
    const welcomeView = document.getElementById('welcome-view');
    const chatFlowContainer = document.getElementById('chat-flow-container');
    const chatLog = document.querySelector('.chat-log');
    
    // Inicia el chat si estamos en una página de respuesta directa (simulación SEO)
    if (!welcomeView && chatFlowContainer) {
        const userQuery = document.title.split('-')[0].trim();
        startChatSequence(userQuery, true);
    }
    
    // Inicia el chat desde la página de bienvenida
    if (welcomeView) {
        const suggestionCards = document.querySelectorAll('.suggestion-card');
        const sendButton = welcomeView.querySelector('.search-container .send-button');
        const textarea = welcomeView.querySelector('#prompt-textarea');
        
        suggestionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const question = card.dataset.question;
                if (question) {
                    welcomeView.classList.add('hidden');
                    chatFlowContainer.classList.remove('hidden');
                    startChatSequence(question);
                }
            });
        });

        sendButton.addEventListener('click', () => {
            if (textarea.value.trim().length > 0) {
                welcomeView.classList.add('hidden');
                chatFlowContainer.classList.remove('hidden');
                startChatSequence(textarea.value);
            }
        });
    }
    
    function scrollToBottom() {
        if (window.innerWidth <= 768) {
            window.scrollTo(0, document.body.scrollHeight);
        } else {
            mainContent.scrollTop = mainContent.scrollHeight;
        }
    }

    function startChatSequence(userQuery, isPreloaded = false) {
        if(mobileNewThreadBtn) mobileNewThreadBtn.classList.remove('hidden');
        chatLog.innerHTML = '';
        const userBubbleHTML = `<div class="user-bubble">${userQuery}</div>`;
        chatLog.insertAdjacentHTML('beforeend', userBubbleHTML);

        const assistantResponseHTML = `
            <div class="assistant-response">
                <img src="images/logo_brujula_small.svg" alt="Logo Brújula" class="logo-brujula">
                <div class="response-content">
                    <div class="preloader">
                        <span class="preloader-text"></span>
                    </div>
                </div>
            </div>`;
        chatLog.insertAdjacentHTML('beforeend', assistantResponseHTML);
        
        const preloaderText = chatLog.querySelector('.preloader-text');
        
        const messages = [
            {
                text: "Verificando fuentes de RPP",
                icon: "🔍",
                duration: 2000
            },
            {
                text: "Analizando información",
                icon: "⚡",
                duration: 2000
            },
            {
                text: "Construyendo respuesta",
                icon: "🔄",
                duration: 2000
            },
            {
                text: "Potenciando esta consulta gracias a BCP",
                isSponsored: true,
                icon: "✨",
                duration: 2500
            }
        ];

        let currentMessageIndex = 0;

        const showMessages = async () => {
            for (const message of messages) {
                preloaderText.innerHTML = `
                    <div class="preloader-message ${message.isSponsored ? 'sponsored-message' : ''}">
                        <span class="preloader-icon">${message.icon}</span>
                        <span class="preloader-text-content">${message.text}</span>
                        <div class="loading-dots">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                `;
                preloaderText.className = `preloader-text ${message.isSponsored ? 'sponsored' : ''}`;
                await new Promise(resolve => setTimeout(resolve, message.duration));
            }
        };

        // Ejecutar la secuencia de mensajes
        showMessages();

        // Ajustar el tiempo total para que coincida con la suma de las duraciones
        const totalDuration = messages.reduce((sum, msg) => sum + msg.duration, 0) + 500;

        setTimeout(() => {
            if (chatLog.dataset.intervalId) {
                clearInterval(chatLog.dataset.intervalId);
            }
            const responseContent = chatLog.querySelector('.assistant-response:last-child .response-content');
            if (!responseContent) return;

            responseContent.innerHTML = '';
            
            let fullResponseText = '';
            if (userQuery.includes("antecedentes penales")) {
                fullResponseText = `
                    <p>¡Claro que sí! Verificar los antecedentes de un candidato es un paso fundamental para un voto informado. 🗳️ Aquí te explico cómo hacerlo usando las plataformas oficiales:</p>
                    <p>El Jurado Nacional de Elecciones (JNE) centraliza esta información en su plataforma <strong>"Voto Informado"</strong>. Además, existen otros registros públicos que puedes consultar.</p>
                    <div class="responsive-table hidden-initially">
                        <table>
                            <thead>
                                <tr>
                                    <th>Plataforma</th>
                                    <th>¿Qué información encuentras?</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Voto Informado (JNE)</strong></td>
                                    <td>Hojas de vida, sentencias penales, deudas, bienes y rentas.</td>
                                </tr>
                                <tr>
                                    <td><strong>Registro de Deudores Alimentarios Morosos (REDAM)</strong></td>
                                    <td>Verifica si el candidato tiene deudas por pensión de alimentos.</td>
                                </tr>
                                <tr>
                                    <td><strong>Consulta de Expedientes Judiciales (CEJ)</strong></td>
                                    <td>Permite buscar expedientes por nombre en el sistema de justicia.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>Para tomar decisiones importantes, la información es tu mejor herramienta. Un voto informado es un voto por el progreso de todos.</p>
                    <div class="sponsored-content-card hidden-initially">
                        <div class="sponsor-logo-container">
                            <img src="images/logo_bcp_white.svg" alt="Logo BCP" class="sponsor-logo-small">
                        </div>
                        <div class="sponsor-content-text">
                            <span class="sponsor-label">Contenido patrocinado</span>
                            <h4>Elige con confianza</h4>
                            <p>Informarte es el primer paso para avanzar. Así como te informas para votar, en BCP creemos en el poder de las buenas decisiones para tu futuro.</p>
                            <a href="https://www.viabcp.com/" target="_blank" class="sponsor-cta-button">Descubre cómo tomar mejores decisiones</a>
                        </div>
                    </div>
                    <p>Recuerda que fiscalizar a los candidatos es nuestro derecho y deber como ciudadanos. ¡Un elector informado fortalece la democracia! 🇵🇪</p>
                `;
            } else {
                fullResponseText = `
                    <p>Para saber si has sido seleccionado como miembro de mesa para las Elecciones Generales 2026 en Per&uacute;, debes consultar la informaci&oacute;n oficial que publicar&aacute; la Oficina Nacional de Procesos Electorales (ONPE).</p>
                    <p>Aqu&iacute; te indico c&oacute;mo hacerlo, bas&aacute;ndome en los procesos de elecciones anteriores:</p>
                    <div style="display: flex; flex-direction: column; gap: 0.8em;">
                        <p class="list-item-paragraph">📅 <strong>1. Espera la publicaci&oacute;n oficial:</strong> La ONPE sortear&aacute; y publicar&aacute; la lista de los miembros de mesa titulares y suplentes para las Elecciones 2026.</p>
                        <p class="list-item-paragraph">🔗 <strong>2. Utiliza el enlace de consulta de la ONPE:</strong> La ONPE habilita un enlace espec&iacute;fico en su p&aacute;gina web oficial para que los ciudadanos consulten su local de votaci&oacute;n.</p>
                        <p class="list-item-paragraph">🆔 <strong>3. Ingresa tu DNI:</strong> En el enlace de consulta, solo necesitas ingresar tu n&uacute;mero de Documento Nacional de Identidad (DNI) para obtener la informaci&oacute;n.</p>
                        <p class="list-item-paragraph">🔔 <strong>4. Mantente informado:</strong> Te recomiendo visitar peri&oacute;dicamente la p&aacute;gina web de la ONPE para conocer las fechas exactas del sorteo y la publicaci&oacute;n de la lista oficial.</p>
                    </div>
                    <p>Es importante recordar que el sorteo de miembros de mesa se realiza de manera p&uacute;blica y que la designaci&oacute;n es un deber c&iacute;vico.</p>
                `;
            }
            
            animateText(fullResponseText, responseContent);
            setupScrollAnimations();
            
        }, isPreloaded ? 100 : totalDuration);
    }
    
    async function animateText(htmlContent, container) {
        const responseWrapper = document.createElement('div');
        responseWrapper.id = 'response-wrapper';
        container.appendChild(responseWrapper);
        responseWrapper.innerHTML = htmlContent;

        // Ocultar los componentes especiales inicialmente
        const table = responseWrapper.querySelector('.responsive-table');
        const sponsoredCard = responseWrapper.querySelector('.sponsored-content-card');
        
        if (table) table.style.display = 'none';
        if (sponsoredCard) sponsoredCard.style.display = 'none';

        const allTextNodes = [];
        const treeWalker = document.createTreeWalker(
            responseWrapper,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Ignorar nodos de texto dentro de los componentes especiales
                    if (node.parentElement.closest('.responsive-table') || 
                        node.parentElement.closest('.sponsored-content-card')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let currentNode;
        while (currentNode = treeWalker.nextNode()) {
            if (currentNode.textContent.trim().length > 0) {
                allTextNodes.push({ 
                    node: currentNode, 
                    text: currentNode.textContent,
                    // Guardar referencia al componente especial que sigue, si existe
                    nextComponent: currentNode.parentElement.nextElementSibling?.classList.contains('responsive-table') ? 'table' :
                                 currentNode.parentElement.nextElementSibling?.classList.contains('sponsored-content-card') ? 'card' : null
                });
                currentNode.textContent = '';
            }
        }

        const typingSpeed = 10;
        for (const item of allTextNodes) {
            const { node, text, nextComponent } = item;
            
            for (let i = 0; i < text.length; i++) {
                await new Promise(resolve => setTimeout(resolve, typingSpeed));
                node.textContent += text[i];
                scrollToBottom();
            }

            // Mostrar componente especial después del texto correspondiente
            if (nextComponent) {
                await new Promise(resolve => setTimeout(resolve, 500)); // Pequeña pausa
                
                if (nextComponent === 'table' && table) {
                    table.style.display = '';
                    await new Promise(resolve => setTimeout(resolve, 50));
                    table.classList.add('visible');
                } else if (nextComponent === 'card' && sponsoredCard) {
                    sponsoredCard.style.display = '';
                    await new Promise(resolve => setTimeout(resolve, 50));
                    sponsoredCard.classList.add('visible');
                }
                
                scrollToBottom();
                await new Promise(resolve => setTimeout(resolve, 500)); // Pausa después del componente
            }
        }
        
        const finalComponentsHTML = `
            <div class="response-footer">
                <button id="sources-cta-button" class="sources-button">
                    Ver Fuentes
                    <span class="notification-badge">4</span>
                </button>
                <div class="feedback-buttons">
                    <button id="copy-response-btn" data-tooltip="Copiar"><i class="feedback-icon icon-copy"></i></button>
                    <button data-tooltip="&Uacute;til"><i class="feedback-icon icon-thumb-up"></i></button>
                    <button data-tooltip="No &uacute;til"><i class="feedback-icon icon-thumb-up icon-inverted"></i></button>
                </div>
            </div>
            <div class="related-section">
                <div class="related-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    <span>Relacionado</span>
                </div>
                <a href="#" class="related-item"><span>&iquest;Cu&aacute;nto pagan por ser miembro de mesa y cu&aacute;ndo se realiza el pago?</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg></a>
                <a href="#" class="related-item"><span>&iquest;Cu&aacute;les son las funciones y responsabilidades de un miembro de mesa?</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg></a>
                <a href="#" class="related-item"><span>&iquest;Qu&eacute; pasa si no puedo asistir? &iquest;Hay una multa?</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg></a>
            </div>`;
        
        const sourcesViewHTML = `
            <div id="sources-view" class="sources-section hidden">
                <div class="related-title">
                    <h4>Fuentes</h4>
                    <button class="back-button" id="back-to-response-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                        Volver
                    </button>
                </div>
                <a href="#" class="source-item">
                    <img src="images/nota_img.jpg" alt="Nota de RPP" class="source-item-img">
                    <div class="source-item-text">
                        <h4>ONPE: ¿Cuándo se publicará la lista oficial de miembros de mesa para 2026?</h4>
                        <p>https://rpp.pe/politica/elecciones/onpe-cuando-se-publicara...</p>
                    </div>
                </a>
                <a href="#" class="source-item">
                    <img src="images/nota_img.jpg" alt="Nota de RPP" class="source-item-img">
                    <div class="source-item-text">
                        <h4>Elecciones 2026: Guía completa para la consulta de local de votación</h4>
                        <p>https://rpp.pe/politica/elecciones/guia-completa-para-consulta...</p>
                    </div>
                </a>
            </div>`;
        
        container.insertAdjacentHTML('beforeend', finalComponentsHTML);
        container.insertAdjacentHTML('beforeend', sourcesViewHTML);

        const sponsorHTML = `
            <div class="sponsor-block">
                <p class="sponsor-text-footer">Contenido de confianza, presentado por:</p>
                <a href="https://www.viabcp.com/" target="_blank"><img src="images/logo_bcp.svg" alt="Logo BCP" class="sponsor-logo-footer" style="max-width: 100px;"></a>
            </div>`;
        container.insertAdjacentHTML('beforeend', sponsorHTML);

        scrollToBottom();

        const sourcesBtn = container.querySelector("#sources-cta-button");
        const sourcesView = container.querySelector("#sources-view");
        const backBtn = container.querySelector("#back-to-response-btn");
        const responseContainer = container.querySelector('#response-wrapper');
        const relatedSection = container.querySelector('.related-section');
        const copyBtn = container.querySelector("#copy-response-btn");

        sourcesBtn.classList.add('glow-animation');
        const feedbackButtonsContainer = container.querySelector(".feedback-buttons");
        setupFeedbackButtons(feedbackButtonsContainer);

        sourcesBtn.addEventListener('click', () => {
            relatedSection.style.opacity = '0';
            setTimeout(() => {
                relatedSection.classList.add('hidden');
                sourcesView.classList.remove('hidden');
                sourcesView.style.opacity = '1';
                scrollToBottom();
            }, 300);
        });

        backBtn.addEventListener('click', () => {
            sourcesView.style.opacity = '0';
            setTimeout(() => {
                sourcesView.classList.add('hidden');
                relatedSection.classList.remove('hidden');
                relatedSection.style.opacity = '1';
            }, 300);
        });
        
        if(copyBtn) {
            copyBtn.addEventListener('click', () => {
                const responseText = responseContainer.innerText;
                const icon = copyBtn.querySelector('i');
                navigator.clipboard.writeText(responseText).then(() => {
                    copyBtn.setAttribute('data-tooltip', '¡Copiado!');
                    copyBtn.classList.add('copied');
                    icon.classList.remove('icon-copy');
                    icon.classList.add('icon-check');
                    setTimeout(() => {
                        copyBtn.setAttribute('data-tooltip', 'Copiar');
                        copyBtn.classList.remove('copied');
                        icon.classList.add('icon-copy');
                        icon.classList.remove('icon-check');
                    }, 2000);
                });
            });
        }
    }

    function setupFeedbackButtons(container) {
        const buttons = container.querySelectorAll("button:not(#copy-response-btn)");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                const wasActive = button.classList.contains("active");
                buttons.forEach(btn => btn.classList.remove("active"));
                if (!wasActive) {
                    button.classList.add("active");
                }
            });
        });
    }
    
    function setupTextarea(textareaId) {
        const textarea = document.getElementById(textareaId);
        if (!textarea) return;

        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const sendButton = textarea.closest('.search-container').parentElement.querySelector('.send-button');
                if (sendButton) {
                    sendButton.click();
                }
            }
        });
        
        const initialHeight = textarea.clientHeight;
        const styles = window.getComputedStyle(textarea);
        const lineHeight = parseFloat(styles.lineHeight);
        const maxHeight = (lineHeight * 3);
        textarea.addEventListener('input', () => {
            textarea.style.height = `${initialHeight}px`;
            const scrollHeight = textarea.scrollHeight;
            if (scrollHeight > (maxHeight + initialHeight - lineHeight)) {
                textarea.style.height = `${maxHeight + initialHeight - lineHeight}px`;
                textarea.style.overflowY = 'scroll';
            } else {
                textarea.style.height = `${scrollHeight}px`;
                textarea.style.overflowY = 'hidden';
            }
        });
    }
    
    const autocompleteSuggestions = [
        "miembro de mesa", "DNI vencido", "local de votación", "voto nulo", "voto en blanco", "antecedentes penales"
    ];

    function setupAutocomplete(textareaId, resultsId) {
        const textarea = document.getElementById(textareaId);
        const resultsContainer = document.getElementById(resultsId);
        if (!textarea || !resultsContainer) return;

        textarea.addEventListener('input', () => {
            const query = textarea.value.toLowerCase();
            resultsContainer.innerHTML = '';
            if (query.length < 3) {
                resultsContainer.classList.remove('visible');
                return;
            }

            const filtered = autocompleteSuggestions.filter(item => item.includes(query));
            if (filtered.length > 0) {
                resultsContainer.classList.add('visible');
                filtered.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'autocomplete-item';
                    div.textContent = `¿Cómo saber sobre ${item}?`;
                    div.onclick = () => {
                        textarea.value = div.textContent;
                        resultsContainer.innerHTML = '';
                        resultsContainer.classList.remove('visible');
                    };
                    resultsContainer.appendChild(div);
                });
            } else {
                resultsContainer.classList.remove('visible');
            }
        });
        document.addEventListener('click', (e) => {
            if (e.target !== textarea) {
                resultsContainer.innerHTML = '';
                resultsContainer.classList.remove('visible');
            }
        });
    }

    setupTextarea('prompt-textarea');
    setupTextarea('chat-textarea');
    setupAutocomplete('prompt-textarea', 'autocomplete-results');

    const newThreadBtn = document.getElementById('new-thread-btn');

    function showWelcomeScreenNoAnimation() {
        const welcomeView = document.getElementById('welcome-view');
        const chatFlowContainer = document.getElementById('chat-flow-container');
        const welcomeHeading = document.getElementById('welcome-heading');
        if(mobileNewThreadBtn) mobileNewThreadBtn.classList.add('hidden');

        chatFlowContainer.classList.add('hidden');
        welcomeView.classList.remove('hidden');

        const originalHTML = 'Te damos la bienvenida a Brújula Electoral,<br>Tu guía electoral para el 2026. Pregunta lo que necesites.';
        welcomeHeading.innerHTML = originalHTML;
        welcomeHeading.classList.add('animation-complete');

        const elements = document.querySelectorAll('#welcome-view .fade-in-item');
        elements.forEach(el => {
            el.classList.add('visible');
        });

        // Clear chat log
        const chatLog = document.querySelector('.chat-log');
        if (chatLog) chatLog.innerHTML = '';

        // Reset textareas
        const promptTextarea = document.getElementById('prompt-textarea');
        if (promptTextarea) promptTextarea.value = '';
        const chatTextarea = document.getElementById('chat-textarea');
        if (chatTextarea) chatTextarea.value = '';
    }

    if (newThreadBtn) {
        newThreadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showWelcomeScreenNoAnimation();
            closeMenu();
        });
    }

    if (mobileNewThreadBtn) {
        mobileNewThreadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showWelcomeScreenNoAnimation();
        });
    }
});

function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.responsive-table, .sponsored-content-card');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('hidden-initially');
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the item is visible
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}