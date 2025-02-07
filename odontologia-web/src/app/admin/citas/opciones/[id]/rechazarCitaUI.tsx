
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
import { RescheduleUI } from "@/app/admin/citas/opciones/[id]/RescheduleUI";
import { es } from "date-fns/locale";
import { parseISO } from "date-fns";

//interface para cita
export interface Cita {
  fecha_cita: string;
  hora_cita: string;
  numero: number;
  nombre_paciente: string;
  correo_paciente: string;
  telefono_paciente: string;
  tipo_cita: string;
}


export default function RechazarCitaUI({ cita }: { cita: Cita }) {
  const [action, setAction] = useState<'confirm' | 'cancel' | 'reschedule' | null>(null);

   const [currentDate ] = useState<Date | undefined>(parseISO(cita.fecha_cita));

  const handleReschedule = async (newDate: Date, newTime: string) => {
    // Lógica para actualizar la cita en Supabase
    const { error } = await supabase
      .from('citas')
      .update({
        fecha_cita: newDate.toISOString(),
        hora_cita: newTime + ':00',
        estado: 'reprogramada'
      })
      .eq('numero', cita.numero);

    if (error) throw error;
    // Enviar email de confirmación
    await fetch('/api/send-email', {
      method: 'POST',
      body: JSON.stringify({
        to: cita.correo_paciente,
        subject: 'Cita Reprogramada',
        text: `Su cita ha sido reprogramada para el ${format(newDate, 'PPPP')} a las ${newTime}`
      })
    });
  };

  const handleCancel = async () => {
    // Lógica para cancelar la cita en Supabase
    const { error } = await supabase
      .from('citas')
      .update({ estado: 'cancelada' })
      .eq('numero', cita.numero);

    if (error) throw error;
    // Enviar email de cancelación
    await fetch('/api/send-email', {
      method: 'POST',
      body: JSON.stringify({
        to: cita.correo_paciente,
        subject: 'Cita Cancelada',
        text: `Su cita ha sido cancelada. Por favor, contáctenos para reprogramar.`
      })
    });
  };

  const handleConfirmExisting = async () => {
    // Lógica para confirmar la cita en Supabase
    const { error } = await supabase
      .from('citas')
      .update({ estado: 'confirmada' })
      .eq('numero', cita.numero);

    if (error) throw error;
    // Enviar email de confirmación
    await fetch('/api/send-email', {
      method: 'POST',
      body: JSON.stringify({
        to: cita.correo_paciente,
        subject: 'Cita Confirmada',
        text: `Su cita ha sido confirmada para el ${format(new Date(cita.fecha_cita), 'PPPP')} a las ${cita.hora_cita}`
      })
    });
  };

  useEffect(() => {
    console.log('Cita en RechazarUI:', cita);
  }, [cita]);


  return (
    <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-4 sm:p-6">
      <h2 className="text-xl text-black font-bold text-center">
        Gestión de Cita #{cita.numero}
      </h2>

      {/* Información de la cita */}
      {!action ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-800">
            <div>
              <p className="font-semibold">Paciente:</p>
              <p>{cita.nombre_paciente}</p>
            </div>

            <div>
              <p className="font-semibold">Correo:</p>
              <p>{cita.correo_paciente}</p>
            </div>

            <div>
              <p className="font-semibold">Teléfono:</p>
              <p>{cita.telefono_paciente}</p>
            </div>

            <div>
              <p className="font-semibold">Fecha:</p>
              <p>{format(currentDate ? currentDate : new Date(), "PPPP", { locale: es })
            .charAt(0).toUpperCase() +
            format(currentDate ? currentDate : new Date(), "PPPP", { locale: es }).slice(1)}</p>
            </div>

            <div>
              <p className="font-semibold">Hora:</p>
              <p>{cita.hora_cita.slice(0, 5)}</p>
            </div>

            <div>
              <p className="font-semibold">Tipo de Cita:</p>
              <p>{cita.tipo_cita}</p>
            </div>
          </div>



          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
              <Button onClick={() => setAction("confirm")} className="w-full sm:w-auto">
                ✅ Confirmar Cita
              </Button>

              <Button
                variant="destructive"
                onClick={() => setAction("cancel")}
                className="w-full sm:w-auto"
              >
                ❌ Cancelar Cita
              </Button>

              <Button
                variant="secondary"
                onClick={() => setAction("reschedule")}
                className="w-full sm:w-auto"
              >
                🔄 Reprogramar
              </Button>
            </div>
          </div>
        </>

      )

        :

        (
          <>
            {action === "reschedule" && <RescheduleUI cita={cita} onConfirm={handleReschedule} />}

            {action === "cancel" && (
              <div className="text-center space-y-4 mt-4">
                <p className="text-red-600 font-semibold">¿Estás seguro de cancelar la cita?</p>
                <Button onClick={handleCancel} variant="destructive">
                  Sí, Cancelar Cita
                </Button>
              </div>
            )}

            {action === "confirm" && (
              <div className="text-center space-y-4 mt-4">
                <p className="text-green-600 font-semibold">¿Confirmar la cita existente?</p>
                <Button onClick={handleConfirmExisting}>Sí, Confirmar Cita</Button>
              </div>
            )}
          </>
        )}
    </div>
  );

}