import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendMail(to: string, subject: string, text: string) {
  const msg = {
    to,
    from: "bryamlopezmirandamirandalopez@gmail.com", // Debe ser validado en SendGrid
    subject,
    text,
  };
  await sgMail.send(msg);
}
