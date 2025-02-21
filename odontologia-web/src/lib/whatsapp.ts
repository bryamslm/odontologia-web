// import Twilio from 'twilio';

//import { X, XCircle } from "lucide-react";
import { supabase } from '../lib/supabaseClient';

// type TwilioMessageResponse = {
//     sid: string;
//     status: string;
//     errorCode: number | null;
//     errorMessage: string | null;
// };

// export async function sendWhatsAppMessage(name: string, service: string, date: string, time: string, gmail: string, phone: string) {
//     try {
//         const twilio = Twilio(process.env.TWILIO_SID as string, process.env.TWILIO_TOKEN as string);

//         const message: TwilioMessageResponse = await twilio.messages.create({
//             from: 'whatsapp:+14155238886',
//             //mensaje profesional con los datos del paciente
//             body: `📅 *Nueva Solicitud de Cita* 📅

// *Servicio:* ${service}

// *Nombre del Paciente:* 
// ${name}

// *Fecha Programada:* ${date}
// *Hora Estimada:* ${time}

// 📧 *Contacto:*
// Correo Electrónico: 
// ${gmail}
// Teléfono: ${phone}

// _Por favor confirme esta cita respondiendo:_ 
// ✅ CONFIRMAR
// ❌ RECHAZAR
// 🔄 REPROGRAMAR

// Gracias por usar nuestro sistema de citas automatizado.`,
//             to: 'whatsapp:+50662633553'
//         });

//         return message.status;
//     } catch (error) {
//         return (error as Error).message;
//     }
// }

/**
 * Sends a WhatsApp message using a template via Facebook Graph API.
 *
 * @param {string} to - The recipient's WhatsApp number.
 * @param {string} templateName - The name of the message template.
 * @param {string[]} parameters - The template parameters.
 * @param {string[]} urlParams - The URL parameters for buttons.
 * @returns {Promise<any>} - The response data from the API.
 */




export const sendWhatsAppMessageAPI = async (
    to: string,
    templateName: string,
    parameters: string[],
    //urlParams: string[],
) => {
    try {

        const saveMessageId = async (messageId: string) => {
            const { data: dataUpdate, error } = await supabase.from('citas').update({
                whatsapp_message_id: messageId
            }).eq('numero', parameters[6]);
            if (error) {
                console.error('Error updating message ID:', error);
            }
           
        };




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
                                parameters: parameters.map(value => ({
                                    type: "text",
                                    text: value
                                }))
                            },
                           
                        ]
                    }
                })
            }
        );

        const data = await response.json();
        console.log('WhatsApp message sent:', data);
        // Extraer el ID del mensaje enviado
        if (data.messages && data.messages.length > 0) {
            const messageId = data.messages[0].id;
            console.log('📌 Message ID:', messageId);
            // Guardar el ID del mensaje en la base de datos
            const res = saveMessageId(messageId);
            res.then(() => console.log('📌 Message ID saved then:', messageId)).catch((error) => console.error('Error saving message ID then:', error));
        }
        return data;
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw error;
    }
};