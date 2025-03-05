import { createContext, useContext, useEffect, useState } from "react";

const VITE_API_CICLISMO_URL = import.meta.env.VITE_API_CICLISMO_URL; 
const RaceContext = createContext();

export const RaceProvider = ({ children }) => {
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [race, setRace] = useState(null);

    useEffect(() => {
        fetchRaces();
    }, []);

    const fetchRaces = async () => {
        try {
            // Agregamos logs para debuggear
            console.log('Iniciando fetch de carreras...');
            
            const response = await fetch(`${VITE_API_CICLISMO_URL}/races?sport=cycling`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Status de la respuesta:', response.status);
            
            if(!response.ok) {
                throw new Error('Error al obtener las carreras de ciclismo.');
            }
            
            const data = await response.json();
            console.log('Datos recibidos:', data);
            
            // Verificamos la estructura de los datos y extraemos el array de races
            if (data && data.races && Array.isArray(data.races)) {
                setRaces(data.races);
                if (data.pagination) {
                    setPagination(data.pagination);
                }
            } else if (Array.isArray(data)) {
                // Si la respuesta es directamente un array
                setRaces(data);
            } else {
                // Si recibimos un mensaje del backend, establecemos un array vacío
                setRaces([]);
                setError(data.message || 'No se pudieron cargar las carreras');
            }
        } catch (error) {
            console.error('Error en fetchRaces:', error);
            setError(error.message);
            setRaces([]); // Aseguramos que races siempre sea un array
        } finally {
            setLoading(false);
        }
    };

    const fetchRaceDetails = async (id) => {
        try {
          const response = await fetch(`http://localhost:3000/api/races/${id}`);
  
          if (!response.ok) {
            throw new Error('No se pudo obtener la información de la carrera');
          }
  
          const data = await response.json();
          setRace(data);
          setLoading(false);
          console.log(data)
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

    console.log('Estado actual de races:', races);

    return (
        <RaceContext.Provider value={{
            races,
            loading,
            error,
            pagination,
            race,
            fetchRaces,
            fetchRaceDetails,
        }}>
            {children}
        </RaceContext.Provider>
    );
};

export const useRace = () => {
    const context = useContext(RaceContext);
    if(!context) {
        throw new Error('useRace debe estar dentro de un RaceProvider');
    }
    return context;
};