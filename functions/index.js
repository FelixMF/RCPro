const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// 1. Endpoint para obtener días disponibles
exports.getAvailableDates = functions.https.onCall(async (data, context) => {
    const { month, year } = data;
    
    try {
        // Obtener todas las citas del mes
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
        
        const appointmentsSnapshot = await db.collection('appointments')
            .where('date', '>=', startDate)
            .where('date', '<=', endDate)
            .get();
        
        const blockedSnapshot = await db.collection('blocked_dates')
            .where('__name__', '>=', startDate)
            .where('__name__', '<=', endDate)
            .get();
        
        // Combinar fechas ocupadas
        const busyDates = [
            ...appointmentsSnapshot.docs.map(doc => doc.data().date),
            ...blockedSnapshot.docs.map(doc => doc.id)
        ];
        
        // Generar lista de días disponibles
        const availableDates = [];
        const daysInMonth = new Date(year, month, 0).getDate();
        const today = new Date().toISOString().split('T')[0];
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dateObj = new Date(dateStr);
            
            // Excluir fines de semana (opcional)
            const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
            
            if (dateStr >= today && !busyDates.includes(dateStr) && !isWeekend) {
                availableDates.push(dateStr);
            }
        }
        
        return { availableDates };
    } catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});

// 2. Función para crear nueva cita
exports.createAppointment = functions.https.onCall(async (data, context) => {
    const { date, customerName, customerPhone, serviceType } = data;
    
    // Validación básica
    if (!date || !customerPhone) {
        throw new functions.https.HttpsError('invalid-argument', 'Datos requeridos faltantes');
    }
    
    try {
        // Verificar disponibilidad
        const dateDoc = await db.collection('blocked_dates').doc(date).get();
        if (dateDoc.exists) {
            throw new functions.https.HttpsError('failed-precondition', 'Fecha no disponible');
        }
        
        // Crear nueva cita
        const newAppointment = {
            date,
            customerName,
            customerPhone,
            serviceType,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = await db.collection('appointments').add(newAppointment);
        
        // Opcional: Bloquear fecha temporalmente
        await db.collection('blocked_dates').doc(date).set({
            reason: `Reserva pendiente: ${customerName}`,
            appointmentId: docRef.id
        });
        
        // Enviar WhatsApp (usando Twilio u otro servicio)
        await sendWhatsAppConfirmation(customerPhone, date);
        
        return { id: docRef.id, ...newAppointment };
    } catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});

// Función auxiliar para enviar WhatsApp
async function sendWhatsAppConfirmation(phone, date) {
    // Implementación con Twilio o API de WhatsApp
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    
    await client.messages.create({
        body: `¡Gracias por reservar con nosotros para el ${date}! Confirmaremos tu cita pronto.`,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${phone}`
    });
}