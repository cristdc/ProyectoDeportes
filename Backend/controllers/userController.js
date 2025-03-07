import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Iniciar sesión
const login = async (req, res) => {
  try {
    console.log('\n=== Login Process Started ===');
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Login failed: Missing credentials');
      return res.status(400).json({ message: "Se requiere email y contraseña" });
    }

    // Obtener el usuario con todos sus datos
    const user = await User.findOne({ email }).select("+password");
    console.log('Database query result:', {
      found: !!user,
      userData: user ? {
        ...user.toObject(),
        password: '[PROTECTED]'
      } : null
    });

    if (!user || !(await user.comparePassword(password))) {
      console.log('Login failed: Invalid credentials');
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Preparar respuesta del usuario con validación de tipos
    const userResponse = {
      id: user._id.toString(),
      name: String(user.name),
      email: String(user.email),
      role: String(user.role),
      height: user.height !== undefined ? Number(user.height) : null,
      weight: user.weight !== undefined ? Number(user.weight) : null,
      age: user.age !== undefined ? Number(user.age) : null,
      gender: user.gender ? String(user.gender) : '',
      profileImage: user.profileImage ? String(user.profileImage) : null,
      stats: {
        totalRaces: Number(user.stats?.totalRaces || 0),
        completedRaces: Number(user.stats?.completedRaces || 0),
        totalKilometers: Number(user.stats?.totalKilometers || 0)
      }
    };

    console.log('Prepared user response:', userResponse);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    console.log('=== Login Process Completed ===\n');

    res.json({
      message: "Inicio de sesión exitoso",
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: "Error al iniciar sesión", 
      error: error.message 
    });
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
    console.log('Datos recibidos para actualización:', req.body);
    const userId = req.user.id;
    
    // Crear objeto de actualización con los datos recibidos
    const updateData = {};
    
    // Validar y añadir cada campo si existe
    if (req.body.name) updateData.name = req.body.name.trim();
    if (req.body.email) updateData.email = req.body.email.trim();
    if (req.body.height) updateData.height = Number(req.body.height);
    if (req.body.weight) updateData.weight = Number(req.body.weight);
    if (req.body.age) updateData.age = Number(req.body.age);
    if (req.body.gender) updateData.gender = req.body.gender;

    // Manejar la imagen si se subió una nueva
    if (req.file) {
      updateData.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    console.log('Datos a actualizar:', updateData);

    // Verificar si se actualiza el email y si ya existe
    if (updateData.email) {
      const emailExists = await User.findOne({
        email: updateData.email,
        _id: { $ne: userId }
      });

      if (emailExists) {
        return res.status(400).json({ message: "El email ya está en uso" });
      }
    }

    // Actualizar el usuario en la base de datos
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Preparar la respuesta
    const userResponse = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      height: updatedUser.height,
      weight: updatedUser.weight,
      age: updatedUser.age,
      gender: updatedUser.gender,
      profileImage: updatedUser.profileImage,
      stats: updatedUser.stats || {
        totalRaces: 0,
        completedRaces: 0,
        totalKilometers: 0
      }
    };

    res.json({
      message: "Perfil actualizado con éxito",
      user: userResponse
    });

  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ 
      message: "Error al actualizar el perfil", 
      error: error.message 
    });
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

