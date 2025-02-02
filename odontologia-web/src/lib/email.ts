import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendMail(to: string, subject: string, htmlContent: string) {
  try {
    const msg = {
      to,
      from: "bryamlopezmirandamirandalopez@gmail.com",
      subject,
      html: htmlContent,
    };
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error("Error enviando email:", error);
    return { success: false, error };
  }
}