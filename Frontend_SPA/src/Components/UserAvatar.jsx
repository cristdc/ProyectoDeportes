import React from "react";

const UserAvatar = ({ user, size = 64 }) => {
  // Si hay una imagen de avatar, intentar mostrarla
  if (user.avatar && user.avatar !== "default.jpg") {
    return (
      <>
        <img
          src={user.avatar}
          alt={user.name || "Usuario"}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null; // Evitar bucle infinito
            e.target.style.display = "none"; // Ocultar la imagen
            e.target.nextSibling.style.display = "flex"; // Mostrar el div de respaldo
          }}
        />
        <div
          className="rounded-full flex items-center justify-center font-bold text-gray-700 w-full h-full"
          style={{
            backgroundColor: getRandomColor(user),
            fontSize: `${size / 2.5}px`,
            display: "none", // Inicialmente oculto, se muestra si la imagen falla
          }}
        >
          {getInitials(user)}
        </div>
      </>
    );
  }

  // Si no hay avatar, mostrar iniciales directamente
  return (
    <div
      className="w-full h-full rounded-full flex items-center justify-center font-bold text-gray-700"
      style={{
        backgroundColor: getRandomColor(user),
        fontSize: `${size / 2.5}px`,
      }}
    >
      {getInitials(user)}
    </div>
  );
};

// Función para obtener las iniciales del nombre del usuario
const getInitials = (user) => {
  if (!user || !user.name) return "?";

  const names = user.name.split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();

  return (
    names[0].charAt(0) + (names[1] ? names[1].charAt(0) : "")
  ).toUpperCase();
};

// Función para generar un color aleatorio pero consistente basado en el nombre
const getRandomColor = (user) => {
  if (!user || !user.name) return "#e0e0e0"; // Gris claro por defecto

  // Usar el nombre como semilla para que el color sea consistente
  let hash = 0;
  const name = user.name || user.email || String(user._id);

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generar colores pastel para mejor legibilidad
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 80%)`;
};

export default UserAvatar;
