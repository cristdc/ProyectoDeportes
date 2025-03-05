import { useEffect, useState } from "react"
import { profile } from "../helpers/fetch";

const User = () => {
    const [user, setUser] = useState({});
    const fetchProfile = async () => {
        const prof = await profile(); 
        setUser(prof);  
      };
    useEffect(() => {
        fetchProfile()
    }, [])
  return (
    <div className="container mx-auto px-4 py-8">
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="w-32 h-32 mb-6">
                <img 
                    src={user.avatar} 
                    alt="Avatar del usuario"
                    className="w-full h-full rounded-full object-cover border-4 border-primary"
                />
            </div>

            {/* Información del usuario */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-text mb-2">{user.name}</h2>
                <p className="text-accent mb-2">{user.role}</p>
                <p className="text-secondary mb-4">{user.email}</p>
                {user.age && (
                    <p className="text-text">Edad: {user.age} años</p>
                )}
            </div>

            {/* Estadísticas */}
            <div className="w-full mt-8 grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-background rounded-lg">
                    <h3 className="text-primary font-bold">Carreras participadas</h3>
                    <p className="text-2xl text-text">0</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                    <h3 className="text-primary font-bold">Carreras completadas</h3>
                    <p className="text-2xl text-text">0</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                    <h3 className="text-primary font-bold">Próximas carreras</h3>
                    <p className="text-2xl text-text">0</p>
                </div>
            </div>

            {/* Botón de editar perfil */}
            <button className="mt-8 bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent transition-colors duration-300">
                Editar perfil
            </button>
        </div>
    </div>
</div>
  )
}

export default User