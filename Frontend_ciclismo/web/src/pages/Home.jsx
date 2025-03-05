import React from 'react';
import { useRace } from '../context/RaceContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { races, loading, error } = useRace();

  // Función segura para contar carreras
  const getActiveRacesCount = () => {
    if (!Array.isArray(races)) return 0;
    return races.filter(race => race?.status === 'active').length;
  };

  const getCompletedRacesCount = () => {
    if (!Array.isArray(races)) return 0;
    return races.filter(race => race?.status === 'completed').length;
  };

  const getTotalRacesCount = () => {
    if (!Array.isArray(races)) return 0;
    return races.length;
  };

  // Datos de ejemplo para cuando no hay información
  const placeholderRace = {
    name: "Gran Fondo de Montaña",
    status: "active",
    date: "2024-12-31",
    location: "Sierra Nevada",
    distance: 120,
    unevenness: 2500,
    maxParticipants: 200,
    qualifyingTime: 240
  };

  // Usar datos reales o datos de ejemplo
  const displayRace = (races && races.length > 0) ? races[0] : placeholderRace;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#fdf7ed]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B9D79]"></div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen bg-[#fdf7ed]">
  //       <div className="bg-red-100 text-red-700 p-4 rounded-md">
  //         {error}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-[#fdf7ed] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Sección Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1204] mb-4">
            CicloApp
          </h1>
          <p className="text-xl text-[#1a1204] opacity-80 max-w-2xl mx-auto">
            Tu plataforma para descubrir y participar en las mejores carreras de ciclismo
          </p>
        </div>

        {/* Tarjeta Principal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto mb-12">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Imagen de la carrera */}
              <div className="w-full md:w-1/2">
                <div className="bg-[#9B9D79] rounded-lg h-64 flex items-center justify-center">
                  <svg className="w-24 h-24 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>

              {/* Información de la carrera */}
              <div className="w-full md:w-1/2">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-[#1a1204]">
                    {loading ? 'Cargando...' : 'Sin carreras disponibles'}
                  </h2>
                  <span className="px-3 py-1 bg-[#9B9D79] text-white rounded-full text-sm">
                    {loading ? 'Cargando' : 'No disponible'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#9B9D79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[#1a1204] opacity-70">Ubicación no disponible</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#9B9D79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[#1a1204] opacity-70">Fecha no disponible</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-[#fdf7ed] p-3 rounded-lg">
                      <div className="text-sm text-[#1a1204] opacity-70">Distancia</div>
                      <div className="text-lg font-semibold text-[#1a1204]">-- km</div>
                    </div>
                    <div className="bg-[#fdf7ed] p-3 rounded-lg">
                      <div className="text-sm text-[#1a1204] opacity-70">Desnivel</div>
                      <div className="text-lg font-semibold text-[#1a1204]">-- m</div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button 
                      className="flex-1 py-2 px-4 bg-[#9B9D79] text-white rounded-lg hover:bg-[#8a8c6a] transition-colors opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Ver Detalles
                    </button>
                    <Link to="/carreras-historial" className="flex-1">
                      <button className="w-full py-2 px-4 border-2 border-[#9B9D79] text-[#9B9D79] rounded-lg hover:bg-[#9B9D79] hover:text-white transition-colors">
                        Ver Todas
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center gap-4">
              <div className="p-3 bg-[#9B9D79] bg-opacity-20 rounded-full">
                <svg className="w-8 h-8 text-[#9B9D79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#9B9D79]">
                  {getTotalRacesCount()}
                </div>
                <div className="text-[#1a1204]">Carreras Totales</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center gap-4">
              <div className="p-3 bg-[#9B9D79] bg-opacity-20 rounded-full">
                <svg className="w-8 h-8 text-[#9B9D79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#9B9D79]">
                  {getActiveRacesCount()}
                </div>
                <div className="text-[#1a1204]">Carreras Activas</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center gap-4">
              <div className="p-3 bg-[#9B9D79] bg-opacity-20 rounded-full">
                <svg className="w-8 h-8 text-[#9B9D79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#9B9D79]">
                  {getCompletedRacesCount()}
                </div>
                <div className="text-[#1a1204]">Carreras Completadas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;