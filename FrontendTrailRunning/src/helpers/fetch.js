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

export const fetchLastRace = async () => {
    try {
        const response = await fetch(`${api}/registrations/user?status=finished`,  {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
        });

        if(!response.ok){
            throw new Error("Error al obtener carreras del usuario")
        }
         
        const data = await response.json(); // de aqui quiero registrations (está ordenado en el backend);

        //la última carrera (primera del arreglo) o null si no hay carreras finalizadas
        return data.registrations.length > 0 ? data.registrations[0] : null;

    } catch(error){
        throw new Error("Error al hacer la petición", error)
    }
}

export const profile = async () => {
    try {
        const response = await fetch(`${api}/users/profile`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          if(!response.ok){
            throw new Error("Error al conectar a la api")
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error: ", error);
    }
}