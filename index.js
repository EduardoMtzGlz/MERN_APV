import  express  from "express";
import dotenv from 'dotenv';
import conectarDB from './config/db.js'; 
import cors from "cors"; 
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js"; 

 
//Asignando la funcionalidad de express a una constante
const app = express(); 
app.use(express.json()); 

//Agregando las variables de entorno
dotenv.config()

conectarDB(); 

const dominiosPermitidos = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){ //-1 signfica que no lo encontró en el arreglo 
            callback(null, true)
        }else {
            callback(new Error("No permitido por CORS"));
        }
    }
}

app.use(cors(corsOptions)); 


//Creando el router de express

app.use('/api/veterinarios', veterinarioRoutes ); 

//Creando el router para pacientes 

app.use('/api/pacientes', pacienteRoutes ); 

const PORT = process.env.PORT || 4000; 

//Iniciando el servidor de express
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
}); 


