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
    <div className="mt-5 text-xl text-text font-semibold text-center">Historial carreras</div>
    { registrations ? (
      <RacesUserList registrations={registrations} />
    ):(
      <div>No hay carreras disponibles</div>
    )}

    </>

  )
}

export default RacesUser