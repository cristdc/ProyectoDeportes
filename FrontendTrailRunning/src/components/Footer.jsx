import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-background shadow-lg text-text">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold mb-4">¡Thanks for visiting!</h2>
          <p className="mb-4">
            Explore more about pokemon and discover all the nice things we have ready for you
          </p>
          <p className="mt-4 text-sm">
            © {new Date().getFullYear()} TrailRunning Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
