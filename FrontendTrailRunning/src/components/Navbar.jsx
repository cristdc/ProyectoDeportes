import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../routes/paths";


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
      <div className="flex justify-between items-center p-2 bg-background p-5">
        {/* Logo */}
        <div>
          <Link to="/" className="text-text hover:text-accent transition-all duration-300"><h1>Trail</h1></Link>
        </div>

        {/* Nombre de usuario centrado en pantallas grandes */}
        <div className="hidden sm:flex flex-1 justify-center">
          <Link to="/" className="text-text hover:text-accent transition-all duration-300">
            {user ? user.name : ""}
          </Link>
        </div>

        {/* Botón Hamburguesa en pantallas menores a 480px */}
        <button 
          className="sm:hidden text-text hover:text-accent transition-all duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menú en pantallas grandes (480px en adelante) */}
        <div className="hidden sm:flex space-x-3">
        <Link to={ROUTES.RACES} className="block text-text text-center hover:bg-background transition-all duration-300">Carreras Disponibles</Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="text-text hover:text-accent transition-all duration-300"
            >
              Cerrar sesión
            </button>
          ) : (
            <Link to="/" className="text-text hover:text-accent transition-all duration-300">
              Iniciar Sesion
            </Link>
          )}
        </div>
      </div>

      <div 
        className={`sm:hidden flex flex-col bg-background text-white py-3 space-y-2 
        transition-all duration-300 ${isOpen ? "block" : "hidden"}`}
      >
        <Link to={ROUTES.RACES} className="block text-text text-center hover:bg-background transition-all duration-300">Carreras Disponibles</Link>
        <button
              onClick={handleLogout}
              className="text-text hover:text-accent transition-all duration-300"
            >
              Cerrar sesión
        </button>
      </div>
    </>
  );
};

export default Navbar;
