document.addEventListener('DOMContentLoaded', function() {
    // Inicializa el calendario
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
        },
        selectable: true,
        select: function(info) {
            handleDateSelect(info.start);
        },
        validRange: {
            start: new Date() // No permite seleccionar fechas pasadas
        },
        dateClick: function(info) {
            handleDateSelect(info.date);
        },
        dayCellClassNames: function(arg) {
            // Marcar días no disponibles (ejemplo)
            const unavailableDates = [
                '2024-06-15',
                '2024-06-20',
                '2024-06-25'
            ];
            
            if (unavailableDates.includes(arg.date.toISOString().split('T')[0])) {
                return ['fc-day-unavailable'];
            }
        }
    });
    calendar.render();

    // Maneja la selección de fecha
    function handleDateSelect(date) {
        const selectedDate = document.getElementById('selected-date');
        selectedDate.textContent = date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Activa el botón de confirmación
        document.getElementById('confirm-booking').disabled = false;
    }

    // Maneja la confirmación por WhatsApp
    document.getElementById('confirm-booking').addEventListener('click', function() {
        const selectedDate = document.getElementById('selected-date').textContent;
        
        // Número de teléfono (reemplaza con el tuyo)
        const phoneNumber = '1234567890';
        
        // Mensaje predeterminado
        const message = `Hola, quisiera reservar una cita para el ${selectedDate}. Por favor confírmenme disponibilidad.`;
        
        // Codifica el mensaje para URL
        const encodedMessage = encodeURIComponent(message);
        
        // Abre WhatsApp
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    });
});