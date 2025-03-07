import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_CICLISMO_URL;

const MyRaces = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [myRaces, setMyRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyRaces = async () => {
            try {
                const response = await fetch(`${API_URL}/registrations/user`, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Error al cargar las carreras');
                }

                const data = await response.json();
                setMyRaces(data.registrations);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setError('Error al cargar tus carreras');
                setLoading(false);
            }
        };

        fetchMyRaces();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fdf7ed] p-4 md:p-8 flex justify-center items-center">
                <div className="text-xl text-[#9B9D79]">Cargando tus carreras...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#fdf7ed] p-4 md:p-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdf7ed] p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-[#1a1204] mb-8">Mis Carreras</h1>

                {myRaces.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-gray-600">No estás inscrito en ninguna carrera todavía.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myRaces.map((registration) => (
                            <div 
                                key={registration._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden border border-[#B4C7B2] hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-[#1a1204] truncate">
                                            {registration.race.name}
                                        </h3>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            registration.status === 'registered' 
                                                ? 'bg-green-100 text-green-800' 
                                                : registration.status === 'finished'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {registration.status === 'registered' ? 'Inscrito' 
                                             : registration.status === 'finished' ? 'Finalizada' 
                                             : 'Cancelada'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                        <div className="bg-[#fdf7ed] p-2 rounded">
                                            <span className="block text-xs text-[#1a1204] opacity-75">Fecha</span>
                                            <span className="font-medium text-[#1a1204]">
                                                {new Date(registration.race.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="bg-[#fdf7ed] p-2 rounded">
                                            <span className="block text-xs text-[#1a1204] opacity-75">Deporte</span>
                                            <span className="font-medium text-[#1a1204]">
                                                {registration.race.sport}
                                            </span>
                                        </div>
                                        {registration.dorsal && (
                                            <div className="bg-[#fdf7ed] p-2 rounded">
                                                <span className="block text-xs text-[#1a1204] opacity-75">Dorsal</span>
                                                <span className="font-medium text-[#1a1204]">{registration.dorsal}</span>
                                            </div>
                                        )}
                                        {registration.position && (
                                            <div className="bg-[#fdf7ed] p-2 rounded">
                                                <span className="block text-xs text-[#1a1204] opacity-75">Posición</span>
                                                <span className="font-medium text-[#1a1204]">{registration.position}</span>
                                            </div>
                                        )}
                                        {registration.time && (
                                            <div className="bg-[#fdf7ed] p-2 rounded">
                                                <span className="block text-xs text-[#1a1204] opacity-75">Tiempo</span>
                                                <span className="font-medium text-[#1a1204]">{registration.time}</span>
                                            </div>
                                        )}
                                    </div>

                                    <button 
                                        onClick={() => navigate(`/carrerasDetail/${registration.race._id}`)}
                                        className="w-full bg-[#9B9D79] text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8EAC93] focus:ring-offset-2"
                                    >
                                        Ver detalles
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRaces;