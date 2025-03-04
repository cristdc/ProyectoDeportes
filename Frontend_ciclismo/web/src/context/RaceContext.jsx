import { createContext, useContext, useEffect, useState } from "react";

const RaceContext = createContext();

export const RaceProvider = ({ children }) => {
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRaces = async () => {
        try {
            // Agregamos logs para debuggear
            console.log('Iniciando fetch de carreras...');
            
            const response = await fetch('http://localhost:3000/api/races', {
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
            
            // Verificamos si data es un array o si contiene un mensaje de error
            if (Array.isArray(data)) {
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

    useEffect(() => {
        fetchRaces();
    }, []);

    console.log('Estado actual de races:', races);

    return (
        <RaceContext.Provider value={{
            races,
            loading,
            error,
            fetchRaces
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