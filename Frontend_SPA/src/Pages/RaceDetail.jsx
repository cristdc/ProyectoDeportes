import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRace } from '../Context/RaceContext';
import { useAuth } from '../hooks/useAuth';
import GpxMap from '../Components/GpxMap';
import { toast } from 'sonner';

const RaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRaceById, getRaceResults, loading, error } = useRace();
  const { user } = useAuth();
  const [race, setRace] = useState(null);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin');
      return;
    }

    const fetchRaceDetails = async () => {
      try {
        const raceData = await getRaceById(id);
        setRace(raceData);
        
        if (raceData.status === 'finished') {
          const resultsData = await getRaceResults(id);
          setResults(resultsData);
        }
      } catch (err) {
        console.error('Error al cargar los detalles:', err);
        toast.error('Error al cargar los detalles de la carrera');
      }
    };

    fetchRaceDetails();
  }, [id, user]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'finished':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9b9d79]"></div>
      </div>
    );
  }

  if (error) {
  return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!race) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-4">
            {/* Título y estado */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{race.name}</h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(race.status)}`}>
                    {getStatusText(race.status)}
                  </span>
                  <span className="hidden sm:inline text-gray-500">•</span>
                  <span className="text-gray-600">{race.sport}</span>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex flex-wrap w-full sm:w-auto gap-2 sm:gap-3">
                <Link 
                  to={`/admin/registations/${id}`}
                  className="flex-1 sm:flex-none px-4 py-2 bg-[#9b9d79] text-white rounded-lg hover:bg-[#6b6d54] transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <span className="sm:inline">Ver inscripciones</span>
                </Link>
                <Link 
                  to={`/admin/races/edit/${id}`}
                  className="flex-1 sm:flex-none px-4 py-2 border border-[#9b9d79] text-[#9b9d79] rounded-lg hover:bg-[#9b9d79] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span className="sm:inline">Editar</span>
                </Link>
                <Link 
                  to="/admin/home"
                  className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="sm:inline">Volver</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b overflow-x-auto">
            <div className="flex whitespace-nowrap">
              <button
                className={`py-3 sm:py-4 px-4 sm:px-6 focus:outline-none ${
                  activeTab === 'details'
                    ? 'border-b-2 border-[#9b9d79] text-[#9b9d79] font-semibold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('details')}
              >
                Detalles
              </button>
              {race.status === 'finished' && (
                <button
                  className={`py-3 sm:py-4 px-4 sm:px-6 focus:outline-none ${
                    activeTab === 'results'
                      ? 'border-b-2 border-[#9b9d79] text-[#9b9d79] font-semibold'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('results')}
                >
                  Resultados
                </button>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'details' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                {/* Información básica */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Básica</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Fecha</p>
                        <p className="text-gray-800 font-medium">
                          {new Date(race.date).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Ubicación</p>
                        <p className="text-gray-800 font-medium">{race.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Distancia</p>
                        <p className="text-gray-800 font-medium">{race.distance} km</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Desnivel</p>
                        <p className="text-gray-800 font-medium">{race.unevenness} m</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Participantes Máximos</p>
                        <p className="text-gray-800 font-medium">{race.maxParticipants}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Plazas Disponibles</p>
                        <p className="text-gray-800 font-medium">{race.availableSlots}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Descripción del Recorrido</h3>
                    <p className="text-gray-700 whitespace-pre-line">{race.tour}</p>
                  </div>
                </div>

                {/* Mapa y GPX */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Archivo GPX</h3>
                    {race.gpx.available ? (
                      <>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-4 gap-3">
                          <div>
                            <p className="font-medium text-gray-700 break-all">{race.gpx.fileName}</p>
                            <p className="text-sm text-gray-500">
                              Subido el {new Date(race.gpx.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button className="w-full sm:w-auto text-[#9b9d79] hover:text-[#6b6d54] transition-colors flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Descargar GPX
                          </button>
                        </div>
                        <div className="h-[300px] sm:h-[400px] w-full">
                          <GpxMap gpxUrl={`${import.meta.env.VITE_BACKEND_URL}/races/${race._id}/gpx`} />
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p className="text-gray-500">No hay archivo GPX disponible</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Tabla de resultados */
              <div className="overflow-x-auto">
                {results ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Posición
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Participante
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tiempo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.results.map((result) => (
                        <tr key={result.registrationId} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-sm font-medium bg-gray-100 rounded-full">
                              {result.position || '-'}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {result.user?.name || 'Usuario no disponible'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {result.user?.email || 'Email no disponible'}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                            {result.time || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-gray-500">No hay resultados disponibles</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceDetail;