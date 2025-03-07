import { useEffect, useState } from "react";
import { fetchRacesUserNumber, profile, fetchKmUser } from "../helpers/fetch"; // Asegúrate de que fetchKmUser esté correctamente importado
import { ROUTES } from "../routes/paths";
import { Link } from "react-router-dom";
import Chart from "../components/Chart";

const User = () => {
    const [user, setUser] = useState({});
    const [races, setRaces] = useState({});
    const [racesChart, setRacesChart] = useState([]);
    const [allKmChart, setAllKm] = useState(0); // Debería ser un número en vez de un objeto

    const fetchProfile = async () => {
        const prof = await profile(); 
        setUser(prof);
        const numbers = await fetchRacesUserNumber();
        setRaces(numbers);
    };

    useEffect(() => {
        fetchProfile()
    }, []);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const racesData = await fetchKmUser();
            console.log(racesData.allKm)
            setRacesChart(racesData.racesChart); // Asegúrate de que racesData tenga la estructura correcta
            setAllKm(racesData.allKm); // Asegúrate de que allKm sea un número
          } catch (error) {
            console.error("Error al obtener los datos de las carreras:", error);
          }
        };
      
        fetchData(); // Llamar a la función async
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
                <div className="flex flex-col items-center">
                    {/* Avatar */}
                    <div className="w-32 h-32 mb-6 rounded-full border-4 border-primary flex items-center justify-center">
                        {user.avatar ? (
                            <img 
                                src={"../../img/default.jpg"} 
                                alt="Avatar del usuario"
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-text">Avatar del usuario</span>
                        )}
                    </div>

                    {/* Información del usuario */}
                    <h2 className="text-3xl font-bold text-text mb-2">{user.name || "Admin Usuario"}</h2>
                    <p className="text-primary mb-2">{user.role || "admin"}</p>
                    <p className="text-secondary mb-4">{user.email || "admin@example.com"}</p>
                    <p className="text-text mb-8">Edad: {user.age || "35"} años</p>

                    {/* Estadísticas */}
                    <div className="w-full grid grid-cols-3 gap-8 mb-8">
                        <div className="text-center">
                            <h3 className="text-primary font-medium mb-2">Carreras participadas</h3>
                            <p className="text-4xl text-text">{races.all}</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-primary font-medium mb-2">Carreras completadas</h3>
                            <p className="text-4xl text-text">{races.finish}</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-primary font-medium mb-2">Próximas carreras</h3>
                            <p className="text-4xl text-text">{races.registered}</p>
                        </div>
                    </div>

                    {/* Botón de editar perfil */}
                    <Link to={ROUTES.EDITUSER} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent transition-colors duration-300">
                        Editar perfil
                    </Link>
                </div>
                <Chart allKm={allKmChart} races={racesChart} />
            </div>

            {/* Aquí renderizas el gráfico */}
        </div>
    );
};

export default User;
