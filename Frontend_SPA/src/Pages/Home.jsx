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

  // Cambiar imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(${images[currentImage]})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "background-image 1s ease-in-out",
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/download/HOLA.exe`
      );
      if (!response.ok) throw new Error("Error al descargar el archivo");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "HOLA.exe";
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

  return (
    <div className="flex flex-col w-full">
      {/* Sección superior con fondo animado - usando viewport height */}
      <div
        className="w-full flex flex-col items-center justify-start relative overflow-hidden"
        style={{ height: "95vh" }}
      >
        {/* Capa de fondo con animación */}
        <div className="absolute inset-0 z-0" style={backgroundStyle} />

        {/* Contenido sobre el fondo - usando flex para distribución espacial */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto px-6 h-full py-8">
          {/* Logo adaptativo */}
          <div className="w-[15vh] h-[15vh] min-w-[80px] max-w-[120px] flex items-center justify-center bg-white/80 rounded-full p-3 mb-4">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Botón adaptativo */}
          <button
            onClick={() => navigate("/register")}
            className="bg-[#9CAF88] px-6 py-2 rounded-lg shadow-lg hover:bg-[#8A9C76] transition-colors text-white text-[2vh] mb-4"
          >
            Registrarse
          </button>

          <div className="text-center flex flex-col gap-4 flex-grow">
            <h1 className="text-[3.5vh] text-[#9CAF88] font-bold">
              Bienvenido a MultiSports
            </h1>
            <p className="text-[1.8vh] text-[#4A5043] leading-relaxed">
              Tu destino definitivo para los amantes del deporte al aire libre.
              En MultiSports, nos especializamos en tres emocionantes
              modalidades que te conectarán con la naturaleza y desafiarán tus
              límites.
            </p>

            {/* Grid de tarjetas adaptativo */}
            <div className="grid grid-cols-1 gap-4 mt-2">
              {/* Tarjetas con altura adaptativa */}
              <div
                onClick={() => scrollToSection("cycling")}
                className="bg-white/80 p-4 rounded-lg cursor-pointer transform hover:scale-105 transition-all duration-300 hover:bg-white/90"
              >
                <h3 className="font-bold text-[2vh] mb-2 text-[#9CAF88]">
                  Cycling
                </h3>
                <p className="text-[1.6vh]">
                  Explora rutas desafiantes y paisajes impresionantes sobre dos
                  ruedas. Desde cicloturismo hasta competiciones de mountain
                  bike.
                </p>
                <span className="text-[1.4vh] text-[#9CAF88] mt-1 block">
                  Click para ver más →
                </span>
              </div>

              <div
                onClick={() => scrollToSection("trail")}
                className="bg-white/80 p-4 rounded-lg cursor-pointer transform hover:scale-105 transition-all duration-300 hover:bg-white/90"
              >
                <h3 className="font-bold text-[2vh] mb-2 text-[#9CAF88]">
                  Trail Running
                </h3>
                <p className="text-[1.6vh]">
                  Descubre senderos naturales y supera tus límites corriendo por
                  montañas, bosques y terrenos técnicos.
                </p>
                <span className="text-[1.4vh] text-[#9CAF88] mt-1 block">
                  Click para ver más →
                </span>
              </div>

              <div
                onClick={() => scrollToSection("running")}
                className="bg-white/80 p-4 rounded-lg cursor-pointer transform hover:scale-105 transition-all duration-300 hover:bg-white/90"
              >
                <h3 className="font-bold text-[2vh] mb-2 text-[#9CAF88]">
                  Running
                </h3>
                <p className="text-[1.6vh]">
                  Participa en carreras urbanas y eventos que combinan la pasión
                  por correr con el espíritu competitivo.
                </p>
                <span className="text-[1.4vh] text-[#9CAF88] mt-1 block">
                  Click para ver más →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Cycling */}
      <div
        id="cycling"
        className="w-full relative bg-[#D1DCCD] overflow-hidden"
        style={{ height: "100vh" }}
      >
        <div className="absolute left-0 top-0 w-1/2 h-full">
          <img
            src={carrera1}
            alt="Carrera 1"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(45deg, transparent 49.9%, #D1DCCD 50%)",
          }}
        ></div>
        <div className="absolute right-0 top-0 w-1/2 h-full flex flex-col justify-center items-center gap-4 z-10">
          <button
            onClick={handleDownload}
            className="bg-white px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors border border-gray-200 text-lg"
          >
            Enlace 1
          </button>
          <button
            onClick={handleDownload}
            className="bg-white px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors border border-gray-200 text-lg"
          >
            Enlace 2
          </button>
        </div>
      </div>

      {/* Sección Running - ajustar altura */}
      <div
        id="running"
        className="w-full relative bg-[#D1DCCD] overflow-hidden"
        style={{ height: "100vh" }}
      >
        <div className="absolute right-0 top-0 w-1/2 h-full">
          <img
            src={carrera2}
            alt="Carrera 2"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(-45deg, transparent 49.9%, #D1DCCD 50%)",
          }}
        ></div>
        <div className="absolute left-0 top-0 w-1/2 h-full flex flex-col justify-center items-center gap-4 z-10">
          <button
            onClick={handleDownload}
            className="bg-white px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors border border-gray-200 text-lg"
          >
            Enlace 1
          </button>
          <button
            onClick={handleDownload}
            className="bg-white px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors border border-gray-200 text-lg"
          >
            Enlace 2
          </button>
        </div>
      </div>

      {/* Sección Trail Running - ajustar altura */}
      <div
        id="trail"
        className="w-full relative bg-[#D1DCCD] overflow-hidden"
        style={{ height: "100vh" }}
      >
        <div className="absolute left-0 top-0 w-1/2 h-full">
          <img
            src={carrera3}
            alt="Carrera 3"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(45deg, transparent 49.9%, #D1DCCD 50%)",
          }}
        ></div>
        <div className="absolute right-0 top-0 w-1/2 h-full flex flex-col justify-center items-center gap-4 z-10">
          <button
            onClick={handleDownload}
            className="bg-white px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors border border-gray-200 text-lg"
          >
            Enlace 1
          </button>
          <button
            onClick={handleDownload}
            className="bg-white px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors border border-gray-200 text-lg"
          >
            Enlace 2
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
