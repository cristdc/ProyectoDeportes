import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { colors } from '../utils/colors';
import {
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaMountain,
  FaRoute,
  FaClock,
  FaFilter,
  FaSort,
  FaArrowRight
} from 'react-icons/fa';

export default function AvailableRaces() {
  const navigate = useNavigate();
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  // Obtener ubicaciones únicas de las carreras
  const uniqueLocations = [...new Set(races.map(race => race.location))].filter(Boolean).sort();

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await apiService.getAvailableRaces();
        setRaces(response.races || []);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar las carreras:', err);
        setError('Error al cargar las carreras disponibles');
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  // Asegurarnos de que races es un array antes de filtrar
  const filteredRaces = Array.isArray(races) ? races.filter(race => {
    if (!race) return false; // Validación adicional
    const matchesSearch = race.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || race.location?.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesDate = !dateFilter || (race.date && new Date(race.date).toLocaleDateString().includes(dateFilter));
    return matchesSearch && matchesLocation && matchesDate;
  }) : [];

  // Asegurarnos de que filteredRaces es un array antes de ordenar
  const sortedRaces = [...filteredRaces].sort((a, b) => {
    const order = sortOrder === 'asc' ? 1 : -1;
    switch (sortBy) {
      case 'date':
        return (new Date(a.date || '') - new Date(b.date || '')) * order;
      case 'name':
        return (a.name || '').localeCompare(b.name || '') * order;
      case 'distance':
        return ((a.distance || 0) - (b.distance || 0)) * order;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando carreras disponibles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF6F1] to-white">
      {/* Header con fondo gradiente */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#8D9B6A] via-[#D4A373] to-[#A8B892] py-12">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Carreras Disponibles</h1>
            <p className="text-xl text-white/90">
              Encuentra tu próxima carrera y prepárate para el desafío
            </p>
          </div>
        </div>
      </div>

      {/* Filtros mejorados */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8D9B6A] focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8D9B6A] focus:border-transparent appearance-none bg-white transition-all"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">Todas las ubicaciones</option>
              {uniqueLocations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8D9B6A] focus:border-transparent appearance-none bg-white transition-all"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Ordenar por fecha</option>
              <option value="name">Ordenar por nombre</option>
              <option value="distance">Ordenar por distancia</option>
            </select>
          </div>
        </div>

        {/* Grid de carreras */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRaces.map((race) => (
            <div
              key={race._id}
              onClick={() => navigate(`/races/${race._id}`)}
              className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden">
                {/* Cabecera con gradiente */}
                <div className="h-48 bg-gradient-to-r from-[#8D9B6A] via-[#CCD5AE] to-[#D4A373] relative">
                  <div className="absolute bottom-4 left-4 space-y-2">
                    <span className="inline-block px-4 py-2 rounded-full bg-white/90 text-[#5C6744] font-medium shadow-md">
                      <FaCalendarAlt className="inline-block mr-2" />
                      {new Date(race.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#5C6744] mb-4 group-hover:text-[#D4A373] transition-colors">
                    {race.name}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center p-3 rounded-lg bg-[#FAEDCD]/30 group-hover:bg-[#FAEDCD]/50 transition-colors">
                      <FaMapMarkerAlt className="text-[#D4A373] mr-3" />
                      <span className="text-gray-700">{race.location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center p-3 rounded-lg bg-[#CCD5AE]/30 group-hover:bg-[#CCD5AE]/50 transition-colors">
                        <FaRoute className="text-[#8D9B6A] mr-2" />
                        <span className="text-gray-700">{race.distance} km</span>
                      </div>

                      <div className="flex items-center p-3 rounded-lg bg-[#CCD5AE]/30 group-hover:bg-[#CCD5AE]/50 transition-colors">
                        <FaMountain className="text-[#8D9B6A] mr-2" />
                        <span className="text-gray-700">{race.unevenness} m</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center text-[#5C6744]">
                      <FaUsers className="mr-2" />
                      <span>{race.maxParticipants} participantes</span>
                    </div>
                    <span className="text-[#D4A373] font-medium group-hover:translate-x-2 transition-transform inline-flex items-center">
                      Ver detalles
                      <FaArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8D9B6A]"></div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center my-8">
            {error}
          </div>
        )}

        {/* Mensaje sin resultados */}
        {!loading && !error && sortedRaces.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl text-[#8D9B6A] mb-4">🏃‍♂️</div>
            <h3 className="text-xl font-bold text-[#5C6744] mb-2">No hay carreras disponibles</h3>
            <p className="text-gray-600">
              No se encontraron carreras que coincidan con tus criterios de búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}