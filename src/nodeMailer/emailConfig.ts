import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();
async function mail(receiver: string, subject: string, html: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!, 10),
      secure: false,
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: receiver,
      subject: subject,
      html: html,
    });
    return { message: "Email sent successfully" };
  } catch (error) {
    throw new Error("Email sending failed");
  }
}

export default mail;
