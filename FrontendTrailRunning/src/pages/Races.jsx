import { useEffect, useState } from "react"
import { fetchAllRaces, fetchUserRegistrations } from "../helpers/fetch";
import RaceCard from "../components/RaceCard";

const Races = () => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formFilter, setFormFilter] = useState({});

  const fetchData = async () => {
    const regdata = await fetchUserRegistrations();
  
    const racedata = await fetchAllRaces();
    
    const filteredRaces = racedata.filter(race => 
      !regdata.some(reg => reg.race._id === race._id)
    );
    
    setRaces(filteredRaces);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFilter((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleCleanFilters = (e) => {
    e.preventDefault();
    setFormFilter({});
  };

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, [])

  if(loading){
    return <div>Cargando...</div>
  }
  

  return (

    <>
      <h2 className="text-center text-3xl font-bold mt-5 mb-5">Carreras disponibles</h2>

      <div className="text-center flex flex-col gap-5 sm:flex-row bg-white p-6 rounded-xl shadow-md mb-4 mx-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mx-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por nombre
            </label>
            <input
              type="text"
              name="name"
              value={formFilter.name || ""}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por lugar
            </label>
            <input
              type="text"
              name="location"
              value={formFilter.location || ""}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              name="date"
              value={formFilter.date || ""}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por fecha
            </label>
            <select
              name="order"
              value={formFilter.order || "newest"}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="newest">Más reciente primero</option>
              <option value="oldest">Más antiguo primero</option>
            </select>
          </div>

          <div className="mt-6 flex justify-start">
            <button
              onClick={handleCleanFilters}
              className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpiar
            </button>
          </div>

        </div>

      </div>


      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-2">
        { races.length !=0 ? races
        .filter((race) => {
          // Filtrar por nombre
          return !formFilter.name || race.name.toLowerCase().includes(formFilter.name.toLowerCase());
        })
        .filter((race) => {
          // Filtrar por lugar
          return !formFilter.location || race.location.toLowerCase().includes(formFilter.location.toLowerCase());
        })
        .filter((race) => {
          // Filtrar por fecha
          if (!formFilter.date) return true;
          const raceDate = new Date(race.date);
          const filterDate = new Date(formFilter.date);
          return (
            raceDate.getFullYear() === filterDate.getFullYear() &&
            raceDate.getMonth() === filterDate.getMonth() &&
            raceDate.getDate() === filterDate.getDate()
          );
        })
        .sort((a, b) => {
          // Ordenar por fecha
          if (formFilter.order === "newest" || !formFilter.order) {
            return new Date(b.date) - new Date(a.date);
          }
          if (formFilter.order === "oldest") {
            return new Date(a.date) - new Date(b.date);
          }
          return 0;
        })
        .map((race)=>(
          <>
            <RaceCard key={race._id} race={race} />
          </>

        )):(
          <div>No hay carreras disponibles</div>
        )}
      </div>
    </>

  )
}

export default Races