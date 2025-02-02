// src/app/citas/reservar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { sendMail } from "@/lib/email"; // la ruta que corresponda
import { sendWhatsAppMessage } from "@/lib/whatsapp"; // la ruta que corresponda

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nombre, correo, telefono, fecha, hora, tipo } = body;

        // Inserta en la tabla "citas"
        const { data, error } = await supabase.from("citas").insert([
            {
                nombre_paciente: nombre,
                correo_paciente: correo,
                telefono_paciente: telefono,
                fecha_cita: fecha,
                hora_cita: hora,
                tipo_cita: tipo,
            },
        ]);
        //fechaFormat cambia formato de AAAA-MM-DD a DD/MM/AAAA
        const fechaFormat = fecha.split("-").reverse().join("/");

        if (error) {

            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        if (!error) {
            // Para el paciente
            const pacienteHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container { max-width: 600px; margin: 20px auto; font-family: Arial, sans-serif; }
                .header { background: #f8f9fa; padding: 20px; text-align: center; }
                .logo { max-width: 150px; }
                .content { padding: 30px; background: white; }
                .details { margin: 20px 0; border-collapse: collapse; width: 100%; }
                .details td { padding: 10px; border-bottom: 1px solid #eee; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
                .button { background: #3b82f6; color: white!important; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://odontologia-web.vercel.app/logo-5.svg" alt="Clínica Dental Keis" class="logo">
                </div>
                
                <div class="content">
                    <h2 style="color: #2d3748;">¡Hola ${nombre}!</h2>
                    <p style="color: #4a5568;">Tu cita en Clínica Dental Keis ha sido confirmada:</p>
                    
                    <table class="details">
                        <tr>
                            <td><strong>📅 Fecha:</strong></td>
                            <td>${fechaFormat}</td>
                        </tr>
                        <tr>
                            <td><strong>⏰ Hora:</strong></td>
                            <td>${hora}</td>
                        </tr>
                        <tr>
                            <td><strong>📌 Servicio:</strong></td>
                            <td>${tipo}</td>
                        </tr>
                        <tr>
                            <td><strong>📍 Dirección:</strong></td>
                            <td>Av. Principal #123, San Carlos, Alajuela</td>
                        </tr>
                    </table>

                    <div style="margin: 30px 0; background: #f0f4ff; padding: 20px; border-radius: 8px;">
                        <h3 style="color: #2d3748; margin-top: 0;">Preparación para tu cita</h3>
                        <ul style="color: #4a5568; padding-left: 20px;">
                            <li>Llegar 15 minutos antes</li>
                            <li>Traer documento de identificación</li>
                            <li>Lista de medicamentos actuales (si aplica)</li>
                        </ul>
                    </div>

                    <p style="text-align: center; margin: 30px 0;">
                        <a href="https://clinica-keis.com/cancelar-cita?token=ABC123" class="button">
                            Cancelar o Reprogramar
                        </a>
                    </p>
                </div>

                <div class="footer">
                    <p>Clínica Dental Keis · Tel: 0000-0000 · Urgencias: 0000-0000</p>
                    <div style="margin-top: 10px;">
                        <a href="https://facebook.com/clinica-keis" style="margin: 0 10px;">Facebook</a>
                        <a href="https://instagram.com/clinica-keis" style="margin: 0 10px;">Instagram</a>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;

            // Para la doctora
            const doctoraHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container { max-width: 600px; margin: 20px auto; font-family: Arial, sans-serif; }
                .alert { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
                .details { width: 100%; border-collapse: collapse; }
                .details td { padding: 10px; border: 1px solid #e5e7eb; }
                .highlight { background: #f8fafc; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2 style="color: #1e3a8a;">📅 Nueva Cita Programada</h2>
                
                <div class="alert">
                    <strong>¡Nueva cita registrada!</strong> Por favor revisa los detalles:
                </div>

                <table class="details">
                    <tr class="highlight">
                        <td><strong>Paciente:</strong></td>
                        <td>${nombre}</td>
                    </tr>
                    <tr>
                        <td><strong>Contacto:</strong></td>
                        <td>${telefono} | ${correo}</td>
                    </tr>
                    <tr class="highlight">
                        <td><strong>Fecha y Hora:</strong></td>
                        <td>${fechaFormat} a las ${hora}</td>
                    </tr>
                    <tr>
                        <td><strong>Servicio:</strong></td>
                        <td>${tipo}</td>
                    </tr>
                    <tr class="highlight">
                        <td><strong>Duración Estimada:</strong></td>
                        <td>${tipo === 'Limpieza Dental' ? '45 minutos' : '1 hora'}</td>
                    </tr>
                </table>

                <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <h3 style="margin-top: 0; color: #1e3a8a;">Acciones Rápidas</h3>
                    <p>
                        <a href="mailto:${correo}">📧 Contactar al paciente</a> | 
                        <a href="tel:${telefono}">📞 Llamar al paciente</a>
                    </p>
                </div>

                <div style="margin-top: 20px; font-size: 12px; color: #666;">
                    <p>Este mensaje fue generado automáticamente por el sistema de citas.</p>
                </div>
            </div>
        </body>
        </html>
        `;

            // Uso en el código
            await sendMail(
                correo,
                `✅ Confirmación de Cita: ${fechaFormat} ${hora} - Clínica Keis`,
                pacienteHTML
            );

            await sendMail(
                "bryam.steven.lopez@gmail.com",
                `📅 Nueva Cita: ${nombre} - ${fechaFormat} ${hora}`,
                doctoraHTML
            );

            // Enviar mensaje de WhatsApp
            const res = await sendWhatsAppMessage(nombre, tipo, fechaFormat, hora, correo, telefono);
            console.log("Mensaje de WhatsApp enviado?: ", res);
        }
        return NextResponse.json({ message: "Cita reservada con éxito", data });
    } catch (err) {
        return NextResponse.json({ error: "Error en el servidor " + err }, { status: 500 });
    }
}
