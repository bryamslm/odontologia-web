'use client'

import React, { useState, useEffect, useCallback, memo } from 'react';
import { Toaster, toast } from 'sonner';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Header } from '@/components/citas/header';
import { Footer } from '@/components/citas/footer';
import { TimeSlots } from '@/components/citas/timeSlots';
import  Calendar from '@/components/ui/Calendar';


// Datos estáticos
const APPOINTMENT_TYPES = [
  {
    id: 'limpieza',
    name: 'Limpieza Dental Profesional',
    description: 'Remoción de placa y sarro con tecnología ultrasónica',
    icon: <div className="text-2xl mx-auto">🦷</div>, // Diente
    price: '₡ 25 000'
  },
  {
    id: 'ortodoncia-inicial',
    name: 'Evaluación de Ortodoncia',
    description: 'Diagnóstico y plan de tratamiento personalizado',
    icon: <div className="text-2xl mx-auto">🦷</div>, // Brackets (alternativa)
    price: '₡ 35 000'
  },
  {
    id: 'control-ortodoncia',
    name: 'Control de Ortodoncia',
    description: 'Ajuste mensual de brackets o alineadores',
    icon: <div className="text-2xl mx-auto">🦷</div>, // Diente
    price: '₡ 20 000'
  },
  {
    id: 'extraccion',
    name: 'Extracciones Dentales',
    description: 'Procedimiento seguro con sedación local',
    icon: <div className="text-2xl mx-auto">🦷</div>, // Extracción (alternativa)
    price: '₡ 40 000 - ₡ 75 000'
  },
  {
    id: 'caries',
    name: 'Tratamiento de Caries',
    description: 'Restauraciones en composite o amalgama',
    icon: <div className="text-2xl mx-auto">🦷</div>, // Reparación
    price: '₡ 35 000 - ₡ 55 000'
  },
  {
    id: 'protesis',
    name: 'Prótesis Dentales',
    description: 'Coronas, puentes y prótesis removibles',
    icon: <div className="text-2xl mx-auto">🦷</div>, // Corona
    price: '₡ 85 000'
  },
  {
    id: 'blanqueamiento',
    name: 'Blanqueo Dental',
    description: 'Tratamiento estético profesional en consultorio',
    icon: <div className="text-2xl mx-auto">🦷</div>, // Brillo
    price: '₡ 60 000'
  },
  {
    id: 'urgencias',
    name: 'Urgencias Dentales',
    description: 'Atención inmediata para casos de emergencia',
    icon: <div className="text-2xl mx-auto">🦷</div>, // Alerta
    price: '₡ 45 000'
  }
];

const AVAILABLE_TIMES = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];



