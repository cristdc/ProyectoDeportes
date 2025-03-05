import React from 'react';
import { useRace } from '../context/RaceContext';
import CardRace from '../components/CardRace';

const CarrerasDisponibles = () => {
  const { races, loading, error } = useRace();

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {races.map((race) => (
            <CardRace key={race._id} race={race} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarrerasDisponibles;