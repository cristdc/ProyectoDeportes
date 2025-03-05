import React, { useState, useEffect } from 'react';
import { useRace } from '../context/RaceContext';
import CardRace from '../components/CardRace';

const CarrerasDisponibles = () => {
  const { races, loading, error } = useRace();
  const [filteredRaces, setFilteredRaces] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    status: ''
  });

  // Efecto para filtrar las carreras
  useEffect(() => {
    if (!races) return;

    // Filtramos solo las carreras activas
    let filtered = races.filter(race => race.status === 'open');

    // Aplicar filtro de búsqueda por nombre
    if (filters.search) {
      filtered = filtered.filter(race =>
        race.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Aplicar filtro de ubicación
    if (filters.location) {
      filtered = filtered.filter(race =>
        race.location.toLowerCase() === filters.location.toLowerCase()
      );
    }

    setFilteredRaces(filtered);
  }, [races, filters]);

  // Manejador de cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
        <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf7ed] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a1204] mb-4">
            Carreras Disponibles
          </h1>
          <p className="text-lg text-[#1a1204] opacity-80">
            Explora todas las carreras activas
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Buscar por nombre..."
              className="p-2 border border-[#B4C7B2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8EAC93]"
            />
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="p-2 border border-[#B4C7B2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8EAC93]"
            >
              <option value="">Todas las ubicaciones</option>
              <option value="Sierra del Norte">Sierra del Norte</option>
              <option value="Parque Central">Parque Central</option>
              <option value="Valle del Río">Valle del Río</option>
            </select>
          </div>
        </div>

        {/* Grid de carreras */}
        {filteredRaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRaces.map((race) => (
              <CardRace key={race._id} race={race} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[#1a1204] opacity-75">
              No se encontraron carreras que coincidan con los filtros
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarrerasDisponibles;