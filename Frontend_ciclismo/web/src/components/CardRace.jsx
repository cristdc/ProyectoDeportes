import React from 'react';

const CardRace = ({ race }) => {
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
          <h3 className="text-xl font-bold text-[#1a1204] truncate">{race.name || 'Sin nombre'}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            race.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {race.status === 'active' ? 'Activa' : 'Inactiva'}
          </span>
        </div>

        {/* Información principal */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-[#1a1204]">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {race.date || 'Fecha no disponible'}
          </div>
          
          <div className="flex items-center text-sm text-[#1a1204]">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {race.location || 'Ubicación no disponible'}
          </div>
        </div>

        {/* Detalles de la carrera */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="bg-[#fdf7ed] p-2 rounded">
            <span className="block text-xs text-[#1a1204] opacity-75">Distancia</span>
            <span className="font-medium text-[#1a1204]">{race.distance || 0} km</span>
          </div>
          <div className="bg-[#fdf7ed] p-2 rounded">
            <span className="block text-xs text-[#1a1204] opacity-75">Desnivel</span>
            <span className="font-medium text-[#1a1204]">{race.unevenness || 0} m</span>
          </div>
          <div className="bg-[#fdf7ed] p-2 rounded">
            <span className="block text-xs text-[#1a1204] opacity-75">Participantes</span>
            <span className="font-medium text-[#1a1204]">{race.maxParticipants || 0}</span>
          </div>
          <div className="bg-[#fdf7ed] p-2 rounded">
            <span className="block text-xs text-[#1a1204] opacity-75">Tiempo clasificatorio</span>
            <span className="font-medium text-[#1a1204]">{race.qualifyingTime || 0} min</span>
          </div>
        </div>

        {/* Botón de acción */}
        <button className="w-full bg-[#9B9D79] text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8EAC93] focus:ring-offset-2">
          Ver detalles
        </button>
      </div>
    </div>
  );
};

export default CardRace;
