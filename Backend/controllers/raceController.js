import Race from "../models/Race.js";
import mongoose from "mongoose";
import Registration from "../models/Registrations.js";

// Importaciones para archivos CSV
import fs from "fs";
import path from "path";
import Papa from "papaparse";
const { parse, unparse } = Papa;
import User from "../models/User.js";


// Importaciones para archivos GPX
import { analyzeGPXFile, validateGPXFile } from "../utils/gpxUtils.js";

/**
 * Funciones auxiliares para validaciones comunes
 */

// Validar formato de ID de MongoDB
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Validar deporte (enum)
const isValidSport = (sport) => {
  const validSports = ["running", "trailRunning", "cycling"];
  return validSports.includes(sport);
};

// Validar y parsear fecha
const validateAndParseDate = (dateString) => {
  // Para formato YYYY-MM-DD
  if (typeof dateString === "string") {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return {
        valid: false,
        message: "Formato de fecha inválido. Debe ser YYYY-MM-DD",
      };
    }
  }

  const parsedDate = new Date(dateString);
  if (isNaN(parsedDate.getTime())) {
    return { valid: false, message: "Fecha inválida" };
  }

  return { valid: true, date: parsedDate };
};

// Validar formato de tiempo
const isValidTimeFormat = (time) => {
  const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
  return timeRegex.test(time);
};

// Convertir formato de tiempo HH:mm:ss a Date
const timeStringToDate = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return new Date(1970, 0, 1, hours, minutes, seconds);
};

