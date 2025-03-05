import React from 'react'
import { useRace } from '../context/RaceContext'
import CardRace from '../components/CardRace'

const CarrerasHistorial = () => {
  const { races, loading, error } = useRace()

  return (
    <div className="min-h-screen bg-[#fdf7ed] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a1204] mb-4">
            Historial de Carreras
          </h1>
          <p className="text-lg text-[#1a1204] opacity-80">
            Revisa todas las carreras completadas
          </p>
        </div>

        {/* Filtros y Estadísticas */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-[#1a1204] mb-4">Filtros</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="w-full p-2 border border-[#B4C7B2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8EAC93]"
              />
              <select className="w-full p-2 border border-[#B4C7B2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8EAC93]">
                <option value="">Ordenar por fecha</option>
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguas</option>
              </select>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-[#1a1204] mb-4">Estadísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#9B9D79]">
                  {races.length}
                </div>
                <div className="text-sm text-[#1a1204]">Total Carreras</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#9B9D79]">
                  {races.reduce((acc, race) => acc + race.distance, 0)}
                </div>
                <div className="text-sm text-[#1a1204]">Km Totales</div>
              </div>
            </div>
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
  )
}

export default CarrerasHistorial