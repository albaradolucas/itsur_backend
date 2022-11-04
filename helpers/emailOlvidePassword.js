import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const { email, nombre, token } = datos;

	// Enviar el email
	const info = await transporter.sendMail({
		from: "ITSur - Integración y Desarrollo de Sistemas",
		to: email,
		subject: "Reestablece tu contraseña de ITSur",
		text: "Hola! Este mail es para que puedas reestablecer tu contraseña, no te olvides de hacerlo para acceder a tu cuenta en nuestro sitio web",
		html: `
                <h2>Hola <span style="color:orange">${nombre}!</span></h2>
                <p>¿Te olvidaste tu contraseña? ¡No te preocupes!</p>
                <p>
                    Sigue el siguiente enlace para crear una nueva contraseña:
                    <a href="${process.env.FRONTEND_URL}olvide-password/${token}">Crear nueva contraseña</a>
                </p>
                <p>Si no fuiste tú quién solicitó el cambio de contraseña, puedes ignorar este mensaje.</p>
                <p>¡Ve con cuidado!</p>
            `,
	});
};

export default emailOlvidePassword;
