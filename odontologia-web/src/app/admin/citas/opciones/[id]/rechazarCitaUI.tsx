
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

import { RescheduleUI } from "@/app/admin/citas/opciones/[id]/RescheduleUI";
import { es } from "date-fns/locale";
import { Toaster, toast } from 'sonner';
import { format, parseISO } from 'date-fns';

//interface para cita
export interface Cita {
  id: string;
  fecha_cita: string;
  hora_cita: string;
  numero: number;
  nombre_paciente: string;
  correo_paciente: string;
  telefono_paciente: string;
  tipo_cita: string;
  cedula_paciente: string;
  estado: string;
  motivo_cancelacion: string;
}


export default function RechazarCitaUI({ cita }: { cita: Cita }) {
  const [action, setAction] = useState<'confirm' | 'cancel' | 'reschedule' | null>(null);
  const [confirmUsed, setConfirmUsed] = useState<boolean>(cita.estado === 'Confirmada' ? true : cita.estado === 'Cancelada' ? true : cita.estado == 'Reprogramada' ? true : false);
  const [cancelUsed, setCancelUsed] = useState<boolean>(cita.estado === 'Cancelada' ? true : false);
  const [rescheduleUsed, setRescheduleUsed] = useState<boolean>(cita.estado === 'Cancelada' ? true : false);
  const [motivoCancel, setMotivoCancel] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string>(cita.estado);

  const [currentDate, setCurrentDate] = useState<Date | undefined>(parseISO(cita.fecha_cita));
  const [currentTime, setCurrentTime] = useState<string>(cita.hora_cita.slice(0, 5))

  const handleReschedule = async (newDate: Date, newTime: string) => {
    // Lógica para actualizar la cita en Supabase
    const { error } = await supabase
      .from('citas')
      .update({
        fecha_cita: newDate.toISOString(),
        hora_cita: newTime + ':00',
        estado: 'Reprogramada'
      })
      .eq('id', cita.id);

    if (error) throw error;
    
    cita.fecha_cita = newDate.toISOString();
    cita.hora_cita = newTime+':00'
    setCurrentDate(newDate);
    setCurrentTime(newTime);
    
    // Enviar email de confirmación
    await fetch('/api/send-email', {
      method: 'POST',
      body: JSON.stringify({
        to: cita.correo_paciente,
        subject: 'Cita Reprogramada - FlowDental',
        htmlContent: `
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
            <h2 style="color: #2d3748;">¡Cita Reprogramada!</h2>
            <p style="color: #4a5568;">La clínica ha reprogramado la cita solicitada por <strong>${cita.nombre_paciente}</strong>.</p>
            
            <table class="details">
                <tr>
                    <td><strong>📅 Nueva Fecha:</strong></td>
                    <td>${format(currentDate ? currentDate : new Date(), "PPPP", { locale: es })
                    .charAt(0).toUpperCase() +
                    format(currentDate ? currentDate : new Date(), "PPPP", { locale: es }).slice(1)}</td>
                </tr>
                <tr>
                    <td><strong>⏰ Nueva Hora:</strong></td>
                    <td>${newTime}</td>
                </tr>
                <tr>
                    <td><strong>📌 Servicio:</strong></td>
                    <td>${cita.tipo_cita}</td>
                </tr>
            </table>
            
            <div style="margin: 30px 0; background: #f0f4ff; padding: 20px; border-radius: 8px;">
                <h3 style="color: #2d3748; margin-top: 0;">Información Importante:</h3>
                <ul style="color: #4a5568; padding-left: 20px;">
                    <li>Se te enviará un correo para confirmar tu asistencia de 24 a 48 horas antes de la cita.</li>
                    <li>Si no confirmas en ese plazo, no se garantiza la atención y el espacio se liberará.</li>
                    <li>En caso de no poder asistir, por favor cancela o reprograma tu cita en el botón de abajo.</li>
                </ul>
            </div>
            
            <p style="text-align: center; margin: 30
            px 0;">
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
    </div>
</body>
</html>
`
      })
    });
    setRescheduleUsed(true);
    setState('Reprogramada');
    cita.estado = 'Reprogramada';
    toast.success('Cita reprogramada exitosamente', { description: 'Se ha notificado al paciente, el mismo podrá cancelar o proponer reprogramar la cita', duration: 5000 });
    setAction(null);
  };

  const handleCancel = async () => {
    // Lógica para cancelar la cita en Supabase
    let errorCancel = null;
    if (motivoCancel) {
      const { error } = await supabase
      .from('citas')
      .update({ estado: 'Cancelada', motivo_cancelacion: motivoCancel })
      .eq('id', cita.id);
      if(error)errorCancel = error;
      cita.motivo_cancelacion = motivoCancel;
    }else{
      const { error } = await supabase
      .from('citas')
      .update({ estado: 'Cancelada' })
      .eq('id', cita.id);
      if(error)errorCancel = error;
    }
    

    if (errorCancel) throw errorCancel;
    
    // Enviar email de cancelación
    await fetch('/api/send-email', {
      method: 'POST',
      body: JSON.stringify({
        to: cita.correo_paciente,
        subject: 'Cita Cancelada - FlowDental',
        htmlContent: `
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
            <h2 style="color: #2d3748;">Tu Cita ha sido cancelada</h2>
            <p style="color: #4a5568;">Lamentablemente, la clínica no puede atender la cita de <strong>${cita.nombre_paciente}</strong> en la fecha y hora propuestas.</p>
            
            <table class="details">
                <tr>
                    <td><strong>📅 Fecha Solicitada:</strong></td>
                    <td>${format(currentDate ? currentDate : new Date(), "PPPP", { locale: es })
                    .charAt(0).toUpperCase() +
                    format(currentDate ? currentDate : new Date(), "PPPP", { locale: es }).slice(1)}</td>
                </tr>
                <tr>
                    <td><strong>⏰ Hora Solicitada:</strong></td>
                    <td>${cita.hora_cita.slice(0, 5)}</td>
                </tr>
                <tr>
                    <td><strong>📌 Servicio:</strong></td>
                    <td>${cita.tipo_cita}</td>
                </tr>
                <tr>
                    <td><strong>📝 Motivo de Cancelación:</strong></td>
                    <td>${cita.motivo_cancelacion || 'Por razones de disponibilidad, no podemos atenderte en el horario solicitado. Te invitamos a agendar una nueva cita en la fecha y hora que mejor te convenga.'}</td>
                </tr>
            </table>
            
            <div style="margin: 30px 0; background: #f0f4ff; padding: 20px; border-radius: 8px;">
                <h3 style="color: #2d3748; margin-top: 0;">Información Importante:</h3>
                <ul style="color: #4a5568; padding-left: 20px;">
                    <li>El seguimiento de la solicitud actual finaliza.</li>
                    <li>Si lo deseas, puedes intentar nuevamente realizando una nueva solicitud de cita.</li>
                </ul>
            </div>
            
            <p style="text-align: center; margin: 30px 0;">
                <a href="https://odontologia-web.vercel.app/citas" class="button">
                    Crear Nueva Cita
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
`
      })
    });
    cita.estado = 'cancelado';
    toast.success('Cita cancelada exitosamente', { description: 'Se ha notificado al paciente de la cancelación.', duration: 5000 });
    setCancelUsed(true);
    setConfirmUsed(true);
    setRescheduleUsed(true);
    setState('Cancelada');
    setAction(null);
  };

  const handleConfirmExisting = async () => {
    // Lógica para confirmar la cita en Supabase
    const { error } = await supabase
      .from('citas')
      .update({ estado: 'Confirmada' })
      .eq('id', cita.id);

    if (error) throw error;
    // Enviar email de confirmación
    
    await fetch('/api/send-email', {
      method: 'POST',
      body: JSON.stringify({
        to: cita.correo_paciente,
        subject: 'Cita Confirmada - FlowDental',
        htmlContent: `
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
            <h2 style="color: #2d3748;">¡Cita Confirmada!</h2>
            <p style="color: #4a5568;">La clínica ha confirmado la cita solicitada por <strong>${cita.nombre_paciente}</strong>.</p>
            
            <table class="details">
                <tr>
                    <td><strong>📅 Fecha:</strong></td>
                    <td>${format(currentDate ? currentDate : new Date(), "PPPP", { locale: es })
                    .charAt(0).toUpperCase() +
                    format(currentDate ? currentDate : new Date(), "PPPP", { locale: es }).slice(1)}</td>
                </tr>
                <tr>
                    <td><strong>⏰ Hora:</strong></td>
                    <td>${cita.hora_cita.slice(0, 5)}</td>
                </tr>
                <tr>
                    <td><strong>📌 Servicio:</strong></td>
                    <td>${cita.tipo_cita}</td>
                </tr>
            </table>
            
            <div style="margin: 30px 0; background: #f0f4ff; padding: 20px; border-radius: 8px;">
                <h3 style="color: #2d3748; margin-top: 0;">Información Importante:</h3>
                <ul style="color: #4a5568; padding-left: 20px;">
                    <li>Se te enviará un correo para confirmar tu asistencia de 24 a 48 horas antes de la cita.</li>
                    <li>Si no confirmas en ese plazo, no se garantiza la atención y el espacio se liberará.</li>
                    <li>En caso de no poder asistir, por favor cancela o reprograma tu cita en el botón de abajo.</li>
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
`
      })
    });
    cita.estado = 'confirmada';
    toast.success('Cita confirmada exitosamente', { description: 'Se ha notificado al paciente, el mismo deberá confirmar su asistencia 1 día antes.', duration: 5000 });
    setConfirmUsed(true);
    setState('Confirmada');
    setAction(null);
  };

  useEffect(() => {
    console.log('Cita en RechazarUI:', cita);
  }, [cita]);


  return (
    <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-4 sm:p-6">
      <Toaster position="top-center" richColors closeButton />
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
            <div className="sm:pl-20">
              <p className="font-semibold">Cédula:</p>
              <p>{cita.cedula_paciente}</p>
            </div>

            <div>
              <p className="font-semibold">Correo:</p>
              <a type='mail' href={`mailto:${cita.correo_paciente}`}>{cita.correo_paciente}</a>
            </div>

            <div className="sm:pl-20">
              <p className="font-semibold">Teléfono:</p>
              <a href={`tel:${cita.telefono_paciente}`}>{cita.telefono_paciente}</a>
            </div>

            <div>
              <p className="font-semibold">Fecha:</p>
              <p>{format(currentDate ? currentDate : new Date(), "PPPP", { locale: es })
                .charAt(0).toUpperCase() +
                format(currentDate ? currentDate : new Date(), "PPPP", { locale: es }).slice(1)}</p>
            </div>

            <div className="sm:pl-20">
              <p className="font-semibold">Hora:</p>
              <p>{currentTime}</p>
            </div>

            <div>
              <p className="font-semibold">Tipo de Cita:</p>
              <p>{cita.tipo_cita}</p>
            </div>
            <div className="sm:pl-20">
              <p className="font-semibold">Estado:</p>
              <p>{ state }</p>
          </div>
          </div>



          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
              
                <Button
                  onClick={() => setAction("confirm")}
                  variant={'confirm'}
                  className="w-full sm:w-auto"
                  disabled={confirmUsed || rescheduleUsed}
                >
                Confirmar Cita
                </Button>
              

                <Button
                  variant="cancel"
                  onClick={() => setAction("cancel")}
                  className="w-full sm:w-auto"
                  disabled={cancelUsed}
                >
                Cancelar Cita
                </Button>

              <Button
                variant="secondary"
                onClick={() => setAction("reschedule")}
                className="w-full sm:w-auto"
                disabled={cancelUsed}
                
              >
              Reprogramar
              </Button>
            </div>
          </div>
        </>

      )

        :

        (
          <>
            {action === "reschedule" && <RescheduleUI cita={cita} onConfirm={handleReschedule} setAction={setAction}  />}

            {action === "cancel" && (
              <div className="text-center space-y-4 mt-4 space-x-5">
                <p className="text-black font-semibold">¿Estás seguro de cancelar la cita?</p>
                <p className="text-gray-500">Al cancelar la cita, se enviará un correo al paciente y se finalizará el seguimiento del mismo.</p>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                  placeholder="Motivo de cancelación (opcional)"
                  value={motivoCancel}
                  onChange={(e) => setMotivoCancel(e.target.value)}
                />
                <Button onClick={handleCancel} variant="cancel">
                  Sí, Cancelar Cita
                </Button>
                <Button onClick={() => setAction(null)} variant="back">
                  Regresar
                </Button>
              </div>
            )}

            {action === "confirm" && (
              <div className="text-center space-y-4 mt-4 space-x-5">
                <p className="text-black font-semibold">¿Confirmar la cita existente?</p>
                <p className="text-gray-500">Al confirmar la cita, se enviará un correo al paciente.</p>
                <Button onClick={handleConfirmExisting} variant={'confirm'}>Sí, Confirmar Cita</Button>

                <Button onClick={() => setAction(null)} variant={'back'}>Regresar</Button>
              </div>
            )}
          </>
        )}
    </div>
  );

}