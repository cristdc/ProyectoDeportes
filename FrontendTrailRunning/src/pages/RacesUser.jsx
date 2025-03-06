import { useEffect, useState } from "react";
import { fetchRaceById, fetchUserRegistrations } from "../helpers/fetch";
import useAuth from "../hooks/useAuth";
import RaceCard from "../components/RaceCard";

// NOTA : CAMBIAR BOTON DE PARTICIPAR Y AÑADIR FUNCIÓN DE DESPUNTAR DE CARRERA 
const RacesUser = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Función para obtener las carreras registradas
  const fetchRegistrations = async () => {
    const data = await fetchUserRegistrations();
    setRegistrations(data);
  };

  // Función para obtener las carreras detalladas (fetchRaceById)
  const getRaces = async () => {
    if (registrations.length > 0) {
      const registraces = await Promise.all(
        registrations.map(async (reg) => {
          const fetchedRace = await fetchRaceById(reg.race._id);
          return {
            ...reg,
            race: fetchedRace,
          };
        })
      );
      setRegistrations(registraces); // Actualiza el estado con las carreras detalladas
      setLoading(false); // Cambia el estado de loading
    }
  };

  // Efecto para obtener registros
  useEffect(() => {
    const loadData = async () => {
      await fetchRegistrations(); // Primero obtenemos las inscripciones
    };
    loadData();
  }, []); // Este useEffect solo se ejecuta una vez cuando el componente se monta

  // Efecto para obtener detalles de las carreras después de que `registrations` cambie
  useEffect(() => {
    if (registrations.length > 0 && loading) {
      getRaces(); // Se llama solo una vez después de obtener los registros
    }
  }, [registrations, loading]); // Se ejecuta cuando `registrations` cambie, pero no entrará en bucle gracias al `loading`

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <>

      <h2 className="text-center text-2xl font-bold mt-5">
        Historial de Races de {user.name}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-2">
        {console.log(registrations)}
        {registrations && registrations.length > 0 ? (
          registrations.map((registration) => (
            <RaceCard
              key={registration.race._id}
              race={registration.race}
              status={registration.status}
              registrationId={registration._id}
            />
          ))
        ) : (
          <div>No hay carreras disponibles</div>
        )}
      </div>
    </>
  );
};

export default RacesUser;
