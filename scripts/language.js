document.addEventListener('DOMContentLoaded', function() {
    // Configuración inicial
    const currentLanguage = document.getElementById('current-language');
    const savedLang = localStorage.getItem('preferredLanguage') || 'es'; // Cambiado a 'es' como predeterminado
    
    // Traducciones más completas
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
                subtitle: "We offer a wide range of cleaning services tailored to meet your needs.",
                residential: "Residential Cleaning",
                commercial: "Commercial Cleaning",
                deep: "Deep Cleaning",
                move: "Move In/Out Cleaning"
            },
            whyUs: {
                title: "Why Choose Us?",
                quality: "Quality Service",
                qualityDesc: "We use premium products and proven techniques.",
                reliable: "Reliable Team",
                reliableDesc: "Fully vetted and trained professionals.",
                flexible: "Flexible Scheduling",
                flexibleDesc: "We work around your availability."
            },
            contact: {
                title: "Contact Us",
                name: "Your Name",
                email: "Your Email",
                message: "Your Message",
                send: "Send Message"
            },
            common: {
                bookService: "Book This Service",
                pricing: "Pricing",
                learnMore: "Learn More"
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
                subtitle: "Ofrecemos una amplia gama de servicios de limpieza adaptados a tus necesidades.",
                residential: "Limpieza Residencial",
                commercial: "Limpieza Comercial",
                deep: "Limpieza Profunda",
                move: "Limpieza por Mudanza"
            },
            whyUs: {
                title: "¿Por Qué Elegirnos?",
                quality: "Servicio de Calidad",
                qualityDesc: "Usamos productos premium y técnicas comprobadas.",
                reliable: "Equipo Confiable",
                reliableDesc: "Profesionales verificados y capacitados.",
                flexible: "Horarios Flexibles",
                flexibleDesc: "Nos adaptamos a tu disponibilidad."
            },
            contact: {
                title: "Contáctanos",
                name: "Tu Nombre",
                email: "Tu Email",
                message: "Tu Mensaje",
                send: "Enviar Mensaje"
            },
            common: {
                bookService: "Reservar Este Servicio",
                pricing: "Precios",
                learnMore: "Saber Más"
            }
        }
    };

    // Inicializar con el idioma guardado
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
        document.querySelectorAll('[data-translate="nav.home"]').forEach(el => el.textContent = t.nav.home);
        document.querySelectorAll('[data-translate="nav.services"]').forEach(el => el.textContent = t.nav.services);
        document.querySelectorAll('[data-translate="nav.whyUs"]').forEach(el => el.textContent = t.nav.whyUs);
        document.querySelectorAll('[data-translate="nav.contact"]').forEach(el => el.textContent = t.nav.contact);

        // Actualizar hero section
        document.querySelectorAll('[data-translate="hero.title"]').forEach(el => el.textContent = t.hero.title);
        document.querySelectorAll('[data-translate="hero.text"]').forEach(el => el.textContent = t.hero.text);
        document.querySelectorAll('[data-translate="hero.btn"]').forEach(el => el.textContent = t.hero.btn);

        // Actualizar sección de servicios
        document.querySelectorAll('[data-translate="services.title"]').forEach(el => el.textContent = t.services.title);
        document.querySelectorAll('[data-translate="services.subtitle"]').forEach(el => el.textContent = t.services.subtitle);
        document.querySelectorAll('[data-translate="services.residential"]').forEach(el => el.textContent = t.services.residential);
        document.querySelectorAll('[data-translate="services.commercial"]').forEach(el => el.textContent = t.services.commercial);
        document.querySelectorAll('[data-translate="services.deep"]').forEach(el => el.textContent = t.services.deep);
        document.querySelectorAll('[data-translate="services.move"]').forEach(el => el.textContent = t.services.move);

        // Actualizar sección "Why Us"
        document.querySelectorAll('[data-translate="whyUs.title"]').forEach(el => el.textContent = t.whyUs.title);
        document.querySelectorAll('[data-translate="whyUs.quality"]').forEach(el => el.textContent = t.whyUs.quality);
        document.querySelectorAll('[data-translate="whyUs.qualityDesc"]').forEach(el => el.textContent = t.whyUs.qualityDesc);
        document.querySelectorAll('[data-translate="whyUs.reliable"]').forEach(el => el.textContent = t.whyUs.reliable);
        document.querySelectorAll('[data-translate="whyUs.reliableDesc"]').forEach(el => el.textContent = t.whyUs.reliableDesc);
        document.querySelectorAll('[data-translate="whyUs.flexible"]').forEach(el => el.textContent = t.whyUs.flexible);
        document.querySelectorAll('[data-translate="whyUs.flexibleDesc"]').forEach(el => el.textContent = t.whyUs.flexibleDesc);

        // Actualizar sección de contacto
        document.querySelectorAll('[data-translate="contact.title"]').forEach(el => el.textContent = t.contact.title);
        document.querySelectorAll('[data-translate="contact.name"]').forEach(el => el.placeholder = t.contact.name);
        document.querySelectorAll('[data-translate="contact.email"]').forEach(el => el.placeholder = t.contact.email);
        document.querySelectorAll('[data-translate="contact.message"]').forEach(el => el.placeholder = t.contact.message);
        document.querySelectorAll('[data-translate="contact.send"]').forEach(el => el.value = t.contact.send);

        // Actualizar textos comunes
        document.querySelectorAll('[data-translate="common.bookService"]').forEach(el => el.textContent = t.common.bookService);
        document.querySelectorAll('[data-translate="common.pricing"]').forEach(el => el.textContent = t.common.pricing);
        document.querySelectorAll('[data-translate="common.learnMore"]').forEach(el => el.textContent = t.common.learnMore);

        // Actualizar atributos lang y dirección de texto
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
});