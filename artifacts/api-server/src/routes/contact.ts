/* Contact form route — sends an email notification to staff */
import { Router } from "express";
import nodemailer from "nodemailer";
import { SendContactMessageBody } from "@workspace/api-zod";

const router = Router();

/* Create a transporter — uses environment SMTP config if set, otherwise Ethereal for testing */
async function getTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  /* Fallback: Ethereal test account (captures emails without sending) */
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

/* POST /api/contact */
router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SendContactMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, phone, subject, message } = parsed.data;
  const staffEmail = process.env.STAFF_EMAIL ?? "aabuashour3@gmail.com";

  try {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: `"AutoDeal Contact Form" <${process.env.SMTP_USER ?? "noreply@autodeal.com"}>`,
      to: staffEmail,
      replyTo: email,
      subject: subject ? `Contact: ${subject}` : `New contact from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        ``,
        `Message:`,
        message,
      ]
        .filter(Boolean)
        .join("\n"),
      html: `
        <h2>New Contact Form Submission</h2>
        <table>
          <tr><td><strong>Name:</strong></td><td>${name}</td></tr>
          <tr><td><strong>Email:</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
          ${phone ? `<tr><td><strong>Phone:</strong></td><td>${phone}</td></tr>` : ""}
          ${subject ? `<tr><td><strong>Subject:</strong></td><td>${subject}</td></tr>` : ""}
        </table>
        <h3>Message</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    req.log.info({ messageId: info.messageId }, "Contact email sent");

    /* If using Ethereal, log the preview URL for dev */
    if (!process.env.SMTP_HOST) {
      req.log.info({ previewUrl: nodemailer.getTestMessageUrl(info) }, "Ethereal preview");
    }

    res.json({ success: true, message: "Your message has been sent. We will get back to you soon." });
  } catch (err) {
    req.log.error({ err }, "Failed to send contact email");
    res.status(500).json({ success: false, message: "Failed to send message. Please try again later." });
  }
});

export default router;
