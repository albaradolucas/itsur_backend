// Components
import Cliente from "../models/Cliente.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    const { email, nombre} = req.body;

    // Prevenir usuarios duplicados
    const existeUsuario = await Cliente.findOne({ email });

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }

    try {
        // Guardar un nuevo veterinario
        const cliente = new Cliente(req.body);
        const clienteGuardado = await cliente.save();

        // Enviar el email <-- Buen lugar dps de guardar el nuevo usuario, por el await, en caso de que haya algún problema
        emailRegistro({
            email,
            nombre,
            token: clienteGuardado.token,
        });

        res.json(clienteGuardado);
    } catch (error) {
        console.log(error);
    }
}

const perfil = (req, res) => {
    const { cliente } = req;

    res.json(cliente);
};


const confirmar = async (req, res) => {
    const { token } = req.params;
    const usuarioConfirmar = await Cliente.findOne({ token });

    if (!usuarioConfirmar) {
        const error = new Error("Token no válido");
        return res.status(404).json({ msg: error.message });
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({ msg: "Usuario confirmado correctamente" });
    } catch (error) {
        console.log(error);
    }
};

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Cliente.findOne({ email });

    if (!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(403).json({ msg: error.message });
    }

    // Comprobrar si el usuario está confirmado
    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada aún");
        return process.env.MSG_ERR;
    }

    // Revisar el password
    if (await usuario.comprobarPassword(password)) {
        // Autenticar al usuario
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
        });
    } else {
        const error = new Error("Tu contraseña es incorrecta");
        return process.env.MSG_ERR;
    }

};

const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const existeCliente = await Cliente.findOne({ email });

    if (!existeCliente) {
        const error = new Error("El usuario no existe");
        return res.status(400).json({ msg: error.message });
    }

    try {
        existeCliente.token = generarId();
        await existeCliente.save();

        // Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeCliente.nombre,
            token: existeCliente.token,
        });

        res.json({ msg: "Email enviado correctamente" });
    } catch (error) {
        console.log(error);
    }
};

const comprobrarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Cliente.findOne({ token });

    if (tokenValido) {
        // El token es valido = el usuario existe
        res.json({ msg: "Token válido y el usuario existe" });
    } else {
        const error = new Error("Token no válido");
        return res.status(400).json({ msg: error.message });
    }
};

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const cliente = await Cliente.findOne({ token });

    if (!cliente) {
        const error = new Error("Hubo un error");
        return res.status(400).json({ msg: error.message });
    }

    try {
        cliente.token = null;
        cliente.password = password;

        await cliente.save();
        res.json({ msg: "Contraseña modificado correctamente" });
    } catch (error) {
        console.log(error);
    }
};

export {
    registrar,
    confirmar,
    autenticar,
    perfil,
    olvidePassword,
    comprobrarToken,
    nuevoPassword,
};
