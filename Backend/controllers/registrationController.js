import mongoose from "mongoose";
import Registration from "../models/Registrations.js";
import Race from "../models/Race.js";
import User from "../models/User.js";

const createRegistration = async (req, res) => {
  try {
    const { raceId } = req.body;
    const userId = req.user._id;

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
      return res.status(400).json({ message: "La carrera no está abierta para inscripciones" });
    }

    // Verificar que la carrera no haya alcanzado su límite de participantes
    const registrationsCount = await Registration.countDocuments({ race: raceId });
    if (registrationsCount >= race.maxParticipants) {
      return res.status(400).json({ message: "La carrera ha alcanzado el número máximo de participantes" });
    }

    // Comprobar si el usuario ya está inscrito
    const existingRegistration = await Registration.findOne({ race: raceId, user: userId });
    if (existingRegistration) {
      return res.status(400).json({ message: "El usuario ya está inscrito en esta carrera" });
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

    // Populate the registration with race and user details before sending response
    const populatedRegistration = await Registration.findById(registration._id)
      .populate('race', 'name date sport')
      .populate('user', 'name email');

    return res.status(201).json({
      message: "Inscripción realizada exitosamente",
      registration: populatedRegistration
    });
  } catch (error) {
    console.log('Error details:', error); // For debugging
    return res.status(500).json({ 
      message: "Error al registrar la inscripción", 
      error: error.message 
    });
  }
};

// Obtener inscripciones del usuario
const getUserRegistrations = async (req, res) => {
   try {
     const userId = req.user._id;

     if (!req.user || !userId) {
      return res.status(401).json({ message: "No hay token de autenticación" });
    }
     const { status } = req.query;

     let query = { user: userId };
     if (status) {
       query.status = status;
     }
 
     const registrations = await Registration.find(query)
       .populate("race")
       .sort({ registeredAt: -1 });
 
     return res.status(200).json(registrations);

   } catch (error) {
     return res.status(500).json({
       message: "Error al obtener las inscripciones",
       error: error.message,
     });
   }
};

// Obtener inscripciones por carrera
const getRaceRegistrations = async (req, res) => {
  try {
    const raceId = req.params._id; 
    const userId = req.user._id; 

    if (!req.user) {
      return res.status(401).json({ message: "No hay token de autenticación" });
    }

    if(!userId){
      return res.status(404).json({ message: "Usuario no encontrado" })
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
    if (req.user.role !== "admin" || race.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "No tienes permisos para acceder a este recurso" });
    }

    // Buscar inscripciones asociadas a la carrera
    const registrations = await Registration.find({ race: raceId })
      .populate("user", "name email")
      .sort({ registeredAt: -1 });

    return res.status(200).json(registrations);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener las inscripciones",
      error: error.message,
    });
  }
};

// Actualizar inscripción con los resultados de la carrera (finished)
const updateRegistration = async (req, res) => {
  try {
    const registrationId = req.params._id;
    const { time, position } = req.body;

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "No tienes permisos para acceder a este recurso" });
    }

    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return res.status(400).json({ message: "ID de inscripción no válido" });
    }


    const registration = await Registration.findById(registrationId).populate("race");
    if (!registration) {
      return res.status(404).json({ message: "Inscripción no encontrada" });
    }

    if (registration.race.status !== "finished") {
      return res.status(400).json({ message: "La carrera no esta en estado finished" });
    }

    registration.time = time;
    registration.position = position;
    registration.status = "finished";
    await registration.save();

    return res.status(200).json(registration);
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar la inscripción",
      error: error.message,
    });
  }
};

// Cancelar inscripción
const cancelRegistration = async (req, res) => {
  try {
    const registrationId = req.params._id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return res.status(400).json({ message: "ID de inscripción no válido" });
    }


    const registration = await Registration.findById(registrationId).populate('race');
    
    if (!registration) {
      return res.status(404).json({ message: "Inscripción no encontrada" });
    }

    if (registration.user.toString() !== userId) {
      return res.status(403).json({ message: "No puedes cancelar una inscripción que no te pertenece" });
    }

  
    if (registration.status !== "registered") {
      return res.status(409).json({ message: "No se puede cancelar una inscripción ya finalizada o cancelada" });
    }


    if (new Date(registration.race.date) < new Date()) {
      return res.status(409).json({ message: "No se puede cancelar una inscripción cuando la carrera ya pasó" });
    }

  
    registration.status = "cancelled";
    await registration.save();

    return res.status(200).json({
      message: "Inscripción cancelada exitosamente",
      registration
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al cancelar la inscripción",
      error: error.message
    });
  }
};

// Actualizar inscripción con tiempo
const updateRegistrationTime = async (req, res) => {
  try {
    const registrationId = req.params._id; 
    const { time, position } = req.body;


    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
    }

 
    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return res.status(400).json({ message: "ID de inscripción no válido" });
    }


    const timeRegex = /^([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({ message: "Formato de tiempo inválido. Use HH:mm:ss" });
    }

  
    if (!Number.isInteger(position) || position <= 0) {
      return res.status(400).json({ message: "La posición debe ser un número entero positivo" });
    }

  
    const registration = await Registration.findById(registrationId).populate('race');
    if (!registration) {
      return res.status(404).json({ message: "Inscripción no encontrada" });
    }

    
    if (registration.race.status !== "finished") {
      return res.status(409).json({ message: "No se puede registrar tiempo para una carrera que no ha finalizado" });
    }

    registration.time = time;
    registration.position = position;
    registration.status = "finished";
    await registration.save();

    return res.status(200).json({
      message: "Tiempo registrado exitosamente",
      registration
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al registrar el tiempo",
      error: error.message
    });
  }
};

// Obtener todas las inscripciones (admin)
const getAllRegistrations = async (req, res) => {
  try {
    const { status, race, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (race) query.race = race;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    if (pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ message: "Parámetros de paginación inválidos" });
    }

    const skip = (pageNum - 1) * limitNum;

 
    const totalRegistrations = await Registration.countDocuments(query);
    const totalPages = Math.ceil(totalRegistrations / limitNum);


    const registrations = await Registration.find(query)
      .populate('race', 'name date sport')
      .populate('user', 'name email')
      .sort({ registeredAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      registrations,
      totalRegistrations,
      totalPages,
      currentPage: pageNum
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener las inscripciones",
      error: error.message
    });
  }
};


export {
  createRegistration,
  getUserRegistrations,
  getAllRegistrations,
  updateRegistrationTime,
  cancelRegistration,
};