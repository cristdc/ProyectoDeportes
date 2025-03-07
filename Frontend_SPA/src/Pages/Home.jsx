import carrera1 from "../assets/carrera1.png";
import carrera2 from "../assets/carrera2.png";
import carrera3 from "../assets/carrera3.png";
import logo from "../assets/logo.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  const handleDownload = async () => {
    try {
      const fileName = isMobile ? "ADIOS.exe" : "HOLA.exe";
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/download/${fileName}`
      );

      if (!response.ok) throw new Error("Error al descargar el archivo");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al descargar el archivo");
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
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-[#9b9d79]">Ciclismo</h2>
        <img 
          src={carrera1}
          alt="Carrera 1" 
          className="max-w-2xl w-full h-48 object-cover rounded-lg shadow-lg"
        />
        <ul className="list-disc text-[#9b9d79]">
          <li>Enlace uno</li>
          <li>Enlace dos</li>
          <li>Enlace tres</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#9b9d79]">Running</h2>
        <img 
          src={carrera2} 
          alt="Carrera 2" 
          className="max-w-2xl w-full h-48 object-cover object-top rounded-lg shadow-lg"
        />
        <ul className="list-disc text-[#9b9d79]">
          <li>Enlace uno</li>
          <li>Enlace dos</li>
          <li>Enlace tres</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#9b9d79]">Trailrunning</h2>
        <img 
          src={carrera3}
          alt="Carrera 3" 
          className="max-w-2xl w-full h-48 object-cover rounded-lg shadow-lg"
        />
        <ul className="list-disc text-[#9b9d79]">
          <li>Enlace uno</li>
          <li>Enlace dos</li>
          <li>Enlace tres</li>
        </ul>
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
  
};

export default Home;


