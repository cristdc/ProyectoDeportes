import React from 'react';
import { useRace } from '../context/RaceContext';
import CardRace from '../components/CardRace';

const CarrerasDisponibles = () => {
  const { races, loading, error, pagination } = useRace();

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
            Explora todas las carreras disponibles
          </p>
          {pagination && (
            <p className="text-sm text-[#1a1204] opacity-60 mt-2">
              Página {pagination.currentPage} de {pagination.totalPages} 
              ({pagination.totalRaces} carreras en total)
            </p>
          )}
        </div>

        {/* Filtros */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="p-2 border border-[#B4C7B2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8EAC93]"
            />
            <select className="p-2 border border-[#B4C7B2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8EAC93]">
              <option value="">Todas las ubicaciones</option>
              <option value="sierra">Sierra</option>
              <option value="costa">Costa</option>
              <option value="valle">Valle</option>
            </select>
            <select className="p-2 border border-[#B4C7B2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8EAC93]">
              <option value="">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="completed">Completadas</option>
            </select>
          </div>
        </div>

        {/* Grid de carreras */}
        {races.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {races.map((race) => (
              <CardRace key={race._id} race={race} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[#1a1204] opacity-75">No hay carreras disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarrerasDisponibles;