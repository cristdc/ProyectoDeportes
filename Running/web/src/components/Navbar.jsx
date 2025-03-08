import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaRunning, FaHistory, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const { logout } = useAuth();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const location = useLocation();

  // Función para determinar si un enlace está activo
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return path !== '/' && location.pathname.startsWith(path);
  };

  // Función para generar las clases del enlace
  const getLinkClasses = (path) => {
    return `flex items-center px-5 py-2 transition-all duration-300 text-gray-600 rounded-full
      ${isActive(path)
        ? 'bg-[#8D9B6A] text-white font-medium shadow-sm'
        : 'hover:bg-[#F5F7F2] hover:text-[#8D9B6A]'
      }`;
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20">
          {/* Logo y enlaces principales */}
          <div className="flex items-center space-x-8">
            {/* Logo Running */}
            <Link
              to="/"
              className="flex items-center group"
            >
              <FaRunning className="text-3xl text-[#8D9B6A] group-hover:scale-110 transition-transform duration-300" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-[#8D9B6A] to-[#A8B892] bg-clip-text text-transparent">
                Running
              </span>
            </Link>

            {/* Enlaces de navegación */}
            <div className="flex items-center space-x-2">
              <Link
                to="/available-races"
                className={getLinkClasses('/available-races')}
              >
                <span>Carreras</span>
              </Link>

              {user && (
                <Link
                  to="/historial"
                  className={getLinkClasses('/historial')}
                >
                  <FaHistory className="mr-2" />
                  <span>Historial</span>
                </Link>
              )}
            </div>
          </div>

          {/* Enlaces de usuario */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#F5F7F2] rounded-full transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-[#8D9B6A] rounded-full flex items-center justify-center text-white">
                    <FaUser className="text-sm" />
                  </div>
                  <span className="ml-2 font-medium">
                    {user.name || user.email || 'Usuario'}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
                >
                  <FaSignOutAlt className="mr-2" />
                  <span className="font-medium">Cerrar sesión</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-6 py-2.5 bg-[#8D9B6A] text-white rounded-full hover:bg-[#7A8759] transition-all duration-300 shadow-sm"
              >
                <FaUser className="mr-2 text-sm" />
                <span className="font-medium">Iniciar sesión</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
