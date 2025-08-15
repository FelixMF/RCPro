document.addEventListener('DOMContentLoaded', async function() {
    // CONFIGURACIÓN
    const COMPANY_PHONE = '13477326277';
    const COMPANY_NAME = 'CleanPro';

    // Variable para el idioma actual
    let currentLang = document.documentElement.lang || 'es';

    // Escuchar cambios de idioma desde language.js
    document.addEventListener('languageChanged', function(e) {
        currentLang = e.detail.lang;
        if (window.calendar) {
            calendar.setOption('locale', currentLang);
        }
    });

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
            calendarEl.style.opacity = '0';
            calendarEl.style.transform = 'translateY(20px)';
            calendarEl.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            
            const bookingDetails = document.querySelector('.booking-details');
            bookingDetails.style.opacity = '0';
            bookingDetails.style.transform = 'translateY(20px)';
            bookingDetails.style.transition = 'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s';
            
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
            confirmBtn.classList.add('btn-clicked');
            setTimeout(() => confirmBtn.classList.remove('btn-clicked'), 300);
            
            const formattedPhone = phone.replace(/\D/g, '');
            const encodedMessage = encodeURIComponent(message);
            
            if (isMobileDevice()) {
                setTimeout(() => {
                    window.location.href = `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`;
                }, 500);
            } else {
                setTimeout(() => {
                    const whatsappWeb = window.open(`https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`, '_blank');
                    
                    setTimeout(() => {
                        if (!whatsappWeb || whatsappWeb.closed) {
                            window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, '_blank');
                        }
                    }, 2000);
                }, 500);
            }
        }

        // 6. Cargar fechas reservadas
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

        // 7. Inicialización de FullCalendar
        const bookedDates = await loadBookedDates();
        
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth'
            },
            locale: currentLang,
            selectable: true,
            validRange: {
                start: new Date()
            },
            dateClick: async function(info) {
                info.dayEl.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    info.dayEl.style.transform = 'scale(1)';
                    info.dayEl.style.transition = 'transform 0.3s ease';
                }, 300);
                
                selectedDate = info.dateStr;
                
                const isAvailable = !bookedDates.includes(selectedDate);
                
                if (isAvailable) {
                    confirmBtn.disabled = false;
                    confirmBtn.classList.add('btn-enabled');
                    setTimeout(() => confirmBtn.classList.remove('btn-enabled'), 1000);
                    
                    updateSelectedDateUI(info.date);
                } else {
                    info.dayEl.classList.add('fc-day-shake');
                    setTimeout(() => info.dayEl.classList.remove('fc-day-shake'), 500);
                    
                    showFeedback(currentLang === 'es' ? 
                        'Esta fecha ya está reservada. Por favor seleccione otra.' : 
                        'This date is already booked. Please select another.', 'error');
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
            datesSet: async function() {
                if (loadingAnimation.parentNode) {
                    loadingAnimation.remove();
                }
                // Recargar fechas reservadas cada vez que se cambia de mes
    const newBookedDates = await loadBookedDates();
    bookedDates.length = 0; // Vaciar array manteniendo referencia
    bookedDates.push(...newBookedDates);
    
    calendar.render(); // Forzar refresco visual
            }
        });

        calendar.render();
        initAnimations();

        // 8. Actualizar la UI con la fecha seleccionada
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
                selectedDateElement.textContent = date.toLocaleDateString(currentLang, options);
                selectedDateElement.style.opacity = '1';
                selectedDateElement.style.transform = 'translateY(0)';
            }, 200);
        }

        // 9. Mostrar feedback visual
        function showFeedback(message, type = 'success') {
            const feedback = document.createElement('div');
            feedback.className = `booking-feedback ${type}`;
            feedback.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : (type === 'error' ? 'exclamation-circle' : 'info-circle')}"></i>
                <span>${message}</span>
            `;
            
            const container = document.querySelector('.booking-details');
            container.appendChild(feedback);
            
            setTimeout(() => {
                feedback.style.opacity = '1';
                feedback.style.transform = 'translateY(0)';
            }, 10);
            
            setTimeout(() => {
                feedback.style.opacity = '0';
                feedback.style.transform = 'translateY(-10px)';
                setTimeout(() => feedback.remove(), 300);
            }, 5000);
        }

        // 10. Manejar la confirmación de reserva
        confirmBtn.addEventListener('click', async function() {
           if (!selectedDate) return;

           document.getElementById('booking-modal').classList.remove('hidden');
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
                alert(currentLang === 'es' ? "Por favor ingrese su nombre." : "Please enter your name.");
                document.getElementById('customerName').focus();
                return;
            }
            if (!/^\+?\d{7,15}$/.test(customerPhone)) {
                alert(currentLang === 'es' ? "Por favor ingrese un número de teléfono válido." : "Please enter a valid phone number.");
                document.getElementById('customerPhone').focus();
                return;
            }

            document.getElementById('submitBtn').disabled = true;
            document.getElementById('cancelBtn').disabled = true;

            try {
                await db.collection('appointments').add({
                    name: customerName,
                    phone: customerPhone,
                    date: selectedDate,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });

                showFeedback(
                    currentLang === 'es' ? 'Reserva realizada con éxito' : 'Booking successful', 
                    'success'
                );

                // Mensaje para WhatsApp en el idioma correcto
                const formattedDate = new Date(selectedDate).toLocaleDateString(currentLang, {
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                });
                
                const message = currentLang === 'es' ?
                    `Hola, soy ${customerName} y deseo reservar un servicio para el ${formattedDate}.` :
                    `Hello, I'm ${customerName} and I want to book a service for ${formattedDate}.`;
                
                openWhatsApp(COMPANY_PHONE, message);

                bookedDates.push(selectedDate);
                confirmBtn.disabled = true;
                selectedDateElement.textContent = '';
                selectedDate = null;

                document.getElementById('booking-modal').classList.add('hidden');
            } catch (error) {
                console.error("Error guardando la reserva:", error);
                showFeedback(
                    currentLang === 'es' ? 'Error al guardar la reserva. Intente de nuevo.' : 'Error saving booking. Please try again.', 
                    'error'
                );
            } finally {
                document.getElementById('submitBtn').disabled = false;
                document.getElementById('cancelBtn').disabled = false;
            }
        });

        // 11. Animaciones CSS
        const style = document.createElement('style');
        style.innerHTML = `
            .btn-clicked {
                animation: clickAnim 0.3s ease forwards;
            }
            @keyframes clickAnim {
                0% { transform: scale(1); }
                50% { transform: scale(0.9); }
                100% { transform: scale(1); }
            }
            .btn-enabled {
                animation: enableAnim 1s ease forwards;
            }
            @keyframes enableAnim {
                0% { box-shadow: 0 0 0 rgba(0, 255, 0, 0); }
                50% { box-shadow: 0 0 10px rgba(0, 255, 0, 0.7); }
                100% { box-shadow: 0 0 0 rgba(0, 255, 0, 0); }
            }
            .fc-day-shake {
                animation: shake 0.5s;
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-5px); }
                40%, 80% { transform: translateX(5px); }
            }
            .booking-feedback {
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                padding: 10px;
                margin-top: 10px;
                border-radius: 5px;
                display: flex;
                align-items: center;
                font-size: 14px;
            }
            .booking-feedback.success {
                background-color: #d4edda;
                color: #155724;
            }
            .booking-feedback.error {
                background-color: #f8d7da;
                color: #721c24;
            }
            .booking-feedback i {
                margin-right: 8px;
            }
            .calendar-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border: 5px solid #f3f3f3;
                border-top: 5px solid #3498db;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                z-index: 999;
            }
            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            .fc-day-past {
                background-color: #f0f0f0;
                color: #999;
            }
            .fc-day-unavailable {
                background-color: #ffc6c6 !important;
                pointer-events: none;
            }
            #booking-modal.hidden {
                display: none;
            }
            #booking-modal {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            #booking-modal .modal-content {
                background: white;
                padding: 20px;
                border-radius: 10px;
                width: 300px;
                max-width: 90%;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            }
            #booking-modal label {
                font-weight: bold;
                margin-top: 10px;
                display: block;
            }
            #booking-modal input {
                width: 100%;
                padding: 8px;
                margin-top: 5px;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-sizing: border-box;
            }
            #booking-modal button {
                margin-top: 15px;
                width: 100%;
                padding: 10px;
                font-weight: bold;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            #submitBtn {
                background-color: #28a745;
                color: white;
            }
            #cancelBtn {
                background-color: #dc3545;
                color: white;
                margin-top: 5px;
            }
        `;
        document.head.appendChild(style);
    } catch (error) {
        console.error("Error initializing app:", error);
        alert(currentLang === 'es' ? 
            "Error al cargar la aplicación. Por favor, recargue la página." : 
            "Error loading the app. Please reload the page.");
    }
});