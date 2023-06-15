import mongoose from "mongoose"; //Funciones necesarias para la base de datos con mongoDB

const pacienteSchema = mongoose.Schema({
    nombre: {
        type: String, 
        require: true
    }, 
    propietario: {
        type: String, 
        require: true
    }, 
    email: {
        type: String, 
        require: true
    }, 
    fecha: {
        type: Date, 
        require: true, 
        default: Date.now()
    }, 
    sintomas: {
        type: String, 
        require: true
    },
    veterinario: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Veterinario'
    } 
}, {
    timestamps: true //Crea las columnas de editado y creado 
}); 
                                //Nombre modelo , el schema creado para el modelo 
const Paciente = mongoose.model('Paciente', pacienteSchema);


export default Paciente; 