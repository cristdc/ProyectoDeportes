import { FaRunning, FaUser } from 'react-icons/fa';
import { MdEmojiEvents } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-items">
          <Link to="/" className="logo">
            LOGO
          </Link>
          
          <div className="nav-links">
            <Link to="/carreras-disponibles" className="nav-link">
              <span className="nav-link-icon"><MdEmojiEvents /></span>
              <span>Carreras</span>
            </Link>
            <Link to="/participar" className="nav-link">
              <span className="nav-link-icon"><FaRunning /></span>
              <span>Participar</span>
            </Link>
            <Link to="/user" className="nav-link">
              <span className="nav-link-icon"><FaUser /></span>
              <span>Perfil</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;