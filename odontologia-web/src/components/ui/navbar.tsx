"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  { id: "inicio", label: "Inicio" },
  { id: "servicios", label: "Servicios" },
  { id: "contacto", label: "Contacto" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({ top: section.offsetTop - 80, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all ${scrolling ? "bg-white shadow-md" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-16">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={150} height={40} priority />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6 text-gray-700">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <button onClick={() => scrollToSection(id)} className="hover:text-blue-500 transition">
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden"
          >
            <ul className="flex flex-col items-center py-4">
              {sections.map(({ id, label }) => (
                <li key={id} className="py-2">
                  <button onClick={() => scrollToSection(id)} className="text-gray-700 hover:text-blue-500">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
