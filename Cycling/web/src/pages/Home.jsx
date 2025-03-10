import { useEffect, useState } from "react";
import { useRace } from "../context/RaceContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { races, loading, error } = useRace();
  const [lastRace, setLastRace] = useState(null);

  useEffect(() => {
    if (races && races.length > 0) {
      // Ordenamos las carreras por fecha de manera descendente
      const sortedRaces = [...races].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });

      // Tomamos la primera carrera (la más reciente)
      setLastRace(sortedRaces[0]);
    }
  }, [races]);

  const formatDate = (dateString) => {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      open: "bg-green-100 text-green-800",
      close: "bg-red-100 text-red-800",
    };

    const statusText = {
      open: "Abierta",
      close: "Cerrada",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusText[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf7ed] flex items-center justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-2xl mx-auto p-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="space-y-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fdf7ed] flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
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
            Bienvenido a Ciclismo App
          </h1>
          <p className="text-lg text-[#1a1204] opacity-80">
            Descubre y participa en las mejores carreras de ciclismo
          </p>
        </div>

        {/* Última carrera */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1a1204] mb-4 text-center">
            Última Carrera Realizada
          </h2>
          {lastRace ? (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-[#1a1204]">
                    {lastRace.name}
                  </h3>
                  {getStatusBadge(lastRace.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-600">Fecha</p>
                      <p className="font-semibold">
                        {formatDate(lastRace.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Ubicación</p>
                      <p className="font-semibold">{lastRace.location}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-600">Distancia</p>
                      <p className="font-semibold">{lastRace.distance} km</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Desnivel</p>
                      <p className="font-semibold">{lastRace.unevenness} m</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Link
                    to={ `/cycling/carrerasDetail/${lastRace._id}`
                    }
                    className="px-4 py-2 bg-[#9B9D79] text-white rounded-md hover:bg-[#8EAC93] transition-colors"
                  >
                    Ver detalles
                  </Link>
                  <Link
                    to={"/cycling/carreras-historial"
                    }
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Ver todas las carreras
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No hay carreras disponibles</p>
            </div>
          )}
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Total de Carreras</h3>
            <p className="text-3xl font-bold text-[#9B9D79]">
              {races?.length || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Carreras Abiertas</h3>
            <p className="text-3xl font-bold text-[#9B9D79]">
              {races?.filter((race) => race.status === "open").length || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Carreras Cerradas</h3>
            <p className="text-3xl font-bold text-[#9B9D79]">
              {races?.filter((race) => race.status === "close").length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
