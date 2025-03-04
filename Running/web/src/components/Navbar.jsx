import { FaHistory, FaUser } from 'react-icons/fa';
import { MdEmojiEvents } from 'react-icons/md';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-items">
          <Link to="/" className="logo">
            RUNNING APP
          </Link>
          
          <div className="nav-links">
            <NavLink 
              to="/carreras-disponibles" 
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              <span className="nav-link-icon"><MdEmojiEvents /></span>
              <span>Carreras</span>
            </NavLink>
            <NavLink 
              to="/historial" 
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              <span className="nav-link-icon"><FaHistory /></span>
              <span>Historial</span>
            </NavLink>
            <NavLink 
              to="/user" 
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              <span className="nav-link-icon"><FaUser /></span>
              <span>Perfil</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
