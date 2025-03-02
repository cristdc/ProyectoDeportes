// Controladores de autenticacion

// Librería para generar y verificar jwt
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Controlador para iniciar sesion
const login = async (req, res) => {
    // Extraemos el username y password del body
    const { username, password } = req.body;
    // Buscamos el usuario en la base de datos
    const user= await User.findOne({username});
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
    // Extraemos el username y password del body
    const {username, password} = req.body;
    // Buscamos el usuario en la base de datos
    const existingUser = await User.findOne({username});
    if(existingUser){
        return res.status(400).json({message: 'El usuario ya existe'});
    }
    // Creamos un nuevo usuario
    const user = new User({username, password});
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

export {login, register, logout};

