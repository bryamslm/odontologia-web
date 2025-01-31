'use client'

import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Menu, X, Instagram, Facebook, Twitter } from 'lucide-react';//Calendar, Phone, MapPin
import Link from 'next/link';

const APPOINTMENT_TYPES = [
  {
    id: 'limpieza',
    name: 'Limpieza Dental',
    description: 'Limpieza profunda y pulido profesional',
    icon: '/clean.png',
    price: '₡ 30000'
  },
  {
    id: 'extraccion',
    name: 'Extracción Dental',
    description: 'Procedimiento de extracción seguro y cuidadoso',
    icon: '/extraction.png',
    price: '₡ 50000'
  },
  {
    id: 'revision',
    name: 'Revisión General',
    description: 'Chequeo completo de salud dental',
    icon: '/evaluacion.png',
    price: '₡ 15000'
  }
];

const AVAILABLE_TIMES = [
  '09:00', '10:00', '11:00', '12:00',
  '14:00', '15:00', '16:00', '17:00'
];

export default function CitasPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: ''
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const resetForm = () => {
    // Resetear formulario
    setSelectedType(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData({ nombre: '', correo: '', telefono: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedType || !selectedDate || !selectedTime) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    try {
      const res = await fetch("/citas/reservar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tipo: selectedType,
          fecha: selectedDate,
          hora: selectedTime
        }),
      });

      const result = await res.json();

      if (res.ok) {
        // Notificaciones de éxito
        toast.success('Cita Reservada con éxito', {
          description: `Se ha reservado tu cita para el ${selectedDate} a las ${selectedTime}.\nSe ha enviado un correo de confirmación a ${formData.correo}`,
          duration: 5000,
        });

        // Resetear formulario
        resetForm();
      } else {
        // Manejo de errores
        toast.error('Error al reservar', {
          description: result.error || 'No se pudo completar la reserva',
        });
      }
    } catch (error) {
      toast.error('Error de conexión', {
        description: 'No se pudo conectar con el servidor: ' + error,
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="bg-gradient-to-b from-rose-50 to-white min-h-screen">
      <Toaster
        position="top-center"
        richColors
        closeButton
      />
      <header className={`fixed w-full transition-all duration-300 z-40 ${isScrolled ? 'bg-white/95 shadow-md' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            <div
              className="div h-15 text-rose-500 font-bold text-2xl cursor-pointer"
              onClick={() => scrollToSection('inicio')}
            >
              Clínica Keis
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 h-15">
              {["Inicio", "Reservar"].map((item) => (
                <Link
                  key={item}
                  href={item === "Inicio" ? "/" : `#${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-rose-500 transition-colors font-medium cursor-pointer"
                  onClick={(e) => {
                    if (item === "Inicio") return;
                    e.preventDefault();
                    if (item === "Reservar") {
                      resetForm();
                    }
                    scrollToSection(item.toLowerCase().replace(/\s+/g, '-'));
                  }}
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-black"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white absolute top-20 left-0 w-full shadow-lg ">
              <div className="px-4 py-2 space-y-2">
                {["Inicio", "Sobre nosotros", "Servicios", "Reserva", "Contacto"].map((item) => (
                  <Link
                    key={item}
                    href={item === "Reserva" ? "/citas" : `#${item.toLowerCase()}`}
                    className="block py-2 text-gray-700 hover:text-rose-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
      <section id='reservar' className="container mx-auto px-4 py-16 lg:px-24">

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Sección de Imagen */}
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
            />
          </motion.div>

          {/* Formulario de Citas */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
              Reserva tu Cita
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selector de Tipo de Cita */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Elige un Servicio
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {APPOINTMENT_TYPES.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`
                        border-2 rounded-xl p-4 text-center cursor-pointer 
                        transition-all duration-300 ease-in-out
                        ${selectedType === type.id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300'
                          : 'border-gray-200 hover:border-blue-300'}
                      `}
                    >
                      <Image
                        src={type.icon}
                        alt={type.name}
                        width={50}
                        height={50}
                        className="mx-auto mb-3"
                      />
                      <h4 className="font-bold text-gray-800">{type.name}</h4>
                      <p className="text-sm text-gray-600">{type.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selección de Fecha y Hora */}
              {selectedType && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Fecha de la Cita
                    </label>
                    <input
                      type="date"
                      value={selectedDate || ''}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-300 text-black"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Hora Disponible
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {AVAILABLE_TIMES.map((time) => (
                          <button
                            type="button"
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`
                              p-2 rounded-lg border-2 text-sm text-black
                              ${selectedTime === time
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'border-gray-200 hover:bg-blue-50'}
                            `}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Información Personal */}
              {selectedType && selectedDate && selectedTime && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
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
                    <label className="block text-gray-700 mb-2">
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
                    <label className="block text-gray-700 mb-2">
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
                    className="w-full bg-blue-600 text-white py-3 rounded-lg 
                    hover:bg-blue-700 transition-colors duration-300 
                    font-semibold shadow-md"
                  >
                    Confirmar Reserva
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </div>

      </section>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              {/* <img
                  src="/api/placeholder/160/40"
                  alt="Clínica Keis"
                  className="h-10 mb-4"
                /> */}
              <h5 className="text-2xl font-bold mb-4">Clínica Keis</h5>
              <p className="text-gray-400">
                Comprometidos con tu salud dental y tu bienestar.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
              <div className="space-y-2">
                <Link href="/" className="block text-gray-400 hover:text-rose-400">Inicio</Link>
                <Link href="/#servicios" className="block text-gray-400 hover:text-rose-400">Servicios</Link>
                <Link href="/#sobre-nosotros" className="block text-gray-400 hover:text-rose-400">Sobre nosotros</Link>
                <Link href="/#contacto" className="block text-gray-400 hover:text-rose-400">Contacto</Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-rose-400">
                  <Facebook size={24} />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-rose-400">
                  <Instagram size={24} />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-rose-400">
                  <Twitter size={24} />
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Clínica Keis. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
      {/* WhatsApp Button */}
      <Link
        href="https://wa.me/50662633553"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </Link>
    </main>
  );
}