import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaRunning, FaHistory, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`inline-flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 ${
                location.pathname === '/' ? 'text-blue-600' : ''
              }`}
            >
              <FaHome className="mr-2" />
              Inicio
            </Link>
            <Link
              to="/available-races"
              className={`inline-flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 ${
                location.pathname === '/available-races' ? 'text-blue-600' : ''
              }`}
            >
              <FaRunning className="mr-2" />
              Carreras
            </Link>
            {user && (
              <Link
                to="/historial"
                className={`inline-flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 ${
                  location.pathname === '/historial' ? 'text-blue-600' : ''
                }`}
              >
                <FaHistory className="mr-2" />
                Historial
              </Link>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`inline-flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 ${
                    location.pathname === '/profile' ? 'text-blue-600' : ''
                  }`}
                >
                  <FaUser className="mr-2" />
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-red-600"
                >
                  <FaSignOutAlt className="mr-2" />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`inline-flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 ${
                  location.pathname === '/login' ? 'text-blue-600' : ''
                }`}
              >
                <FaUser className="mr-2" />
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
