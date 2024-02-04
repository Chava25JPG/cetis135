const nodemailer = require('nodemailer');

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'saseza8@gmail.com',
    pass: 'znlq hauu shft nqmg ',
  },
});

function enviarCorreoVerificacion(correo, codigoVerificacion) {
  const mailOptions = {
    from: 'saseza8@gmail.com',
    to: correo,
    subject: 'Código de Verificación',
    text: `Tu código de verificación es: ${codigoVerificacion}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo de verificación:', error);
    } else {
      console.log('Correo de verificación enviado:', info.response);
    }
  });
}

module.exports = enviarCorreoVerificacion;
