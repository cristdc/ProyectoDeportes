import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRace } from '../context/RaceContext';

const CarrerasDetail = () => {
  const { carreraId } = useParams();  // Cambiado de id a carreraId para coincidir con el router
  const { race, loading, error, fetchRaceDetails } = useRace();

  useEffect(() => {
    console.log('ID de carrera:', carreraId);
    fetchRaceDetails(carreraId);
  }, [carreraId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf7ed] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B9D79]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fdf7ed] flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <Link 
            to="/carreras-disponibles" 
            className="mt-4 inline-block bg-[#9B9D79] text-white px-4 py-2 rounded-md hover:bg-opacity-90"
          >
            Volver a carreras
          </Link>
        </div>
      </div>
    );
  }

  if (!race) {
    return (
      <div className="min-h-screen bg-[#fdf7ed] flex items-center justify-center">
        <div className="bg-yellow-100 text-yellow-700 p-6 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">Carrera no encontrada</h2>
          <p>No se pudo encontrar la información de esta carrera.</p>
          <Link 
            to="/carreras-disponibles" 
            className="mt-4 inline-block bg-[#9B9D79] text-white px-4 py-2 rounded-md hover:bg-opacity-90"
          >
            Volver a carreras
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf7ed] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Botón de regreso */}
        <Link 
          to="/" 
          className="inline-flex items-center text-[#9B9D79] hover:text-[#8a8c6a] mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWcarreraIdth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Inicio
        </Link>

        {/* Contenedor principal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hcarreraIdden">
          {/* Encabezado */}
          <div className="bg-[#9B9D79] bg-opacity-10 p-6 md:p-8 border-b border-[#9B9D79] border-opacity-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1a1204] mb-2">
                  {race.name}
                </h1>
                <p className="text-[#1a1204] opacity-75">
                  {race.tour}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                race.status === 'open' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {race.status === 'open' ? 'Abierta' : 'Cerrada'}
              </span>
            </div>
          </div>

          {/* ContencarreraIdo principal */}
          <div className="p-6 md:p-8">
            {/* Información general */}
            <div className="grcarreraId grcarreraId-cols-1 md:grcarreraId-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#1a1204] mb-4">
                  Información General
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#9B9D79] bg-opacity-10 rounded-full">
                      <svg className="w-5 h-5 text-[#9B9D79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWcarreraIdth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-[#1a1204] opacity-75">Fecha</p>
                      <p className="text-[#1a1204] font-medium">{race.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#9B9D79] bg-opacity-10 rounded-full">
                      <svg className="w-5 h-5 text-[#9B9D79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWcarreraIdth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWcarreraIdth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-[#1a1204] opacity-75">Ubicación</p>
                      <p className="text-[#1a1204] font-medium">{race.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#9B9D79] bg-opacity-10 rounded-full">
                      <svg className="w-5 h-5 text-[#9B9D79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWcarreraIdth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-[#1a1204] opacity-75">Deporte</p>
                      <p className="text-[#1a1204] font-medium">{race.sport}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grcarreraId grcarreraId-cols-2 gap-4">
                <div className="bg-[#fdf7ed] p-4 rounded-lg">
                  <span className="block text-sm text-[#1a1204] opacity-75 mb-1">Distancia</span>
                  <span className="text-2xl font-bold text-[#1a1204]">{race.distance} km</span>
                </div>
                
                <div className="bg-[#fdf7ed] p-4 rounded-lg">
                  <span className="block text-sm text-[#1a1204] opacity-75 mb-1">Desnivel</span>
                  <span className="text-2xl font-bold text-[#1a1204]">{race.unevenness} m</span>
                </div>
                
                <div className="bg-[#fdf7ed] p-4 rounded-lg">
                  <span className="block text-sm text-[#1a1204] opacity-75 mb-1">Participantes máx.</span>
                  <span className="text-2xl font-bold text-[#1a1204]">{race.maxParticipants}</span>
                </div>
                
                <div className="bg-[#fdf7ed] p-4 rounded-lg">
                  <span className="block text-sm text-[#1a1204] opacity-75 mb-1">Tiempo clasificatorio</span>
                  <span className="text-2xl font-bold text-[#1a1204]">{race.qualifyingTime}</span>
                </div>
              </div>
            </div>

            {/* Clasificación */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-[#1a1204] mb-4">
                Clasificación
              </h2>
              
              {race.classification && race.classification.length > 0 ? (
                <div className="bg-white rounded-lg border border-[#B4C7B2] overflow-hcarreraIdden">
                  <table className="min-w-full divcarreraIde-y divcarreraIde-[#B4C7B2]">
                    <thead className="bg-[#9B9D79] bg-opacity-10">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1204] uppercase tracking-wcarreraIder">
                          Posición
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1204] uppercase tracking-wcarreraIder">
                          Corredor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1204] uppercase tracking-wcarreraIder">
                          Marca
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divcarreraIde-y divcarreraIde-[#B4C7B2]">
                      {race.classification.map((result, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1204]">
                            {index + 1} 
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1204]">
                            {result.runner}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1204]">
                            {result.mark}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-[#fdf7ed] p-6 rounded-lg text-center">
                  <p className="text-[#1a1204] opacity-75">
                    Aún no hay resultados disponibles para esta carrera
                  </p>
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="mt-8 pt-8 border-t border-[#B4C7B2]">
              <div className="flex items-center justify-between text-sm text-[#1a1204] opacity-75">
                <span>Creada el {new Date(race.createdAt).toLocaleDateString()}</span>
                <span>ID: {carreraId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrerasDetail;