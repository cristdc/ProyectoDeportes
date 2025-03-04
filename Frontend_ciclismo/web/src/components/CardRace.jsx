import React, { useContext } from 'react'
import { RacesContext } from '../context/RacesContext';
export const CardRace = () => {
    const { races } = useContext(RacesContext);
  return (
    <div>
        <div className="card">
            <div className="card-image">
                <img src={image} alt={title} />
            </div>
            <div className="card-content">
                <h3>{title}</h3>
            </div>
        </div>
    </div>
  )
}
