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

export const sendWhatsAppMessageAPI = async (
    to: string, 
    templateName: string,
    parameters: string[],
    urlParams: string[],
  ) => {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v21.0/${process.env.PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: to,
            type: "template",
            template: {
              name: templateName,
              language: { code: "es" },
              components: [
                {
                  type: "body",
                  parameters:  parameters.map(value => ({
                    type: "text",
                    text: value
                  }))
                },
                {
                  type: "button",
                  sub_type: "url",  // Especifica que el tipo de botón es URL
                  index: 2,  // El índice debe ser 2 si es el tercer botón en la plantilla (índices empiezan en 0)
                  parameters: urlParams.map(value => ({
                    type: "text",
                    text: value
                  }))
                  
                }
              ]
            }
          })
        }
      );
  
      return await response.json();
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  };