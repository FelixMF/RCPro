// Animaciones al hacer scroll - Versión Mejorada
document.addEventListener('DOMContentLoaded', function() {
    // Configuración mejorada del Observer
    const observerOptions = {
        threshold: 0.15, // Aumentamos el threshold
        rootMargin: '0px 0px -100px 0px' // Más margen negativo
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                
                // Animación principal para la sección
                section.classList.add('animate');
                
                // Animaciones específicas para cada sección
                if (section.classList.contains('services')) {
                    animateServiceCards(section);
                } else if (section.id === 'why-us') {
                    animateWhyUsFeatures(section);
                }
                
                console.log(`Sección animada: ${section.id || section.className}`);
            }
        });
    };

    // Función para animar las tarjetas de servicios
    function animateServiceCards(section) {
        const serviceCards = section.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 100 + 200);
        });
    }

    // Función específica para Why Choose Us
    function animateWhyUsFeatures(section) {
        const features = section.querySelectorAll('.feature');
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.classList.add('animate');
            }, index * 150 + 300);
        });
        
        // Forzar display del container si es necesario
        const container = section.querySelector('.container');
        if (container) {
            container.style.display = 'block';
            container.style.opacity = '1';
        }
    }

    // Crear e inicializar el observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Configuración inicial para secciones
    const scrollSections = document.querySelectorAll('[data-scroll]');
    scrollSections.forEach(section => {
        // Configuración inicial para asegurar visibilidad
        section.style.opacity = '1';
        section.style.transform = 'none';
        
        // Configuración específica para why-us
        if (section.id === 'why-us') {
            const features = section.querySelectorAll('.feature');
            features.forEach(feature => {
                feature.style.opacity = '0';
                feature.style.transform = 'translateY(20px)';
                feature.style.transition = 'all 0.6s ease-out';
            });
        }
        
        observer.observe(section);
    });

    // Animación inicial para el hero
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        setTimeout(() => {
            heroSection.classList.add('animate');
        }, 500);
    }

    // Debugging
    /*console.log('Total secciones observadas:', scrollSections.length);
    const whyUsSection = document.getElementById('why-us');
    if (whyUsSection) {
        console.log('Why Us section encontrada, features:', 
            whyUsSection.querySelectorAll('.feature').length);
    }*/
});