// Convertir Date a formato de tiempo HH:mm:ss
const dateToTimeString = (date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

// Función auxiliar para verificar y actualizar el estado de la carrera según inscripciones
const checkAndUpdateRaceStatus = async (raceId) => {
  try {
    const race = await Race.findById(raceId);
    if (!race || race.status !== 'open') return;

    const registrationsCount = await Registration.countDocuments({
      race: raceId,
      status: 'registered'
    });

    if (registrationsCount >= race.maxParticipants) {
      race.status = 'closed';
      await race.save();
      console.log(`Carrera ${race.name} cerrada automáticamente por alcanzar el límite de participantes`);
    }
  } catch (error) {
    console.error('Error al verificar estado de la carrera:', error);
  }
};

/**
 * Obtener todas las carreras con paginación
 * @route GET /api/races
 */
const getAllRaces = async (req, res) => {
  try {
    // Parámetros de paginación y filtros
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sport = req.query.sport;
    const location = req.query.location;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: "Los parámetros de paginación deben ser números positivos",
      });
    }

    const skip = (page - 1) * limit;

    // Construir el filtro base
    let filter = { status: { $ne: "deleted" } };

    // Añadir filtros adicionales si existen
    if (sport && isValidSport(sport)) {
      filter.sport = sport;
    }

    if (location) {
      filter.location = { $regex: new RegExp(location, "i") };
    }

    // Ejecutar consulta con paginación
    const races = await Race.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ date: 1 });

    const totalRaces = await Race.countDocuments(filter);
    const totalPages = Math.ceil(totalRaces / limit);

    return res.status(200).json({
      races,
      pagination: {
        totalRaces,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error en getAllRaces:", error);
    return res.status(500).json({
      message: "Error al obtener las carreras",
      error: error.message,
    });
  }
};

/**
 * Filtrar carreras por deporte
 * @route GET /api/races/sport/:sport
 */
const getRacesBySport = async (req, res) => {
  try {
    const { sport } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!isValidSport(sport)) {
      return res.status(400).json({
        message:
          "Tipo de deporte inválido. Opciones válidas: running, trailRunning, cycling",
      });
    }

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: "Los parámetros de paginación deben ser números positivos",
      });
    }

    const skip = (page - 1) * limit;

    // Filtrar también las carreras eliminadas
    const filter = { sport, status: { $ne: "deleted" } };

    const races = await Race.find(filter)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    const totalRaces = await Race.countDocuments(filter);
    const totalPages = Math.ceil(totalRaces / limit);

    if (races.length === 0 && page === 1) {
      return res.status(404).json({
        message: "No hay carreras disponibles para este deporte",
      });
    }

    return res.status(200).json({
      races,
      pagination: {
        totalRaces,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error en getRacesBySport:", error);
    return res.status(500).json({
      message: "Error al obtener las carreras por deporte",
      error: error.message,
    });
  }
};

/**
 * Crear una nueva carrera
 * @route POST /api/races
 */
const createRace = async (req, res) => {
  try {
    const {
      name,
      sport,
      date,
      location,
      distance,
      maxParticipants,
      unevenness,
      tour,
      qualifyingTime,
    } = req.body;

    // Verificar permisos
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "No tienes permisos para crear carreras",
      });
    }

    // Validaciones de datos
    if (
      !name ||
      !sport ||
      !date ||
      !location ||
      !distance ||
      !maxParticipants ||
      !unevenness ||
      !tour ||
      !qualifyingTime
    ) {
      return res.status(400).json({
        message: "Todos los campos son requeridos",
      });
    }

    // Validar formato de fecha
    const dateValidation = validateAndParseDate(date);
    if (!dateValidation.valid) {
      return res.status(400).json({
        message: dateValidation.message,
      });
    }

    // Validar deporte
    if (!isValidSport(sport)) {
      return res.status(400).json({
        message:
          "Tipo de deporte inválido. Opciones válidas: running, trailRunning, cycling",
      });
    }

    // Validar valores numéricos
    if (distance <= 0 || maxParticipants <= 0 || unevenness <= 0) {
      return res.status(400).json({
        message: "Los valores numéricos deben ser positivos",
      });
    }

    // Validar formato de tiempo de calificación
    if (!isValidTimeFormat(qualifyingTime)) {
      return res.status(400).json({
        message: "Formato de tiempo de calificación inválido. Use HH:mm:ss",
      });
    }

    // Verificar si ya existe una carrera con el mismo nombre y fecha
    const existingRace = await Race.findOne({
      name,
      date: dateValidation.date,
      status: { $ne: "deleted" },
    });

    if (existingRace) {
      return res.status(400).json({
        message: "Ya existe una carrera con el mismo nombre y fecha",
      });
    }

    // Crear y guardar la nueva carrera
    const race = new Race({
      name,
      sport,
      date: dateValidation.date,
      location,
      distance,
      maxParticipants,
      unevenness,
      tour,
      qualifyingTime,
      createdBy: req.user.id,
      status: "open",
      createdAt: new Date(),
    });

    await race.save();

    // Verificar si ya hay suficientes inscripciones para cerrar la carrera
    await checkAndUpdateRaceStatus(race._id);

    return res.status(201).json({
      message: "Carrera creada exitosamente",
      race,
    });
  } catch (error) {
    console.error("Error en createRace:", error);
    return res.status(500).json({
      message: "Error al crear la carrera",
      error: error.message,
    });
  }
};

/**
 * Obtener detalle de una carrera por ID
 * @route GET /api/races/:id
 */
const getRaceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID de carrera inválido",
      });
    }

    const race = await Race.findOne({
      _id: id,
      status: { $ne: "deleted" },
    }).populate("createdBy", "name email");

    if (!race) {
      return res.status(404).json({
        message: "Carrera no encontrada",
      });
    }

    // Obtener información adicional: número de inscripciones
    const registrationsCount = await Registration.countDocuments({
      race: id,
      status: "registered",
    });

    // Calcular plazas disponibles
    const availableSlots = race.maxParticipants - registrationsCount;

    // Añadir información adicional
    const raceWithDetails = {
      ...race.toObject(),
      registrationsCount,
      availableSlots,
      // Añadidos archivos GPX
      gpx: {
        available: race.hasGPXFile,
        fileName: race.gpxFileName || null,
        uploadedAt: race.gpxFileUploadedAt || null
      }
    };

    return res.status(200).json(raceWithDetails);
  } catch (error) {
    console.error("Error en getRaceById:", error);
    return res.status(500).json({
      message: "Error al obtener la carrera",
      error: error.message,
    });
  }
};

/**
 * Actualizar una carrera existente
 * @route PUT /api/races/:id
 */
