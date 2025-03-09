import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import useAuth from "../hooks/useAuth";


const Navbar = ( { user } ) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async() =>{
    await logout();
    navigate("/")
  }

  return (
    <>
      <div className="flex justify-between items-center p-2 bg-white">
        {/* Logo */}
        <a href="/trailRunning/home">
          <div className="flex transition-all duration-300 hover:opacity-80">
            <img
              src="url('/public/img/logo.png')"
              alt="Logo Trail"
              className="h-12 mr-[-30px]"
            />
            <img
              src="/public/img/nombre.png"
              alt="Logo Trail"
              className="h-12"
            />
          </div>
        </a>

        <div className="hidden sm:flex flex-1 justify-center"></div>

        {/* Botón Hamburguesa en pantallas menores a 480px */}
        <button
          className="sm:hidden text-text hover:text-accent transition-all duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menú en pantallas grandes (480px en adelante) */}
        <div className="hidden sm:flex space-x-3 ">
          <Link
            to="/trailRunning/user"
            className="text-text hover:text-accent transition-all duration-300"
          >
            {user ? user.name : ""}
          </Link>
          {user ? (
            <>
              <Link
                to="/trailRunning/races"
                className="pr-3 text-text  hover:text-accent transition-all duration-300"
              >
                Carreras Disponibles
              </Link>
              <Link
                to="/trailRunning/racesuser"
                className="pr-3 text-text  hover:text-accent transition-all duration-300"
              >
                Historial de Carreras
              </Link>
              <button
                onClick={handleLogout}
                className="text-text hover:text-accent transition-all duration-300"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              to="/"
              className="text-text hover:text-accent transition-all duration-300"
            >
              Iniciar Sesion
            </Link>
          )}
        </div>
      </div>

      <div
        className={`sm:hidden flex flex-col bg-background text-white py-3 space-y-2 
        transition-all duration-300 ${isOpen ? "block" : "hidden"}`}
      >
        <Link
          to="/trailRunning/user"
          className="text-text text-center hover:text-accent transition-all duration-300"
        >
          {user ? user.name : ""}
        </Link>
        {user ? (
          <>
            <Link
              to="/trailRunning/races"
              className="pr-3 text-text text-center hover:text-accent transition-all duration-300"
            >
              Carreras Disponibles
            </Link>
            <Link
              to="/trailRunning/racesuser"
              className="pr-3 text-text text-center hover:text-accent transition-all duration-300"
            >
              Historial de Carreras
            </Link>

            <button
              onClick={async () => logout()}
              className="text-text hover:text-accent transition-all duration-300"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link
            to="/"
            className="text-text text-center hover:text-accent transition-all duration-300"
          >
            Iniciar Sesion
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;
