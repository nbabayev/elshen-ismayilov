import { Contact } from "@/models";
import { Op, WhereOptions } from "sequelize";
import EmailService from "@/services/email.service";

export interface CreateContactInput {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export interface ConversationSummary {
  email: string;
  name: string;
  lastName: string;
  phone: string;
  lastMessage: string;
  lastDate: string;
  unreadCount: number;
  isOwnLast: boolean;
}

class ContactService {
  async create(input: CreateContactInput) {
    const email = input.email.trim().toLowerCase();
    const name = input.name.trim();
    const lastName = input.lastName.trim();
    const phone = input.phone.trim();
    const message = input.message.trim();

    if (!name || !lastName || !email || !phone || !message) {
      return { success: false as const, message: "Bütün sahələr tələb olunur" };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        success: false as const,
        message: "Düzgün email ünvanı daxil edin",
      };
    }

    const contact = await Contact.create({
      Name: name,
      LastName: lastName,
      Email: email,
      Phone: phone,
      Message: message,
      isRead: false,
      isOwn: false,
      isDeleted: false,
    });

    return {
      success: true as const,
      message: "Mesajınız göndərildi",
      data: this.toDto(contact),
    };
  }

  async getUnreadCount(): Promise<number> {
    return Contact.count({
      where: {
        isDeleted: false,
        isOwn: false,
        isRead: false,
      },
    });
  }

  async getConversations(search?: string): Promise<ConversationSummary[]> {
    const where: WhereOptions = { isDeleted: false };

    if (search?.trim()) {
      const q = `%${search.trim()}%`;
      Object.assign(where, {
        [Op.or]: [
          { Email: { [Op.like]: q } },
          { Name: { [Op.like]: q } },
          { LastName: { [Op.like]: q } },
          { Phone: { [Op.like]: q } },
          { Message: { [Op.like]: q } },
        ],
      });
    }

    const rows = await Contact.findAll({
      where,
      order: [["CreatedDate", "DESC"]],
    });

    const map = new Map<string, ConversationSummary>();

    for (const row of rows) {
      const email = String(row.Email).toLowerCase();
      const existing = map.get(email);

      if (!existing) {
        map.set(email, {
          email: String(row.Email),
          name: String(row.Name),
          lastName: String(row.LastName),
          phone: String(row.Phone),
          lastMessage: String(row.Message),
          lastDate: row.CreatedDate
            ? new Date(row.CreatedDate).toISOString()
            : new Date().toISOString(),
          unreadCount: !row.isOwn && !row.isRead ? 1 : 0,
          isOwnLast: Boolean(row.isOwn),
        });
      } else if (!row.isOwn && !row.isRead) {
        existing.unreadCount += 1;
      }
    }

    return Array.from(map.values());
  }

  async getThread(email: string) {
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      return { success: false as const, message: "Email tələb olunur" };
    }

    const rows = await Contact.findAll({
      where: {
        isDeleted: false,
        Email: normalized,
      },
      order: [["CreatedDate", "ASC"]],
    });

    return {
      success: true as const,
      data: rows.map((r: any) => this.toDto(r)),
    };
  }

  async markThreadRead(email: string) {
    const normalized = email.trim().toLowerCase();
    await Contact.update(
      { isRead: true },
      {
        where: {
          isDeleted: false,
          isOwn: false,
          isRead: false,
          Email: normalized,
        },
      }
    );
    return { success: true as const };
  }

  async reply(email: string, message: string) {
    const normalized = email.trim().toLowerCase();
    const text = message.trim();

    if (!normalized || !text) {
      return {
        success: false as const,
        message: "Email və mesaj tələb olunur",
      };
    }

    const lastVisitor = await Contact.findOne({
      where: {
        isDeleted: false,
        isOwn: false,
        Email: normalized,
      },
      order: [["CreatedDate", "DESC"]],
    });

    const lastAny = lastVisitor
      ? lastVisitor
      : await Contact.findOne({
          where: { isDeleted: false, Email: normalized },
          order: [["CreatedDate", "DESC"]],
        });

    if (!lastAny) {
      return { success: false as const, message: "Söhbət tapılmadı" };
    }

    const contact = await Contact.create({
      Name: lastAny.Name,
      LastName: lastAny.LastName,
      Email: normalized,
      Phone: lastAny.Phone,
      Message: text,
      isRead: true,
      isOwn: true,
      isDeleted: false,
    });

    try {
      await EmailService.send({
        to: normalized,
        subject: "Mesajınıza cavab",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <p>Hörmətli ${lastAny.Name} ${lastAny.LastName},</p>
            <p>Mesajınıza cavab:</p>
            <blockquote style="border-left: 3px solid #C88445; padding-left: 12px; color: #333;">
              ${text
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\n/g, "<br/>")}
            </blockquote>
          </div>
        `,
      });
    } catch (err) {
      console.error("Reply email failed:", err);
    }

    return {
      success: true as const,
      message: "Cavab göndərildi",
      data: this.toDto(contact),
    };
  }

  async softDelete(id: number) {
    const contact = await Contact.findOne({
      where: { Id: id, isDeleted: false },
    });
    if (!contact) {
      return { success: false as const, message: "Mesaj tapılmadı" };
    }
    await contact.update({ isDeleted: true });
    return { success: true as const, message: "Mesaj silindi" };
  }

  async softDeleteConversations(emails: string[]) {
    const normalized = [
      ...new Set(emails.map((e) => e.trim().toLowerCase()).filter(Boolean)),
    ];

    if (normalized.length === 0) {
      return { success: false as const, message: "Email seçilməyib" };
    }

    const [affected] = await Contact.update(
      { isDeleted: true },
      {
        where: {
          isDeleted: false,
          Email: { [Op.in]: normalized },
        },
      }
    );

    return {
      success: true as const,
      message: "Söhbətlər silindi",
      deleted: affected,
    };
  }

  private toDto(row: {
    Id: number;
    Name: string;
    LastName: string;
    Email: string;
    Phone: string;
    Message: string;
    isRead: boolean;
    isOwn: boolean;
    CreatedDate?: Date;
    LastUpdate?: Date;
  }) {
    return {
      id: row.Id,
      name: row.Name,
      lastName: row.LastName,
      email: row.Email,
      phone: row.Phone,
      message: row.Message,
      isRead: Boolean(row.isRead),
      isOwn: Boolean(row.isOwn),
      createdDate: row.CreatedDate
        ? new Date(row.CreatedDate).toISOString()
        : null,
      lastUpdate: row.LastUpdate
        ? new Date(row.LastUpdate).toISOString()
        : null,
    };
  }
}

const contactService = new ContactService();
export default contactService;
