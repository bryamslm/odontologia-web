/* app/components/Home.tsx */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import { Phone, Clock, MapPin } from "lucide-react";

// Aquí la interfaz del prop 'services' si gustas tiparlo
interface Service {
    title: string;
    description: string;

}

export default function Home({ services }: { services: Service[] }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("inicio");

    // Alternativa simple de scroll sin requestAnimationFrame
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            setActiveSection(hash.slice(1));
           
        }

        const handleScroll = () => setIsScrolled(window.scrollY > 30);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Mueve el scroll a la sección que corresponda
    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        setActiveSection(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);

    return (
        <main className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
            {/* Header / Navbar */}
            <Header
                isScrolled={isScrolled}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                scrollToSection={scrollToSection}
            />

            {/* Sección Hero */}
            <section id="inicio" className="pt-28 px-4 bg-gradient-to-b from-white to-blue-50">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center"
                >
                    <div className="">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 text-center md:text-start" 
                            >
                            Tu sonrisa merece la mejor atención
                        </h1>
                        <p className="text-lg text-gray-800 mb-8 text-justify hyphens-auto">
                            Con FlowDental, tu salud dental está en las mejores manos.
                            Experimenta una atención personalizada y resultados excepcionales.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 text-center justify-center md:justify-start">
                            <Link
                                href="/citas"
                                className="bg-blue-500 text-gray-800 px-8 py-3 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                                prefetch={false}
                            >
                                <strong>Reservar Cita</strong>
                            </Link>
                            <button
                                onClick={() => scrollToSection("sobre-nosotros")}
                                className="bg-white text-rose-500 px-8 py-3 rounded-full border-2 border-rose-500 hover:bg-rose-50 transition-colors"
                                aria-label="Conoce más"
                            >
                                <strong>Conoce más</strong>
                            </button>
                        </div>
                    </div>
                    <div className="hidden md:block relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
                        <Image
                            src="/doc-3.png"
                            alt="FlowBiz Dental"
                            className="w-full h-full object-contain rounded-2xl shadow-xl"
                            width={500}
                            height={500}
                            priority
                            quality={85}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Sección Sobre Nosotros */}
            <section
                id="sobre-nosotros"
                className="py-28 px-4 bg-gradient-to-b from-blue-50 to-white"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-800 text-justify hyphens-auto" 
                            >
                                Experiencia y Compromiso con tu Salud Dental
                            </h2>
                            <div className="prose prose-lg text-gray-600">
                                <p className="text-justify hyphens-auto">
                                    FlowBiz Dental cuenta con más de 5 años de experiencia
                                    en odontología general y estética. Su compromiso con la
                                    excelencia y la atención personalizada la han convertido
                                    en una profesional reconocida en San Carlos.
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
                                    <div className="text-3xl font-bold text-blue-500">+2000</div>
                                    <div className="text-sm text-gray-600">
                                        Pacientes Satisfechos
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-500">3</div>
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

            {/* Sección Servicios (usamos props.services) */}
            <section id="servicios" className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-gray-800">
                        Nuestros Servicios
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 gap-x-4">
                        {services.map((service) => (
                            <div
                                key={service.title}
                                className="bg-blue-100 p-6 rounded-xl hover:shadow-lg transition-shadow"
                            >
                                <h3 className="text-xl text-black font-semibold mb-2 text-center">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 text-center">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sección Testimonios */}
            <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-gray-800">
                        Lo que dicen nuestros pacientes
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-blue-100 p-6 rounded-xl shadow-sm">
                            <div className="text-blue-500 mb-4">★★★★★</div>
                            <p className="text-gray-600 mb-4 text-justify hyphens-auto">
                                &quot;Nunca había tenido una experiencia dental tan
                                reconfortante. FlowDental no solo fue extremadamente
                                profesional, sino también muy empática...&quot;
                            </p>
                            <p className="font-medium text-black">Laura Rodríguez</p>
                            <p className="text-sm text-gray-500">
                                Tratamiento de Blanqueamiento
                            </p>
                        </div>
                        <div className="bg-blue-100 p-6 rounded-xl shadow-sm">
                            <div className="text-blue-500 mb-4">★★★★★</div>
                            <p className="text-gray-600 mb-4 text-justify hyphens-auto">
                                &quot;Como alguien con miedo al dentista, encontrar a
                                FlowDental fue un verdadero alivio...&quot;
                            </p>
                            <p className="font-medium text-black">Rodrigo Martínez</p>
                            <p className="text-sm text-gray-500">Ortodoncia Preventiva</p>
                        </div>
                        <div className="bg-blue-100 p-6 rounded-xl shadow-sm">
                            <div className="text-blue-500 mb-4">★★★★★</div>
                            <p className="text-gray-600 mb-4 text-justify hyphens-auto">
                                &quot;Llegué con un problema de caries que me preocupaba mucho.
                                FlowDental no solo trató el problema de manera eficiente...&quot;
                            </p>
                            <p className="font-medium text-black">Sofía Guzmán</p>
                            <p className="text-sm text-gray-500 ">Tratamiento de Caries</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección Contacto */}
            <section id="contacto" className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-8 text-gray-800">
                            Contáctanos
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                {/* Icono Phone dinámico */}
                                <Phone className="text-blue-500" />
                                <div>
                                    <p className="font-medium text-black">Teléfono</p>
                                    <p className="text-gray-600">000-0000</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <MapPin className="text-blue-500" />
                                <div>
                                    <p className="font-medium text-black">Dirección</p>
                                    <p className="text-gray-600">
                                        San Carlos, Alajuela, Costa Rica.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Clock className="text-blue-500" />
                                <div>
                                    <p className="font-medium text-black">Horario</p>
                                    <p className="text-gray-600">
                                        Lunes a Viernes: 8:00 AM - 5:00 PM
                                    </p>
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

            {/* Footer */}
            <Footer />

            {/* Botón Flotante de WhatsApp */}
            <WhatsAppButton />
        </main>
    );
}