const updateRace = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = { ...req.body };

    // Verificar permisos
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "No tienes permisos para actualizar carreras",
      });
    }

    // Validar ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID de carrera inválido",
      });
    }

    // Proteger campos que no deben modificarse
    const protectedFields = ["createdBy", "createdAt"];
    protectedFields.forEach((field) => {
      if (updateFields[field]) {
        delete updateFields[field];
      }
    });

    // Validar deporte si se está actualizando
    if (updateFields.sport && !isValidSport(updateFields.sport)) {
      return res.status(400).json({
        message:
          "Tipo de deporte inválido. Opciones válidas: running, trailRunning, cycling",
      });
    }

    // Validar valores numéricos si se están actualizando
    const numericFields = ["distance", "maxParticipants", "unevenness"];
    for (const field of numericFields) {
      if (updateFields[field] !== undefined && updateFields[field] <= 0) {
        return res.status(400).json({
          message: `El campo ${field} debe ser un número positivo`,
        });
      }
    }

    // Validar fecha si se está actualizando
    if (updateFields.date) {
      const dateValidation = validateAndParseDate(updateFields.date);
      if (!dateValidation.valid) {
        return res.status(400).json({
          message: dateValidation.message,
        });
      }
      updateFields.date = dateValidation.date;
    }

    // Validar tiempo de calificación si se está actualizando
    if (
      updateFields.qualifyingTime &&
      !isValidTimeFormat(updateFields.qualifyingTime)
    ) {
      return res.status(400).json({
        message: "Formato de tiempo de calificación inválido. Use HH:mm:ss",
      });
    }

    // Validar classification si se está actualizando
    if (updateFields.classification) {
      if (!Array.isArray(updateFields.classification)) {
        return res.status(400).json({
          message: "El campo classification debe ser un array",
        });
      }

      const isValid = updateFields.classification.every(
        (item) => item.runner && item.mark && typeof item.mark === "number"
      );

      if (!isValid) {
        return res.status(400).json({
          message:
            "classification debe contener 'runner' y 'mark' (número) en todos los elementos",
        });
      }
    }

    // Verificar si la carrera existe
    const existingRace = await Race.findOne({
      _id: id,
      status: { $ne: "deleted" },
    });

    if (!existingRace) {
      return res.status(404).json({
        message: "Carrera no encontrada",
      });
    }

    // Verificar si hay inscripciones si se intenta reducir maxParticipants
    if (
      updateFields.maxParticipants &&
      updateFields.maxParticipants < existingRace.maxParticipants
    ) {
      const registrationsCount = await Registration.countDocuments({
        race: id,
        status: "registered",
      });

      if (updateFields.maxParticipants < registrationsCount) {
        return res.status(400).json({
          message: `No se puede reducir el número máximo de participantes por debajo del número actual de inscripciones (${registrationsCount})`,
        });
      }
    }

    // Actualizar la carrera
    const updatedRace = await Race.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "Carrera actualizada exitosamente",
      race: updatedRace,
    });
  } catch (error) {
    console.error("Error en updateRace:", error);
    return res.status(500).json({
      message: "Error al actualizar la carrera",
      error: error.message,
    });
  }
};

/**
 * Eliminar (marcar como eliminada) una carrera
 * @route DELETE /api/races/:id
 */
const deleteRace = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar permisos
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "No tienes permisos para eliminar carreras",
      });
    }

    // Validar ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID de carrera inválido",
      });
    }

    // Buscar la carrera
    const race = await Race.findById(id);
    if (!race) {
      return res.status(404).json({
        message: "Carrera no encontrada",
      });
    }

    if (race.status === "deleted") {
      return res.status(400).json({
        message: "Esta carrera ya ha sido eliminada",
      });
    }

    // Actualizar inscripciones
    const registrations = await Registration.find({ race: id });
    if (registrations.length > 0) {
      // Cancelar inscripciones pendientes
      await Registration.updateMany(
        { race: id, status: "registered" },
        { $set: { status: "cancelled" } }
      );

      // No modificar inscripciones ya finalizadas
    }

    // Marcar carrera como eliminada
    race.status = "deleted";
    await race.save();

    return res.status(200).json({
      message: "Carrera eliminada correctamente",
      affectedRegistrations: registrations.length,
    });
  } catch (error) {
    console.error("Error en deleteRace:", error);
    return res.status(500).json({
      message: "Error al eliminar la carrera",
      error: error.message,
    });
  }
};

