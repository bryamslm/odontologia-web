// import { sendMail } from "@/lib/email";

// export default async function handler(req, res) {
//     //Verificar firma Twilio
//     //if (!validarTwilioSignature(req)) return res.status(403).end();
  
//     const { Body, From, ButtonText } = req.body;
    
//     // Actualizar base de datos según botón
//     const { data, error } = await supabase
//       .from('citas')
//       .update({ estado: ButtonText.toLowerCase() })
//       .eq('telefono_paciente', 'NUMERO_DEL_PACIENTE');
  
//     // Enviar email de confirmación
//     await sendMail({
//       to: 'paciente@email.com',
//       subject: `Karen ha ${ButtonText} tu cita`
//     });
  
//     res.setHeader('Content-Type', 'text/xml');
//     res.send('<Response></Response>'); // Respuesta vacía para Twilio
//   }