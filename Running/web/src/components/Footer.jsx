import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-simple">
          <Link to="/" className="footer-logo">
            RUNNING APP
          </Link>
          <div className="footer-links">
            <Link to="/carreras-disponibles">Carreras</Link>
            <Link to="/historial">Historial</Link>
          </div>
          <div className="social-links">
            <a href="#" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="#" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
            <a href="#" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} Running App. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;