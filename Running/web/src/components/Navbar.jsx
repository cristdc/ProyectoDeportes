import { FaHome, FaUser } from "react-icons/fa";
import { MdEmojiEvents } from "react-icons/md";
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed bottom-0 w-full md:static md:w-auto md:shadow-none">
      <div className="flex justify-between items-center p-4 md:py-2 md:px-8">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          RUNNING APP
        </Link>

        {/* Links de navegación */}
        <div className="flex space-x-6 md:space-x-8">
          <NavLink
            to="/carreras-disponibles"
            className={({ isActive }) =>
              `flex flex-col items-center text-gray-600 ${
                isActive ? "text-blue-600 font-semibold" : ""
              }`
            }
          >
            <MdEmojiEvents className="text-2xl" />
            <span className="text-sm">Carreras</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center text-gray-600 ${
                isActive ? "text-blue-600 font-semibold" : ""
              }`
            }
          >
            <FaUser className="text-2xl" />
            <span className="text-sm">Perfil</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
