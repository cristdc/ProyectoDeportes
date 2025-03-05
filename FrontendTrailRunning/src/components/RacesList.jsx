import React from "react";
import { registration } from "../helpers/fetch";

const RacesList = ({ races }) => {

  const handleClick = async (raceId) =>{
    const data = await registration(raceId);
    console.log(data);
  }

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border-collapse border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Deporte</th>
            <th className="border border-gray-300 px-4 py-2">Fecha</th>
            <th className="border border-gray-300 px-4 py-2">Ubicación</th>
            <th className="border border-gray-300 px-4 py-2">Distancia (km)</th>
            <th className="border border-gray-300 px-4 py-2">Máx. Participantes</th>
            <th className="border border-gray-300 px-4 py-2">Desnivel (m)</th>
            <th className="border border-gray-300 px-4 py-2">Tiempo Clasificación</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
            <th className="border border-gray-300 px-4 py-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {races.map((race)=>(
            <tr key={race._id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{race.name}</td>
              <td className="border border-gray-300 px-4 py-2">{race.sport}</td>
              <td className="border border-gray-300 px-4 py-2">{new Date(race.date).toLocaleDateString()}</td>
              <td className="border border-gray-300 px-4 py-2">{race.location}</td>
              <td className="border border-gray-300 px-4 py-2">{race.distance}</td>
              <td className="border border-gray-300 px-4 py-2">{race.maxParticipants}</td>
              <td className="border border-gray-300 px-4 py-2">{race.unevenness}</td>
              <td className="border border-gray-300 px-4 py-2">{race.qualifyingTime}</td>
              <td className="border border-gray-300 px-4 py-2 capitalize">{race.status}</td>
              <td className="border border-gray-300 px-4 py-2">
              <button onClick={() => handleClick(race._id)} disabled={race.status !== "open"} className="bg-blue-500 text-white px-4 py-2 rounded">
                Participar
              </button>
              </td>
            </tr>
          ))}

          
        </tbody>
      </table>
    </div>
  );
};

export default RacesList;
