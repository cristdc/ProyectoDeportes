// Controladores de autenticacion

// Librería para generar y verificar jwt
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Controlador para iniciar sesion
const login = async (req, res) => {
    // Extraemos el email y password del body
    const { email, password } = req.body;
    // Buscamos el usuario en la base de datos
    const user= await User.findOne({email});
    // Si el usuario no existe, devolvemos un error
    if(!user || !(user.comparePassword(password))){
        return res.status(401).json({message: 'Usuario o contraseña incorrectos'});
    }
    // Generamos un token JWT que incluya id y el tiempo de expiracion
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

    // Creamos la cookie con el token
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'production', // Solo en produccion
        sameSite:"none",
        maxAge: 3600000, // 1 hora
        sameSite:"strict"
})
res.json({message: 'Inicio de sesion exitoso'});


}

// Controlador para registrar usuarios
const register = async (req, res) => {
    // Extraemos el email y password del body
    const {email, password} = req.body;
    // Buscamos el usuario en la base de datos
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message: 'El usuario ya existe'});
    }
    // Creamos un nuevo usuario
    const user = new User({email, password});
    await user.save();
    res.status(201).json({message: 'Usuario registrado exitosamente'});
}

// Controlador para cerrar sesion
const logout = (req, res) => {
    // Eliminamos la cookie de autenticacion
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'production',
        expires: new Date(0),
        maxAge: 0,

    });
    res.json({message: 'Cierre de sesion exitoso'});
}

const getUserProfile=async(req, res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        if(!user){
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        res.json({user: user._id, email: user.email});
    }catch(error){
        res.status(500).json({message: 'Error al obtener el perfil del usuario', error: error.message});
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
}

const getUsersByName = async (req, res) => {
    try {
        const users = await User.find({ name: new RegExp(req.query.name,'i') }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener todos los usuarios', error: error.message });
    }
}

export { login, register, logout, getUserProfile, getUserById, getUsersByName, updateUser, deleteUser, getAllUsers };