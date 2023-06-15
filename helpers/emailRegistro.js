import nodemailer from "nodemailer"; 

const emailRegistro = async (datos) =>{
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
        subject: "Comprueba tu cuenta en APV", 
        text: "Comprueba tu cuenta en APV",
        html: `<p>Hola ${nombre}, comprueba tu cuenta.</p>
            <p>Tu cuenta ya esta lista, solo debes de comprobarla en el siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}">Comprobar cuenta</a> </p>
            <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>
        `
    })
    console.log("Mensaje enviado: $s", info.messageId); 
};

export default emailRegistro; 