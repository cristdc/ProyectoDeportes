import React from "react";

const RacesUserList = ({ registrations }) => {  
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
            <th className="border border-gray-300 px-4 py-2">Estado</th>
            <th className="border border-gray-300 px-4 py-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {registrations
            .filter(registration => registration.race.sport.toLowerCase() === "trailrunning")
            .map((registration) => (
              <tr key={registration.race._id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{registration.race.name}</td>
                <td className="border border-gray-300 px-4 py-2">{registration.race.sport}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(registration.race.date).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">{registration.race.location}</td>
                <td className="border border-gray-300 px-4 py-2">{registration.race.distance}</td>
                <td className="border border-gray-300 px-4 py-2 capitalize">{registration.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {registration.status.toLowerCase() === "registered" ? ( // según el estado del registro aparece el botón bloqueado o no 
                    <button 
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => alert("Has pulsado para desapuntarte")}
                    >
                      Desapuntarse
                    </button>
                  ) : (
                    <button 
                      className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed opacity-50"
                      disabled
                    >
                      Desapuntarse
                    </button>
                  )}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default RacesUserList;