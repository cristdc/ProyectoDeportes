import React, { useEffect, useState } from 'react'
import useAuth from "../hooks/useAuth"
import { fetchLastRace } from "../helpers/fetch";
import BeatLoader from "react-spinners/BeatLoader";

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
    <div className="flex">
      <div className="bg-[url('img/mountain.jpg')] bg-cover bg-center h-screen w-1/2 text-center">
        <h3 className="font-semibold text-primary text-2xl">"El dolor es temporal, pero la satisfacción es para siempre."</h3>
      </div>

      <div className="w-1/2 p-6">
        <h3 className="ml-5 text-2xl font-semibold mb-4">Última carrera de {user?.name}</h3>
        
        {loading ? (
          <div className="w-full flex justify-center ">
            <BeatLoader color="#9B9D79" />
          </div>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : lastRace ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-700">
              <thead className="bg-gray-200">
                <tr>
                  <th colSpan="2" className="p-3 text-lg font-semibold bg-secondary">Detalles de la Carrera</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Nombre", value: lastRace.race.name },
                  { label: "Fecha", value: new Date(lastRace.race.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) },
                  { label: "Deporte", value: lastRace.race.sport },
                  { label: "Ubicación", value: lastRace.race.location },
                  { label: "Distancia", value: `${lastRace.race.distance} km` },
                  { label: "Fecha de Inscripción", value: new Date(lastRace.registeredAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) },
                  { label: "Estado", value: lastRace.status },
                ].map((row, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="p-3 font-semibold bg-gray-100">{row.label}</td>
                    <td className="p-3 capitalize">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No se encontraron carreras finalizadas.</p>
        )}
      </div>
    </div>
  )
}

export default Home