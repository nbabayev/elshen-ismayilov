// services/ArticleNotificationService.ts
import { ArticleNotification, Article } from "@/models";
import SubscriptionService from "@/services/subscription.service";
import EmailService from "@/services/email.service";

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

  async processPendingNotifications(): Promise<void> {
    const pending = await ArticleNotification.findAll({
      where: { status: "pending" },
      include: { model: Article, as: "article" },
    });

    for (const notification of pending) {
      try {
        const sentCount = await this.sendToSubscribers(notification.article);

        await notification.update({
          status: "sent",
          sent_at: new Date(),
        });
      } catch (error: any) {
        await notification.update({
          status: "failed",
          error_message: error.message,
        });
        console.error(`Notification failed:`, error);
      }
    }
  }

  private async sendToSubscribers(article: any): Promise<number> {
    const subscribers = await SubscriptionService.getVerifiedSubscribers();

    if (subscribers.length === 0) {
      throw new Error("No active subscribers");
    }

    const emails = subscribers.map((sub) => ({
      to: sub.Email,
      subject: `Yeni məqalə: ${article.title}`,
      html: EmailService.getArticleNotificationHtml(
        article,
        `${process.env.SITE_URL}/unsubscribe?email=${sub.Email}`
      ),
    }));

    await EmailService.sendBulk(emails);

    return subscribers.length;
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
