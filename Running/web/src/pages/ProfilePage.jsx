import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdf7ed] p-4">
      <h1 className="text-3xl font-bold mb-6 text-[#1a1204]">Perfil del Usuario</h1>
      {user ? (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <div className="flex flex-col items-center">
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full mb-4 border-2 border-[#9B9D79]"
            />
            <p className="text-lg font-semibold text-[#1a1204]"><strong>Nombre:</strong> {user.name}</p>
            <p className="text-lg text-[#1a1204]"><strong>Email:</strong> {user.email}</p>
            <p className="text-lg text-[#1a1204]"><strong>Edad:</strong> {user.age}</p>
            <p><strong>Fecha de registro: </strong>{user.registrationDate}</p>
          </div>
        </div>
      ) : (
        <p className="text-lg text-[#8EAC93]">Cargando información del usuario...</p>
      )}
    </div>
  );
}

export default ProfilePage;