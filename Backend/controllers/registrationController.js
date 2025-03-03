import Registration from "../models/Registrations.js";
import Race from "../models/Race.js";
import User from "../models/User.js";

// Crear inscripción
const createRegistration = async (req, res) => {
  // TODO:
  // - Extraer el ID de la carrera (race) del body
  // - Validar que el ID de carrera tenga formato válido de MongoDB
  // - Verificar que la carrera exista con Race.findById()
  // - Comprobar que la carrera tenga estado 'open'
  // - Verificar que la carrera no haya alcanzado su maxParticipants
  // - Comprobar si el usuario ya está inscrito en esta carrera para evitar duplicados
  // - Crear una nueva instancia de Registration con:
  //   * race: ID de la carrera
  //   * user: ID del usuario actual (req.user.id)
  //   * status: 'registered' (por defecto)
  //   * registeredAt: fecha actual
  // - Guardar la inscripción en la base de datos
  // - Devolver la inscripción creada con código 201
  // - Manejar errores con try/catch
   try {
     // Respuesta temporal
     return res.status(200).json({
       message:
         "Endpoint conectado correctamente, metodo pendiente de programar",
     });
   } catch (error) {
     return res.status(500).json({
       message: "Error en la conexión al endpoint",
       error: error.message,
     });
   }
};

// Obtener inscripciones del usuario
const getUserRegistrations = async (req, res) => {
  // TODO:
  // - Obtener el ID del usuario autenticado (req.user.id)
  // - Buscar todas las inscripciones donde user coincida con el ID del usuario
  // - Usar .populate('race') para incluir los detalles de las carreras
  // - Filtrar por estado de inscripción si se proporciona en query params
  // - Ordenar resultados (por ejemplo, por fecha de carrera o fecha de registro)
  // - Devolver la lista de inscripciones con código 200
  // - Manejar posibles errores de base de datos
   try {
     // Respuesta temporal
     return res.status(200).json({
       message:
         "Endpoint conectado correctamente, metodo pendiente de programar",
     });
   } catch (error) {
     return res.status(500).json({
       message: "Error en la conexión al endpoint",
       error: error.message,
     });
   }
};

// Obtener inscripciones por carrera
const getRaceRegistrations = async (req, res) => {
  // TODO:
  // - Extraer el ID de la carrera de req.params.raceId
  // - Validar que el ID tenga formato válido
  // - Verificar permisos del usuario (solo admin/creador de la carrera deberían acceder)
  // - Buscar inscripciones con Registration.find({ race: raceId })
  // - Usar .populate('user', 'name email') para incluir información de los usuarios
  // - Ordenar por filtros (marcas de tiempo, posicion...etc)
  // - Devolver la lista de inscripciones con código 200
  // - Manejar errores con try/catch
   try {
     // Respuesta temporal
     return res.status(200).json({
       message:
         "Endpoint conectado correctamente, metodo pendiente de programar",
     });
   } catch (error) {
     return res.status(500).json({
       message: "Error en la conexión al endpoint",
       error: error.message,
     });
   }
};

// Actualizar inscripción con los resultados de la carrera (finished)
const updateRegistration = async (req, res) => {
  // TODO:
  // - Extraer el ID de inscripción de req.params.id
  // - Extraer tiempo y posición del body
  // - Validar formato del tiempo (podría ser una duración en segundos o formato HH:MM:SS)
  // - Validar que la posición sea un número positivo
  // - Verificar permisos (solo admin debería poder registrar resultados)
  // - Verificar que la carrera asociada tenga estado 'finished'
  // - Actualizar la inscripción con tiempo y posición
  // - Cambiar status a 'finished'
  // - Devolver la inscripción actualizada con código 200
  // - Manejar errores con try/catch
   try {
     // Respuesta temporal
     return res.status(200).json({
       message:
         "Endpoint conectado correctamente, metodo pendiente de programar",
     });
   } catch (error) {
     return res.status(500).json({
       message: "Error en la conexión al endpoint",
       error: error.message,
     });
   }
};

// Cancelar inscripción
const cancelRegistration = async (req, res) => {
  // TODO:
  // - Extraer el ID de inscripción de req.params.id
  // - Validar que el ID tenga formato válido
  // - Verificar que la inscripción pertenezca al usuario actual (req.user.id)
  // - Comprobar que la inscripción tenga estado 'registered' (no cancelar algo ya cancelado o finalizado)
  // - Verificar que la fecha de la carrera no haya pasado
  // - Actualizar el estado a 'cancelled' usando findByIdAndUpdate
  // - Si la inscripción no existe, devolver 404
  // - Devolver la inscripción actualizada o un mensaje de éxito con código 200
  // - Manejar errores con try/catch
   try {
     // Respuesta temporal
     return res.status(200).json({
       message:
         "Endpoint conectado correctamente, metodo pendiente de programar",
     });
   } catch (error) {
     return res.status(500).json({
       message: "Error en la conexión al endpoint",
       error: error.message,
     });
   }
};

// Actualizar inscripción con tiempo
const updateRegistrationTime = async (req, res) => {

  // TODO:
  // - Extraer ID de inscripción
  // - Extraer tiempo y posición del body
  // - Validar formato del tiempo
  // - Validar que la posición sea un número positivo
  // - Verificar permisos (solo admin)
  // - Actualizar la inscripción
  // - Cambiar status a 'finished'
  // - Devolver la inscripción actualizada
  // - Manejar errores con try/catch
  try {
    // Respuesta temporal
    return res.status(200).json({
      message:
        "Endpoint conectado correctamente, metodo pendiente de programar",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error en la conexión al endpoint",
      error: error.message,
    });
  }
};

// Obtener todas las inscripciones (admin)
const getAllRegistrations = async (req, res) => {
  
try {
  // Respuesta temporal
  return res.status(200).json({
    message: "Endpoint conectado correctamente, metodo pendiente de programar",
  });
} catch (error) {
  return res.status(500).json({
    message: "Error en la conexión al endpoint",
    error: error.message,
  });
}
  // TODO:
  // - Obtener todas las inscripciones
  // - Poblar información de usuarios y carreras
  // - Implementar filtros (por estado, por carrera, etc.)
  // - Implementar paginación
  // - Devolver lista de inscripciones
  // - Manejar errores con try/catch
};


export {
  createRegistration,
  getUserRegistrations,
  getAllRegistrations,
  updateRegistrationTime,
  cancelRegistration,
};