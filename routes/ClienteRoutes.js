// Libraries
import express from "express";

// Components
import {
	registrar,
	confirmar,
	autenticar,
	perfil,
    olvidePassword,
    comprobrarToken,
    nuevoPassword,
} from "../controllers/ClienteController.js";
import checkAuth from "../middleware/authMiddleware.js";

// Variables
const router = express.Router();

// Rutas áreas públicas
router.post("/registrar", registrar);
router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword);
router
	.route("/olvide-password/:token")
	.get(comprobrarToken)
	.post(nuevoPassword);

// Rutas área privada
router.get("/perfil", checkAuth, perfil);

export default router;
