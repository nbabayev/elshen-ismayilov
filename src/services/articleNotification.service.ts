// services/ArticleNotificationService.ts
import { ArticleNotification, Article } from "@/models";
import SubscriptionService from "@/services/subscription.service";
import EmailService from "@/services/email.service";
// this file finds the active subscribers and creates links and sends the notifications to them;
class ArticleNotificationService {
  async createNotification(
    articleId: number,
    shouldNotify: boolean = false
  ): Promise<any> {
    if (!shouldNotify) {
      return null;
    }

    return await ArticleNotification.create({
      article_id: articleId,
      notification_type: "email",
      status: "pending",
    });
  }

  async processNotification(notificationId: number): Promise<void> {
    const notification = await ArticleNotification.findOne({
      where: { id: notificationId, status: "pending" },
      include: { model: Article, as: "article" },
    });

    if (!notification) return;

    await this.deliverNotification(notification);
  }

  async processPendingNotifications(): Promise<{
    processed: number;
    sent: number;
    failed: number;
  }> {
    const pending = await ArticleNotification.findAll({
      where: { status: "pending" },
      include: { model: Article, as: "article" },
    });

    let sent = 0;
    let failed = 0;

    for (const notification of pending) {
      const wasSent = await this.deliverNotification(notification);
      if (wasSent) sent += 1;
      else failed += 1;
    }

    return { processed: pending.length, sent, failed };
  }

  private async deliverNotification(notification: any): Promise<boolean> {
    try {
      await this.sendToSubscribers(notification.article);

      await notification.update({
        status: "sent",
        sent_at: new Date(),
        error_message: null,
      });
      return true;
    } catch (error: any) {
      await notification.update({
        status: "failed",
        error_message: error.message,
      });
      console.error("Notification failed:", error);
      return false;
    }
  }

  private async sendToSubscribers(article: any): Promise<number> {
    const subscribers = await SubscriptionService.getVerifiedSubscribers();

    if (subscribers.length === 0) {
      throw new Error("Aktiv abunəçi yoxdur");
    }

    const emails = subscribers.map((sub) => {
      const unsubscribeLink = SubscriptionService.getUnsubscribeLink(sub.Id);
      const oneClickUnsubscribeLink =
        SubscriptionService.getOneClickUnsubscribeLink(sub.Id);

      return {
        to: sub.Email,
        subject: `Yeni məqalə: ${article.Title}`,
        html: EmailService.getArticleNotificationHtml(article, unsubscribeLink),
        headers: {
          "List-Unsubscribe": `<${oneClickUnsubscribeLink}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      };
    });

    const result = await EmailService.sendBulk(emails);

    return result.sent;
  }

  async retryFailedNotifications(): Promise<void> {
    await ArticleNotification.update(
      { status: "pending" },
      { where: { status: "failed" } }
    );

    await this.processPendingNotifications();
  }

  async getNotificationStats(articleId: number): Promise<any> {
    return await ArticleNotification.findAll({
      where: { article_id: articleId },
      attributes: [
        "status",
        [Article.sequelize!.fn("COUNT", Article.sequelize!.col("id")), "count"],
      ],
      group: ["status"],
      raw: true,
    });
  }
}

export default new ArticleNotificationService();
