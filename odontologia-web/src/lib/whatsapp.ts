import Twilio from 'twilio';

type TwilioMessageResponse = {
    sid: string;
    status: string;
    errorCode: number | null;
    errorMessage: string | null;
};

export async function sendWhatsAppMessage(name: string, service: string, date: string, time: string, gmail: string, phone: string) {
    try {
        const twilio = Twilio(process.env.TWILIO_SID as string, process.env.TWILIO_TOKEN as string);

        const message: TwilioMessageResponse = await twilio.messages.create({
            from: 'whatsapp:+14155238886',
            //mensaje profesional con los datos del paciente
            body: `📅 *Nueva Solicitud de Cita* 📅

*Servicio:* ${service}

*Nombre del Paciente:* 
${name}

*Fecha Programada:* ${date}
*Hora Estimada:* ${time}

📧 *Contacto:*
Correo Electrónico: 
${gmail}
Teléfono: ${phone}

_Por favor confirme esta cita respondiendo:_ 
✅ CONFIRMAR
❌ RECHAZAR
🔄 REPROGRAMAR

Gracias por usar nuestro sistema de citas automatizado.`,
            to: 'whatsapp:+50662633553'
        });

        return message.status;
    } catch (error) {
        return (error as Error).message;
    }
}
