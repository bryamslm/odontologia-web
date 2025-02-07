// import { supabase } from "@/lib/supabaseClient";

// export async function whatsappResponse(message: any){
//     if (message.text?.body) {
//         const text = message.text.body;
//         console.log('📩 Mensaje de texto:', text);

//         if (text.toLowerCase() === 'rechazar') {
//             //actualiza en supabase la tabla 
//         }
//     } else if (message.button?.text) {
//         const button = message.button.text;
//         console.log('📩 Mensaje de botón:', button);

//         if (button.toLowerCase() === 'confirmar') {
//             await updateDatabase(message.from, 'Confirmado');
//             await sendEmailConfirmation(message.from, 'Cita confirmada');
//         }
//     }
// }