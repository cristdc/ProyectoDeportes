import { createContext, useContext, useEffect, useState } from "react";

const VITE_API_CICLISMO_URL = import.meta.env.VITE_API_CICLISMO_URL; 
const RaceContext = createContext();

export const RaceProvider = ({ children }) => {
    const [races, setRaces] = useState([]);
    const [race, setRace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);

    const fetchRaces = async () => {
        try {
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
            
            if (data && data.races && Array.isArray(data.races)) {
                setRaces(data.races);
                setPagination(data.pagination);
            } else {
                console.error('Estructura de datos inesperada:', data);
                setRaces([]);
                setError('Formato de datos incorrecto');
            }
        } catch (error) {
            console.error('Error en fetchRaces:', error);
            setError(error.message);
            setRaces([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchRaceDetails = async (id) => {
        try {
            setLoading(true);
            setError(null);
            console.log('Iniciando fetch de detalles de carrera:', id);
            
            const response = await fetch(`${VITE_API_CICLISMO_URL}/races/${id}`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Status de la respuesta:', response.status);
            
            if (!response.ok) {
                throw new Error('No se pudo obtener la información de la carrera');
            }
            
            const data = await response.json();
            console.log('Datos de carrera recibidos:', data);
            setRace(data);
        } catch (err) {
            console.error('Error en fetchRaceDetails:', err);
            setError(err.message);
            setRace(null);
        } finally {
            setLoading(false);
        }
    };

    const downloadRace = async (id) => {
        try {
            const response = await fetch(`${VITE_API_CICLISMO_URL}/races/${id}`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (err) {
            console.error('Error en downloadRace:', err);
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchRaces();
    }, []);

    return (
        <RaceContext.Provider value={{
            races,
            race,
            loading,
            error,
            pagination,
            fetchRaces,
            fetchRaceDetails,
            downloadRace
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