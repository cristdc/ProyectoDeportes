import mongoose from "mongoose";
import Registration from "../models/Registrations.js";
import Race from "../models/Race.js";
import User from "../models/User.js";

/**
 * Crea una nueva inscripción para un usuario en una carrera
 * @route POST /api/registrations
 */
const createRegistration = async (req, res) => {
  try {
    const { raceId } = req.body;
    const userId = req.user.id; 

    // Validar que el ID de la carrera tenga formato válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(raceId)) {
      return res.status(400).json({ message: "ID de carrera no válido" });
    }

    // Verificar que la carrera exista
    const race = await Race.findById(raceId);
    if (!race) {
      return res.status(404).json({ message: "Carrera no encontrada" });
    }

    // Comprobar que la carrera tenga estado 'open'
    if (race.status !== "open") {
      return res
        .status(400)
        .json({ message: "La carrera no está abierta para inscripciones" });
    }

    // Verificar que la carrera no haya alcanzado su límite de participantes
    const registrationsCount = await Registration.countDocuments({
      race: raceId,
      status: "registered",
    });
    if (registrationsCount >= race.maxParticipants) {
      return res
        .status(400)
        .json({
          message: "La carrera ha alcanzado el número máximo de participantes",
        });
    }

    // Comprobar si el usuario ya está inscrito
    const existingRegistration = await Registration.findOne({
      race: raceId,
      user: userId,
      status: { $ne: "cancelled" }, // Ignorar inscripciones canceladas
    });

    if (existingRegistration) {
      return res
        .status(400)
        .json({ message: "El usuario ya está inscrito en esta carrera" });
    }

    // Crear nueva inscripción
    const registration = new Registration({
      race: raceId,
      user: userId,
      status: "registered",
      registeredAt: new Date(),
    });

    // Guardar inscripción en la base de datos
    await registration.save();

    const populatedRegistration = await Registration.findById(registration._id)
      .populate("race", "name date sport")
      .populate("user", "name email");

    return res.status(201).json({
      message: "Inscripción realizada exitosamente",
      registration: populatedRegistration,
    });
  } catch (error) {
    console.error("Error en createRegistration:", error);
    return res.status(500).json({
      message: "Error al registrar la inscripción",
      error: error.message,
    });
  }
};

/**
 * Obtiene las inscripciones del usuario autenticado
 * @route GET /api/registrations/user
 */
const getUserRegistrations = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { status, page = 1, limit = 10 } = req.query;

    // Verificar autenticación
    if (!req.user || !userId) {
      return res.status(401).json({ message: "No hay token de autenticación" });
    }

    // Construir query
    let query = { user: userId };
    if (status) {
      query.status = status;
    }

    // Aplicar paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res
        .status(400)
        .json({ message: "Parámetros de paginación inválidos" });
    }

    const skip = (pageNum - 1) * limitNum;

    // Contar total de registros para paginación
    const totalRegistrations = await Registration.countDocuments(query);
    const totalPages = Math.ceil(totalRegistrations / limitNum);

    // Obtener registros con paginación
    const registrations = await Registration.find(query)
      .populate("race", "name date sport location distance")
      .sort({ registeredAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      registrations,
      totalRegistrations,
      totalPages,
      currentPage: pageNum,
    });
  } catch (error) {
    console.error("Error en getUserRegistrations:", error);
    return res.status(500).json({
      message: "Error al obtener las inscripciones",
      error: error.message,
    });
  }
};

/**
 * Obtiene las inscripciones para una carrera específica (solo admin)
 * @route GET /api/registrations/race/:id
 */
const getRaceRegistrations = async (req, res) => {
  try {
    const raceId = req.params.id; 
    const userId = req.user.id; 
    const { status, page = 1, limit = 10 } = req.query;

    if (!req.user) {
      return res.status(401).json({ message: "No hay token de autenticación" });
    }

    if (!userId) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!mongoose.Types.ObjectId.isValid(raceId)) {
      return res.status(400).json({ message: "ID de carrera no válido" });
    }

    // Verificar que la carrera exista
    const race = await Race.findById(raceId);
    if (!race) {
      return res.status(404).json({ message: "Carrera no encontrada" });
    }

    // Verificar permisos (admin o creador de la carrera)
    if (req.user.role !== "admin" && race.createdBy.toString() !== userId) {
      
      return res
        .status(403)
        .json({ message: "No tienes permisos para acceder a este recurso" });
    }

    // Construir query
    let query = { race: raceId };
    if (status) {
      query.status = status;
    }

    // Aplicar paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res
        .status(400)
        .json({ message: "Parámetros de paginación inválidos" });
    }

    const skip = (pageNum - 1) * limitNum;

    // Contar total de registros para paginación
    const totalRegistrations = await Registration.countDocuments(query);
    const totalPages = Math.ceil(totalRegistrations / limitNum);

    // Buscar inscripciones asociadas a la carrera
    const registrations = await Registration.find(query)
      .populate("user", "name email age")
      .sort({ registeredAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      registrations,
      totalRegistrations,
      totalPages,
      currentPage: pageNum,
    });
  } catch (error) {
    console.error("Error en getRaceRegistrations:", error);
    return res.status(500).json({
      message: "Error al obtener las inscripciones",
      error: error.message,
    });
  }
};

/**
 * Actualiza una inscripción con los resultados de la carrera
 * @route PUT /api/registrations/:id
 */
