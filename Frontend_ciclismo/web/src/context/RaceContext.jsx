import { createContext, useContext, useState } from "react";

const VITE_API_CICLISMO_URL = import.meta.env.VITE_API_CICLISMO_URL;

const RaceContext = createContext();

export const RaceProvider = ({ children }) => {
    const [race, setRace] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRaces = async () => {
        try {
            const response = await fetch(`${VITE_API_CICLISMO_URL}/races?sport=Ciclismo`);
            if(!response.ok){
                throw new Error('Error al obtener las carreras de ciclismo.');
            }
            const data = await response.json();
            setRace(data);
            setLoading(false);
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false);
        }
    };

    return(
        <RaceContext.Provider value={{race, loading, error, fetchRaces}}>
            {children}
        </RaceContext.Provider>
    )
};

export const useRace = () => {
    const context = useContext(RaceContext);
    if(!context){
        throw new Error('useRace debe estar dentro de un RaceProvider');
    }
    return context;
};