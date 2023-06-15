import express from "express"; 
import { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualzarPassword } from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router(); 

//--------------Área pública--------------
//Router para registrar un nuevo usuario 
router.post('/', registrar);
//router que añade el token al usuario 
router.get('/confirmar/:token', confirmar);
//router para el login del usuario
router.post('/login', autenticar );
//Router para recuperar constraseña 
router.post('/olvide-password', olvidePassword);
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);

//---------------Área privada-------------
router.get('/perfil',checkAuth, perfil);
router.put("/perfil/:id", checkAuth, actualizarPerfil);
router.put("/actualizar-password", checkAuth, actualzarPassword); 


export default router;