document.addEventListener('DOMContentLoaded', async function() {
    // CONFIGURACIÓN (MODIFICA ESTOS VALORES)
    const COMPANY_PHONE = '593984612134'; // Tu número con código de país
    const COMPANY_NAME = 'CleanPro'; // Nombre de tu empresa

    // 1. Inicialización de Firebase
    const firebaseConfig = {
    apiKey: "AIzaSyDKXnlCAa0yQ-wrf1hr_qpQI7t4H_JMGrc",
    authDomain: "calendarcleanpro.firebaseapp.com",
    projectId: "calendarcleanpro",
    storageBucket: "calendarcleanpro.firebasestorage.app",
    messagingSenderId: "632510156360",
    appId: "1:632510156360:web:460315cd6e99c454fed27d"
};
    
    // Inicializa Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // 2. Variables globales
    let selectedDate = null;
    const calendarEl = document.getElementById('calendar');
    const confirmBtn = document.getElementById('confirm-booking');
    confirmBtn.disabled = true;

    // 3. Detectar dispositivo
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // 4. Función para abrir WhatsApp
    function openWhatsApp(phone, message) {
        const formattedPhone = phone.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(message);
        
        if (isMobileDevice()) {
            // Abrir en app nativa
            window.location.href = `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`;
        } else {
            // Abrir en WhatsApp Web
            const whatsappWeb = window.open(`https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`, '_blank');
            
            // Fallback después de 2 segundos si WhatsApp Web no carga
            setTimeout(() => {
                if (!whatsappWeb || whatsappWeb.closed) {
                    window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, '_blank');
                }
            }, 2000);
        }
    }

    // 5. Cargar fechas reservadas
    async function loadBookedDates() {
        const today = new Date().toISOString().split('T')[0];
        const snapshot = await db.collection('appointments')
            .where('date', '>=', today)
            .get();
        return snapshot.docs.map(doc => doc.data().date);
    }

    // 6. Inicialización de FullCalendar con fechas ocupadas
    const bookedDates = await loadBookedDates();
    
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
        },
        locale: 'es',
        selectable: true,
        validRange: {
            start: new Date()
        },
        dateClick: async function(info) {
            selectedDate = info.dateStr;
            
            // Verificar disponibilidad
            const isAvailable = !bookedDates.includes(selectedDate);
            confirmBtn.disabled = !isAvailable;
            
            if (isAvailable) {
                updateSelectedDateUI(info.date);
            } else {
                alert('Esta fecha ya está reservada. Por favor seleccione otra.');
            }
        },
        dayCellClassNames: function(arg) {
            const dateStr = arg.date.toISOString().split('T')[0];
            const classes = [];
            
            if (dateStr < new Date().toISOString().split('T')[0]) {
                classes.push('fc-day-past');
            }
            if (bookedDates.includes(dateStr)) {
                classes.push('fc-day-unavailable');
            }
            return classes;
        }
    });

    calendar.render();

    // 7. Actualizar la UI con la fecha seleccionada
    function updateSelectedDateUI(date) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('selected-date').textContent = 
            date.toLocaleDateString('es-ES', options);
    }

    // 8. Manejar la confirmación de reserva
    confirmBtn.addEventListener('click', async function() {
        if (!selectedDate) return;
        
        const customerName = prompt("Por favor ingrese su nombre completo:");
        if (!customerName) return;

        const customerPhone = prompt("Ingrese su número de contacto (ej: 0991234567):");
        if (!customerPhone) return;

        // Formatear fecha
        const formattedDate = new Date(selectedDate).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        try {
            // Guardar en Firestore
            const docRef = await db.collection('appointments').add({
                date: selectedDate,
                customerName,
                customerPhone: customerPhone.replace(/\D/g, ''),
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                notified: false
            });

            // Crear mensaje estructurado
            const message = `*${COMPANY_NAME} - Nueva Reserva*%0A%0A` +
                            `📅 *Fecha:* ${formattedDate}%0A` +
                            `👤 *Cliente:* ${customerName}%0A` +
                            `📱 *Teléfono:* ${customerPhone}%0A` +
                            `🔖 *ID Reserva:* ${docRef.id}%0A%0A` +
                            `_Por favor confirme esta reserva_`;

            // Abrir WhatsApp
            openWhatsApp(COMPANY_PHONE, message);
            
            // Actualizar UI
            bookedDates.push(selectedDate);
            calendar.refetchEvents();
            confirmBtn.disabled = true;
            
            alert('¡Reserva registrada con éxito! Se abrirá WhatsApp para confirmación.');
            
        } catch (error) {
            console.error("Error al guardar reserva:", error);
            alert("Ocurrió un error al guardar la reserva. Por favor intente nuevamente.");
        }
    });

    // 9. Estilos CSS
    const style = document.createElement('style');
    style.textContent = `
        .fc-day-past {
            background-color: #f9f9f9;
            color: #d3d3d3;
            cursor: not-allowed;
        }
        .fc-day-unavailable {
            background-color: #ffebee !important;
            cursor: not-allowed;
        }
        .fc-day-unavailable a {
            color: #bdbdbd !important;
            text-decoration: line-through;
        }
        #selected-date {
            font-size: 1.1em;
            margin: 15px 0;
            padding: 10px;
            background: #f0f7ff;
            border-radius: 5px;
            border-left: 4px solid #3498db;
        }
        #confirm-booking:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
});