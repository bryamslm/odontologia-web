// app/admin/dashboard/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { User, Clock, Stethoscope } from 'lucide-react'
import { Cita } from '@/types/types'
import CitasCalendar from '@/components/admin/Calendar'
import DataTable from '@/components/admin/DataTable'

export default function DashboardPage() {
  const [citas, setCitas] = useState<Cita[] | []>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await fetch('/api/citas')
        const data = await res.json()
        setCitas(data.data)
        console.log('Citas: ', data.data)
      } catch (error) {
        console.error('Error fetching citas:', error)
      }
    }
    fetchCitas();
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [])

  const stats = [
    {
      title: "Citas Hoy",
      value: citas.filter(c => new Date(new Date(c.fecha_cita).setHours(24)).toLocaleDateString('es-CR').split('T')[0] == new Date().toLocaleDateString('es-CR').split('T')[0]).length,
      icon: <Clock size={20} className='text-blue-200' />,
      color: 'bg-blue-200'
    },
    {
      title: "Pacientes Registrados",
      value: [...new Set(citas.map(c => c.cedula_paciente))].length,
      icon: <User size={20} className='text-green-200' />,
      color: 'bg-green-200'
    },
    {
      title: "Tipos de Procedimiento",
      value: [...new Set(citas.map(c => c.tipo_cita))].length,
      icon: <Stethoscope size={20} className='text-purple-200' />,
      color: 'bg-purple-200'
    }
  ]

  return (
    <main className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <header className={`fixed w-full transition-all duration-300 z-50 
      ${isScrolled ? "bg-white/95 shadow-md" : "bg-transparent"
        }`}>
        <div className="max-w-7xl mx-auto px-0 flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold text-blue-500">FlowDental Admin</h1>
          <div className="flex items-center space-x-4">
          <button
        onClick={() => setView('calendar')}
        className={`p-2 rounded ${view === 'calendar' ? 'bg-blue-100' : ''}`}
      >
        <span className="text-blue-600">Calendario</span>
      </button>
      <button
        onClick={() => setView('list')}
        className={`p-2 rounded ${view === 'list' ? 'bg-blue-100' : ''}`}
      >
        <span className="text-blue-600">Lista</span>
      </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.color} p-6 rounded-lg shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-2 text-black">{stat.value}</p>
                </div>
                <div className="p-3 rounded-full bg-white">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {view === 'calendar' ? (
          <CitasCalendar citas={citas} selectedDate={selectedDate} onDateChange={setSelectedDate} />
        ) : (
          <DataTable citas={citas} />
        )}
      </div>
    </main>
  )
}