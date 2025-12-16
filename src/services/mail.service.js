const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

async function sendResetEmail(to, url) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "Recuperación de contraseña",
    html: `
      <p>Hacé click para restablecer tu contraseña (válido 1 hora):</p>
      <a href="${url}">Restablecer contraseña</a>
    `
  });
}

module.exports = { sendResetEmail };