/**
 * Filtrar carreras por fecha
 * @route GET /api/races/date/:date
 */
const getRacesByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Validar formato de fecha
    const dateValidation = validateAndParseDate(date);
    if (!dateValidation.valid) {
      return res.status(400).json({
        message: dateValidation.message,
      });
    }

    // Ajustar para buscar en todo el día
    const parsedDate = dateValidation.date;
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    // Configurar paginación
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: "Los parámetros de paginación deben ser números positivos",
      });
    }

    const skip = (page - 1) * limit;

    // Filtrar carreras por fecha y que no estén eliminadas
    const filter = {
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $ne: "deleted" },
    };

    const races = await Race.find(filter)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    const totalRaces = await Race.countDocuments(filter);
    const totalPages = Math.ceil(totalRaces / limit);

    if (races.length === 0 && page === 1) {
      return res.status(404).json({
        message: "No hay carreras disponibles para esta fecha",
      });
    }

    return res.status(200).json({
      races,
      pagination: {
        totalRaces,
        totalPages,
        currentPage: page,
        limit,
        date: startOfDay.toISOString().split("T")[0],
      },
    });
  } catch (error) {
    console.error("Error en getRacesByDate:", error);
    return res.status(500).json({
      message: "Error al obtener las carreras por fecha",
      error: error.message,
    });
  }
};

/**
 * Filtrar carreras por ubicación
 * @route GET /api/races/location/:location
 */
const getRacesByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!location || location.trim() === "") {
      return res.status(400).json({
        message: "Se requiere especificar una ubicación válida",
      });
    }

    // Configurar paginación
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: "Los parámetros de paginación deben ser números positivos",
      });
    }

    const skip = (page - 1) * limit;

    // Búsqueda insensible a mayúsculas/minúsculas
    const regex = new RegExp(location, "i");

    // Filtrar también las carreras eliminadas
    const filter = {
      location: { $regex: regex },
      status: { $ne: "deleted" },
    };

    const races = await Race.find(filter)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    const totalRaces = await Race.countDocuments(filter);
    const totalPages = Math.ceil(totalRaces / limit);

    if (races.length === 0 && page === 1) {
      return res.status(404).json({
        message: "No hay carreras disponibles en esta ubicación",
      });
    }

    return res.status(200).json({
      races,
      pagination: {
        totalRaces,
        totalPages,
        currentPage: page,
        limit,
        location,
      },
    });
  } catch (error) {
    console.error("Error en getRacesByLocation:", error);
    return res.status(500).json({
      message: "Error al obtener las carreras por ubicación",
      error: error.message,
    });
  }
};

/**
 * Registrar resultados de una carrera
 * @route POST /api/races/:id/results
 */
