import { FaHome, FaUser } from 'react-icons/fa';
import { MdEmojiEvents } from 'react-icons/md';

const Navbar = () => {
  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-items">
          <a href="/" className="logo">
            LOGO
          </a>
          
          <div className="nav-links">
            <a href="/" className="nav-link">
              <span className="nav-link-icon"><FaHome /></span>
              <span>Inicio</span>
            </a>
            <a href="/carreras-dispo" className="nav-link">
              <span className="nav-link-icon"><MdEmojiEvents /></span>
              <span>Carreras</span>
            </a>
            <a href="/user" className="nav-link">
              <span className="nav-link-icon"><FaUser /></span>
              <span>Perfil</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;