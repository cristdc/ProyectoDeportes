import { useEffect, useState } from "react"
import { fetchUserRegistrations } from "../helpers/fetch";
import RacesUserList from "../components/RacesUserList";
import useAuth from "../hooks/useAuth";

// NOTA : CAMBIAR BOTON DE PARTICIPAR Y AÑADIR FUNCIÓN DE DESPUNTAR DE CARRERA 
const RacesUser = () => {

  const [registrations, setRegistrations] = useState([]);
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchRaces = async () =>{
      const data = await fetchUserRegistrations();
      setRegistrations(data);
    }
    fetchRaces();
  }, [])
  

  return (
    <>
    <div> 
        <h1 className="text-center text-2xl font-bold mt-5">Historial de Races de {user.name}  </h1>
    </div>
    { registrations ? (
      <RacesUserList registrations={registrations} />
    ):(
      <div>No hay carreras disponibles</div>
    )}

    </>

  )
}

export default RacesUser