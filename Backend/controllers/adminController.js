import User from "../models/User.js";

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener todos los usuarios",
        error: error.message,
      });
  }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el usuario", error: error.message });
  }
};

// Buscar usuarios por nombre
const getUsersByName = async (req, res) => {
  try {
    if (!req.query.name) {
      return res
        .status(400)
        .json({ message: "Se requiere un nombre para la búsqueda" });
    }

    const users = await User.find({
      name: new RegExp(req.query.name, "i"),
    }).select("-password");

    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener usuarios", error: error.message });
  }
};

// Actualizar usuario (admin puede actualizar cualquier usuario)
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // Verificar si se actualiza el email y si ya existe
    if (updates.email) {
      const emailExists = await User.findOne({
        email: updates.email,
        _id: { $ne: userId },
      });

      if (emailExists) {
        return res.status(400).json({ message: "El email ya está en uso" });
      }
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al actualizar el usuario",
        error: error.message,
      });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el usuario", error: error.message });
  }
};

// Cambiar rol de usuario
const changeUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (role !== "admin" && role !== "user") {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      message: "Rol actualizado correctamente",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al cambiar el rol del usuario",
        error: error.message,
      });
  }
};



const getSystemStats = async (req, res) => {

  // TODO:
  // - Obtener conteo de usuarios registrados (User.countDocuments())
  // - Obtener conteo de usuarios por rol (admin/regular)
  // - Obtener conteo de carreras activas por deporte
  // - Obtener conteo de inscripciones por estado
  // - Calcular estadísticas adicionales (usuarios registrados por mes, carreras por mes, etc.)
  // - Devolver objeto con todas las estadísticas
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
  getAllUsers,
  getUserById,
  getUsersByName,
  updateUser,
  deleteUser,
  changeUserRole,
  getSystemStats,
};
