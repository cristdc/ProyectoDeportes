import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../hooks/useAuth";

const EditProfile = () => {
  const { user, editUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [avatar, setAvatar] = useState(null); 

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Comprobar si se ha seleccionado un nuevo avatar o usar el predeterminado
    const avatarName = avatar ? avatar.name : user.avatar; 

    try {
      const data = await editUser(name, age, avatarName); // Pasar el nombre del avatar o el predeterminado
      if (data) {
        toast.success("Usuario editado correctamente 🎉");
      }
    } catch (err) {
      toast.error("Error al editar el usuario ❌", err);
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg bg-white shadow-lg rounded-xl p-6 m-3">
        <h2 className="text-2xl font-bold text-center mb-4">Editar Usuario</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Nombre Usuario</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Edad</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Foto de Perfil</label>
            <input
              type="file"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setAvatar(e.target.files[0])} // Actualizar el estado con el archivo seleccionado
              accept="image/*"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:bg-rose-500 transition mb-5"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
