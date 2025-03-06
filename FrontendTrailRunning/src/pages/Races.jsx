import { useEffect, useState } from "react"
import { fetchAllRaces } from "../helpers/fetch";
import RacesList from "../components/RacesList";
import RaceCard from "../components/RaceCard";

const Races = () => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRaces = async () =>{
    const data = await fetchAllRaces();
    setRaces(data);
  }

  useEffect(() => {
    fetchRaces();
    setLoading(false);
  }, [])

  if(loading){
    return <div>Cargando...</div>
  }
  

  return (

    <>
      <h2 className="text-3xl mt-5 text-text font-semibold text-center">Carreras disponibles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-2">
        { races ? races.map((race)=>(
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