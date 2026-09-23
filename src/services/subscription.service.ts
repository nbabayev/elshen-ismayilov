// services/SubscriptionService.ts
import { Subscription } from "@/models";
import EmailService from "@/services/email.service";
import { Op } from "sequelize";
import {
  createSubscriptionToken,
  verifySubscriptionToken,
} from "@/@lib/subscription-token";
// this file controls the subscription rules , statuses and tokens;
interface SubscribeResult {
  success: boolean;
  message: string;
}

class SubscriptionService {
  async subscribe(email: string): Promise<SubscribeResult> {
    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return { success: false, message: "Düzgün email ünvanı daxil edin" };
      }

      const sub = await Subscription.findOne({
        where: { Email: normalizedEmail },
      });

      if (sub) {
        if (sub.isVerified && sub.isActive && !sub.isDeleted) {
          return { success: false, message: "Artıq abunəsiniz" };
        }

        if (sub.isDeleted) {
          await sub.update({
            isActive: false,
            isVerified: false,
            isDeleted: false,
            LastUpdate: new Date(),
          });
        }

        await this.sendVerificationEmail(normalizedEmail, sub.Id);
        return {
          success: true,
          message: sub.isVerified
            ? "Abunəliyi yenidən aktivləşdirmək üçün təsdiq linki göndərildi"
            : "Təsdiq linki yenidən göndərildi",
        };
      }

      const newSub = await Subscription.create({
        Email: normalizedEmail,
        isActive: false,
        isVerified: false,
        isDeleted: false,
        CreatedDate: new Date(),
        LastUpdate: new Date(),
      });

      await this.sendVerificationEmail(normalizedEmail, newSub.Id);

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
    const token = createSubscriptionToken(subscriberId, "verify", 60 * 60 * 24);
    const verifyLink = `${this.getSiteUrl()}/verify-email?token=${encodeURIComponent(
      token
    )}`;

    await EmailService.send({
      to: email,
      subject: "Email təsdiqi",
      html: EmailService.getVerificationEmailHtml(verifyLink),
    });
  }

  async verifyEmail(token: string): Promise<SubscribeResult> {
    try {
      const { subscriberId } = verifySubscriptionToken(token, "verify");
      const sub = await Subscription.findOne({
        where: { Id: subscriberId, isDeleted: false },
      });

      if (!sub) {
        return { success: false, message: "Abunəlik tapılmadı" };
      }

      if (sub.isVerified && sub.isActive) {
        return { success: true, message: "Abunəlik artıq aktivdir" };
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

  async unsubscribe(token: string): Promise<SubscribeResult> {
    try {
      const { subscriberId } = verifySubscriptionToken(token, "unsubscribe");
      const sub = await Subscription.findOne({
        where: { Id: subscriberId, isDeleted: false },
      });

      if (!sub) {
        return { success: false, message: "Abunəlik tapılmadı" };
      }

      if (!sub.isActive) {
        return { success: true, message: "Abunəlik artıq deaktivdir" };
      }

      await sub.update({
        isActive: false,
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

  async getSubscribers({
    page = 1,
    limit = 10,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<any> {
    try {
      const normalizedSearch = search?.trim();
      const subs = await Subscription.findAndCountAll({
        where: {
          isDeleted: false,
          ...(normalizedSearch
            ? { Email: { [Op.like]: `%${normalizedSearch}%` } }
            : {}),
        },
        limit,
        offset: (page - 1) * limit,
        order: [["CreatedDate", "DESC"]],
      });

      return {
        total: subs.count,
        data: subs.rows.map((item: any) => ({
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
      throw error;
    }
  }

  async deleteSubscriber(id: number): Promise<SubscribeResult> {
    const [affectedCount] = await Subscription.update(
      {
        isActive: false,
        isDeleted: true,
        LastUpdate: new Date(),
      },
      {
        where: { Id: id, isDeleted: false },
      }
    );

    if (affectedCount === 0) {
      return { success: false, message: "Abunəçi tapılmadı" };
    }

    return { success: true, message: "Abunəçi uğurla silindi" };
  }

  getUnsubscribeLink(id: number): string {
    const token = createSubscriptionToken(
      id,
      "unsubscribe",
      60 * 60 * 24 * 365
    );

    return `${this.getSiteUrl()}/unsubscribe?token=${encodeURIComponent(
      token
    )}`;
  }

  getOneClickUnsubscribeLink(id: number): string {
    const token = createSubscriptionToken(
      id,
      "unsubscribe",
      60 * 60 * 24 * 365
    );

    return `${this.getSiteUrl()}/api/subscription/unsubscribe?token=${encodeURIComponent(
      token
    )}`;
  }

  private getSiteUrl(): string {
    const siteUrl = process.env.SITE_URL;

    if (!siteUrl) {
      throw new Error("SITE_URL təyin edilməyib");
    }

    return siteUrl.replace(/\/$/, "");
  }
}

export default new SubscriptionService();
