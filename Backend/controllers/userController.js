import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Se requiere email y contraseña" });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hora
    });

    res.json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al iniciar sesión", error: error.message });
  }
};

// Registrar usuarios
const register = async (req, res) => {
  try {
    const { email, password, name, age, avatar } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Se requiere email, contraseña y nombre" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Formato de email inválido" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const user = new User({
      email,
      password,
      name,
      role: "user",
      age: age || null,
      avatar: avatar || "default.jpg"
    });

    await user.save();

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        registrationDate: user.registrationDate,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar usuario", error: error.message });
  }
};

// Cerrar sesión
const logout = (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      maxAge: 0,
    });

    res.json({ message: "Cierre de sesión exitoso" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al cerrar sesión", error: error.message });
  }
};

// Obtener perfil del usuario autenticado
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener el perfil del usuario",
        error: error.message,
      });
  }
};

// Actualizar perfil propio
const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const userId = req.user.id;

    // Prevenir actualización de campos protegidos
    if (updates.role || updates.registrationDate) {
      return res.status(403).json({
        message: "No tienes permiso para actualizar campos protegidos",
      });
    }

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

    // En lugar de devolver solo el usuario, devuelve un objeto con mensaje y usuario
    res.json({
      message: "Perfil actualizado con éxito",
      user: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el perfil", error: error.message });
  }
};

const getUserById = async (req, res) => {
 
  // TODO:
  // - Extraer ID del usuario de req.params.id
  // - Validar formato del ID
  // - Validar permisos (usuarios regulares solo deberían ver información limitada de otros usuarios)
  // - Buscar el usuario por ID
  // - Si no existe, devolver 404
  // - Si existe, devolver información pública del usuario (sin contraseña)
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

// Buscar usuarios por nombre
const searchUsersByName = async (req, res) => {

  // TODO:
  // - Extraer término de búsqueda de req.query.name
  // - Validar que el término no esté vacío
  // - Buscar usuarios que coincidan con el término (usando RegExp para búsqueda parcial)
  // - Devolver lista de usuarios con información pública (sin contraseñas)
  // - Implementar paginación de resultados
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
  login,
  register,
  logout,
  getUserProfile,
  updateProfile,
  getUserById,
  searchUsersByName,
};

