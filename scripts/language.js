// language.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const currentLanguage = document.getElementById('current-language');
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    
    
    const translations = {
        en: {
            nav: {
                home: "Home",
                services: "Services",
                whyUs: "Why Us",
                contact: "Contact"
            },
            hero: {
                title: "Professional Cleaning Services",
                text: "Delivering excellence in every clean. Transform your space with our trusted team.",
                btn: "Book Now"
            },
            services: {
                title: "Our Services",
                subtitle: "We offer a wide range of cleaning services tailored to meet your needs."
            },
            // Agrega más secciones según necesites
            common: {
                bookService: "Book This Service",
                pricing: "Pricing"
            }
        },
        es: {
            nav: {
                home: "Inicio",
                services: "Servicios",
                whyUs: "Ventajas",
                contact: "Contacto"
            },
            hero: {
                title: "Servicios Profesionales de Limpieza",
                text: "Excelencia en cada limpieza. Transformamos tus espacios con nuestro equipo confiable.",
                btn: "Reservar Ahora"
            },
            services: {
                title: "Nuestros Servicios",
                subtitle: "Ofrecemos una amplia gama de servicios de limpieza adaptados a tus necesidades."
            },
            // Agrega más secciones según necesites
            common: {
                bookService: "Reservar Este Servicio",
                pricing: "Precios"
            }
        }
    };

    // Inicializar con el idioma guardado o predeterminado
    initLanguage(savedLang);

    // Manejador del selector de idioma
    document.querySelectorAll('.language-dropdown a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // Función para establecer el idioma
    function setLanguage(lang) {
        localStorage.setItem('preferredLanguage', lang);
        currentLanguage.textContent = lang.toUpperCase();
        updateContent(lang);
    }

    // Función para inicializar el idioma
    function initLanguage(lang) {
        currentLanguage.textContent = lang.toUpperCase();
        updateContent(lang);
    }

    // Función principal para actualizar contenido
    function updateContent(lang) {
        const t = translations[lang];
        if (!t) return;

        // Actualizar navegación
        const navLinks = document.querySelectorAll('.nav-links a');
        if (navLinks.length >= 4) {
            navLinks[0].textContent = t.nav.home;
            navLinks[1].textContent = t.nav.services;
            navLinks[2].textContent = t.nav.whyUs;
            navLinks[3].textContent = t.nav.contact;
        }

        // Actualizar hero section
        const heroTitle = document.querySelector('.hero-content h1');
        const heroText = document.querySelector('.hero-content p');
        const heroBtn = document.querySelector('.hero-content .btn');
        
        if (heroTitle) heroTitle.textContent = t.hero.title;
        if (heroText) heroText.textContent = t.hero.text;
        if (heroBtn) heroBtn.textContent = t.hero.btn;

        // Actualizar sección de servicios
        const servicesTitle = document.querySelector('.section-title h2');
        const servicesSubtitle = document.querySelector('.section-title p');
        if (servicesTitle && t.services) servicesTitle.textContent = t.services.title;
        if (servicesSubtitle && t.services) servicesSubtitle.textContent = t.services.subtitle;

        // Actualizar botones y textos comunes
        document.querySelectorAll('.btn:not(.hero-content .btn)').forEach(btn => {
            if (btn.textContent.includes("Book")) {
                btn.textContent = t.common.bookService;
            }
        });

        document.querySelectorAll('h3').forEach(el => {
            if (el.textContent === "Pricing") {
                el.textContent = t.common.pricing;
            }
        });

        // Agrega más actualizaciones según necesites
        console.log(`Idioma cambiado a: ${lang}`);
    }
});