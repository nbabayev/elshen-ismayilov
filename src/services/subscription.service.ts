// services/SubscriptionService.ts
import { Subscription } from "@/models";
import EmailService from "@/services/email.service";

interface SubscribeResult {
  success: boolean;
  message: string;
}

class SubscriptionService {
  async subscribe(email: string): Promise<SubscribeResult> {
    try {
      const sub = await Subscription.findOne({
        where: { Email: email },
      });

      if (sub) {
        if (sub.isVerified) {
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

      await this.sendVerificationEmail(email, newSub.Id);

      return {
        success: true,
        message: "Email ünvanınıza təsdiq linki göndərildi",
      };
    } catch (error) {
      console.error("Subscribe error:", error);
      throw error;
    }
  }

  private async sendVerificationEmail(
    email: string,
    subscriberId: number
  ): Promise<void> {
    const token = this.generateToken(subscriberId);
    const verifyLink = `${process.env.SITE_URL}/verify-email?token=${token}`;

    await EmailService.send({
      to: email,
      subject: "Email təsdiqi",
      html: EmailService.getVerificationEmailHtml(verifyLink),
    });
  }

  async verifyEmail(token: string): Promise<SubscribeResult> {
    try {
      const subscriberId = this.decodeToken(token);
      const sub = await Subscription.findByPk(subscriberId);

      if (!sub) {
        return { success: false, message: "Abunəlik tapılmadı" };
      }

      if (sub.isVerified) {
        return { success: false, message: "Artıq təsdiqlənib" };
      }

      await sub.update({
        isVerified: true,
        isActive: true,
        LastUpdate: new Date(),
      });

      return { success: true, message: "Email təsdiqləndi" };
    } catch (error) {
      console.error("Verify error:", error);
      throw error;
    }
  }

  async unsubscribe(email: string): Promise<SubscribeResult> {
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

  async getVerifiedSubscribers(): Promise<any[]> {
    return await Subscription.findAll({
      where: {
        isVerified: true,
        isActive: true,
        isDeleted: false,
      },
    });
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
      return { count: 0, rows: [] };
    }
  }

  private generateToken(id: number): string {
    return Buffer.from(id.toString()).toString("base64");
  }

  private decodeToken(token: string): number {
    return parseInt(Buffer.from(token, "base64").toString());
  }
}

export default new SubscriptionService();
