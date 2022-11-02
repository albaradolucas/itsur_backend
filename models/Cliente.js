// libraries
import mongoose from "mongoose";
import bcrypt from "bcrypt";
// component
import generarId from "../helpers/generarId.js";

const clienteSchema = mongoose.Schema({
	nombre: {
		type: String,
		required: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	telefono: {
		type: String,
		default: null,
	},
	compañia: {
		type: String,
		default: null,
	},
	token: {
		type: String,
		default: generarId(),
	},
	confirmado: {
		type: Boolean,
		default: false,
	},
});

// Modificar antes que se almacene, y luego hashear o encriptar la contraseña
clienteSchema.pre('save', async function(next) {
    // Prevenir que se vuelva a hashear
    if(!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

clienteSchema.methods.comprobarPassword = async function(passForm) {
    return await bcrypt.compare(passForm, this.password)
}


const Cliente = mongoose.model("Cliente", clienteSchema);
export default Cliente;