const registerRaceResults = async (req, res) => {
  try {
    const { id } = req.params;
    const { results } = req.body;

    // Verificar permisos
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "No tienes permisos para registrar resultados",
      });
    }

    // Validar ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID de carrera inválido",
      });
    }

    // Validar array de resultados
    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({
        message: "Se requiere un array de resultados válido",
      });
    }

    // Buscar la carrera
    const race = await Race.findById(id);
    if (!race) {
      return res.status(404).json({
        message: "Carrera no encontrada",
      });
    }

    if (race.status === "deleted") {
      return res.status(400).json({
        message: "No se pueden registrar resultados para una carrera eliminada",
      });
    }

    // Verificar que todas las inscripciones existan
    const userIds = results.map((result) => result.userId);
    const existingRegistrations = await Registration.find({
      race: id,
      user: { $in: userIds },
      status: "registered",
    });

    const existingUserIds = existingRegistrations.map((reg) =>
      reg.user.toString()
    );
    const missingUserIds = userIds.filter(
      (userId) => !existingUserIds.includes(userId)
    );

    if (missingUserIds.length > 0) {
      return res.status(400).json({
        message: `Los siguientes usuarios no están inscritos en esta carrera: ${missingUserIds.join(
          ", "
        )}`,
      });
    }

    // Validar cada resultado
    for (let result of results) {
      const { userId, time, position } = result;

      // Validar ID de usuario
      if (!isValidObjectId(userId)) {
        return res.status(400).json({
          message: `ID de usuario inválido: ${userId}`,
        });
      }

      // Validar formato de tiempo
      if (!isValidTimeFormat(time)) {
        return res.status(400).json({
          message: `Formato de tiempo inválido para usuario ${userId}: ${time} (debe ser HH:mm:ss)`,
        });
      }

      // Validar posición
      if (
        typeof position !== "number" ||
        position <= 0 ||
        !Number.isInteger(position)
      ) {
        return res.status(400).json({
          message: `La posición para usuario ${userId} debe ser un número entero positivo`,
        });
      }
    }

    // Verificar posiciones duplicadas
    const positions = results.map((r) => r.position);
    if (new Set(positions).size !== positions.length) {
      return res.status(400).json({
        message: "Hay posiciones duplicadas en los resultados",
      });
    }

    // Cambiar el estado de la carrera a finalizada
    race.status = "finished";
    await race.save();

    // Actualizar las inscripciones con los resultados
    const updatedRegistrations = [];
    for (let result of results) {
      const { userId, time, position } = result;

      const registration = await Registration.findOneAndUpdate(
        { race: id, user: userId },
        {
          time,
          position,
          status: "finished",
        },
        { new: true }
      );

      updatedRegistrations.push(registration);
    }

    // Enviar emails en segundo plano (para no hacer esperar a la respuesta API)
    const sendEmails = async () => {
      let successCount = 0;
      let errorCount = 0;

      for (let result of results) {
        const { userId, time, position } = result;

        try {
          // Obtener datos completos del usuario
          const user = await User.findById(userId);

          if (user && user.email) {
            const success = await sendRaceResultsEmail(user, race, {
              time,
              position,
            });
            if (success) successCount++;
            else errorCount++;
          }
        } catch (emailError) {
          console.error(
            `Error al procesar email para usuario ${userId}:`,
            emailError
          );
          errorCount++;
        }
      }

      console.log(
        `Envío de emails completado: ${successCount} exitosos, ${errorCount} fallidos`
      );
    };

    // Iniciar el proceso de envío sin esperar
    // (no bloqueará la respuesta de la API)
    sendEmails().catch((e) =>
      console.error("Error en el proceso de envío de emails:", e)
    );

    // Responder inmediatamente al cliente
    return res.status(200).json({
      message: "Resultados registrados correctamente",
      raceId: id,
      raceName: race.name,
      totalResults: results.length,
      emailsScheduled: true,
      results: results.map((r) => ({
        userId: r.userId,
        position: r.position,
        time: r.time,
      })),
    });
  } catch (error) {
    console.error("Error en registerRaceResults:", error);
    return res.status(500).json({
      message: "Error al registrar los resultados",
      error: error.message,
    });
  }
};

/**
 * Obtener resultados de una carrera
 * @route GET /api/races/:id/results
 */
const getRaceResults = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "ID de carrera inválido",
      });
    }

    // Verificar que la carrera exista
    const race = await Race.findById(id);
    if (!race) {
      return res.status(404).json({
        message: "Carrera no encontrada",
      });
    }

    // Obtener resultados
    const results = await Registration.find({
      race: id,
      status: "finished",
    })
      .populate("user", "name email age")
      .sort({ position: 1 });

    if (results.length === 0) {
      return res.status(404).json({
        message: "No se encontraron resultados para esta carrera",
      });
    }

    // Formatear resultados para incluir información de la carrera
    const formattedResults = {
      race: {
        id: race._id,
        name: race.name,
        date: race.date,
        sport: race.sport,
        distance: race.distance,
        location: race.location,
      },
      results: results.map((result) => ({
        position: result.position,
        user: result.user,
        time: result.time,
        registrationId: result._id,
      })),
    };

    return res.status(200).json(formattedResults);
  } catch (error) {
    console.error("Error en getRaceResults:", error);
    return res.status(500).json({
      message: "Error al obtener los resultados de la carrera",
      error: error.message,
    });
  }
};


