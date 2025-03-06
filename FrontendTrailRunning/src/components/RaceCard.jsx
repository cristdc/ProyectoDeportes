import React from "react";
import { createRegistration } from "../helpers/fetch";

const RaceCard = ({ race }) => {
  const handleClick = async () => {
    const data = await createRegistration(race._id);
    console.log(data);
  };

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

    <button 
        onClick={handleClick} 
        disabled={race.status !== "open"} 
        className="mt-4 bg-primary hover:bg-accent text-white px-4 py-2 rounded disabled:bg-gray-400 w-full">
        Participar
    </button>
    </div>


  );
};

export default RaceCard;