// Componentes memoizados
const AppointmentTypeCard = memo(({ type, selected, onClick }: {
  type: typeof APPOINTMENT_TYPES[number];
  selected: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={`border-2 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ease-in-out ${selected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300' : 'border-gray-200 hover:border-blue-300'
      }`}
  >
    {type.icon}
    <h4 className="font-bold text-gray-800">{type.name}</h4>
    <p className="text-sm text-gray-600">{type.price}</p>
  </div>
));
AppointmentTypeCard.displayName = 'AppointmentTypeCard';

const WhatsAppButton = memo(() => (
  <Link
    href="https://wa.me/50662633553"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
    aria-label="Contactar por WhatsApp"
  >
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  </Link>
));
WhatsAppButton.displayName = 'WhatsAppButton';

function CitasPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [selectedDateObj, setSelectedDateObj] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nombre: '', correo: '', telefono: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState("");

  const resetForm = () => {
    setSelectedType(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setFormData({ nombre: '', correo: '', telefono: '' });
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  const scrollAfterTypeSelection = (id: string) => {
    //wait 1 second for scroll to dateForm id
    setTimeout(() => {
      scrollToSection(id);
    }, 500);
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedType || !selectedDate || !selectedTime) {
      toast.error('Por favor complete todos los campos');
      return;
    }
    console.log("Form Data: ", formData);
    console.log("Fecha for db: ", selectedDateObj);
    console.log("Fecha for ui: ", selectedDate);
    setIsLoading(true);  // Se inicia el estado de carga

    try {
      const res = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tipo: selectedType,
          fecha: selectedDateObj,
          hora: selectedTime
        }),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success('Cita Reservada con éxito', {
          description: `Se ha reservado tu cita para el ${selectedDate} a las ${selectedTime}.\nSe ha enviado un correo de confirmación a ${formData.correo}`,
          duration: 5000,
        });
        resetForm();
      } else {
        toast.error('Error al reservar', { description: result.error || 'No se pudo completar la reserva' });
      }
    } catch (error) {
      toast.error('Error de conexión', { description: 'No se pudo conectar con el servidor' + error });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', hour12: false });
    setCurrentTime(formattedTime);
    const formattedDate = now.toLocaleDateString('es-CR');
    setCurrentDate(formattedDate);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const holidays = [
    '2025-12-25', // Navidad
    '2025-01-01', // Año Nuevo
    '2025-04-11', // Jueves Santo
    '2025-04-12', // Viernes Santo
    
    // Agrega otros días feriados según necesites
  ];


  return (
    <main className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Toaster position="top-center" richColors closeButton />

      <Header
        isScrolled={isScrolled}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        resetForm={resetForm}
      />

      <section id='reservar' className="container mx-auto px-4 py-16 lg:px-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:block sticky top-20 h-fit z-10 self-start"
          >
            <Image
              src="/res.jpg"
              alt="Reserva de Citas"
              width={500}
              height={500}
              className="object-cover rounded-2xl shadow-lg"
              priority
              quality={85}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Reserva tu Cita</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Elige un Servicio</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {APPOINTMENT_TYPES.map((type) => (
                    <AppointmentTypeCard
                      key={type.id}
                      type={type}
                      selected={selectedType === type.id}
                      onClick={() => {
                        setSelectedType(type.id);
                        scrollAfterTypeSelection("dateForm");
                      }}
                    />
                  ))}
                </div>
              </div>

              {selectedType && (

                <motion.div
                  className="space-y-4"
                  id='dateForm'
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ opacity: 1, y: 0 }}

                >
                  <div>
                    <label className="block text-gray-900 mb-2">Fecha de la Cita</label>
                    {/* <input
                      type="date"
                      value={selectedDate || ''}
                      onChange={(e) => { setSelectedDate(e.target.value); setSelectedDateObj(new Date(e.target.value)); console.log("DATE SELECT: ", e.target.value) }}
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-300 text-black"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    /> */}
                    <Calendar
                      selected={selectedDateObj}
                      onSelect={(date: Date | undefined) => {
                        setSelectedDate(date?.toLocaleDateString('es-CR').split('T')[0]);
                        setSelectedDateObj(date);
                        scrollAfterTypeSelection("timeForm");
                        console.log("Fecha seleccionada:", selectedDate);
                      }}
                      holidays={holidays}
                      required={true}
                      
                    />
                  </div>

                  {selectedDate && (
                    <motion.div
                      className="space-y-4"
                      id='timeForm'
                      initial={{ opacity: 0, y: -100 }}
                      animate={{ opacity: 1, y: 0 }}

                    >
                      <div>
                        <label className="block text-gray-900 mb-2">Horas Disponible</label>
                        <div className="grid grid-cols-4 gap-2">
                          <TimeSlots
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            setSelectedTime={setSelectedTime}
                            scrollAfterTypeSelection={scrollAfterTypeSelection}
                            selectedDateObj={selectedDateObj}
                            AVAILABLE_TIMES={AVAILABLE_TIMES}
                            currentDate={currentDate}
                            currentTime={currentTime}
                          />

                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Información Personal */}
              {selectedType && selectedDate && selectedTime && (
                <motion.div
                  className="space-y-4"
                  id="personalInfo"
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ opacity: 1, y: 0 }}

                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-900 mb-2">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-300 text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-900 mb-2">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        value={formData.correo}
                        onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                        className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-300 text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-900 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-300 text-black"
                      />
                    </div>

                    <button
                      type="submit"
                      className={` text-white px-8 py-3 rounded-full 
                    transition-colors shadow-lg  
                    ${isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Reservando...' : 'Confirmar Reserva'} {/* Muestra texto diferente mientras carga */}
                    </button>
                  </div>
                </motion.div>
              )}

            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}





export default CitasPage;