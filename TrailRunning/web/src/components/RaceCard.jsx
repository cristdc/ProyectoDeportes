import React, { useState } from "react";
import { createRegistration } from "../helpers/fetch";
import { unRegister } from "../helpers/fetch";

const RaceCard = ({ race, status = null, registrationId = null}) => { 

    const [visible, setVisible] = useState(true);
    const [state, setState] = useState(status);

    const handleClick = async () => {
        const data = await createRegistration(race._id);
        console.log(data);
        setVisible(false);
    };

  const handleUnRegister = async (registration_id) => {
    try {
        const message = await unRegister(registration_id);
        if(message){
            setState("cancelled");
        }
    } catch(error){
        throw new error("Error al tratar de desapuntarse", error);
    }


  }

  if (!visible) return null;

    return (

    <div className="bg-white shadow-lg rounded-lg p-6 m-4 border border-gray-200">
        <h2 className="text-xl text-center font-bold text-gray-800">{race.name}</h2> 
        <p className="text-center">📍 {race.location}</p>
        <p className="text-center mb-4"><span>📅</span> {new Date(race.date).toLocaleDateString()}</p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-600">
            <p className="flex justify-between rounded-lg bg-background px-2 py-1"><span>🏃</span> {race.distance} km</p>
            <p className="flex justify-between rounded-lg bg-background px-2 py-1"><span>👥</span> {race.maxParticipants}</p>
            <p className="flex justify-between rounded-lg bg-background px-2 py-1"><span>⛰️</span> {race.unevenness} m</p>
            <p className="flex justify-between rounded-lg bg-background px-2 py-1"><span>⏳</span> {race.qualifyingTime}</p>
        </div>

        { state ? (
            state.toLowerCase() === "registered" ? ( // Según el estado del registro aparece el botón bloqueado o no
                <button 
                className="mt-4 bg-primary hover:bg-accent text-white px-4 py-2 rounded disabled:bg-gray-400 w-full"
                onClick={() => handleUnRegister(registrationId)}
                >
                Desapuntarse
                </button>
            ) : (
                state === "cancelled" ? (
                    <button 
                    className="mt-4 bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed opacity-50 w-full"
                    disabled
                    >
                    Cancelado
                    </button>
                ):(
                    <button 
                    className="mt-4 bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed opacity-50 w-full"
                    disabled
                    >
                    Finalizado
                    </button>
                )

            )
        ) : (

            <button 
            onClick={() => handleClick()} 
            disabled={race.status !== "open"} 
            className="mt-4 bg-primary hover:bg-accent text-white px-4 py-2 rounded disabled:bg-gray-400 w-full">
                Participar
            </button>
        )}

    </div>


    );
};

export default RaceCard;