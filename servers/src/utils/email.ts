import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function enviarEmailRecuperacion(destinatario: string, link: string) {
  await transporter.sendMail({
    from: `"Domus" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: "Recuperar contraseña - Domus",
    html: `
      <h2>Recuperar contraseña</h2>
      <p>Hacé clic en el siguiente enlace para restablecer tu contraseña. El enlace expira en 1 hora.</p>
      <a href="${link}">Restablecer contraseña</a>
      <p>Si no pediste esto, podés ignorar este correo.</p>
    `,
  });
}