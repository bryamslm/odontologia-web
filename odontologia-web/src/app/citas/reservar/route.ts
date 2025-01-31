// src/app/citas/reservar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { sendMail } from "@/lib/email"; // la ruta que corresponda

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

    if (error) {
      console.error(error);
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!error) {
        // Notificar al paciente
        // await sendMail(
        //   correo,
        //   "Confirmación de Cita",
        //   `Hola ${nombre}, tu cita se ha reservado para el día ${fecha} a las ${hora}.`
        // );
      
        // Notificar a la doctora
        // await sendMail(
        //   "bryam.steven.lopez@gmail.com",
        //   "Nueva Cita Reservada",
        //   `Nueva cita con ${nombre} el ${fecha} a las ${hora}.`
        // );
    }
    return NextResponse.json({ message: "Cita reservada con éxito", data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