/**
 * Descargar el CSV con dorsales para rellenar tiempos
 * @route GET /api/races/:id/runners-csv
 */
const downloadRunnersCSV = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "ID de carrera inválido" });
    }

    // Verificar que la carrera existe
    const race = await Race.findById(id);
    if (!race) {
      return res.status(404).json({ message: "Carrera no encontrada" });
    }

    // Verificar que el usuario es el creador o un admin
    if (race.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "No tienes permisos para descargar datos de esta carrera" });
    }
    
    // Obtener todas las inscripciones de la carrera
    const registrations = await Registration.find({
      race: id,
      status: 'registered'
    }).populate('user', 'email name');
    
    if (registrations.length === 0) {
      return res.status(404).json({ message: "No hay inscripciones registradas para esta carrera" });
    }
    
    // Preparar datos para el CSV
    const csvData = registrations.map(reg => ({
      email: reg.user.email,
      nombre: reg.user.name,
      dorsal: reg.dorsal || '',
      tiempo: ''
    }));
    
    // Generar CSV
    const csvString = Papa.unparse(csvData);
    
    // Determinar nombre del archivo
    const filename = `resultados_${race.name.replace(/\s+/g, '_')}.csv`;
    
    // Configurar encabezados para descarga
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Enviar el archivo
    return res.send(csvString);
  } catch (error) {
    console.error('Error en downloadRunnersCSV:', error);
    return res.status(500).json({
      message: "Error al descargar datos para resultados",
      error: error.message
    });
  }
};

/**
 * Subir CSV con tiempos de los corredores
 * @route POST /api/races/:id/results-csv
 */
