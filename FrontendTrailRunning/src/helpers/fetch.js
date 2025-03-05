const api = import.meta.env.VITE_BACKEND_URL;

export const fetchAllRaces = async () =>{
    try {
        const response = await fetch(`${api}/races/sport/trailRunning`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          })

        if(!response.ok){
            throw new Error("Error al conectar a la api")
        }
    
        const data = await response.json();
        return data.races;
    } catch (error) {
        console.log("Error: ", error);
    }
}

export const registration = async (raceId) =>{
    try {
        const response = await fetch(`${api}/registrations`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify ({ raceId })
          })

        if(!response.ok){
            throw new Error("Error al conectar a la api")
        }
    
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log("Error: ", error);
    }
}