"use client";
import React, { useState, useEffect, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Carga diferida de iconos no críticos
const Menu = dynamic(() => import('lucide-react').then(mod => mod.Menu), { ssr: false });
const X = dynamic(() => import('lucide-react').then(mod => mod.X), { ssr: false });
const Phone = dynamic(() => import('lucide-react').then(mod => mod.Phone), { ssr: false });
const MapPin = dynamic(() => import('lucide-react').then(mod => mod.MapPin), { ssr: false });
const Clock = dynamic(() => import('lucide-react').then(mod => mod.Clock), { ssr: false });
const Instagram = dynamic(() => import('lucide-react').then(mod => mod.Instagram), { ssr: false });
const Facebook = dynamic(() => import('lucide-react').then(mod => mod.Facebook), { ssr: false });
const Twitter = dynamic(() => import('lucide-react').then(mod => mod.Twitter), { ssr: false });

// Datos estáticos fuera del componente
const SERVICES = [
  {
    title: "Limpieza Dental Profesional",
    description: "Mantén tu sonrisa radiante y saludable",
    icon: "🦷", // Emoji de diente
  },
  {
    title: "Blanqueamiento Dental",
    description: "Recupera el brillo natural de tus dientes",
    icon: "✨", // Emoji de brillo
  },
  {
    title: "Ortodoncia Preventiva",
    description: "Tratamientos personalizados para cada paciente",
    icon: "🦿", // Emoji de brackets (alternativa)
  },
  {
    title: "Tratamiento de Caries",
    description: "Restauraciones estéticas y duraderas",
    icon: "🔧", // Emoji de herramienta (representa reparación)
  },
  {
    title: "Extracciones Dentales",
    description: "Procedimientos seguros y sin dolor",
    icon: "🪛", // Emoji de extracción (alternativa)
  },
  {
    title: "Prótesis Dentales",
    description: "Coronas, puentes y prótesis removibles",
    icon: "👑", // Emoji de corona
  },
  {
    title: "Urgencias Dentales",
    description: "Atención inmediata para casos de emergencia",
    icon: "🚨", // Emoji de alerta
  },
];

const Header = memo(({ isScrolled, isMenuOpen, setIsMenuOpen, scrollToSection }: {
  isScrolled: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToSection: (sectionId: string) => void;
}) => {
  const navItems = ["Inicio", "Sobre nosotros", "Servicios", "Reserva", "Contacto"];

  return (
    <header className={`fixed w-full transition-all duration-300 z-50 ${isScrolled ? 'bg-white/95 shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div
            className="h-15 text-rose-500 font-bold text-2xl cursor-pointer"
            onClick={() => scrollToSection('inicio')}
            role="button"
            tabIndex={0}
          >
            Clínica Keis
          </div>

          <nav className="hidden md:flex h-15 space-x-8">
            {navItems.map((item) => (
              <Link
                key={item}
                href={item === "Reserva" ? "/citas" : `#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-gray-700 hover:text-rose-500 transition-colors font-medium"
                onClick={(e) => {
                  if (item === "Reserva") {
                    return; // Allow default link behavior for Reserva
                  }
                  e.preventDefault();
                  //colocoar en la url la seccion
                  window.history.pushState(null, "", `#${item.toLowerCase().replace(/\s+/g, '-')}`);
                  scrollToSection(item.toLowerCase().replace(/\s+/g, '-'));
                }}
                prefetch={false}
              >
                {item}
              </Link>
              //scroll suave

            ))}
          </nav>

          <button
            className="md:hidden p-2 text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white absolute top-20 left-0 w-full shadow-lg" role="menu">
            <div className="px-4 py-2 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={item === "Reserva" ? "/citas" : `#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block py-2 text-gray-700 hover:text-rose-500"
                  onClick={() => {
                    setIsMenuOpen(false);
                    scrollToSection(item.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  prefetch={false}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
});
Header.displayName = 'Header';

const Footer = memo(() => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <h5 className="text-2xl font-bold mb-4">Clínica Keis</h5>
          <p className="text-gray-400">
            Comprometidos con tu salud dental y tu bienestar.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
          <div className="space-y-2">
            {["Inicio", "Servicios", "Reserva", "Contacto"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-gray-400 hover:text-rose-400"
                prefetch={false}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
          <div className="flex space-x-4">
            {[Facebook, Instagram, Twitter].map((Icon, index) => (
              <Link
                key={index}
                href="#"
                className="text-gray-400 hover:text-rose-400"
                aria-label={`Red social ${index}`}
              >
                <Icon size={24} />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2025 Clínica Keis. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
));
Footer.displayName = 'Footer';

const WhatsAppButton = memo(() => (
  <Link
    href="https://wa.me/50662633553"
    passHref
    legacyBehavior
  >
    <a
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
      aria-label="Contactar por WhatsApp"
    >
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    </a>
  </Link>
));
WhatsAppButton.displayName = 'WhatsAppButton';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 30);
    };

    const throttledScroll = () => {
      let ticking = false;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  return (
    <main className="bg-gradient-to-b from-rose-50 to-white min-h-screen">
      <Header {...{ isScrolled, isMenuOpen, setIsMenuOpen, scrollToSection }} />

      {/* Sección Hero */}
      <section id="inicio" className="pt-32 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-20 h-fit z-10 self-start"
        >
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Tu sonrisa merece la mejor atención
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Con la Dra. Karen Vargas Cortés, tu salud dental está en las mejores manos.
                Experimenta una atención personalizada y resultados excepcionales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/citas"
                  className="bg-rose-500 text-white px-8 py-3 rounded-full hover:bg-rose-600 transition-colors shadow-lg"
                  prefetch={false}
                >
                  Reservar Cita
                </Link>
                <button
                  onClick={() => scrollToSection('sobre-nosotros')}
                  className="bg-white text-blue-500 px-8 py-3 rounded-full border-2 border-blue-500 hover:bg-rose-50 transition-colors"
                  aria-label="Conoce más"
                >
                  Conoce más
                </button>
              </div>
            </div>
            <div className="hidden md:block relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="/doc-3.png"
                alt="Dra. Karen Dayana Vargas"
                className="w-full h-full object-contain rounded-2xl shadow-xl"
                width={500}
                height={500}
                priority
                quality={85}
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, 50vw" // <- Y esto
              />
            </div>

          </div>
        </motion.div>
      </section>

      <section id="sobre-nosotros" className="py-20 px-4 bg-gradient-to-b from-white to-rose-50">
        
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">
                Experiencia y Compromiso con tu Salud Dental
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  La Dra. Karen cuenta con más de 5 años de experiencia
                  en odontología general y estética. Su compromiso con la excelencia y
                  la atención personalizada la han convertido en una profesional
                  reconocida en San Carlos.
                </p>
                <ul className="space-y-4 mt-6">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    Especialización en tratamientos estéticos y preventivos
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    Formación continua en las últimas técnicas odontológicas
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    Enfoque gentil y personalizado para cada paciente
                  </li>
                </ul>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">+500</div>
                  <div className="text-sm text-gray-600">Pacientes Satisfechos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">5</div>
                  <div className="text-sm text-gray-600">Años de Experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">100%</div>
                  <div className="text-sm text-gray-600">Compromiso</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Image
                src="/clinica.jpg"
                alt="Clínica Interior"
                className="w-full h-full object-cover rounded-lg shadow-lg"
                width={500}
                height={500}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <Image
                src="/equipo-dental.avif"
                alt="Equipamiento Moderno"
                className="w-full h-full object-cover rounded-lg shadow-lg mt-8"
                width={500}
                height={500}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 px-4 bg-rose-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Nuestros Servicios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="bg-blue-200 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                
                <h3 className="text-xl text-black font-semibold mb-2">{service.icon}{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-rose-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Lo que dicen nuestras pacientes
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-blue-500 mb-4">★★★★★</div>
              <p className="text-gray-600 mb-4">
                &quot;Nunca había tenido una experiencia dental tan reconfortante. La Dra. Karen no solo fue extremadamente profesional, sino también muy empática. Me explicó cada paso del tratamiento de blanqueamiento, lo que me ayudó a sentirme completamente tranquila y segura.&quot;
              </p>
              <p className="font-medium text-black">Laura Rodríguez</p>
              <p className="text-sm text-gray-500">Tratamiento de Blanqueamiento</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-blue-500 mb-4">★★★★★</div>
              <p className="text-gray-600 mb-4">
                &quot;Como alguien con miedo al dentista, encontrar a la Dra. Vargas fue un verdadero alivio. Su enfoque suave y profesional me ayudó a superar mi ansiedad. El tratamiento de ortodoncia preventiva que me realizó fue completamente indoloro y los resultados son increíbles.&quot;
              </p>
              <p className="font-medium text-black">Ana Martínez</p>
              <p className="text-sm text-gray-500">Ortodoncia Preventiva</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-blue-500 mb-4">★★★★★</div>
              <p className="text-gray-600 mb-4">
                &quot;Llegué con un problema de caries que me preocupaba mucho. La Dra. Karen no solo trató el problema de manera eficiente, sino que me educó sobre prevención dental. Su atención detallada y el seguimiento posterior me hicieron sentir completamente respaldada en mi cuidado dental.&quot;
              </p>
              <p className="font-medium text-black">Sofía Guzmán</p>
              <p className="text-sm text-gray-500">Tratamiento de Caries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Contáctanos</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Phone className="text-blue-500" />
                <div>
                  <p className="font-medium text-black">Teléfono</p>
                  <p className="text-gray-600">000-0000</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="text-blue-500" />
                <div>
                  <p className="font-medium  text-black">Dirección</p>
                  <p className="text-gray-600">San José de La Tigra, San Carlos, Alajuela, Costa Rica.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Clock className="text-blue-500" />
                <div>
                  <p className="font-medium  text-black">Horario</p>
                  <p className="text-gray-600">Lunes a Viernes: 8:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <iframe
              title="Mapa Clínica"
              src="https://www.google.com/maps/embed"
              className="w-full h-[400px] rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}