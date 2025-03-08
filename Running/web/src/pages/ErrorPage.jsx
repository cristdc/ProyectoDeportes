import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF6F1] to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-[#8D9B6A] via-[#D4A373] to-[#A8B892] p-8 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex flex-col items-center">
            <FaExclamationTriangle className="text-6xl text-white mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
              ¡Ups! Algo salió mal
            </h1>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-8">
          <p className="text-gray-600 text-center text-lg mb-8">
            Lo sentimos, la página que estás buscando no está disponible o ha ocurrido un error.
          </p>

          {/* Botones de acción */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full 
                       border-2 border-[#8D9B6A] text-[#8D9B6A] font-semibold
                       hover:bg-[#8D9B6A]/10 transition-all duration-300"
            >
              <FaArrowLeft />
              Volver atrás
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full 
                       bg-[#8D9B6A] text-white font-semibold
                       hover:bg-[#738055] transition-all duration-300"
            >
              <FaHome />
              Ir al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;