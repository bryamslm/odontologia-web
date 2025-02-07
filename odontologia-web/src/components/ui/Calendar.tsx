// components/Calendar.tsx
import React from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { es } from 'react-day-picker/locale';


interface CalendarProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  // Puedes pasar un arreglo de fechas (como strings o Date) que serán consideradas feriados
  holidays?: (string | Date)[];
  required?: boolean;
  
}

export default function Calendar({ selected, onSelect, holidays = [], required }: CalendarProps) {
  // Convertir días feriados a objetos Date (si vienen como string)
  const parsedHolidays = holidays.map(holiday =>
    typeof holiday === 'string' ? new Date(holiday) : holiday
  );

  // Configuramos los días deshabilitados:
  // - Fines de semana (sábado: 6, domingo: 0)
  // - Días feriados

  const defaultClassNames = getDefaultClassNames();


  return (
    <div className="border-2 rounded-lg text-black border-gray-200 p-1">
      <DayPicker
        locale={es}
        mode="single"
        selected={selected}
        onSelect={onSelect}
        disabled={
          [
            { dayOfWeek: [0, 6] },

            { before: new Date() },
            ...parsedHolidays
          ]
        }

        required={required ? required : false}
        showOutsideDays
        classNames={{
          root: `${defaultClassNames.root} `, // Fuerza que el calendario ocupe todo el ancho del contenedor
          chevron: `${defaultClassNames.chevron} `, // Estilo de la cabecera
          nav: `${defaultClassNames.nav} `, // Estilo de la cabecera
        }}

      />
    </div>
  );
}
