import jwt from 'jsonwebtoken';

// Middleware para verificar el token JWT
const authMiddleware = async (req, res, next) => {
    try{
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

// Middleware para verificar si es admin
const adminMiddleware = async (req,res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message: 'No hay token de autenticacion'});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role!== 'admin'){
            return res.status(403).json({message: 'No tienes permisos para acceder a este recurso'});
        }
        req.userId = decoded.userId;
        next();
    }catch(error){
        res.status(401).json({message: 'Token invalido'});
    }
}

export default {authMiddleware, adminMiddleware};
