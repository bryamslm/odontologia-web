// RescheduleUI.tsx (Componente cliente nuevo)
"use client";
import React, { useState } from 'react';
import { TimeSlots } from '@/components/client/citas/timeSlots';
import Calendar from '@/components/ui/Calendar'; // Asumiendo que tienes un componente Calendar
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale'; // Opcional para localización

//interface para cita
export interface Cita {
  fecha_cita: string;
  hora_cita: string;
}

export const RescheduleUI = ({ cita, onConfirm, setAction }: {
  cita: Cita;
  onConfirm: (newDate: Date, newTime: string) => Promise<void>;
  //setAction es  useState<'confirm' | 'cancel' | 'reschedule' | null>(null);
  setAction: React.Dispatch<React.SetStateAction<"confirm" | "cancel" | "reschedule" | null>>;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(parseISO(cita.fecha_cita));
  const [currentDate, setCurrentDate] = useState<Date | undefined>(parseISO(cita.fecha_cita));

  const [selectedTime, setSelectedTime] = useState<string | null>(cita.hora_cita.slice(0, 5));
  const [currentTime, setCurrentTime] = useState<string | null>(cita.hora_cita.slice(0, 5));
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) return;

    setLoading(true);
    try {
     
      setCurrentDate(selectedDate);
      setCurrentTime(selectedTime);
      await onConfirm(selectedDate, selectedTime);
      
    } catch {
     
    }
    setLoading(false);
  };
  const holidays = [
    '2025-12-25', // Navidad
    '2025-01-01', // Año Nuevo
    '2025-04-11', // Jueves Santo
    '2025-04-12', // Viernes Santo

    // Agrega otros días feriados según necesites
  ];

  return (
    <div className="space-y-6">
      {/* Sección de información actual */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-blue-50 p-4 rounded-lg"
      >
        <h3 className="font-semibold text-lg mb-2 text-black">Fecha y hora actual</h3>
        <p className='text-gray-900 font-medium'>
          {format(currentDate ? currentDate : new Date(), "PPPP", { locale: es })
            .charAt(0).toUpperCase() +
            format(currentDate ? currentDate : new Date(), "PPPP", { locale: es }).slice(1)}
        </p>
        <p className="text-blue-950 font-bold">{currentTime}</p>
      </motion.div>

      {/* Selector de nueva fecha */}
      <div className="space-y-4">
        <Button
          onClick={() => setShowCalendar(!showCalendar)}
          variant={showCalendar ? 'outline' : 'default'}
          className='bg-blue-50 rounded-lg'
        >
          {showCalendar ? 'Ocultar Calendario' : 'Seleccionar Nueva Fecha'}
        </Button>

        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 p-0"
          >
            <Calendar
              selected={selectedDate || undefined}
              onSelect={(date: Date | undefined) => {

                setSelectedDate(date);
                setShowCalendar(false);
              }}
              holidays={holidays}
            />
          </motion.div>
        )}
      </div>

      {/* Selector de nueva hora */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 p-4 rounded-lg shadow"
        >
          <h4 className="font-semibold mb-4 text-gray-900" id='time-selector'>
            Horas disponibles para el {format(selectedDate, "PPPP", { locale: es })}
          </h4>

          <div className="grid grid-cols-4 gap-2">
            <TimeSlots
              selectedDate={format(selectedDate, 'yyyy-MM-dd')}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              scrollAfterTypeSelection={() => { }}
              selectedDateObj={selectedDate}
              AVAILABLE_TIMES={['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']} // Reemplazar con tus horarios reales
              currentDate={format(new Date(), 'yyyy-MM-dd')}
              currentTime={format(new Date(), 'HH:mm')}
            />
          </div>
        </motion.div>
      )}

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
        <Button
          variant="secondary"
          onClick={() => {
            setSelectedDate(undefined);
            setSelectedTime(null);
            setShowCalendar(false);
          }}
        >
          Reiniciar
        </Button>

        <Button
          onClick={handleReschedule}
          disabled={!selectedDate || !selectedTime || loading}
          variant={loading ? 'default' : 'confirm'}
        >
          {loading ? 'Procesando...' : 'Reprogramar'}
        </Button>
        {/* back button */}
        <Button
          onClick={() => setAction(null)}
          variant="back"
        >
          Regresar  
        </Button>

        
      </div>
    </div>
  );
};