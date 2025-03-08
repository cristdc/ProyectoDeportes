import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRace } from '../Context/RaceContext';
import { useAuth } from '../hooks/useAuth';

const RaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRaceById, getRaceResults, loading, error } = useRace();
  const { user } = useAuth();
  const [race, setRace] = useState(null);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // 'details' o 'results'

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
      }
    };

    fetchRaceDetails();
  }, [id, user]);

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

  if (!race) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">{race.name}</h1>
          <div className="flex gap-2">
            <Link 
              to={`/admin/races/edit/${id}`}
              className="px-4 py-2 bg-[#9b9d79] text-white rounded-lg 
                        hover:bg-[#6b6d54] transition-all duration-1000 text-center"
            >
              Editar Carrera
            </Link>
            <Link 
              to="/admin/home"
              className="px-4 py-2 border border-[#9b9d79] text-[#9b9d79] rounded-lg 
                        hover:bg-[#9b9d79] hover:text-white transition-all duration-1000 text-center"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-6 border-b">
        <div className="flex gap-4">
          <button
            className={`py-2 px-4 -mb-px ${
              activeTab === 'details'
                ? 'border-b-2 border-[#9b9d79] text-[#9b9d79] font-semibold'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Detalles
          </button>
          {race.status === 'finished' && (
            <button
              className={`py-2 px-4 -mb-px ${
                activeTab === 'results'
                  ? 'border-b-2 border-[#9b9d79] text-[#9b9d79] font-semibold'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('results')}
            >
              Resultados
            </button>
          )}
        </div>
      </div>

      {activeTab === 'details' ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información básica */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Información Básica</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Deporte</p>
                    <p className="text-gray-800">{race.sport}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(race.status)}`}>
                      {getStatusText(race.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="text-gray-800">{new Date(race.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ubicación</p>
                    <p className="text-gray-800">{race.location}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Detalles Técnicos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Distancia</p>
                    <p className="text-gray-800">{race.distance} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Desnivel</p>
                    <p className="text-gray-800">{race.unevenness} m</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Participantes Máximos</p>
                    <p className="text-gray-800">{race.maxParticipants}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Plazas Disponibles</p>
                    <p className="text-gray-800">{race.availableSlots}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Archivos y Recorrido</h3>
                <div className="space-y-4">
                  {race.gpx.available ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-700">{race.gpx.fileName}</p>
                        <p className="text-sm text-gray-500">
                          Subido el {new Date(race.gpx.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button className="text-[#9b9d79] hover:text-[#6b6d54] transition-colors">
                        Descargar GPX
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500">No hay archivo GPX disponible</p>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Recorrido</p>
                    <p className="text-gray-800">{race.tour}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Información Adicional</h3>
                <div>
                  <p className="text-sm text-gray-500">Tiempo de clasificación</p>
                  <p className="text-gray-800">{race.qualifyingTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tabla de resultados */
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {results && results.results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posición
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tiempo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.results.map((result) => (
                    <tr key={result.registrationId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{result.user.name}</div>
                        <div className="text-sm text-gray-500">{result.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No hay resultados disponibles
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RaceDetail;