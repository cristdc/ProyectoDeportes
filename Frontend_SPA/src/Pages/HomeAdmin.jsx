import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import RaceCard from '../Components/RaceCard';
 // Asumiendo que tienes un contexto de autenticación

const HomeAdmin = () => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sport: '',
    status: ''
  });
  const { user } = useAuth(); // Para obtener el usuario actual
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchRaces();
  }, []);

  const fetchRaces = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/races`);
      if (!response.ok) {
        throw new Error('Error al cargar las carreras');
      }
      const data = await response.json();
      setRaces(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredRaces = races.races ? races.races.filter(race => {
    const matchesSearch = race.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesSport = !filters.sport || race.sport === filters.sport;
    const matchesStatus = !filters.status || race.status === filters.status;
    return matchesSearch && matchesSport && matchesStatus;
  }) : [];

  const handleEdit = async (raceId) => {
    try {
      navigate(`/admin/races/edit/${raceId}`);
    } catch (error) {
      console.error('Error al editar la carrera:', error);
    }
  };

  const handleDelete = async (raceId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta carrera?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/races/${raceId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la carrera');
        }

        setRaces(races.filter(race => race._id !== raceId));
      } catch (error) {
        console.error('Error al eliminar la carrera:', error);
      }
    }
  };

  const handleDownloadCSV = async (raceId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/races/${raceId}/download-csv`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al descargar el CSV');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `carrera-${raceId}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el CSV:', error);
    }
  };

  const handleUploadResults = async (raceId) => {
    try {
      navigate(`/admin/races/${raceId}/upload-results`);
    } catch (error) {
      console.error('Error al preparar la subida de resultados:', error);
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
    return null; // o un componente de loading
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Header con título y botón */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Panel de Administración
        </h1>
        <button 
          onClick={() => navigate('/admin/races/new')}
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
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Buscar por nombre..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
        />
        <select 
          name="sport"
          value={filters.sport}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
        >
          <option value="">Todos los deportes</option>
          <option value="running">Running</option>
          <option value="cycling">Cycling</option>
          <option value="trailRunning">Trail Running</option>
        </select>
        <select 
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
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
        {filteredRaces.map(race => (
          <RaceCard 
            key={race._id}
            race={race}
            currentUserId={user._id}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDownloadCSV={handleDownloadCSV}
            onUploadResults={handleUploadResults}
          />
        ))}
      </div>

      {filteredRaces.length === 0 && (
        <div className="text-center text-gray-500 mt-8 p-4 bg-white rounded-lg shadow">
          No hay carreras disponibles
        </div>
      )}
    </div>
  );
};

export default HomeAdmin;