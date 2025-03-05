const api = import.meta.env.VITE_BACKEND_URL;

export const fetchAllRaces = async () =>{
    try {
        const response = await fetch(`${api}/races`, {
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

        return data;
    } catch (error) {
        console.log("Error: ", error);
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