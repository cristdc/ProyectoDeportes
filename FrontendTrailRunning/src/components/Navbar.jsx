import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center p-2 bg-cyan-600">
        {/* Logo */}
        <div>
          <Link to="/">Trail</Link>
        </div>

        {/* Botón Hamburguesa en pantallas menores a 480px */}
        <button 
          className="sm:hidden text-white"  // Se oculta en pantallas mayores a 480px
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menú en pantallas grandes (480px en adelante) */}
        <div className="hidden sm:flex space-x-3">
          <Link to="" className="pr-3">Carreras Disponibles</Link>
          <Link>Cerrar sesión</Link>
          <Link>Usuario</Link>
        </div>
      </div>

      {/* Menú Móvil (visible solo cuando isOpen es true) */}
      <div 
        className={`sm:hidden flex flex-col bg-cyan-700 text-white py-3 space-y-2 
        transition-all duration-300 ${isOpen ? "block" : "hidden"}`}
      >
        <Link to="" className="block text-center">Carreras Disponibles</Link>
        <Link className="block text-center">Cerrar sesión</Link>
        <Link className="block text-center">Usuario</Link>
      </div>
    </>
  );
};

export default Navbar;

