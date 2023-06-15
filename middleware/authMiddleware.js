import jwt from 'jsonwebtoken'; 
import Veterinario from '../models/Veterinario.js';

const checkAuth = async (req, res, next) => {
    let token; 

    if(req.headers.authorization && 
       req.headers.authorization.startsWith("Bearer")
    ) {

        try{
            token= req.headers.authorization.split(' ')[1]; //Se esta separando el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);          
            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado"); //Estos son los datos que no se trae del usuario al ser verificado, no trae password, etc            
            return next(); 
            
        }catch(error){
            const e = new Error('Token no válido'); 
            return res.status(403).json({msg: e.message });            
        }
    }

    if(!token){
        const error = new Error('Token no válido o inexistente'); 
        res.status(403).json({msg: error.message });         
    }
    next(); 
}

export default checkAuth; 