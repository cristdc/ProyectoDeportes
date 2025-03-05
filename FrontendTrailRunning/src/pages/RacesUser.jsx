import { useEffect, useState } from "react"
import { fetchUserRegistrations } from "../helpers/fetch";
import RacesUserList from "../components/RacesUserList";

// NOTA : CAMBIAR BOTON DE PARTICIPAR Y AÑADIR FUNCIÓN DE DESPUNTAR DE CARRERA 
const RacesUser = () => {

  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchRaces = async () =>{
      const data = await fetchUserRegistrations();
      setRegistrations(data);
    }
    fetchRaces();
  }, [])
  

  return (
    <>
    <div>Races</div>
    { registrations ? (
      <RacesUserList registrations={registrations} />
    ):(
      <div>No hay carreras disponibles</div>
    )}

    </>

  )
}

export default RacesUser