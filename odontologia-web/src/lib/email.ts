
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

/**
 * Sends an email using SendGrid.
 *
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} htmlContent - The HTML content of the email.
 * @returns {Promise<{ success: boolean; error?: any }>} - An object indicating the success of the operation and any error encountered.
 */
export async function sendMail(to: string, subject: string, htmlContent: string): Promise<{ success: boolean; error?: Error }> {
  try {
    const msg = {
      to,
      from: "bryamlopezmirandamirandalopez@gmail.com",
      subject,
      html: htmlContent,
    };
    await sgMail.send(msg);
    return { success: true };
  } catch (error: Error | any) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}