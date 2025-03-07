import React, { useEffect, useState } from 'react'
import useAuth from "../hooks/useAuth"
import { fetchLastRace } from "../helpers/fetch";
import { 
  Flag, 
  Calendar, 
  Activity, 
  MapPin, 
  Ruler, 
  ClipboardEdit, 
  Bell 
} from "lucide-react";

const Home = () => {
  const { user } = useAuth(); 
  const [lastRace, setLastRace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRace = async () => {
    try {
      setLoading(true);
      const race = await fetchLastRace();
      setLastRace(race);
      setError(null);
    } catch (err) {
      setError(err.message);
      setLastRace(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRace();
  }, [])
  
  return (
    <div className="flex flex-col md:flex-row h-auto min-h-screen">
      {/* Sección de imagen y cita - adaptativo para móvil */}
      <div className="w-full md:w-1/2 h-64 md:h-auto bg-[url('img/mountain.jpg')] bg-cover bg-center flex items-center justify-center text-center p-6">
        <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-lg italic">
          "El dolor es temporal, <br /> pero la satisfacción es para siempre."
        </h3>
      </div>

      {/* Sección de datos de carrera - adaptativo para móvil */}
      <div className="w-full md:w-1/2 p-4 md:p-6">
        <h3 className="text-xl md:text-2xl font-semibold mb-4 text-center md:text-left">
          Última carrera de {user?.name}
        </h3>
        
        {loading ? (
          <p className="text-center md:text-left">Cargando última carrera...</p>
        ) : error ? (
          <p className="text-red-500 text-center md:text-left">Error: {error}</p>
        ) : lastRace ? (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="w-full text-left text-gray-700 border-collapse">
              <thead>
                <tr>
                  <th colSpan="2" className="p-3 md:p-4 text-base md:text-lg font-bold text-white bg-secondary rounded-t-lg">
                    Detalles de la Carrera
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Nombre", value: lastRace.race.name, icon: <Flag className="w-4 md:w-5 h-4 md:h-5 text-gray-600" /> },
                  { label: "Fecha", value: new Date(lastRace.race.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }), icon: <Calendar className="w-4 md:w-5 h-4 md:h-5 text-gray-600" /> },
                  { label: "Deporte", value: lastRace.race.sport, icon: <Activity className="w-4 md:w-5 h-4 md:h-5 text-gray-600" /> },
                  { label: "Ubicación", value: lastRace.race.location, icon: <MapPin className="w-4 md:w-5 h-4 md:h-5 text-gray-600" /> },
                  { label: "Distancia", value: `${lastRace.race.distance} km`, icon: <Ruler className="w-4 md:w-5 h-4 md:h-5 text-gray-600" /> },
                  { label: "Fecha de Inscripción", value: new Date(lastRace.registeredAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }), icon: <ClipboardEdit className="w-4 md:w-5 h-4 md:h-5 text-gray-600" /> },
                  { label: "Estado", value: lastRace.status, icon: <Bell className="w-4 md:w-5 h-4 md:h-5 text-gray-600" /> },
                ].map((row, index, arr) => (
                  <tr key={index} className={index === arr.length - 1 ? "" : "border-b border-gray-200"}>
                    {/* En móvil, hacemos que las filas sean más compactas */}
                    <td className="p-2 md:p-4 font-semibold bg-gray-100 flex items-center text-sm md:text-base">
                      <span className="mr-2 md:mr-3 flex items-center justify-center">{row.icon}</span> 
                      {row.label}
                    </td>
                    <td className="p-2 md:p-4 capitalize bg-white text-sm md:text-base">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center md:text-left">No se encontraron carreras finalizadas.</p>
        )}
      </div>
    </div>
  )
}

export default Home