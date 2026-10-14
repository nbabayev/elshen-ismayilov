import { api } from "@/@lib/api/interceptor";

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

export interface ContactMessage {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  isOwn: boolean;
  createdDate: string | null;
  lastUpdate: string | null;
}

export const getConversations = (search?: string) =>
  api
    .get("/contacts", { params: { search: search || undefined } })
    .then((res) => res.data);

export const getThread = (email: string) =>
  api.get("/contacts", { params: { email } }).then((res) => res.data);

export const getUnreadCount = () =>
  api.get("/contacts/unread").then((res) => res.data);

export const markThreadRead = (email: string) =>
  api.put("/contacts/read", { email }).then((res) => res.data);

export const replyToContact = (email: string, message: string) =>
  api.post("/contacts/reply", { email, message }).then((res) => res.data);

export const createContact = (payload: {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}) => api.post("/contacts", payload).then((res) => res.data);

export const deleteContact = (id: number) =>
  api.delete(`/contacts/${id}`).then((res) => res.data);

export const deleteConversations = (emails: string[]) =>
  api.post("/contacts/bulk-delete", { emails }).then((res) => res.data);
