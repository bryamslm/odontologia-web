// src/app/citas/reservar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { sendMail } from "@/lib/email"; // la ruta que corresponda
import { sendWhatsAppMessageAPI } from "@/lib/whatsapp"; // la ruta que corresponda
import { format, parseISO } from 'date-fns';
import { es } from "date-fns/locale";
//varianbles de entorno
const URL_REPROGRAMAR_PRE = process.env.URL_REPROGRAM; 


//GET para obtener citas
export async function GET() {
    const { data, error } = await supabase.from("citas").select("*");
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.log('GET citas: ', data);
    return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nombre, cedula, correo, telefono, fecha, hora, tipo } = body;

        //imprimir datos a insertar
        console.log(
            "\nnombre_paciente: ", nombre,
            "\ncedula_paciente: ", cedula,
            "\ncorreo_paciente: ", correo,
            "\ntelefono_paciente: ", telefono,
            "\nfecha_cita: ", fecha,
            "\nhora_cita: ", hora,
            "\ntipo_cita: ", tipo.name,
        );

        // Inserta en la tabla "citas"
        const { data, error } = await supabase.from("citas").insert([
            {
                nombre_paciente: nombre,
                cedula_paciente: cedula,
                correo_paciente: correo,
                telefono_paciente: telefono,
                fecha_cita: fecha,
                hora_cita: hora,
                tipo_cita: tipo.name,
            },
        ]).select("id,numero");
        //fechaFormat cambia formato de AAAA-MM-DD a DD/MM/AAAA
        const fechaFormat = new Date(fecha).toLocaleDateString('es-CR').split('T')[0];
        const currentDate = parseISO(new Date().toISOString());
        const urlReprogramar = `${URL_REPROGRAMAR_PRE}${data? data[0].id: 'notfound'}`;

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
                .logo { max-width: 100px; }
                .content { padding: 30px; background: white; }
                .details { margin: 20px 0; border-collapse: collapse; width: 100%; }
                .details td { padding: 10px; border-bottom: 1px solid #eee; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
                .button { background: #3b82f6; color: white!important; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header" style="background: transparent; text-align: center;">
                    <img src="https://drive.google.com/uc?export=view&id=1K3WcKEYzNjvGQVDBCV7XQcBkfPryvZBd" alt="FlowDental" class="logo">
                </div>
                
                <div class="content">
                    <h2 style="color: #2d3748;">¡Hola ${nombre}!</h2>
                    <p style="color: #4a5568;">Tu cita en FlowDental ha sido solicitada:</p>
                    
                    <table class="details">
                        <tr>
                            <td><strong>📅 Fecha:</strong></td>
                            <td>${format(currentDate ? currentDate : new Date(), "PPPP", { locale: es })
                            .charAt(0).toUpperCase() + format(currentDate ? currentDate : new Date(), "PPPP", { locale: es }).slice(1)}</td>
                        </tr>
                        <tr>
                            <td><strong>⏰ Hora:</strong></td>
                            <td>${hora}</td>
                        </tr>
                        <tr>
                            <td><strong>📌 Servicio:</strong></td>
                            <td>${tipo.name}</td>
                        </tr>
                        <tr>
                            <td><strong>📍 Dirección:</strong></td>
                            <td>Av. Principal #123, San Carlos, Alajuela</td>
                        </tr>
                    </table>

                    <div style="margin: 30px 0; background: #f0f4ff; padding: 20px; border-radius: 8px;">
                        <h3 style="color: #2d3748; margin-top: 0;">Mientras procesamos tu cita:</h3>
                        <ul style="color: #4a5568; padding-left: 20px;">
                            <li>Espera la respuesta de la clínica.</li>
                            <li>La clínica confirmará, cancelará o reprogramará la cita.</li>
                            <li>El medio de información es este mismo.</li>
                        </ul>
                    </div>

                    <p style="text-align: center; margin: 30px 0;">
                        <a href="https://odontologia-web.vercel.app/" class="button">
                            Cancelar o Reprogramar
                        </a>
                    </p>
                </div>

                <div class="footer">
                    <p>FlowDental · Tel: 6263-3553 · Urgencias: 6263-3553</p>
                    <div style="margin-top: 10px;">
                        <a href="https://www.facebook.com/profile.php?id=61572656967759" style="margin: 0 10px;">Facebook</a>
                        <a href="https://instagram.com/" style="margin: 0 10px;">Instagram</a>
                    </div>
                </div>
                 <div style="margin-top: 20px; font-size: 12px; color: #666;">
                    <p>Este mensaje fue generado automáticamente por el sistema de citas FlowDental.</p>
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
                .attention { background: #f59e0b; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2 style="color: #1e3a8a;">📅 Nueva Cita Solicitada</h2>
                
                <div class="alert">
                    <strong>¡Nueva cita solicitada!</strong> Por favor revisa los detalles:
                </div>

                <table class="details">
                    <tr>
                        <td><strong>Número de Cita:</strong></td>
                        <td>${data[0].numero}</td>
                    <tr class="highlight">
                        <td><strong>Paciente:</strong></td>
                        <td>${nombre}</td>
                    </tr>
                    <tr>
                        <td><strong>Cédula:</strong></td>
                        <td>${cedula}</td>
                    <tr>
                        <td><strong>Contacto:</strong></td>
                        <td>${telefono} | ${correo}</td>
                    </tr>
                    <tr class="highlight">
                        <td><strong>Fecha y Hora:</strong></td>
                        <td>${format(currentDate ? currentDate : new Date(), "PPPP", { locale: es })
                            .charAt(0).toUpperCase() + format(currentDate ? currentDate : new Date(), "PPPP", { locale: es }).slice(1)} a las ${hora}</td>
                    </tr>
                    <tr>
                        <td><strong>Servicio:</strong></td>
                        <td>${tipo.name}</td>
                    </tr>
                    <tr class="highlight">
                        <td><strong>Duración Estimada:</strong></td>
                        <td>${tipo.id === 'limpieza' ? '≈ 45 minutos' : '≈ 1 hora'}</td>
                    </tr>
                    <tr class="attention">
                        <td><strong>Confirma, Cancela o Reprograma:</strong></td>
                        <td> 
                            <a href="https://odontologia-web.vercel.app/admin/citas/opciones/${data[0].id}" target="_blank">
                                &#x1F517;Gestionar Cita #${data[0].numero}
                            </a></td>
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
                    <p>Este mensaje fue generado automáticamente por el sistema de citas FlowDent.</p>
                </div>
            </div>
        </body>
        </html>
        `;

            //Uso en el código
           await sendMail(
                correo,
                `📅 Cita solicitada: ${fechaFormat} ${hora} - FlowDental`,
                pacienteHTML
            );

            await sendMail(
                "bryam.steven.lopez@gmail.com",
                `📅 Nueva Cita: ${nombre} - ${fechaFormat} ${hora} - FlowDental`,
                doctoraHTML
            );

            // Enviar mensaje de WhatsApp
            //objeto con lista clave valor
            const numeroCita = data[0].numero.toString();
            const parameters = [fechaFormat, hora, tipo.name, nombre, correo, telefono, numeroCita, cedula, urlReprogramar];
            await sendWhatsAppMessageAPI("50662633553", "nueva_cita_3", parameters);
            //const res = await sendWhatsAppMessage(nombre, tipo, fechaFormat, hora, correo, telefono);
            
        }
        return NextResponse.json({ message: "Cita reservada con éxito", data });
    } catch (err) {
        return NextResponse.json({ error: "Error en el servidor " + err }, { status: 500 });
    }
}