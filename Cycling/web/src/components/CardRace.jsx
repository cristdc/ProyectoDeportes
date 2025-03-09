import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const CardRace = ({ race }) => {
  const { userRegistrations, registerToRace, unregisterFromRace } = useAuth();
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkRegistration = () => {
      const registration = userRegistrations.find(
        reg => reg.race._id === race._id && reg.status === 'registered'
      );
      setIsRegistered(!!registration);
    };
    checkRegistration();
  }, [userRegistrations, race._id]);

  const handleRegistration = async () => {
    try {
      if (isRegistered) {
        toast.loading('Cancelando inscripción...');
        const registration = userRegistrations.find(
          reg => reg.race._id === race._id && reg.status === 'registered'
        );
        
        if (registration) {
          const result = await unregisterFromRace(registration._id);
          if (result.success) {
            toast.success('Te has dado de baja correctamente de la carrera');
            setIsRegistered(false);
          }
        }
      } else {
        toast.loading('Procesando inscripción...');
        const result = await registerToRace(race._id);
        if (result.success) {
          toast.success('¡Te has inscrito correctamente a la carrera!');
          setIsRegistered(true);
        }
      }
    } catch (error) {
      toast.error('Ha ocurrido un error: ' + error.message);
    }
  };

  const handleDownload = async () => {
    try {
      toast.loading('Preparando la descarga...');
      // ... lógica de descarga ...
      toast.success('¡Archivo descargado correctamente!');
    } catch (error) {
      toast.error('Error al descargar el archivo');
    }
  };

  // Si no hay datos de carrera, mostramos un mensaje o retornamos null
  if (!race) {
    console.log('No hay datos de carrera');
    return null; // o podrías retornar un componente de placeholder/loading
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-[#B4C7B2]">
      <div className="p-4">
        {/* Encabezado de la tarjeta */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-[#1a1204] truncate">
            {race.name || "Sin nombre"}
          </h3>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              race.status === "open"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {race.status === "open" ? "Abierta" : "Cerrada"}
          </span>
        </div>

        {/* Información principal */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-[#1a1204]">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {race.date || "Fecha no disponible"}
          </div>

          <div className="flex items-center text-sm text-[#1a1204]">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {race.location || "Ubicación no disponible"}
          </div>
        </div>

        {/* Detalles de la carrera */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="bg-[#fdf7ed] p-2 rounded">
            <span className="block text-xs text-[#1a1204] opacity-75">
              Distancia
            </span>
            <span className="font-medium text-[#1a1204]">
              {race.distance || 0} km
            </span>
          </div>
          <div className="bg-[#fdf7ed] p-2 rounded">
            <span className="block text-xs text-[#1a1204] opacity-75">
              Desnivel
            </span>
            <span className="font-medium text-[#1a1204]">
              {race.unevenness || 0} m
            </span>
          </div>
          <div className="bg-[#fdf7ed] p-2 rounded">
            <span className="block text-xs text-[#1a1204] opacity-75">
              Participantes
            </span>
            <span className="font-medium text-[#1a1204]">
              {race.maxParticipants || 0}
            </span>
          </div>
          <div className="bg-[#fdf7ed] p-2 rounded">
            <span className="block text-xs text-[#1a1204] opacity-75">
              Tiempo clasificatorio
            </span>
            <span className="font-medium text-[#1a1204]">
              {race.qualifyingTime || 0} min
            </span>
          </div>
        </div>

        {/* Botón de acción */}
        <button
          onClick={handleRegistration}
          disabled={isLoading}
          className={`w-full mb-2 ${
            isRegistered
              ? "bg-red-500 hover:bg-red-600"
              : "bg-[#9B9D79] hover:bg-opacity-90"
          } text-white py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8EAC93] focus:ring-offset-2 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading
            ? "Procesando..."
            : isRegistered
            ? "Desapuntarse"
            : "Inscribirme"}
        </button>
        <Link
          to={
            window.location.pathname.startsWith("/cycling")
              ? `/cycling/carrerasDetail/${race._id}`
              : `/carrerasDetail/${race._id}`
          }
          className="..."
        >
          Ver detalles
        </Link>

        <button
          onClick={handleDownload}
          className="flex mt-2 w-full justify-center items-center gap-2 px-4 py-2 bg-[#9B9D79] text-white rounded-md hover:bg-[#8EAC93] transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Descargar
        </button>
      </div>
    </div>
  );
};

export default CardRace;
