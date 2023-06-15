import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarID.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

//Creando el controlador para registrar veterinario
const registrar = async (req, res) =>  {
    const {email, nombre} = req.body //.body para leer los datos del formulario

    //Revisar usuarios duplicados 
    //1. Revisar la base de datos (en este caso esta definida el el modelo de Veterinario) con el metrodo findOne
    const existeUsuario = await Veterinario.findOne({email})

    //2. Código por si el usuario existe 
    if(existeUsuario){
        const error = new Error('Usuario ya registrado'); 
        return res.status(400).json({msg: error.message}); 
    }

    //Guardar un nuevo veterinario con un try y un await
    try {
        const veterinario = new Veterinario(req.body); 
        const veterinarioGuardado = await veterinario.save(); 

        //Enviar el email
        emailRegistro({
            email, 
            nombre, 
            token: veterinarioGuardado.token
        }); 


        res.json(veterinarioGuardado); 

    } catch (error) {
        console.log(error)
    }

}; 

//Obtiene el perfil del usuario
const perfil = (req, res) => {
    const {veterinario} = req;

    return res.json(veterinario); 
}; 

//Actualiza el perfil del usuario
const actualizarPerfil = async (req, res) => {
    const {id} = req.params; //Identifica el registro que se va a modificar
    const veterinario = await Veterinario.findById(id)
     
    if(!veterinario){
        const error = new Error("Hubo un error"); 
        return res.status(400).json({msg: error.message})
    }

    const {email} = req.body; 

    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email}); 
        
        if(existeEmail){
            const error = new Error("Email ya registrado"); 
            return res.status(400).json({msg: error.message})
        }
    }

    try {
        veterinario.nombre = req.body.nombre 
        veterinario.email = req.body.email 
        veterinario.web = req.body.web 
        veterinario.telefono = req.body.telefono 

        const veterinarioActualizado = await veterinario.save(); 

        return res.json(veterinarioActualizado); 

    } catch (error) {
        console.log(error)
    }
}




//Controlador para confirmar la cuenta de usuario
const confirmar = async (req, res) => {
    const {token} = req.params  //Este .token es la rutan dinámica que se asigno en el router como :token ---- .params para leer los datos de la url

    const usuarioConfirmar = await Veterinario.findOne({token}); 

    try {
        if(!usuarioConfirmar){
            const error = new Error ('Token no valido'); 
            return res.status(404).json({msg: error.message})
        }
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true; 
        usuarioConfirmar.save();         
        res.json({msg: "Usuario Confirmado correctamente"})
    } catch (error) {
        console.log(error)
    }     
}

//Controlador para autenticar usuarios

const autenticar = async (req, res) => {
    const {email, password} = req.body; 

    //Comprobar si el usuario exist
    const usuario = await Veterinario.findOne({email})

    if(!usuario){
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }

    //Comprobar si el usuario esta confirmado o no
    if(!usuario.confirmado){
        const error = new Error('Cuenta no confirmada'); 
        return res.status(403).json({msg: error.message})
    }

    //Revisar el password y generar webToken
    if (await usuario.comprobarPassword(password)) {
        //Autenticar
        res.json({
            _id: usuario._id, 
            nombre: usuario.nombre, 
            email: usuario.email, 
            token: generarJWT(usuario.id)
        })
    } else {
        const error = new Error("El password es incorrecto"); 
        return res.status(403).json({msg: error.message})
    }
    
    
}

//Controlador para recuperar constraseña

const olvidePassword = async (req, res) =>{
    const{ email } = req.body; //Esta es información del formulario
    
    const existeVeterinario = await Veterinario.findOne({email}); 

    if(!existeVeterinario){
        const error = new Error('El usuario no existe'); 
        return res.status(400).json({msg: error.message}); 
    }

    try {
        existeVeterinario.token = generarId(); 
        await existeVeterinario.save(); 
        
        //Enviar correo con instrucciones para recuperar cuenta
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre, 
            token: existeVeterinario.token
        }); 

        res.json({msg: 'Hemos enviado un mensaje a tu correo con las instrucciones'})
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req, res) =>{
    const {token} = req.params //Información de la url
    
    const tokenValido = await Veterinario.findOne({token});   

    if(tokenValido){        
        res.json({msg: "Crea tu Nuevo Password"})
    }else{        
        const error = new Error('Error en la URL'); 
        return res.status(400).json({msg: error.message})
    }
}

const nuevoPassword = async (req, res) =>{
    const {token} = req.params; 
    const {password} = req.body; 

    const veterinario = await Veterinario.findOne({token}); 

    if(!veterinario){
        const error = new Error('Hubo un error '); 
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinario.token = null; 
        veterinario.password = password
        await veterinario.save(); 
        res.json({msg: "Password modificado correctamente"}); 
    } catch (error) {
        console.log(error); 
    }
}

const actualzarPassword = async (req, res) => {
    //Leer datos 
    const {id} = req.veterinario //Se esta extrayendo el id del veterinario
    const { pwd_actual , pwd_nuevo} = req.body; 

    //Comprobar que el usuario exista
    const veterinario = await Veterinario.findById(id);  

    if(!veterinario){
        const error = new Error('Hubo un error '); 
        return res.status(400).json({msg: error.message});
    }

    //Comprobar password
    if(await veterinario.comprobarPassword(pwd_actual)){
        //Almacenar el nuevo password
        veterinario.password = pwd_nuevo; 
        await veterinario.save(); 
        res.json({msg: "Password Almacenado Correctamente"});
    }else{
        const error = new Error('El Password Actual es Incorrecto'); 
        return res.status(400).json({msg: error.message});
    }

    
    
    
}

export {
    registrar, 
    perfil, 
    confirmar, 
    autenticar, 
    olvidePassword, 
    comprobarToken, 
    nuevoPassword, 
    actualizarPerfil, 
    actualzarPassword
}