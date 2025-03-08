import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRace } from '../Context/RaceContext';
import RaceCard from '../Components/RaceCard';


const HomeAdmin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { races, loading, error, fetchRaces, deleteRace, downloadCSV, uploadResults, getRaces } = useRace();
  const [errorState, setErrorState] = useState(null);

  const [nameFilter, setNameFilter] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin');
      return;
    }
    fetchRaces();
  }, [user, navigate]);

  const getFilteredRaces = () => {
    if (!races?.races) return [];

    return races.races.filter(race => {
      const nameMatch = race.name.toLowerCase().includes(nameFilter.toLowerCase());
      const sportMatch = !sportFilter || race.sport === sportFilter;
      const statusMatch = !statusFilter || race.status === statusFilter;

      return nameMatch && sportMatch && statusMatch;
    });
  };

  const clearFilters = () => {
    setNameFilter('');
    setSportFilter('');
    setStatusFilter('');
  };

  const handleUploadGpx = async (raceId, file) => {
    // Esta función se pasaría como prop a RaceCard
    // Puedes implementar lógica adicional aquí si es necesario
  };

  const handleRaceUpdate = async () => {
    try {
      await fetchRaces();
    } catch (error) {
      console.error('Error al actualizar las carreras:', error);
      toast.error('Error al actualizar la lista de carreras');
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

  if (!user || user.role !== 'admin') {
    return null;
  }

  const filteredRaces = getFilteredRaces();

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Panel de Administración
        </h1>
        <Link 
          to="/admin/races/new"
          className="w-full sm:w-auto bg-[#9b9d79] hover:bg-[#6b6d54] text-white 
                    font-bold py-2 px-4 rounded-lg transition-all duration-1000 ease-in-out text-center"
        >
          Crear Nueva Carrera
        </Link>
      </div>

      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
          />
          <select 
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
          >
            <option value="">Todos los deportes</option>
            <option value="running">Running</option>
            <option value="cycling">Cycling</option>
            <option value="trailRunning">Trail Running</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
          >
            <option value="">Todos los estados</option>
            <option value="open">Abierta</option>
            <option value="finished">Finalizada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>
        
        {(nameFilter || sportFilter || statusFilter) && (
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="text-[#9b9d79] hover:text-[#6b6d54] transition-colors duration-300"
            >
              Limpiar filtros
            </button>
          </div>
        )}
        
        <div className="text-gray-600">
          {filteredRaces.length} {filteredRaces.length === 1 ? 'carrera encontrada' : 'carreras encontradas'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredRaces.map(race => (
          <RaceCard 
            key={race._id}
            race={race}
            currentUserId={user._id}
            onDelete={async (raceId) => {
              try {
                await deleteRace(raceId);
              } catch (error) {
                setErrorState('Error al eliminar la carrera. Por favor, inténtalo de nuevo.');
                setTimeout(() => setErrorState(null), 5000);
              }
            }}
            onDownloadCSV={downloadCSV}
            onUploadResults={uploadResults}
            onRaceUpdate={handleRaceUpdate}
          />
        ))}
      </div>

      {filteredRaces.length === 0 && (
        <div className="text-center text-gray-500 mt-8 p-4 bg-white rounded-lg shadow">
          {nameFilter || sportFilter || statusFilter 
            ? 'No se encontraron carreras con los filtros aplicados'
            : 'No hay carreras disponibles'}
        </div>
      )}

      {errorState && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errorState}
        </div>
      )}
    </div>
  );
};

export default HomeAdmin;