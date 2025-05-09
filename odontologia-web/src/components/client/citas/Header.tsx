"use client";
import { memo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Menu = dynamic(() => import('lucide-react').then(mod => mod.Menu), { ssr: false });
const X = dynamic(() => import('lucide-react').then(mod => mod.X), { ssr: false });

const NAV_ITEMS = ["Inicio", "Sobre nosotros", "Servicios", "Reserva", "Contacto"];


export const Header = memo(({ isScrolled, isMenuOpen, setIsMenuOpen, resetForm }: {
  isScrolled: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<boolean>;
  resetForm: () => void;

}) => {

  return (
    <header
      className={`fixed w-full transition-all duration-300 z-50
        ${isScrolled ? 'bg-white/95 shadow-md' : 'bg-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* LOGO */}
        <div className="text-blue-500 font-bold text-2xl cursor-pointer">
          <Link href="/">
            FlowDental
          </Link>
        </div>
  
        {/* NAV DESKTOP */}
        <nav className="hidden md:flex space-x-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item}
              href={
                item === "Reserva"
                  ? "/citas"
                  : `/#${item.toLowerCase().replace(/\s+/g, '-')}`
              }
              className={
                item === "Reserva"
                  ? "text-blue-500 hover:text-blue-600 transition-colors font-medium underline"
                  : "text-gray-700 hover:text-blue-500 transition-colors font-medium"
              }
              onClick={(e) => {
                if (item !== "Reserva") return;
                e.preventDefault();
                resetForm();
                
              }}
            >
              {item}
            </Link>
          ))}
        </nav>
  
        {/* BOTÓN MENÚ MÓVIL */}
        <button
          className="md:hidden p-2 text-black"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
  
      {/* NAV MÓVIL */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-20 left-0 w-full shadow-lg">
          <div className="px-4 py-2 space-y-2">
            {["Inicio", "Sobre nosotros", "Servicios", "Reserva", "Contacto"].map((item) => (
              <Link
                key={item}
                href={
                  item === "Reserva"
                    ? "/citas"
                    : `/#${item.toLowerCase().replace(/\s+/g, '-')}`
                }
                className="block py-2 text-gray-700 hover:text-blue-500"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
);  
Header.displayName = 'Header';