const uploadResultsCSV = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }

    if (!isValidObjectId(id)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "ID de carrera inválido" });
    }

    // Verificar que la carrera existe y el usuario tiene permisos
    const race = await Race.findById(id);
    if (!race) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Carrera no encontrada" });
    }

    // Verificar que el usuario es el creador o un admin
    if (race.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ message: "No tienes permisos para subir resultados a esta carrera" });
    }

    // Procesar el CSV
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    const csvData = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true
    });

    // Validar estructura del CSV
    if (!csvData.data.length) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "El archivo CSV está vacío o tiene un formato incorrecto" });
    }

    // Verificar que todas las columnas necesarias existen
    const requiredColumns = ['email', 'dorsal', 'tiempo'];
    const missingColumns = requiredColumns.filter(col => !csvData.meta.fields.includes(col));
    
    if (missingColumns.length > 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        message: `El CSV no tiene las columnas requeridas: ${missingColumns.join(', ')}` 
      });
    }

    // Validar tiempos y dorsales
    const errors = [];
    const results = [];
    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    
    for (let i = 0; i < csvData.data.length; i++) {
      const row = csvData.data[i];
      
      // Solo procesar si tiene tiempo
      if (row.tiempo && row.tiempo.trim() !== '') {
        // Validar formato de tiempo
        if (!timeRegex.test(row.tiempo)) {
          errors.push(`Fila ${i+1}: Formato de tiempo inválido (${row.tiempo}). Use formato HH:mm:ss`);
          continue;
        }
        
        // Buscar usuario por email
        const user = await User.findOne({ email: row.email });
        
        if (!user) {
          errors.push(`Fila ${i+1}: No se encontró ningún usuario con el email ${row.email}`);
          continue;
        }
        
        // Verificar si está inscrito
        const registration = await Registration.findOne({ 
          user: user._id,
          race: race._id,
          status: 'registered'
        });
        
        if (!registration) {
          errors.push(`Fila ${i+1}: El usuario ${row.email} no está inscrito en esta carrera`);
          continue;
        }
        
        // Verificar que el dorsal coincide
        if (registration.dorsal && registration.dorsal.toString() !== row.dorsal) {
          errors.push(`Fila ${i+1}: El dorsal ${row.dorsal} no coincide con el asignado (${registration.dorsal}) al usuario ${row.email}`);
          continue;
        }
        
        // Añadir a la lista de resultados
        results.push({
          userId: user._id.toString(),
          time: row.tiempo,
          position: i + 1, // Posición basada en el orden del CSV
          dorsal: parseInt(row.dorsal)
        });
      }
    }
    
    // Si hay errores, no continuar
    if (errors.length > 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        message: "El CSV contiene errores", 
        errors 
      });
    }
    
    // Si no hay resultados con tiempo
    if (results.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        message: "No se encontraron tiempos válidos en el CSV" 
      });
    }

    // Marcar la carrera como finalizada
    race.status = "finished";
    await race.save();

    // Actualizar las inscripciones con los resultados
    for (const result of results) {
      await Registration.updateOne(
        { race: id, user: result.userId },
        { 
          $set: { 
            time: result.time,
            position: result.position,
            status: "finished",
            dorsal: result.dorsal
          } 
        }
      );
    }

    // Guardar el nuevo CSV reemplazando el anterior
    if (race.runnersCSVPath && fs.existsSync(race.runnersCSVPath)) {
      fs.unlinkSync(race.runnersCSVPath);
    }
    
    // Almacenar el nuevo CSV
    race.runnersCSVPath = req.file.path;
    race.lastCSVUpdate = new Date();
    await race.save();

    const sendEmails = async () => {
      let successCount = 0;
      let errorCount = 0;
      
      for (const result of results) {
        try {
          const user = await User.findById(result.userId);
          if (user && user.email) {
            const success = await sendRaceResultsEmail(user, race, {
              time: result.time,
              position: result.position
            });
            
            if (success) successCount++;
            else errorCount++;
          }
        } catch (emailError) {
          console.error(`Error al enviar email al usuario ${result.userId}:`, emailError);
          errorCount++;
        }
      }
      
      console.log(`Envío de emails completado: ${successCount} exitosos, ${errorCount} fallidos`);
    };
    
    // Iniciar proceso de envío de emails sin bloquear
    sendEmails().catch(e => console.error('Error en proceso de envío de emails:', e));

    return res.status(200).json({
      message: "Resultados procesados correctamente",
      raceId: id,
      raceName: race.name,
      totalResults: results.length,
      emailsScheduled: true
    });
  } catch (error) {
    console.error('Error en uploadResultsCSV:', error);
    
    // Eliminar archivo si existe
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({
      message: "Error al procesar el CSV de resultados",
      error: error.message
    });
  }
};

/**
 * Carga un archivo GPX para una carrera específica y extrae información
 * @route POST /api/races/:id/gpx
 */
const uploadGPXFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { updateRaceInfo } = req.body; // Flag para indicar si actualizar información de la carrera
    
    // Verificar si hay un archivo
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo GPX" });
    }

    // Validar ID de carrera
    if (!isValidObjectId(id)) {
      // Eliminar el archivo si existe
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "ID de carrera inválido" });
    }

    // Verificar que la carrera existe
    const race = await Race.findById(id);
    if (!race) {
      // Eliminar el archivo si existe
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: "Carrera no encontrada" });
    }

    // Verificar permisos (si el usuario es un admin)
    if (req.user.role !== "admin") {
      // Eliminar el archivo si existe
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({ 
        message: "No tienes permisos para subir archivos GPX"
      });
    }

    // Analizar el archivo GPX para extraer información
    let gpxInfo = null;
    try {
      gpxInfo = await analyzeGPXFile(req.file.path);
    } catch (gpxError) {
      // Si hay un error al analizar el GPX, es posible que el archivo no sea válido
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        message: "El archivo GPX no es válido o está corrupto",
        error: gpxError.message
      });
    }

    // Si ya existía un archivo GPX previo, eliminarlo
    if (race.gpxFilePath && fs.existsSync(race.gpxFilePath)) {
      fs.unlinkSync(race.gpxFilePath);
    }

    // Actualizar la información de la carrera con los datos del nuevo archivo GPX
    race.hasGPXFile = true;
    race.gpxFilePath = req.file.path;
    race.gpxFileUploadedAt = new Date();
    race.gpxFileName = req.file.originalname || path.basename(req.file.path);
    
    // Si se solicitó actualizar la información de la carrera basada en el GPX
    if (updateRaceInfo === 'true' && gpxInfo) {
      // Solo actualizar campos si los valores del GPX son razonables
      if (gpxInfo.totalDistance > 0) {
        race.distance = gpxInfo.totalDistance;
      }
      
      if (gpxInfo.elevationGain > 0) {
        race.unevenness = gpxInfo.elevationGain;
      }
      
      // Actualizar el campo 'tour' si tiene un nombre en el GPX
      if (gpxInfo.name && gpxInfo.name !== 'Sin nombre') {
        race.tour = gpxInfo.name;
      }
    }
    
    await race.save();

    return res.status(200).json({
      message: "Archivo GPX subido correctamente",
      race: {
        id: race._id,
        name: race.name,
        gpxFileName: race.gpxFileName,
        gpxFileUploadedAt: race.gpxFileUploadedAt
      },
      gpxInfo: gpxInfo // Devolver la información extraída del GPX
    });
  } catch (error) {
    console.error("Error en uploadGPXFile:", error);
    
    // Eliminar archivo si existe y hay un error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({
      message: "Error al subir el archivo GPX",
      error: error.message
    });
  }
};

