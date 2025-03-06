import React, { useState, useSyncExternalStore } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, error, editUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [info, setInfo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await editUser(name, age);
    if (data) {
      setInfo("Editado el usuario");
    }
  };

  return (
    <div className="w-full flex justify-center items-center ">
      <div className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg bg-white shadow-lg rounded-xl p-6 m-3">
        <h2 className="text-2xl font-bold text-center mb-4">Editar Usuario</h2>
        {(error || info) && (
          <h5
            className={`text-center font-semibold p-1 rounded-lg shadow-md mb-3 
                ${
                  error
                    ? "bg-red-100 text-red-600 border border-red-400"
                    : "bg-blue-100 text-blue-600 border border-blue-400"
                }`}
          >
            {error || info}
          </h5>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block font-medium text-gray-700">
              Nombre Usuario
            </label>
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
