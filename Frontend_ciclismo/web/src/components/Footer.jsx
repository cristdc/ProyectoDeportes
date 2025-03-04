import React from 'react';

function Footer() {
  return (
    <footer className="bg-[#1a1204] text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            &copy; {new Date().getFullYear()} CicloApp. Todos los derechos reservados.
          </div>
          <div className="flex space-x-4">
            <a href="/about" className="hover:text-[#8EAC93] transition-colors duration-200">Sobre Nosotros</a>
            <a href="/contact" className="hover:text-[#8EAC93] transition-colors duration-200">Contacto</a>
            <a href="/privacy" className="hover:text-[#8EAC93] transition-colors duration-200">Política de Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;