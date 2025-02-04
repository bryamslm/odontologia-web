import { memo } from 'react';
import  Link  from 'next/link';
import dynamic from 'next/dynamic';

// Carga diferida de componentes e iconos
const SocialIcons = {
    Facebook: dynamic(() => import('lucide-react').then(mod => mod.Facebook), { ssr: false }),
    Instagram: dynamic(() => import('lucide-react').then(mod => mod.Instagram), { ssr: false }),
    Twitter: dynamic(() => import('lucide-react').then(mod => mod.Twitter), { ssr: false })
  };

export const Footer = memo(() => (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h5 className="text-2xl font-bold mb-4">FlowDent</h5>
            <p className="text-gray-400">Comprometidos con tu salud dental y tu bienestar.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <div className="space-y-2">
              {["Inicio", "Servicios", "Sobre nosotros", "Contacto"].map((item) => (
                <Link
                  key={item}
                  href={`/#${item.toLowerCase().replace(' ', '-')}`}
                  className="block text-gray-400 hover:text-blue-400"
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
              {Object.entries(SocialIcons).map(([name, Icon]) => (
                <Link key={name} href="#" className="text-gray-400 hover:text-blue-400">
                  <Icon size={24} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 FlowDent. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  ));
  
  Footer.displayName = 'Footer';