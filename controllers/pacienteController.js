import Paciente from "../models/Paciente.js" //Se exporta el modelo con el que se va a trabajar
import mongoose from "mongoose"; //Funciones necesarias para la base de datos con mongoDB

const agregarPaciente = async (req, res) => {
    
    //Se crea una nueva instancia de paciente, este contiene los datos del formulario
    const paciente = new Paciente(req.body); 
    paciente.veterinario = req.veterinario._id; 

    //Ese paciente se guarda en la base de datos, como se hará una petición se utiliza un try catch

    try {
      const pacienteAlmacenado = await paciente.save(); 
      res.json(pacienteAlmacenado); 
    } catch (error) {
        console.log(error)
    }

    
}

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario); 

    return res.json(pacientes); 
}

//Todos estos serán asyn por qué se consultará la base de datos 

const obtenerPaciente = async (req, res) =>{
    const {id} = req.params;      

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({msg: "No encontrado"})
    }

    const paciente= await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg: "No encontrado"}); 
    }

    //Mandar el paciente si este existe    
    res.json(paciente); 
    
}

const actualizarPaciente = async (req, res) =>{
    const {id} = req.params;      

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({msg: "No encontrado"})
    }

    const paciente= await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg: "No encontrado"}); 
    }

    //Si encuentra el paciente se edita
    paciente.nombre = req.body.nombre || paciente.nombre; 
    paciente.propietario = req.body.propietario || paciente.propietario; 
    paciente.email = req.body.email || paciente.email; 
    paciente.fecha = req.body.fecha || paciente.fecha; 
    paciente.sintomas = req.body.sintomas || paciente.sintomas; 

    try{
        const pacienteActualizado = await paciente.save(); 
        res.json(pacienteActualizado); 
    }catch(error){
        console.log(error)
    }

}

const eliminarPaciente = async (req, res) =>{
    const {id} = req.params;      

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({msg: "No encontrado"})
    }

    const paciente= await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg: "No encontrado"}); 
    }

    try {
        await paciente.deleteOne(); 
        res.json({msg: "Paciente eliminado"})
    } catch (error) {
        console.log(error); 
    }
}

export {
    agregarPaciente, 
    obtenerPacientes, 
    obtenerPaciente, 
    actualizarPaciente, 
    eliminarPaciente
}