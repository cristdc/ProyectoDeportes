import React from 'react';
import { Link } from 'react-router-dom';

const RaceCard = ({ 
  race, 
  currentUserId, // ID del usuario actual
  onDelete, 
  onDownloadCSV, 
  onUploadResults 
}) => {
  // Verifica si el usuario actual es el creador de la carrera
  const isCreator = race.createdBy === currentUserId;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'finished':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'deleted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return 'Abierta';
      case 'finished':
        return 'Finalizada';
      case 'cancelled':
        return 'Cancelada';
      case 'deleted':
        return 'Eliminada';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Barra de acciones superior */}
      <div className="flex justify-end gap-2 p-2 bg-gray-50 rounded-t-lg border-b">
        {/* Editar */}
        <Link 
          to={`/admin/races/edit/${race._id}`}
          className="p-1.5 hover:bg-[#9b9d79] hover:text-white rounded-full transition-all duration-300"
          title="Editar carrera"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>

        {/* Descargar CSV */}
        <button 
          onClick={() => onDownloadCSV(race._id)}
          className="p-1.5 hover:bg-[#9b9d79] hover:text-white rounded-full transition-all duration-300"
          title="Descargar CSV"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>

        {/* Subir Resultados */}
        <button 
          onClick={() => onUploadResults(race._id)}
          className="p-1.5 hover:bg-[#9b9d79] hover:text-white rounded-full transition-all duration-300"
          title="Subir resultados"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </button>

        {/* Eliminar */}
        <button 
          onClick={() => onDelete(race._id)}
          className="p-1.5 hover:bg-red-500 hover:text-white rounded-full transition-all duration-300"
          title="Eliminar carrera"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Contenido de la carrera */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {race.name}
        </h3>
        
        <div className="space-y-3">
          {/* Fecha */}
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(race.date).toLocaleDateString()}</span>
          </div>

          {/* Ubicación */}
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{race.location}</span>
          </div>

          {/* Estado */}
          <div className="mt-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(race.status)}`}>
              {getStatusText(race.status)}
            </span>
          </div>
        </div>

        {/* Botón Ver Detalles */}
        <div className="mt-6 text-center">
          <Link
            to={`/admin/races/${race._id}`}
            className="inline-block w-full px-4 py-2 bg-[#9b9d79] text-white rounded-lg
                     hover:bg-[#6b6d54] transition-all duration-1000 ease-in-out"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RaceCard;