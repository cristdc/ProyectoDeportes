import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import carrera1 from "../assets/carrera1.png";
import carrera2 from "../assets/carrera2.png";
import carrera3 from "../assets/carrera3.png";
import logo from "../assets/logo.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const images = [carrera1, carrera2, carrera3];
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Cambiar imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Comprobar si hay un tema guardado
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px es el breakpoint de lg en Tailwind
    };

    // Comprobar tamaño inicial
    checkScreenSize();

    // Añadir listener para cambios de tamaño
    window.addEventListener("resize", checkScreenSize);

    // Limpiar listener
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const backgroundStyle = {
    backgroundImage: `linear-gradient(${
      isDark
        ? "rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)"
        : "rgba(253, 247, 237, 0.6), rgba(0, 0, 0, 0.6)"
    }), url(${images[currentImage]})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition:
      "background-image 1s ease-in-out, background-color 0.3s ease-in-out",
  };

  // Función actualizada para manejar descargas de archivos EXE según la modalidad
  const handleExeDownload = async (sportType) => {
    try {
      // Determinar qué archivo descargar según el deporte
      let fileName;
      switch (sportType) {
        case "cycling":
          fileName = "Cycling.exe";
          break;
        case "running":
          fileName = "Running.exe";
          break;
        case "trail":
          fileName = "TrailRunning.exe";
          break;
        case "management":
          fileName = "Management.exe";
          break;
        default:
          throw new Error("Tipo de deporte no válido");
      }

      const toastId = toast.loading(`Preparando la descarga de ${fileName}...`);
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/download/exe/${fileName}`);

      if (!response.ok) {
        throw new Error(`Error al descargar ${fileName}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.update(toastId, {
        render: `¡${fileName} descargado correctamente!`,
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Error al descargar el archivo: ${error.message}`);
    }
  };

  // Nueva función para manejar descargas de archivos APK
  const handleApkDownload = async (sportType) => {
    try {
      // Determinar qué archivo APK descargar según el deporte
      let fileName;
      switch (sportType) {
        case "cycling":
          fileName = "Cycling.apk";
          break;
        case "running":
          fileName = "Running.apk";
          break;
        case "trail":
          fileName = "Running.apk"; // Usando el mismo que running para trail
          break;
        default:
          throw new Error("Tipo de deporte no válido");
      }

      const toastId = toast.loading(`Preparando la descarga de ${fileName}...`);
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/download/apk/${fileName}`);

      if (!response.ok) {
        throw new Error(`Error al descargar ${fileName}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.update(toastId, {
        render: `¡${fileName} descargado correctamente!`,
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Error al descargar el archivo: ${error.message}`);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Función para cambiar el tema
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="flex flex-col w-full relative">
      {/* Añadir ToastContainer para las notificaciones */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? "dark" : "light"}
      />

      {/* Botón de tema */}
      <button
        onClick={toggleTheme}
        className={`fixed top-8 right-8 w-12 h-12 rounded-full 
          ${
            isDark
              ? "bg-white/20 hover:bg-white/30 text-white"
              : "bg-[#333333]/20 hover:bg-[#333333]/30 text-[#333333]"
          }
          backdrop-blur-sm transition-all duration-300 
          flex items-center justify-center z-50 group`}
        aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      >
        {isDark ? (
          // Icono del sol para modo claro
          <svg
            className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          // Icono de la luna para modo oscuro
          <svg
            className="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>

      {/* Sección superior responsive */}
      <div
        className="w-full flex flex-col items-center justify-start relative overflow-hidden"
        style={{ height: "100vh" }}
      >
        <div className="absolute inset-0 z-0" style={backgroundStyle} />

        <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto px-4 sm:px-6 h-full py-4 sm:py-8">
          <div className="w-[15vh] h-[15vh] min-w-[60px] max-w-[120px] flex items-center justify-center bg-black/40 rounded-full p-3 mb-4">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <button
            onClick={() => navigate("/register")}
            className="bg-[#9CAF88] px-4 sm:px-6 py-2 rounded-lg shadow-lg hover:bg-[#8A9C76] transition-colors text-white text-[2vh] mb-4"
          >
            Registrarse
          </button>

          <div className="text-center flex flex-col gap-4 flex-grow">
            <h1 className="text-[2.5vh] sm:text-[3.5vh] text-white font-bold">
              Bienvenido a MultiSports
            </h1>
            <p className="text-[1.5vh] sm:text-[1.8vh] text-gray-200 leading-relaxed px-2">
              Tu destino definitivo para los amantes del deporte al aire libre.
              En MultiSports, nos especializamos en tres emocionantes
              modalidades que te conectarán con la naturaleza y desafiarán tus
              límites.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2 px-2">
              <div
                onClick={() => scrollToSection("cycling")}
                className="bg-black/40 p-3 sm:p-4 rounded-lg cursor-pointer transform hover:scale-105 transition-all duration-300 hover:bg-black/50"
              >
                <h3 className="font-bold text-[1.8vh] sm:text-[2vh] mb-1 sm:mb-2 text-white">
                  Cycling
                </h3>
                <p className="text-[1.4vh] sm:text-[1.6vh] text-gray-200">
                  Explora rutas desafiantes y paisajes impresionantes sobre dos
                  ruedas.
                </p>
                <span className="text-[1.2vh] sm:text-[1.4vh] text-white mt-1 block">
                  Click para ver más →
                </span>
              </div>

              <div
                onClick={() => scrollToSection("trail")}
                className="bg-black/40 p-3 sm:p-4 rounded-lg cursor-pointer transform hover:scale-105 transition-all duration-300 hover:bg-black/50"
              >
                <h3 className="font-bold text-[1.8vh] sm:text-[2vh] mb-1 sm:mb-2 text-white">
                  Trail Running
                </h3>
                <p className="text-[1.4vh] sm:text-[1.6vh] text-gray-200">
                  Descubre senderos naturales y supera tus límites corriendo por
                  montañas, bosques y terrenos técnicos.
                </p>
                <span className="text-[1.2vh] sm:text-[1.4vh] text-white mt-1 block">
                  Click para ver más →
                </span>
              </div>

              <div
                onClick={() => scrollToSection("running")}
                className="bg-black/40 p-3 sm:p-4 rounded-lg cursor-pointer transform hover:scale-105 transition-all duration-300 hover:bg-black/50"
              >
                <h3 className="font-bold text-[1.8vh] sm:text-[2vh] mb-1 sm:mb-2 text-white">
                  Running
                </h3>
                <p className="text-[1.4vh] sm:text-[1.6vh] text-gray-200">
                  Participa en carreras urbanas y eventos que combinan la pasión
                  por correr con el espíritu competitivo.
                </p>
                <span className="text-[1.2vh] sm:text-[1.4vh] text-white mt-1 block">
                  Click para ver más →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secciones de deportes responsive */}
      {/* Cycling */}
      <div
        id="cycling"
        className="w-full relative overflow-hidden flex flex-col lg:flex-row"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-full lg:w-1/2 relative" style={{ minHeight: "50vh" }}>
          <img
            src={carrera1}
            alt="Cycling"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <h2 className="absolute bottom-10 left-10 text-3xl sm:text-4xl font-bold text-white">
            Cycling
          </h2>
        </div>

        <div className="w-full lg:w-1/2 bg-[var(--bg-primary)] p-6 sm:p-8 lg:p-16 flex flex-col justify-center">
          <div className="space-y-4 sm:space-y-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3 sm:mb-6">
              Descubre nuevas rutas
            </h3>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] mb-6 sm:mb-10">
              Explora rutas desafiantes y paisajes impresionantes sobre dos
              ruedas. Desde cicloturismo hasta competiciones de mountain bike.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <Link
                to="/cycling/"
                className="w-full bg-[var(--accent-light)] hover:bg-[var(--accent-hover)] px-4 sm:px-8 py-3 sm:py-4 
          rounded-lg shadow-lg transition-all duration-300 text-white text-base sm:text-lg 
          flex items-center justify-center group"
              >
                <span>Accede a nuestra página Web</span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>

              {/* Botón de descarga EXE */}
              <button
                onClick={() => handleExeDownload("cycling")}
                className="w-full bg-transparent border-2 border-[var(--accent-light)] 
            hover:bg-[var(--accent-light)]/10 px-4 sm:px-8 py-3 sm:py-4 rounded-lg 
            transition-all duration-300 text-[var(--accent-light)]
            text-base sm:text-lg flex items-center justify-center group"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Descarga para Windows</span>
              </button>

              {/* Botón de descarga APK */}
              <button
                onClick={() => handleApkDownload("cycling")}
                className="w-full bg-transparent border-2 border-[var(--accent-light)] 
            hover:bg-[var(--accent-light)]/10 px-4 sm:px-8 py-3 sm:py-4 rounded-lg 
            transition-all duration-300 text-[var(--accent-light)]
            text-base sm:text-lg flex items-center justify-center group"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18l-6-6h4V4h4v8h4l-6 6z"
                  />
                </svg>
                <span>Descarga para Android</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Running */}
      <div
        id="running"
        className="w-full relative overflow-hidden flex flex-col lg:flex-row-reverse"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-full lg:w-1/2 relative" style={{ minHeight: "50vh" }}>
          <img
            src={carrera2}
            alt="Running"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent" />
          <h2 className="absolute bottom-10 right-10 text-3xl sm:text-4xl font-bold text-white">
            Running
          </h2>
        </div>

        <div className="w-full lg:w-1/2 bg-[var(--bg-primary)] p-6 sm:p-8 lg:p-16 flex flex-col justify-center">
          <div className="space-y-4 sm:space-y-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3 sm:mb-6">
              Supera tus límites
            </h3>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] mb-6 sm:mb-10">
              Participa en carreras urbanas y eventos que combinan la pasión por
              correr con el espíritu competitivo.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <Link
                to="/running/"
                className="w-full bg-[var(--accent-light)] hover:bg-[var(--accent-hover)] px-4 sm:px-8 py-3 sm:py-4 
          rounded-lg shadow-lg transition-all duration-300 text-white text-base sm:text-lg 
          flex items-center justify-center group cursor-pointer"
              >
                <span>Accede a nuestra página Web</span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>

              {/* Botón de descarga EXE */}
              <button
                onClick={() => handleExeDownload("running")}
                className="w-full bg-transparent border-2 border-[var(--accent-light)] 
            hover:bg-[var(--accent-light)]/10 px-4 sm:px-8 py-3 sm:py-4 rounded-lg 
            transition-all duration-300 text-[var(--accent-light)]
            text-base sm:text-lg flex items-center justify-center group"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Descarga para Windows</span>
              </button>

              {/* Botón de descarga APK */}
              <button
                onClick={() => handleApkDownload("running")}
                className="w-full bg-transparent border-2 border-[var(--accent-light)] 
            hover:bg-[var(--accent-light)]/10 px-4 sm:px-8 py-3 sm:py-4 rounded-lg 
            transition-all duration-300 text-[var(--accent-light)]
            text-base sm:text-lg flex items-center justify-center group"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18l-6-6h4V4h4v8h4l-6 6z"
                  />
                </svg>
                <span>Descarga para Android</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trail Running */}
      <div
        id="trail"
        className="w-full relative overflow-hidden flex flex-col lg:flex-row"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-full lg:w-1/2 relative" style={{ minHeight: "50vh" }}>
          <img
            src={carrera3}
            alt="Trail Running"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <h2 className="absolute bottom-10 left-10 text-3xl sm:text-4xl font-bold text-white">
            Trail Running
          </h2>
        </div>

        <div className="w-full lg:w-1/2 bg-[var(--bg-primary)] p-6 sm:p-8 lg:p-16 flex flex-col justify-center">
          <div className="space-y-4 sm:space-y-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3 sm:mb-6">
              Conquista la naturaleza
            </h3>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] mb-6 sm:mb-10">
              Descubre senderos naturales y supera tus límites corriendo por
              montañas, bosques y terrenos técnicos.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <Link
                to="/trailRunning/"
                className="w-full bg-[var(--accent-light)] hover:bg-[var(--accent-hover)] px-4 sm:px-8 py-3 sm:py-4 
          rounded-lg shadow-lg transition-all duration-300 text-white text-base sm:text-lg 
          flex items-center justify-center group cursor-pointer"
              >
                <span>Accede a nuestra página Web</span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>

              {/* Botón de descarga EXE */}
              <button
                onClick={() => handleExeDownload("trail")}
                className="w-full bg-transparent border-2 border-[var(--accent-light)] 
            hover:bg-[var(--accent-light)]/10 px-4 sm:px-8 py-3 sm:py-4 rounded-lg 
            transition-all duration-300 text-[var(--accent-light)]
            text-base sm:text-lg flex items-center justify-center group"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Descarga para Windows</span>
              </button>

              {/* Botón de descarga APK */}
              <button
                onClick={() => handleApkDownload("trail")}
                className="w-full bg-transparent border-2 border-[var(--accent-light)] 
            hover:bg-[var(--accent-light)]/10 px-4 sm:px-8 py-3 sm:py-4 rounded-lg 
            transition-all duration-300 text-[var(--accent-light)]
            text-base sm:text-lg flex items-center justify-center group"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18l-6-6h4V4h4v8h4l-6 6z"
                  />
                </svg>
                <span>Descarga para Android</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección para Administradores */}
      <div className="w-full bg-[var(--bg-primary)] py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[var(--accent-light)]/10 p-6 sm:p-8 rounded-xl border border-[var(--accent-light)]/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                  ¿Eres administrador?
                </h3>
                <p className="text-[var(--text-secondary)] max-w-xl">
                  Accede a nuestra aplicación de escritorio para gestionar
                  eventos, participantes y resultados de todas las modalidades
                  deportivas.
                </p>
              </div>

              <button
                onClick={() => handleExeDownload("management")}
                className="flex items-center gap-3 bg-[var(--accent-light)] hover:bg-[var(--accent-hover)] px-6 py-4 
            rounded-lg shadow-lg transition-all duration-300 text-white text-lg group whitespace-nowrap"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Descargar aplicación de Administración</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Botón flotante para volver arriba */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm 
          hover:bg-black/50 transition-all duration-300 flex items-center justify-center 
          text-white z-50 group
          ${
            showScrollButton
              ? "translate-y-0 opacity-100"
              : "translate-y-20 opacity-0"
          }`}
        aria-label="Volver arriba"
      >
        <svg
          className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>

      {/* Añade también estas clases al CSS global o en un archivo de estilos */}
      <style jsx global>{`
        :root {
          --bg-primary: #fdf7ed;
          --text-primary: #333333;
          --text-secondary: #666666;
          --accent-light: #9caf88;
          --accent-hover: #8a9c76;
        }

        .dark {
          --bg-primary: #1a1a1a;
          --text-primary: #ffffff;
          --text-secondary: #cccccc;
          --accent-light: #7a8f68;
          --accent-hover: #6a7f58;
        }

        /* Transición suave al cambiar de tema */
        * {
          transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Home;
