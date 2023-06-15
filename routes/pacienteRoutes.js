import express from "express"; //Se esta importanto express
import { agregarPaciente, obtenerPacientes, obtenerPaciente, eliminarPaciente, actualizarPaciente } from "../controllers/pacienteController.js";
import checkAuth from "../middleware/authMiddleware.js"; //Autentica que el veterinario esta autenticado 

const router = express.Router(); //Se exporta el router de express y se manda a llamar(); 

//Se esta agregando checkAuth por qué el usuarios debe estar autenticado antes de crear un paciente
router.route('/')
    .post(checkAuth,agregarPaciente)
    .get(checkAuth,obtenerPacientes); 

//Router que trae un paciente en específico

router.route('/:id')
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente) //Put sirve para actualizar en la db
    .delete(checkAuth, eliminarPaciente); 




export default router; 