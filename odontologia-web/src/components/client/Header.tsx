/* app/components/Header.tsx */
"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  isScrolled: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
  scrollToSection: (sectionId: string) => void;
}

const Header = memo(function Header({
  isScrolled,
  isMenuOpen,
  setIsMenuOpen,
  activeSection,
  setActiveSection,
  scrollToSection,
}: HeaderProps) {
  const navItems = ["Inicio", "Sobre nosotros", "Servicios", "Reserva", "Contacto"];

  return (
    <header
      className={`fixed w-full transition-all duration-300 z-50 
      ${isScrolled ? "bg-white/95 shadow-md" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-0 flex justify-between items-center h-16">
        <div
          className="text-blue-500 font-bold text-2xl cursor-pointer"
          onClick={() => scrollToSection("inicio")}
          
        
          role="button"
          tabIndex={0}
        >
          FlowDental
        </div>

        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => {
            const linkSection = item.toLowerCase().replace(/\s+/g, "-");
            const href = item === "Reserva" ? "/citas" : `#${linkSection}`;

            return (
              <Link
                key={item}
                href={href}
                className={
                  activeSection === linkSection
                    ? "text-blue-500 hover:text-blue-600 transition-colors font-medium underline"
                    : "text-gray-700 hover:text-blue-500 transition-colors font-medium"
                }
                onClick={(e) => {
                  setActiveSection(linkSection);
                  if (item === "Reserva") return; // Deja el link normal
                  e.preventDefault();
                  
                  window.history.pushState(null, "", `#${linkSection}`);
                  scrollToSection(linkSection);
                }}
              >
                {item}
              </Link>
            );
          })}
        </nav>

        {/* Botón menú hamburguesa en modo móvil */}
        <button
          className="md:hidden p-2 text-black"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú en modo móvil */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-20 left-0 w-full shadow-lg">
          {navItems.map((item) => {
            const linkSection = item.toLowerCase().replace(/\s+/g, "-");
            const href = item === "Reserva" ? "/citas" : `#${linkSection}`;
            return (
              <Link
                key={item}
                href={href}
                className="block py-2 px-4 text-gray-700 hover:text-blue-500"
                onClick={(e) => {
                  setIsMenuOpen(false);
                  if (item === "Reserva") return;
                  e.preventDefault();
                  scrollToSection(linkSection);
                }}
              >
                {item}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
});

Header.displayName = "Header";

export default Header;