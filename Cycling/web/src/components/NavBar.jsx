import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo o Nombre del sitio */}
          <div className="flex-shrink-0 flex items-center">
            <Link to={"/cycling"} className="text-2xl font-bold text-[#1a1204]">
              CicloApp
            </Link>
          </div>

          {/* Enlaces de navegación */}
          <div className="flex items-center">
            <div className="hidden md:flex space-x-8">
              <Link
                to={"/cycling"}
                className={`${
                  isActiveRoute("/") || isActiveRoute("/cycling")
                    ? "text-[#9B9D79] border-b-2 border-[#9B9D79]"
                    : "text-[#1a1204] hover:text-[#8EAC93]"
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                Inicio
              </Link>
              <Link
                to={"/cycling/carreras-disponibles"}
                className={`${
                  isActiveRoute("/carreras-disponibles") ||
                  isActiveRoute("/cycling/carreras-disponibles")
                    ? "text-[#9B9D79] border-b-2 border-[#9B9D79]"
                    : "text-[#1a1204] hover:text-[#8EAC93]"
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                Carreras Disponibles
              </Link>
              <Link
                to={"/cycling/carreras-historial"}
                className={`${
                  isActiveRoute("/carreras-historial") ||
                  isActiveRoute("/cycling/carreras-historial")
                    ? "text-[#9B9D79] border-b-2 border-[#9B9D79]"
                    : "text-[#1a1204] hover:text-[#8EAC93]"
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                Historial de Carreras
              </Link>
              <Link
                to={"/cycling/mis-carreras"}
                className={`${
                  isActiveRoute("/mis-carreras") ||
                  isActiveRoute("/cycling/mis-carreras")
                    ? "text-[#9B9D79] border-b-2 border-[#9B9D79]"
                    : "text-[#1a1204] hover:text-[#8EAC93]"
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                Mis Carreras
              </Link>
            </div>

            {/* Botones de autenticación */}
            <div className="ml-8 flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-[#1a1204] text-sm">
                    Hola,{" "}
                    <Link
                      to={"/cycling/profile"}
                      className="text-gray-500 hover:text-[#8EAC93] hover:font-bold transition-all duration-150"
                    >
                      {user?.name}
                    </Link>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-[#9B9D79] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8EAC93] focus:ring-offset-2"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link
                  to={"/cycling/login"}
                  className="bg-[#9B9D79] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8EAC93] focus:ring-offset-2"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>

          {/* Botón de menú móvil (puedes implementar la lógica del menú móvil más tarde) */}
          <div className="md:hidden flex items-center">
            <button className="text-[#1a1204] hover:text-[#8EAC93]">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil (oculto por defecto) */}
      <div className="hidden md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to={ "/cycling" }
            className="block px-3 py-2 text-[#1a1204] hover:text-[#8EAC93]"
          >
            Inicio
          </Link>
          <Link
            to={ "/cycling/carreras-disponibles"
            }
            className="block px-3 py-2 text-[#1a1204] hover:text-[#8EAC93]"
          >
            Carreras Disponibles
          </Link>
          <Link
            to={"/cycling/carreras-historial"}
            className="block px-3 py-2 text-[#1a1204] hover:text-[#8EAC93]"
          >
            Historial de Carreras
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
