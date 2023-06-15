import mongoose from "mongoose";
import bcrypt from "bcrypt"; 
import generarId from "../helpers/generarID.js";

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String, 
        require: true, 
        trim: true
    }, 
    password: {
        type: String, 
        require:true
    }, 
    email: {
        type: String, 
        require: true, 
        unique: true, 
        trim:true
    }, 
    telefono: {
        type: String, 
        default: null, 
        trim: true
    }, 
    web: {
        type: String, 
        default: null
    },
    token: {
        type: String, 
        default: generarId
    }, 
    confirmado: {
        type: Boolean, 
        default: false
    }
}); 

veterinarioSchema.pre('save', async function(next){
    //Este código verifica si un password ya esta hasheado, si ya lo esta avanza al siguiente middleware, es decir lo que viene después del next() ya no se ejecuta
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt); 
}); 

veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password)
}

//Nombre del modelo a exportar, se agrega nombre y el schema
const Veterinario = mongoose.model('Veterinario', veterinarioSchema); 

export default Veterinario; 

