// services/SubscriptionService.ts
//
// Verify linki birdəfəlik taktikası (status workaround YOX):
// 1) Email göndəriləndə imzalı token yaradılır; DB-yə tokenun özü yox,
//    HMAC hash-i (`VerifyTokenHash`) yazılır.
// 2) Səhifə/API yalnız hash uyğun gələndə "pending" sayır.
// 3) Təsdiq uğurlu olanda eyni hash ilə atomic UPDATE edilir və
//    `VerifyTokenHash = null` — link bir daha işləmir.
// 4) Yeni verify emaili göndəriləndə hash üzərinə yazılır → köhnə link ölür.
// 5) Abunə deaktiv olub yenidən təsdiq gözləyəndə də yalnız SON hash keçərlidir.
//
import { Subscription } from "@/models";
import EmailService from "@/services/email.service";
import { Op } from "sequelize";
import {
  createSubscriptionToken,
  hashSubscriptionToken,
  subscriptionTokenHashesMatch,
  verifySubscriptionToken,
} from "@/@lib/subscription-token";

export type SubscribeCode =
  | "subscribed"
  | "already_subscribed"
  | "invalid_email"
  | "unsubscribed"
  | "verified"
  | "link_used"
  | "not_found";

export type VerifyPageStatus = "pending" | "used" | "invalid";

export interface SubscribeResult {
  success: boolean;
  message: string;
  code?: SubscribeCode;
  email?: string;
  unsubscribeToken?: string;
}

class SubscriptionService {
  async subscribe(email: string): Promise<SubscribeResult> {
    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return {
          success: false,
          code: "invalid_email",
          message: "Düzgün email ünvanı daxil edin",
        };
      }

      const sub = await Subscription.findOne({
        where: { Email: normalizedEmail },
      });

      if (sub) {
        if (sub.isVerified && sub.isActive && !sub.isDeleted) {
          return {
            success: false,
            code: "already_subscribed",
            email: normalizedEmail,
            unsubscribeToken: createSubscriptionToken(
              sub.Id,
              "unsubscribe",
              60 * 60 * 24
            ),
            message: "Artıq abunəsiniz",
          };
        }

        if (sub.isDeleted) {
          await sub.update({
            isActive: false,
            isVerified: false,
            isDeleted: false,
            VerifyTokenHash: null,
            LastUpdate: new Date(),
          });
        }

        await this.sendVerificationEmail(normalizedEmail, sub.Id);
        return {
          success: true,
          code: "subscribed",
          email: normalizedEmail,
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
        VerifyTokenHash: null,
        CreatedDate: new Date(),
        LastUpdate: new Date(),
      });

      await this.sendVerificationEmail(normalizedEmail, newSub.Id);

      return {
        success: true,
        code: "subscribed",
        email: normalizedEmail,
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
    const tokenHash = hashSubscriptionToken(token);

    // Yeni hash köhnəni əvəz edir → əvvəlki verify linkləri dərhal yararsızdır
    await Subscription.update(
      {
        VerifyTokenHash: tokenHash,
        LastUpdate: new Date(),
      },
      { where: { Id: subscriberId } }
    );

    const verifyLink = `${this.getSiteUrl()}/verify-email?token=${encodeURIComponent(
      token
    )}`;

    await EmailService.send({
      to: email,
      subject: "Email təsdiqi",
      html: EmailService.getVerificationEmailHtml(verifyLink),
    });
  }

  private matchesActiveVerifyToken(
    storedHash: string | null | undefined,
    token: string
  ): boolean {
    if (!storedHash) return false;
    return subscriptionTokenHashesMatch(
      storedHash,
      hashSubscriptionToken(token)
    );
  }

  async getVerifyPageStatus(token?: string): Promise<VerifyPageStatus> {
    if (!token) return "invalid";

    try {
      const { subscriberId } = verifySubscriptionToken(token, "verify");
      const sub = await Subscription.findOne({
        where: { Id: subscriberId, isDeleted: false },
      });

      if (!sub) return "invalid";

      // Hash yoxdursa və ya uyğun gəlmirsə link artıq yoxdur / köhnədir
      if (!this.matchesActiveVerifyToken(sub.VerifyTokenHash, token)) {
        return "used";
      }

      return "pending";
    } catch {
      return "invalid";
    }
  }

  async verifyEmail(token: string): Promise<SubscribeResult> {
    try {
      const { subscriberId } = verifySubscriptionToken(token, "verify");
      const tokenHash = hashSubscriptionToken(token);
      const sub = await Subscription.findOne({
        where: { Id: subscriberId, isDeleted: false },
      });

      if (!sub) {
        return {
          success: false,
          code: "not_found",
          message: "Abunəlik tapılmadı",
        };
      }

      if (!this.matchesActiveVerifyToken(sub.VerifyTokenHash, token)) {
        return {
          success: false,
          code: "link_used",
          message: "Bu təsdiq linki artıq istifadə olunub",
        };
      }

      // Atomic consume: yalnız eyni hash hələ DB-dədirsə sil + aktivləşdir
      const [affectedCount] = await Subscription.update(
        {
          isVerified: true,
          isActive: true,
          VerifyTokenHash: null,
          LastUpdate: new Date(),
        },
        {
          where: {
            Id: subscriberId,
            isDeleted: false,
            VerifyTokenHash: tokenHash,
          },
        }
      );

      if (affectedCount === 0) {
        return {
          success: false,
          code: "link_used",
          message: "Bu təsdiq linki artıq istifadə olunub",
        };
      }

      return {
        success: true,
        code: "verified",
        message: "Email təsdiqləndi",
      };
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
        return {
          success: false,
          code: "not_found",
          message: "Abunəlik tapılmadı",
        };
      }

      if (!sub.isActive) {
        return {
          success: true,
          code: "unsubscribed",
          message: "Abunəlik artıq deaktivdir",
        };
      }

      await sub.update({
        isActive: false,
        LastUpdate: new Date(),
      });

      return {
        success: true,
        code: "unsubscribed",
        message: "Abunəlikdən çıxdınız",
      };
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
        VerifyTokenHash: null,
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
