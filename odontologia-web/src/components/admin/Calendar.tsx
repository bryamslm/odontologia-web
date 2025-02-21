// components/admin/Calendar.tsx
'use client'
import { useState } from 'react'
import { Calendar as CalendarLib } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { Cita } from '@/types/types'

interface CitasCalendarProps {
  citas: Cita[]
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export default function CitasCalendar({ citas, selectedDate, onDateChange }: CitasCalendarProps) {
  const [view, setView] = useState<'month' | 'year' | 'decade'>('month')

  const dateHasCitas = (date: Date) => {
    return citas.some(cita =>
      new Date(cita.fecha_cita).toDateString() === date.toDateString()
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm text-gray-800">
      <CalendarLib
        value={selectedDate}
        onChange={(date) => onDateChange(date as Date)}
        onViewChange={({ view }) => setView(view as any)}
        tileClassName={({ date }) =>
          dateHasCitas(date) ? 'bg-blue-20 border-2 border-blue-200 ' : ''
        }
        tileContent={({ date }) => {
          const dailyCitas = citas.filter(c =>
            new Date(new Date(c.fecha_cita).setHours(24)).toDateString() === date.toDateString() && c.estado !== 'Cancelada')
          return dailyCitas.length > 0 ? (
            <div className="text-left text-xs text-blue-800 m-0 p-0 ">
              {dailyCitas.length} cita{dailyCitas.length > 1 ? 's' : ''}
            </div>
          ) : null
        }}
      />

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">
          Citas para el {selectedDate.toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h3>
        {citas.filter(c => new Date(new Date(c.fecha_cita).setHours(24)).toDateString() === selectedDate.toDateString() && c.estado !== 'Cancelada')
          .map(cita => (
            <div key={cita.id} className={`p-4 mb-3 border-l-4 ${cita.estado === 'Solicitada' ? 'border-yellow-400' :
              cita.estado === 'Cancelada' ? 'border-red-400' :
                 cita.estado === 'Confirmada' ? 'border-blue-400' :
                  'border-gray-400'
            } bg-gray-50 rounded`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{cita.nombre_paciente}</p>
                  <p className="text-sm text-gray-600">{cita.tipo_cita} - {cita.hora_cita.slice(0, 5)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${cita.estado === 'Solicitada' ? 'bg-yellow-100 text-yellow-800' :
                    cita.estado === 'Cancelada' ? 'bg-red-100 text-red-800' :
                      cita.estado === 'Confirmada' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                  }`}>
                  {cita.estado}
                </span>
              </div>
              {cita.notas && <p className="mt-2 text-sm text-gray-600">📝Notas: {cita.notas}</p>}
            </div>
          ))}
      </div>
    </div>
  )
}