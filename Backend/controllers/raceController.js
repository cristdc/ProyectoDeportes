import Race from "../models/Race.js";

// Listar carreras por deporte
const getRacesBySport = async (req, res) => {
  // TODO:
  // - Extraer el parámetro 'sport' de req.params (ejemplo: 'running', 'trailRunning', 'cycling')
  // - Validar que el valor del parámetro coincida con alguno de los enum definidos en el campo 'sport'
  // - Realizar la consulta con Race.find({ sport: deporte }) para filtrar por el deporte seleccionado
  // - Ordenar resultados (por ejemplo, por fecha (las que van a ser proximamente primero) usando .sort({ date: 1 }))
  // - Devolver la lista de carreras con código 200
  // - Manejar errores con try/catch y responder con el mensaje adecuado
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
};

// Crear carrera
const createRace = async (req, res) => {
  // TODO:
  // - Extraer todos los campos del body que coincidan con el modelo:
  //   * name, sport, date, location, distance, maxParticipants, unevenness, tour, qualifyingTime
  // - Validar que 'sport' sea uno de: "running", "trailRunning", "cycling"
  // - Verificar que todos los campos numéricos sean positivos (distance, maxParticipants, unevenness)
  // - Validar el formato de la fecha
  // - Asignar el ID del usuario actual como createdBy (req.user.id) IMPORTANTE, debe ser un admin!!!!
  // - Crear una nueva instancia de Race con los datos validados
  // - Guardar en la base de datos con .save()
  // - Devolver la carrera creada con código 201
  // - Capturar y manejar errores de validación o de base de datos
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

// Obtener carrera por ID
const getRaceById = async (req, res) => {
  // TODO:
  // - Extraer el ID de la carrera de req.params.id
  // - Validar que el ID tenga formato válido de MongoDB
  // - Buscar la carrera usando Race.findById(id)
  // - Opcionalmente, usar .populate('createdBy', 'name email') para incluir información del creador
  // - Si no existe la carrera, devolver 404 con mensaje "Carrera no encontrada"
  // - Si existe, devolver la carrera encontrada con código 200
  // - Manejar posibles errores de base de datos con try/catch
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

// Actualizar carrera
const updateRace = async (req, res) => {
  // TODO:
  // - Extraer el ID de la carrera de req.params.id
  // - Validar que el ID tenga formato válido de MongoDB
  // - Extraer los campos a actualizar del body
  // - Validar que los campos a actualizar sean válidos según el modelo:
  //   * Si se actualiza 'sport', debe ser uno de los valores permitidos
  //   * Si se actualizan campos numéricos, deben ser positivos
  //   * Si se actualiza 'classification', cada elemento debe tener 'runner' y 'mark'
  // - Verificar que no se intenten modificar campos protegidos como 'createdBy' o 'createdAt'
  // - Usar Race.findByIdAndUpdate con la opción { new: true, runValidators: true }
  // - Si no existe la carrera, devolver 404
  // - Si la actualización es exitosa, devolver la carrera actualizada con código 200
  // - Manejar errores de validación y de base de datos
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

// Eliminar carrera
const deleteRace = async (req, res) => {
  // TODO:
  // - Extraer el ID de la carrera de req.params.id
  // - Validar que el ID tenga formato válido de MongoDB
  // - Verificar si existen inscripciones asociadas a esta carrera consultando el modelo Registration
  // - Si hay inscripciones prestar demasiada atención para hacer un borrado lógico (status = deleted)
  // - Usar Race.findByIdAndDelete(id) para eliminar la carrera (de igual forma, borrado lógico)
  // - Si no existe la carrera, devolver 404 con mensaje adecuado
  // - Si la eliminación es exitosa, devolver mensaje de confirmación con código 200
  // - Manejar posibles errores de base de datos con try/catch
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


// Listar todas las carreras
const getAllRaces = async (req, res) => {


  // TODO:
  // - Obtener todas las carreras no eliminadas (status != 'deleted')
  // - Ordenar por fecha (próximas primero)
  // - Implementar paginación
  // - Opcionalmente, usar populate para incluir información básica del creador
  // - Devolver la lista de carreras
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

// Filtrar carreras por fecha
const getRacesByDate = async (req, res) => {
  

  // TODO:
  // - Extraer fecha de req.params.date
  // - Validar formato de fecha
  // - Buscar carreras en esa fecha
  // - Ordenar resultados
  // - Devolver lista de carreras
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

// Filtrar carreras por ubicación
const getRacesByLocation = async (req, res) => {
  

  // TODO:
  // - Extraer ubicación de req.params.location
  // - Usar expresión regular para búsqueda parcial (case insensitive)
  // - Ordenar resultados por fecha (próximas primero)
  // - Devolver lista de carreras
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


// Registrar resultados de carrera
const registerRaceResults = async (req, res) => {

  // TODO:
  // - Extraer el ID de la carrera
  // - Validar formato del ID
  // - Extraer los resultados del body (array de {userId, time, position})
  // - Validar formato de los resultados
  // - Actualizar el estado de la carrera a 'finished'
  // - Actualizar las inscripciones relacionadas con los resultados
  // - Devolver confirmación de los resultados registrados
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

// Obtener resultados de carrera
const getRaceResults = async (req, res) => {

  // TODO:
  // - Extraer el ID de la carrera
  // - Validar formato del ID
  // - Buscar inscripciones de esa carrera que tengan resultados (status = 'finished')
  // - Ordenar por posición o tiempo
  // - Poblar información de usuarios
  // - Devolver lista de resultados
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


export {
  getAllRaces,
  getRacesByDate,
  getRacesByLocation,
  getRacesBySport,
  createRace,
  getRaceById,
  updateRace,
  deleteRace,
  registerRaceResults,
  getRaceResults,
};