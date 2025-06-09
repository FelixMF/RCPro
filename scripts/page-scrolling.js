// Animaciones al hacer scroll
document.addEventListener('DOMContentLoaded', function() {
    // Configuración del Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Función para manejar las intersecciones
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animación para la sección principal
                entry.target.classList.add('animate');
                
                // Animación especial para las tarjetas de servicios
                if (entry.target.classList.contains('services')) {
                    const serviceCards = entry.target.querySelectorAll('.service-card');
                    serviceCards.forEach(card => {
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, 100);
                    });
                }
                
                // Opcional: dejar de observar después de la animación
                // observer.unobserve(entry.target);
            }
        });
    };

    // Crear el observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observar todas las secciones con data-scroll
    const scrollSections = document.querySelectorAll('[data-scroll]');
    scrollSections.forEach(section => {
        observer.observe(section);
    });

    // Opcional: Animación inicial para el hero sin esperar scroll
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        setTimeout(() => {
            heroSection.classList.add('animate');
        }, 300);
    }
});