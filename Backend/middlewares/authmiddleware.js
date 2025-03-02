import jwt from 'jsonwebtoken';

// Middleware para verificar el token JWT
const authMiddleware = async (req, res, next) => {
    try{

        // Extraemos el token de la cookie
        const token = req.cookies.token;
        if(!token){


        return res.status(401).json({message: 'No hay token de autenticacion'});
    }

    // Verificamos y decodificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
}catch(error){
    res.status(401).json({message: 'Token invalido'});
}
}

export default authMiddleware;
