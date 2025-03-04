import Race from "../models/Race.js";
import mongoose from "mongoose";
import Registration from "../models/Registrations.js";

// Listar carreras por deporte
const getRacesBySport = async (req, res) => {
  try {
    const { sport } = req.params;
    
    if(sport !== "running" && sport !== "trailRunning" && sport !== "cycling"){
      return res.status(400).json({
        message: "Tipo de deporte inválido",
      });
    }
    
    const races = await Race.find({ sport }).sort({ date: 1 });

    if (races.length === 0) {
      return res.status(404).json({ message: 'No hay carreras en este deporte' });
    }

    return res.status(200).json(races);

  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener las carreras",
      error: error.message,
    });
  }
};

// Crear carrera
const createRace = async (req, res) => {
   try {
    const { name, sport, date, location, distance, maxParticipants, unevenness, tour, qualifyingTime } = req.body;

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "No tienes permisos para crear carreras",
      });
    }

    const existingRace = await Race.findOne(req.body);

    if (existingRace) {
        return res.status(400).json({ message: 'Ya existe una carrera con estos datos' });
    }

    const parsedDate = new Date(date);
    if(isNaN(parsedDate.getTime())){
      return res.status(400).json({
        message: "Formato de fecha inválido",
      });
    }

    if(sport !== "running" && sport !== "trailRunning" && sport !== "cycling"){
      return res.status(400).json({
        message: "Tipo de deporte inválido",
      });
    }

    if(distance <= 0 || maxParticipants <= 0 || unevenness <= 0){
      return res.status(400).json({
        message: "Los valores numéricos deben ser positivos",
      });
    }

    const race = new Race({
      name,
      sport,
      date: parsedDate,
      location,
      distance,
      maxParticipants,
      unevenness,
      tour,
      qualifyingTime,
      createdBy: req.user.id,
    });

    await race.save();

    return res.status(201).json(race);

   } catch (error) {
     return res.status(500).json({
       message: "Error al crear la carrera",
       error: error.message,
     });
   }
};

// Obtener carrera por ID
const getRaceById = async (req, res) => {
   try {
      const { id } = req.params;

      if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({ message: "ID de carrera inválido" });
      }

      const race = await Race.findById(id);
      
      if (!race) {
          return res.status(404).json({ message: 'Carrera no encontrada' });
      }

      await race.populate('createdBy', 'name email');

      return res.status(200).json(race);

   } catch (error) {
      return res.status(500).json({
        message: "Error al obtener la carrera",
        error: error.message,
      });
   }
};

// Actualizar carrera
const updateRace = async (req, res) => {
  try {
    const { id } = req.params;
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
      classification,
      createdBy,
      createdAt
    } = req.body;

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "No tienes permisos para acceder a este recurso",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "El id no es válido" });
    }

    if (createdBy || createdAt) {
      return res.status(400).json({
        message: "No puedes modificar los campos 'createdBy' o 'createdAt'",
      });
    }

    if (classification) {
      const isValid = classification.every(
        (item) => item.runner && item.mark
      );
      if (!isValid) {
        return res.status(400).json({
          message: "'classification' debe contener 'runner' y 'mark' en todos los elementos",
        });
      }
    }

    if (sport && sport !== "running" && sport !== "trailRunning" && sport !== "cycling") {
      return res.status(400).json({
        message: "El deporte no es válido, opciones permitidas: running, trailRunning, cycling",
      });
    }

    if (
      (distance && distance < 0) ||
      (maxParticipants && maxParticipants < 0) ||
      (unevenness && unevenness < 0)
    ) {
      return res.status(400).json({
        message: "Los valores numéricos deben ser positivos",
      });
    }

    if (date && !(date instanceof Date)) {
      return res.status(400).json({
        message: "'date' debe ser un formato de fecha válido",
      });
    }

    const updateFields = { ...req.body };

    if (updateFields.createdBy || updateFields.createdAt) {
      delete updateFields.createdBy;
      delete updateFields.createdAt;
    }

    const race = await Race.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!race) {
      return res.status(404).json({ message: "Carrera no encontrada" });
    }

    res.status(200).json(race);
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar la carrera",
      error: error.message,
    });
  }
};