/**
 * Descarga el archivo GPX de una carrera
 * @route GET /api/races/:id/gpx
 */
const downloadGPXFile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar ID de carrera
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "ID de carrera inválido" });
    }

    // Verificar que la carrera existe
    const race = await Race.findById(id);
    if (!race) {
      return res.status(404).json({ message: "Carrera no encontrada" });
    }

    // Verificar si la carrera tiene un archivo GPX
    if (!race.hasGPXFile || !race.gpxFilePath) {
      return res.status(404).json({ message: "Esta carrera no tiene archivo GPX disponible" });
    }

    // Verificar que el archivo existe en el sistema de archivos
    if (!fs.existsSync(race.gpxFilePath)) {
      return res.status(404).json({ message: "El archivo GPX no se encuentra disponible" });
    }

    // Nombre del archivo para la descarga (usar el nombre original si está disponible)
    const fileName = race.gpxFileName || `route-${race.name.replace(/\s+/g, '_')}.gpx`;

    // Configurar los encabezados para la descarga
    res.setHeader('Content-Type', 'application/gpx+xml');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Crear un stream de lectura y enviarlo como respuesta
    const fileStream = fs.createReadStream(race.gpxFilePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error en downloadGPXFile:", error);
    return res.status(500).json({
      message: "Error al descargar el archivo GPX",
      error: error.message
    });
  }
};

/**
 * Elimina el archivo GPX de una carrera (solo admin)
 * @route DELETE /api/races/:id/gpx
 */
const deleteGPXFile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar ID de carrera
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "ID de carrera inválido" });
    }

    // Verificar que la carrera existe
    const race = await Race.findById(id);
    if (!race) {
      return res.status(404).json({ message: "Carrera no encontrada" });
    }

    // Verificar permisos (si el usuario es un admin)
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        message: "No tienes permisos para eliminar archivos GPX" 
      });
    }

    // Verificar si la carrera tiene un archivo GPX
    if (!race.hasGPXFile || !race.gpxFilePath) {
      return res.status(404).json({ message: "Esta carrera no tiene archivo GPX para eliminar" });
    }

    // Eliminar el archivo del sistema de archivos
    if (fs.existsSync(race.gpxFilePath)) {
      fs.unlinkSync(race.gpxFilePath);
    }

    // Actualizar la información de la carrera
    race.hasGPXFile = false;
    race.gpxFilePath = null;
    race.gpxFileUploadedAt = null;
    race.gpxFileName = null;
    
    await race.save();

    return res.status(200).json({
      message: "Archivo GPX eliminado correctamente",
      raceId: race._id
    });
  } catch (error) {
    console.error("Error en deleteGPXFile:", error);
    return res.status(500).json({
      message: "Error al eliminar el archivo GPX",
      error: error.message
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
  downloadRunnersCSV,
  uploadGPXFile,
  downloadGPXFile,
  deleteGPXFile,
};
