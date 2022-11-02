// Libraries
import express from "express";
import dotenv from "dotenv";

// Components
import conectarDB from "./config/db.js";
import ClienteRoutes from "./routes/ClienteRoutes.js";

const app = express();

app.use(express.json());

dotenv.config();
conectarDB();

app.use('/api/cliente', ClienteRoutes)




const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log('Servidor funcionando en el puerto 4000')
})