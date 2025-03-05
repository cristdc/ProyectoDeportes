import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-background shadow-lg text-text px-13 py-5">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">TRAILRUNNING</h2>

        <div className="flex gap-4">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon 
              icon={faTwitter} 
              className="text-gray-600 hover:text-blue-500 text-xl transition-colors duration-300 ease-in-out hover:scale-110"
            />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon 
              icon={faGithub} 
              className="text-gray-600 hover:text-black text-xl transition-colors duration-300 ease-in-out hover:scale-110"
            />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon 
              icon={faLinkedin} 
              className="text-gray-600 hover:text-blue-700 text-xl transition-colors duration-300 ease-in-out hover:scale-110"
            />
          </a>
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-gray-600">© 2025 TrailRunning App. Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;