// Eliminar carrera
const deleteRace = async (req, res) => {
   try {
     const { id } = req.params;
     
     if (!req.user || req.user.role !== "admin") {
       return res.status(403).json({
         message: "No tienes permisos para eliminar carreras",
       });
     }

     if(!mongoose.Types.ObjectId.isValid(id)){
       return res.status(400).json({ message: "El id no es válido" });
     }

     const race = await Race.findById(id);
     if (!race) {
       return res.status(404).json({ message: 'Carrera no encontrada' });
     }

     const registrations = await Registration.find({ race: id });

     if (registrations.length > 0) {
       await Registration.deleteMany({ race: id });
     }

     race.status = "deleted"

     await race.save();
     return res.status(200).json({ message: 'Carrera eliminada correctamente' });

   } catch (error) {
     return res.status(500).json({
       message: "Error al eliminar la carrera",
       error: error.message,
     });
   }
};

const getAllRaces = async (req, res) => {
  try {
    // Recibir parámetros de paginación
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    const races = await Race.find({ status: { $ne: 'deleted' } })
      .skip(skip)
      .limit(pageSize)
      .sort({ date: 1 });

    const totalRaces = await Race.countDocuments({ status: { $ne: 'deleted' } });

    const totalPages = Math.ceil(totalRaces / pageSize);

    res.status(200).json({
      races,
      pagination: {
        totalRaces,
        totalPages,
        currentPage: page,
        pageSize,
      },
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
  try {
    const { date } = req.params;
    
    // Validar formato de fecha YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        message: "Formato de fecha inválido",
      });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Formato de fecha inválido",
      });
    }

    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));
    
    const races = await Race.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ date: 1 });

    if (races.length === 0) {
        return res.status(404).json({ message: 'No hay carreras en esta fecha' });
    }

    return res.status(200).json(races);

  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener las carreras",
      error: error.message
    });
  }
};

// Filtrar carreras por ubicación
const getRacesByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const regex = new RegExp(location, 'i');
    
    const races = await Race.find({ location: { $regex: regex } }).sort({ date: 1 });

    if (races.length === 0) {
      return res.status(404).json({ message: 'No hay carreras en esta ubicación' });
    }

    return res.status(200).json(races);

  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener las carreras",
      error: error.message,
    });
  }
};

// Registrar resultados de carrera
const registerRaceResults = async (req, res) => {
  try {
    const { id } = req.params;
    const { results } = req.body;

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "No tienes permisos para registrar resultados",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de carrera inválido" });
    }

    if (!Array.isArray(results)) {
      return res.status(400).json({ message: "El formato de los resultados es inválido" });
    }

    const race = await Race.findById(id);
    if (!race) {
      return res.status(404).json({ message: "Carrera no encontrada" });
    }

    // Validar y procesar cada resultado
    for (let result of results) {
      const { userId, time, position } = result;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "ID de usuario inválido" });
      }

      // Validar formato de tiempo (HH:mm:ss)
      const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
      if (!timeRegex.test(time)) {
        return res.status(400).json({ 
          message: "Formato de tiempo inválido (debe ser HH:mm:ss)" 
        });
      }

      if (typeof position !== "number" || position <= 0) {
        return res.status(400).json({ message: "La posición debe ser un número positivo" });
      }
    }

    // Actualizar el estado de la carrera
    race.status = "finished";
    await race.save();

    // Actualizar los registros con los resultados
    for (let result of results) {
      const { userId, time, position } = result;
      
      // Convertir el tiempo HH:mm:ss a milisegundos para almacenarlo
      const [hours, minutes, seconds] = time.split(':').map(Number);
      const timeInMs = new Date(1970, 0, 1, hours, minutes, seconds).getTime();

      await Registration.updateOne(
        { race: id, user: userId },
        { 
          $set: { 
            time: timeInMs, // Guardamos el tiempo en milisegundos
            position,
            status: "finished"
          } 
        }
      );
    }

    return res.status(200).json({ 
      message: "Resultados registrados correctamente",
      raceId: id,
      totalResults: results.length
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error al registrar los resultados",
      error: error.message,
    });
  }
};

// Obtener resultados de carrera
const getRaceResults = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "El ID de la carrera no es válido" });
    }

    const results = await Registration.find({ race: id, status: 'finished' })
      .populate('user', 'name email')
      .sort({ position: 1 });

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron resultados para esta carrera' });
    }

    // Convertir los tiempos de milisegundos a formato HH:mm:ss
    const formattedResults = results.map(result => {
      const date = new Date(result.time);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return {
        ...result.toObject(),
        time: `${hours}:${minutes}:${seconds}`
      };
    });

    return res.status(200).json(formattedResults);
    
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los resultados de la carrera",
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