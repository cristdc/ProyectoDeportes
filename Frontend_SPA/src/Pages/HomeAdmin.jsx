import { useEffect } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRace } from '../Context/RaceContext';
import RaceCard from '../Components/RaceCard';

const HomeAdmin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    races, 
    loading, 
    error, 
    fetchRaces, 
    deleteRace, 
    downloadCSV, 
    uploadResults 
  } = useRace();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchRaces();
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Header con título y botón */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Panel de Administración
        </h1>
        <button 
         onClick={() => navigate('admin/races/new', { replace: true })}
          className="w-full sm:w-auto bg-[#9b9d79] hover:bg-[#6b6d54] text-white 
                    font-bold py-2 px-4 rounded-lg transition-all duration-1000 ease-in-out"
        >
          Crear Nueva Carrera
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
        />
        <select 
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
        >
          <option value="">Todos los deportes</option>
          <option value="running">Running</option>
          <option value="cycling">Cycling</option>
          <option value="trailRunning">Trail Running</option>
        </select>
        <select 
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
        >
          <option value="">Todos los estados</option>
          <option value="open">Abierta</option>
          <option value="finished">Finalizada</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </div>

      {/* Grid de carreras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {races.races && races.races.map(race => (
          <RaceCard 
            key={race._id}
            race={race}
            currentUserId={user._id}
            onDelete={deleteRace}
            onDownloadCSV={downloadCSV}
            onUploadResults={uploadResults}
          />
        ))}
      </div>

      {(!races.races || races.races.length === 0) && (
        <div className="text-center text-gray-500 mt-8 p-4 bg-white rounded-lg shadow">
          No hay carreras disponibles
        </div>
      )}
    </div>
  );
};

export default HomeAdmin;