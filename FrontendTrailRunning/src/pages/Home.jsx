import React, { useEffect, useState } from 'react'
import useAuth from "../hooks/useAuth"
import { fetchLastRace } from "../helpers/fetch";

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
        <h3 className="ml-5 text-2xl font-semibold mb-4">Última carrera de {user.name}</h3>
        
        {loading ? (
          <p>Cargando última carrera...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : lastRace ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th colSpan="2" className="border p-2 text-left">Detalles de la Carrera</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Nombre</td>
                  <td className="border p-2">{lastRace.race.name}</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Fecha</td>
                  <td className="border p-2">
                    {new Date(lastRace.race.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Deporte</td>
                  <td className="border p-2 capitalize">{lastRace.race.sport}</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Ubicación</td>
                  <td className="border p-2">{lastRace.race.location}</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Distancia</td>
                  <td className="border p-2">{lastRace.race.distance} km</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Fecha de Inscripción</td>
                  <td className="border p-2">
                    {new Date(lastRace.registeredAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Estado</td>
                  <td className="border p-2 capitalize">{lastRace.status}</td>
                </tr>
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