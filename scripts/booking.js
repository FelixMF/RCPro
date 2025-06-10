document.addEventListener('DOMContentLoaded', async function() {
    // CONFIGURACIÓN (MODIFICA ESTOS VALORES)
    const COMPANY_PHONE = '13477326277'; // Tu número con código de país
    const COMPANY_NAME = 'CleanPro'; // Nombre de tu empresa

    // 1. Inicialización de Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyDKXnlCAa0yQ-wrf1hr_qpQI7t4H_JMGrc",
        authDomain: "calendarcleanpro.firebaseapp.com",
        projectId: "calendarcleanpro",
        storageBucket: "calendarcleanpro.appspot.com",
        messagingSenderId: "632510156360",
        appId: "1:632510156360:web:460315cd6e99c454fed27d"
    };
    
    // Inicializa Firebase con animación de carga
    const loadingAnimation = document.createElement('div');
    loadingAnimation.className = 'calendar-loading';
    document.getElementById('calendar').appendChild(loadingAnimation);
    
    try {
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        
        // 2. Variables globales
        let selectedDate = null;
        const calendarEl = document.getElementById('calendar');
        const confirmBtn = document.getElementById('confirm-booking');
        const selectedDateElement = document.getElementById('selected-date');
        confirmBtn.disabled = true;

        // 3. Animaciones de entrada
        function initAnimations() {
            // Animación para el contenedor del calendario
            calendarEl.style.opacity = '0';
            calendarEl.style.transform = 'translateY(20px)';
            calendarEl.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            
            // Animación para los detalles de reserva
            const bookingDetails = document.querySelector('.booking-details');
            bookingDetails.style.opacity = '0';
            bookingDetails.style.transform = 'translateY(20px)';
            bookingDetails.style.transition = 'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s';
            
            // Activar animaciones después de un breve retraso
            setTimeout(() => {
                calendarEl.style.opacity = '1';
                calendarEl.style.transform = 'translateY(0)';
                bookingDetails.style.opacity = '1';
                bookingDetails.style.transform = 'translateY(0)';
            }, 100);
        }

        // 4. Detectar dispositivo
        function isMobileDevice() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }

        // 5. Función para abrir WhatsApp con animación
        function openWhatsApp(phone, message) {
            // Animación de clic en el botón
            confirmBtn.classList.add('btn-clicked');
            setTimeout(() => confirmBtn.classList.remove('btn-clicked'), 300);
            
            const formattedPhone = phone.replace(/\D/g, '');
            const encodedMessage = encodeURIComponent(message);
            
            if (isMobileDevice()) {
                // Abrir en app nativa con retraso para que se vea la animación
                setTimeout(() => {
                    window.location.href = `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`;
                }, 500);
            } else {
                // Abrir en WhatsApp Web
                setTimeout(() => {
                    const whatsappWeb = window.open(`https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`, '_blank');
                    
                    // Fallback después de 2 segundos si WhatsApp Web no carga
                    setTimeout(() => {
                        if (!whatsappWeb || whatsappWeb.closed) {
                            window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, '_blank');
                        }
                    }, 2000);
                }, 500);
            }
        }

        // 6. Cargar fechas reservadas con animación de carga
        async function loadBookedDates() {
            const today = new Date().toISOString().split('T')[0];
            
            try {
                const snapshot = await db.collection('appointments')
                    .where('date', '>=', today)
                    .get();
                    
                return snapshot.docs.map(doc => doc.data().date);
            } catch (error) {
                console.error("Error loading booked dates:", error);
                return [];
            }
        }

        // 7. Inicialización de FullCalendar con animaciones
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
                // Animación de selección de fecha
                info.dayEl.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    info.dayEl.style.transform = 'scale(1)';
                    info.dayEl.style.transition = 'transform 0.3s ease';
                }, 300);
                
                selectedDate = info.dateStr;
                
                // Verificar disponibilidad
                const isAvailable = !bookedDates.includes(selectedDate);
                
                if (isAvailable) {
                    // Animación al habilitar el botón
                    confirmBtn.disabled = false;
                    confirmBtn.classList.add('btn-enabled');
                    setTimeout(() => confirmBtn.classList.remove('btn-enabled'), 1000);
                    
                    updateSelectedDateUI(info.date);
                } else {
                    // Animación para fecha no disponible
                    info.dayEl.classList.add('fc-day-shake');
                    setTimeout(() => info.dayEl.classList.remove('fc-day-shake'), 500);
                    
                    showFeedback('Esta fecha ya está reservada. Por favor seleccione otra.', 'error');
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
            },
            datesSet: function() {
                // Eliminar animación de carga cuando el calendario está listo
                if (loadingAnimation.parentNode) {
                    loadingAnimation.remove();
                }
            }
        });

        calendar.render();
        initAnimations();

        // 8. Actualizar la UI con la fecha seleccionada (con animación)
        function updateSelectedDateUI(date) {
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            
            selectedDateElement.style.opacity = '0';
            selectedDateElement.style.transform = 'translateY(10px)';
            selectedDateElement.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                selectedDateElement.textContent = date.toLocaleDateString('es-ES', options);
                selectedDateElement.style.opacity = '1';
                selectedDateElement.style.transform = 'translateY(0)';
            }, 200);
        }

        // 9. Mostrar feedback visual
        function showFeedback(message, type = 'success') {
            const feedback = document.createElement('div');
            feedback.className = `booking-feedback ${type}`;
            feedback.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            `;
            
            const container = document.querySelector('.booking-details');
            container.appendChild(feedback);
            
            // Animación de entrada
            setTimeout(() => {
                feedback.style.opacity = '1';
                feedback.style.transform = 'translateY(0)';
            }, 10);
            
            // Eliminar después de 5 segundos
            setTimeout(() => {
                feedback.style.opacity = '0';
                feedback.style.transform = 'translateY(-10px)';
                setTimeout(() => feedback.remove(), 300);
            }, 5000);
        }

        // 10. Manejar la confirmación de reserva con animaciones
        confirmBtn.addEventListener('click', async function() {
           if (!selectedDate) return;

    // Mostrar modal
    document.getElementById('booking-modal').classList.remove('hidden');

    // Limpiar inputs
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerName').focus();
});

// Cancelar y cerrar modal
document.getElementById('cancelBtn').addEventListener('click', function () {
    document.getElementById('booking-modal').classList.add('hidden');
});

// Confirmar reserva desde modal
document.getElementById('submitBtn').addEventListener('click', async function () {
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();

    if (!customerName) {
        alert("Por favor ingrese su nombre completo.");
        document.getElementById('customerName').focus();
        return;
    }

    if (!customerPhone) {
        alert("Por favor ingrese su número de contacto.");
        document.getElementById('customerPhone').focus();
        return;
    }

    document.getElementById('booking-modal').classList.add('hidden');

    const formattedDate = new Date(selectedDate).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    try {
        showFeedback('Procesando su reserva...', 'info');

        const docRef = await db.collection('appointments').add({
            date: selectedDate,
            customerName,
            customerPhone: customerPhone.replace(/\D/g, ''),
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            notified: false
        });

        const message = `*${COMPANY_NAME} - Confirmación de Nueva Reserva*%0A%0A` +
                `🗓️ *Fecha de la Reserva:* ${formattedDate}%0A` +
                `👤 *Nombre del Cliente:* ${customerName}%0A` +
                `📞 *Teléfono de Contacto:* ${customerPhone}%0A` +
                `🆔 *ID de Reserva:* ${docRef.id}%0A%0A` +
                `_Le agradecemos confirmar esta reserva a la brevedad. Quedamos atentos a su respuesta._`;

        openWhatsApp(COMPANY_PHONE, message);

        bookedDates.push(selectedDate);
        calendar.refetchEvents();
        confirmBtn.disabled = true;

        showFeedback('¡Reserva registrada con éxito! Se abrirá WhatsApp para confirmación.', 'success');

    } catch (error) {
        console.error("Error al guardar reserva:", error);
        showFeedback("Ocurrió un error al guardar la reserva. Por favor intente nuevamente.", 'error');
    }
        });

        // 11. Estilos CSS dinámicos con animaciones
        const style = document.createElement('style');
        style.textContent = `
            /* Animaciones base */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(20px); }
                to { transform: translateY(0); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-5px); }
                40%, 80% { transform: translateX(5px); }
            }
            
            @keyframes btnClick {
                0% { transform: scale(1); }
                50% { transform: scale(0.95); }
                100% { transform: scale(1); }
            }
            
            @keyframes btnEnable {
                0% { transform: scale(1); box-shadow: 0 0 0 rgba(37, 211, 102, 0); }
                50% { transform: scale(1.05); box-shadow: 0 0 15px rgba(37, 211, 102, 0.4); }
                100% { transform: scale(1); box-shadow: 0 0 0 rgba(37, 211, 102, 0); }
            }
            
            /* Estilos para el calendario */
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
            
            .fc-day-shake {
                animation: shake 0.5s ease;
            }
            
            /* Estilos para la fecha seleccionada */
            #selected-date {
                font-size: 1.1em;
                margin: 15px 0;
                padding: 10px;
                background: #f0f7ff;
                border-radius: 5px;
                border-left: 4px solid #3498db;
                transition: all 0.3s ease;
            }
            
            /* Estilos para el botón de confirmación */
            #confirm-booking {
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            #confirm-booking:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            #confirm-booking:not(:disabled):hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
            }
            
            #confirm-booking.btn-clicked {
                animation: btnClick 0.3s ease;
            }
            
            #confirm-booking.btn-enabled {
                animation: btnEnable 1s ease;
            }
            
            /* Feedback de reserva */
            .booking-feedback {
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.3s ease;
                margin-top: 15px;
                padding: 12px;
                border-radius: 5px;
                display: flex;
                align-items: center;
                font-size: 0.9em;
            }
            
            .booking-feedback i {
                margin-right: 10px;
                font-size: 1.2em;
            }
            
            .booking-feedback.success {
                background: #e8f5e9;
                color: #2e7d32;
                border-left: 4px solid #4caf50;
            }
            
            .booking-feedback.error {
                background: #ffebee;
                color: #c62828;
                border-left: 4px solid #f44336;
            }
            
            .booking-feedback.info {
                background: #e3f2fd;
                color: #1565c0;
                border-left: 4px solid #2196f3;
            }
            
            /* Animación de carga */
            .calendar-loading {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #f5f5f5;
                border-radius: 8px;
                overflow: hidden;
            }
            
            .calendar-loading::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
                animation: loading 1.5s infinite;
            }
            
            @keyframes loading {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);

    } catch (error) {
        console.error("Error initializing Firebase:", error);
        loadingAnimation.textContent = 'Error al cargar el calendario. Por favor recarga la página.';
        loadingAnimation.style.color = 'red';
        loadingAnimation.style.padding = '20px';
        loadingAnimation.style.textAlign = 'center';
    }
});