import { useEffect, useState } from "react"
import { fetchAllRaces } from "../helpers/fetch";
import RacesList from "../components/RacesList";

const Races = () => {

  const [races, setRaces] = useState([]);

  useEffect(() => {
    const fetchRaces = async () =>{
      const data = await fetchAllRaces();
      setRaces(data);
    }
    fetchRaces();
  }, [])
  

  return (
    <>
    <div>Races</div>
    { races ? (
      <RacesList races={races} />
    ):(
      <div>No hay carreras disponibles</div>
    )}

    </>

  )
}

export default Races