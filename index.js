// Libraries
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Components
import conectarDB from "./config/db.js";
import ClienteRoutes from "./routes/ClienteRoutes.js";

const app = express();

app.use(express.json());

dotenv.config();
conectarDB();

const dominiosPermitios = ["http://localhost:5173"]

const corsOptions = {
    origin: function(origin, callback) {
        if(dominiosPermitios.indexOf(origin) !== -1 ) {
            // El origen del request está permitido
            callback(null, true) // <-- Primer parámetro es un error null (no error), segundo, le permite la conexión
        }
        else {
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(corsOptions))

app.use('/api/cliente', ClienteRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log('Servidor funcionando en el puerto 4000')
})