import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#B4C7B2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-[#1a1204]">CicloApp</h3>
            <p className="mt-4 text-[#1a1204] opacity-75 max-w-md">
              Tu plataforma para descubrir y participar en las mejores carreras
              de ciclismo. Encuentra las competencias que mejor se adapten a tu
              nivel y objetivos.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-[#1a1204] font-semibold mb-4">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to={"/cycling" }
                  className="text-[#1a1204] opacity-75 hover:opacity-100 transition-opacity"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to={"/cycling/carreras-disponibles" }
                  className="text-[#1a1204] opacity-75 hover:opacity-100 transition-opacity"
                >
                  Carreras Disponibles
                </Link>
              </li>
              <li>
                <Link
                  to={
                     "/cycling/carreras-historial"
                  }
                  className="text-[#1a1204] opacity-75 hover:opacity-100 transition-opacity"
                >
                  Historial
                </Link>
              </li>
              <li>
                <Link
                  to={  "/cycling/profile" }
                  className="text-[#1a1204] opacity-75 hover:opacity-100 transition-opacity"
                >
                  Mi Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-[#1a1204] font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-[#1a1204] opacity-75">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                contacto@cicloapp.com
              </li>
              <li className="flex items-center text-[#1a1204] opacity-75">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +56 9 1234 5678
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer