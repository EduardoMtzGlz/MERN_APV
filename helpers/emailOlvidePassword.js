import nodemailer from "nodemailer"; 

const emailOlvidePassword = async (datos) =>{
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {nombre, email, token} = datos; 

    //Enviar email, en sendMail se pone toda la configuración de email que se esta mandando

    const info = await transporter.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria", 
        to: email, 
        subject: "Reestablce tu Password", 
        text: "Reestablce tu Password",
        html: `<p>Hola ${nombre}, has solicitado reestablecer tu password.</p>
            <p>Da click en el siguiente enlace para generar un nuevo password:
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Recuperar contraseña</a> </p>

            <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>
        `
    })
    console.log("Mensaje enviado: $s", info.messageId); 
};

export default emailOlvidePassword;