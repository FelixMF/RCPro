document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero');
    
    if(heroSection) {
        // Ajusta el punto de activación (60 = 60px desde el top)
        const stickyPoint = 60;
        
        window.addEventListener('scroll', function() {
            if(window.scrollY > stickyPoint) {
                header.classList.add('header-sticky');
                header.classList.remove('header-transparent');
            } else {
                header.classList.remove('header-sticky');
                header.classList.add('header-transparent');
            }
        });
    }
    
    // Asegura que el header tenga la clase correcta al cargar
    if(window.scrollY <= 60) {
        header.classList.add('header-transparent');
    }
});