const updateRegistration = async (req, res) => {
  try {
    const registrationId = req.params.id; 
    const { time, position } = req.body;

    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para acceder a este recurso" });
    }

    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return res.status(400).json({ message: "ID de inscripción no válido" });
    }

    const registration = await Registration.findById(registrationId).populate(
      "race"
    );
    if (!registration) {
      return res.status(404).json({ message: "Inscripción no encontrada" });
    }

    if (registration.race.status !== "finished") {
      return res
        .status(400)
        .json({ message: "La carrera no está en estado finished" });
    }

    registration.time = time;
    registration.position = position;
    registration.status = "finished";
    await registration.save();

    return res.status(200).json(registration);
  } catch (error) {
    console.error("Error en updateRegistration:", error);
    return res.status(500).json({
      message: "Error al actualizar la inscripción",
      error: error.message,
    });
  }
};

/**
 * Cancela una inscripción
 * @route PUT /api/registrations/:id/cancel
 */
const cancelRegistration = async (req, res) => {
  try {
    const registrationId = req.params.id; 
    const userId = req.user.id; 

    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return res.status(400).json({ message: "ID de inscripción no válido" });
    }

    const registration = await Registration.findById(registrationId).populate(
      "race"
    );

    if (!registration) {
      return res.status(404).json({ message: "Inscripción no encontrada" });
    }

    if (registration.user.toString() !== userId && req.user.role !== "admin") {
      // Permitir que admin también pueda cancelar
      return res
        .status(403)
        .json({
          message: "No puedes cancelar una inscripción que no te pertenece",
        });
    }

    if (registration.status !== "registered") {
      return res
        .status(409)
        .json({
          message:
            "No se puede cancelar una inscripción ya finalizada o cancelada",
        });
    }

    if (new Date(registration.race.date) < new Date()) {
      return res
        .status(409)
        .json({
          message:
            "No se puede cancelar una inscripción cuando la carrera ya pasó",
        });
    }

    registration.status = "cancelled";
    await registration.save();

    return res.status(200).json({
      message: "Inscripción cancelada exitosamente",
      registration,
    });
  } catch (error) {
    console.error("Error en cancelRegistration:", error);
    return res.status(500).json({
      message: "Error al cancelar la inscripción",
      error: error.message,
    });
  }
};

/**
 * Actualiza el tiempo y posición de una inscripción
 * @route PUT /api/registrations/:id/time
 */
const updateRegistrationTime = async (req, res) => {
  try {
    const registrationId = req.params.id; 
    const { time, position } = req.body;

    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para realizar esta acción" });
    }

    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return res.status(400).json({ message: "ID de inscripción no válido" });
    }

    // Validación del formato de tiempo
    const timeRegex = /^([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
    if (!timeRegex.test(time)) {
      return res
        .status(400)
        .json({ message: "Formato de tiempo inválido. Use HH:mm:ss" });
    }

    // Validación de la posición
    if (!Number.isInteger(Number(position)) || Number(position) <= 0) {
      return res
        .status(400)
        .json({ message: "La posición debe ser un número entero positivo" });
    }

    const registration = await Registration.findById(registrationId).populate(
      "race"
    );
    if (!registration) {
      return res.status(404).json({ message: "Inscripción no encontrada" });
    }

    if (registration.race.status !== "finished") {
      return res
        .status(409)
        .json({
          message:
            "No se puede registrar tiempo para una carrera que no ha finalizado",
        });
    }

    registration.time = time;
    registration.position = position;
    registration.status = "finished";
    await registration.save();

    return res.status(200).json({
      message: "Tiempo registrado exitosamente",
      registration,
    });
  } catch (error) {
    console.error("Error en updateRegistrationTime:", error);
    return res.status(500).json({
      message: "Error al registrar el tiempo",
      error: error.message,
    });
  }
};

/**
 * Obtiene todas las inscripciones (solo admin)
 * @route GET /api/registrations
 */
const getAllRegistrations = async (req, res) => {
  try {
    const { status, race, user, page = 1, limit = 10 } = req.query;

    // Construir query con todos los filtros
    let query = {};
    if (status) query.status = status;
    if (race) {
      if (!mongoose.Types.ObjectId.isValid(race)) {
        return res.status(400).json({ message: "ID de carrera no válido" });
      }
      query.race = race;
    }
    if (user) {
      if (!mongoose.Types.ObjectId.isValid(user)) {
        return res.status(400).json({ message: "ID de usuario no válido" });
      }
      query.user = user;
    }

    // Validar y aplicar paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res
        .status(400)
        .json({ message: "Parámetros de paginación inválidos" });
    }

    const skip = (pageNum - 1) * limitNum;

    // Contar total de registros para paginación
    const totalRegistrations = await Registration.countDocuments(query);
    const totalPages = Math.ceil(totalRegistrations / limitNum);

    // Obtener registros con paginación y populate
    const registrations = await Registration.find(query)
      .populate("race", "name date sport")
      .populate("user", "name email")
      .sort({ registeredAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      registrations,
      totalRegistrations,
      totalPages,
      currentPage: pageNum,
    });
  } catch (error) {
    console.error("Error en getAllRegistrations:", error);
    return res.status(500).json({
      message: "Error al obtener las inscripciones",
      error: error.message,
    });
  }
};

export {
  createRegistration,
  getUserRegistrations,
  getRaceRegistrations, 
  updateRegistration, 
  getAllRegistrations,
  updateRegistrationTime,
  cancelRegistration,
};