import { BookNotification, Book } from "@/models";
import SubscriptionService from "@/services/subscription.service";
import EmailService from "@/services/email.service";

class BookNotificationService {
  async createNotification(
    bookId: number,
    shouldNotify: boolean = false
  ): Promise<any> {
    if (!shouldNotify) {
      return null;
    }

    return await BookNotification.create({
      book_id: bookId,
      notification_type: "email",
      status: "pending",
    });
  }

  async processNotification(notificationId: number): Promise<void> {
    const notification = await BookNotification.findOne({
      where: { id: notificationId, status: "pending" },
      include: { model: Book, as: "book" },
    });

    if (!notification) return;

    await this.deliverNotification(notification);
  }

  async processPendingNotifications(): Promise<{
    processed: number;
    sent: number;
    failed: number;
  }> {
    const pending = await BookNotification.findAll({
      where: { status: "pending" },
      include: { model: Book, as: "book" },
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
      await this.sendToSubscribers(notification.book);

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
      console.error("Book notification failed:", error);
      return false;
    }
  }

  private async sendToSubscribers(book: any): Promise<number> {
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
        subject: `Yeni kitab: ${book.Title}`,
        html: EmailService.getBookNotificationHtml(book, unsubscribeLink),
        headers: {
          "List-Unsubscribe": `<${oneClickUnsubscribeLink}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      };
    });

    const result = await EmailService.sendBulk(emails);
    return result.sent;
  }
}

export default new BookNotificationService();
