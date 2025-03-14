const api = import.meta.env.VITE_BACKEND_URL;

export const fetchAllRaces = async () =>{
    try {
        const response = await fetch(`${api}/races/sport/trailRunning`, {
            method: 'GET',
            credentials: 'include',
            headers: {
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

export const createRegistration = async (raceId) =>{
    try {
        const response = await fetch(`${api}/registrations`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify ({ raceId })
          })

        if(!response.ok){
            throw new Error("Error al conectar a la api")
        }
    
        const data = await response.json();
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

export const fetchKmUser = async () => {
    try {
        // Obtenemos las inscripciones terminadas
        const finish = await fetch(`${api}/registrations/user?status=finished`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!finish.ok) {
            throw new Error("Error al obtener las carreras finalizadas del usuario");
        }

        // Parseamos el JSON de la respuesta
        const finishData = await finish.json();

        // Usamos Promise.all para obtener detalles de todas las carreras
        const races = await Promise.all(
            finishData.registrations.map(async (reg) => {
                const race = await fetch(`${api}/races/${reg.race._id}`);
                if (!race.ok) {
                    throw new Error(`Error al obtener detalles de la carrera con ID: ${reg.race}`);
                }

                return race.json(); // Retorna el JSON de la carrera
            })
        );
        const allKm = races.reduce((totalKm, race) => {
            // Convertimos explícitamente la fecha de la carrera
            const raceDate = new Date(race.date);
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            
            // Verificamos si es del mes y año actual
            if (raceDate.getMonth() === currentMonth && raceDate.getFullYear() === currentYear) {
              // Convertimos explícitamente distance a número
              return totalKm + parseFloat(race.distance || 0);
            }
            return totalKm;
          }, 0);

        return {allKm, racesChart: races};

    } catch (error) {
        console.error("Error al hacer la petición:", error); // Log para mayor claridad
        throw new Error(error.message || "Error desconocido"); // Lanza un error con mensaje adecuado
    }
};

export const fetchRacesUserNumber = async () => {
    try {
        // terminadas
        const finish = await fetch(`${api}/registrations/user?status=finished`,  {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
        });

        if(!finish.ok){
            throw new Error("Error al obtener las carreras finalizadas del usuario")
        }

        const finishData = await finish.json(); //hacer finishData.registrations.lenght
        const finishNum = finishData.registrations.length ;

        // registradas
        const registered = await fetch(`${api}/registrations/user?status=registered`,  {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
        });

        if(!registered.ok){
            throw new Error("Error al obtener las carreras finalizadas del usuario")
        }

        // "registered", "cancelled", "finished")
        const registeredData = await registered.json(); //hacer finishData.registrations.lenght
        const registeredNum = registeredData.registrations.length;

        return { finish: finishNum, 
            registered: registeredNum, 
            all: finishNum+registeredNum
        }

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
        console.log(data);
        return data;
    } catch (error) {
        console.log("Error: ", error);
    }
}

// fetch para obtener historial de carreras del user
export const fetchUserRegistrations = async () => {
    try {
        const response = await fetch(`${api}/registrations/user`, {
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
        return data.registrations;

    } catch (error) {
        console.log("Error: ", error);
    }
    
}

export const fetchRaceById =  async (raceId) =>{
    try {
        const response = await fetch(`${api}/races/${raceId}`,  {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
        });

        if(!response.ok){
            throw new Error("Error al obtener la carrera")
        }
         
        const race = await response.json();
        return race;

    } catch(error){
        throw new Error("Error al hacer la petición", error)
    }
}


//fetch para desapuntarte de una carrera 
export const unRegister = async (registrationId) => {
    try {
        const response = await fetch(`${api}/registrations/${registrationId}/cancel`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          })

        if(!response.ok){
            throw new Error("Error al cancelar inscripción")
        }
    
        const data = await response.json();
        return data.message;

    } catch (error) {
        console.log("Error: ", error);
    }
    
}