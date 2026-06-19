// services/EmailService.ts
import nodemailer, { Transporter } from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST as string,
      port: Number(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async send(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    } catch (error) {
      console.error(`Email send failed to ${options.to}:`, error);
      throw error;
    }
  }

  async sendBulk(emails: EmailOptions[]): Promise<void> {
    const results = await Promise.allSettled(
      emails.map((email) => this.send(email))
    );

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      console.warn(`${failed.length}/${emails.length} emails failed`);
    }
  }

  // Verification email template
  getVerificationEmailHtml(verifyLink: string): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email təsdiqi</h2>
        <p>Abunəliyinizi təsdiqləmək üçün aşağıdaki linkə klikləyin:</p>
        <a href="${verifyLink}" style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Təsdiq et
        </a>
      </div>
    `;
  }

  // Article notification template
  getArticleNotificationHtml(article: any, unsubscribeLink: string): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${article.title}</h2>
        <p>${article.summary || article.content?.substring(0, 200) || ""}...</p>
        <a href="${process.env.SITE_URL}/articles/${
      article.slug
    }" style="display: inline-block; padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px;">
          Məqaləni oxu
        </a>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          <a href="${unsubscribeLink}" style="color: #666;">Abunəlikdən çıx</a>
        </p>
      </div>
    `;
  }
}

export default new EmailService();
