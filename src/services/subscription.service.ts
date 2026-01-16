import { BaseParams } from "@/app/shared";
import { Subscription } from "@/models";
import nodemailer, { Transporter } from "nodemailer";
interface Subscribers {
  count: number;
  rows: any[];
}
class Subscriptions {
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

  async subscribe(email: string) {
    try {
      const sub = Subscription.findOne({
        where: {
          Email: email,
        },
      });
      if (sub?.Email) {
        // console.log(JSON.stringify(sub), "jsdaj");
        if (sub?.isVerified) {
          return { success: false, message: "Artıq abunəsiniz" };
        }
        await this.sendVerificationEmail(email, sub.Id);
        return {
          success: true,
          message: "Təsdiq linki yenidən göndərildi",
        };
      }

      const newSub = await Subscription.create({
        Email: email,
        isActive: false,
        isVerified: false,
        isDeleted: false,
        CreatedDate: new Date(),
        LastUpdate: new Date(),
      });
      await this.sendVerificationEmail(email, newSub?.Id);

      return {
        success: true,
        message: "Email ünvanınıza təsdiq linki göndərildi",
      };
    } catch (error) {
      console.error("Subscribe error:", error);
      throw error;
    }
  }

  private async sendVerificationEmail(email: string, subscriberId: number) {
    const token = this.generateToken(subscriberId);
    const verifyLink = `${process.env.SITE_URL}/verify-email?token=${token}`;
    console.log("Sending email to:", email);
    console.log("Verify link:", verifyLink);
    // Email göndər (Nodemailer, Resend, və s.)
    const result = await this.transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Email təsdiqi",
      html: `<a href="${verifyLink}">Təsdiq et</a>`,
    });

    console.log("Email sent successfully:", result);
  }

  private generateToken(id: number): string {
    // JWT və ya sadə encode
    return Buffer.from(id.toString()).toString("base64");
  }

  private decodeToken(token: string): number {
    return parseInt(Buffer.from(token, "base64").toString());
  }

  async unsubscribe(email: string) {
    try {
      const sub = await Subscription.findOne({
        where: { Email: email, isDeleted: false },
      });

      if (!sub) {
        return { success: false, message: "Abunəlik tapılmadı" };
      }

      await sub.update({
        isActive: false,
        isDeleted: true,
        LastUpdate: new Date(),
      });

      return { success: true, message: "Abunəlikdən çıxdınız" };
    } catch (error) {
      console.error("Unsubscribe error:", error);
      throw error;
    }
  }

  async getSubscribers(limit: number, offset: number): Promise<any> {
    try {
      const subs = await Subscription.findAndCountAll({
        where: { isDeleted: false },
        limit,
        offset,
      });

      return {
        count: subs.count,
        rows: subs.rows.map((item: any) => ({
          id: item.Id,
          email: item.Email,
          isActive: item.isActive,
          isVerified: item.isVerified,
          createdDate: item.CreatedDate,
          lastUpdate: item.LastUpdate,
        })),
      };
    } catch (error) {
      console.error("Subscribers fetch error:", error);
      return { count: 0, rows: [] }; // ✅ Bunu əlavə et
    }
  }
}

export default new Subscriptions();
