import User from "../models/User.js";

// Controlador para obtener todos los usuarios
const addUser = async (req, res) => {
    try{
        const {username, password} = req.body;
        // Creamos y guardamos el usuario
        const user = new User({username, password});
        await user.save();
        res.status(201).json({message: 'Usuario registrado exitosamente'});

    }catch(error){
        res.status(500).json({message: 'Error al registrar el usuario', error: error.message});
    }
    
}

// Controlador para obtener el perfil del usuario autenticado
const getUserProfile=async(req, res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        if(!user){
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        res.json({user: user._id, username: user.username});
    }catch(error){
        res.status(500).json({message: 'Error al obtener el perfil del usuario', error: error.message});
    }
}

export {addUser, getUserProfile};

