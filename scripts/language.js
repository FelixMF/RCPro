document.addEventListener('DOMContentLoaded', async function() {
    // Configuración inicial
    const currentLanguage = document.getElementById('current-language');
    const savedLang = localStorage.getItem('preferredLanguage') || 'es';
    
    // Objeto para almacenar traducciones
    const translations = {
        en: { global: {}, pages: {} },
        es: { global: {}, pages: {} }
    };

    // Inicializar
    await initLanguage(savedLang);

    // Manejador del selector de idioma
    document.querySelectorAll('.language-dropdown a').forEach(link => {
        link.addEventListener('click', async function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            await setLanguage(lang);
            
            // Disparar evento para otros componentes
            const event = new CustomEvent('languageChanged', { 
                detail: { lang: lang } 
            });
            document.dispatchEvent(event);
        });
    });

    async function setLanguage(lang) {
        localStorage.setItem('preferredLanguage', lang);
        currentLanguage.textContent = lang.toUpperCase();
        document.documentElement.lang = lang;
        await updateContent(lang);
    }

    async function initLanguage(lang) {
        currentLanguage.textContent = lang.toUpperCase();
        document.documentElement.lang = lang;
        await updateContent(lang);
    }

    async function updateContent(lang) {
        const pageName = getCurrentPageName();
        document.documentElement.lang = lang;

        // Cargar traducciones globales si no están cargadas
        if (!translations[lang].global.loaded) {
            await loadTranslationFile(lang, 'global');
        }
        
        // Cargar traducciones específicas de la página si no están cargadas
        if (!translations[lang].pages[pageName]?.loaded) {
            await loadTranslationFile(lang, pageName);
        }

        // Aplicar traducciones
        applyTranslations(lang, pageName);
    }

    function getCurrentPageName() {
        const path = window.location.pathname;
        let pageName = path.split("/").pop().replace('.html', '');
        if (!pageName || pageName === 'index') pageName = 'index';
        return pageName;
    }

    async function loadTranslationFile(lang, file) {
        try {
            const response = await fetch(`/RCPro/translations/${lang}/${file}.json`);
            if (!response.ok) throw new Error(`No se pudo cargar: ${lang}/${file}.json`);
            
            const data = await response.json();
            if (file === 'global') {
                translations[lang].global = { ...data, loaded: true };
            } else {
                translations[lang].pages[file] = { ...data, loaded: true };
            }
        } catch (error) {
            console.error('Error cargando traducciones:', error);
            if (file === 'global') {
                translations[lang].global = { loaded: true };
            } else {
                translations[lang].pages[file] = { loaded: true };
            }
        }

        console.log(`Cargando traducción: /translations/${lang}/${file}.json`);

    }

    function applyTranslations(lang, pageName) {
    // Traducciones globales
    if (translations[lang].global) {
        translateElements('global.', translations[lang].global);
    }

    // Traducciones de la página sin prefijo (clave raíz)
    if (translations[lang].pages[pageName]) {
        translateElements('', translations[lang].pages[pageName]);
    }

    // Cambiar título de la página
    if (translations[lang].pages[pageName]?.title) {
        document.title = translations[lang].pages[pageName].title;
    }
}

    function translateElements(prefix, translations) {
    const selector = prefix ? `[data-translate^="${prefix}"]` : '[data-translate]';
    document.querySelectorAll(selector).forEach(el => {
        let translateKey = el.getAttribute('data-translate');
        if (prefix && translateKey.startsWith(prefix)) {
            translateKey = translateKey.substring(prefix.length);
        }
        const keys = translateKey.split('.');
        let value = translations;
        for (const key of keys) {
            if (value && value[key] !== undefined) {
                value = value[key];
            } else {
                value = null;
                break;
            }
        }
        if (value !== null) {
            updateElementContent(el, value);
        }
    });
}


    function updateElementContent(el, value) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = value;
        } else if (el.tagName === 'INPUT' && el.type === 'submit') {
            el.value = value;
        } else {
            el.textContent = value;
        }
    }
});



