import { Book as BookModel } from "@/models/index";
import { Op, InferAttributes } from "sequelize";

type Book = InferAttributes<typeof BookModel>;

export type BookPayload = {
  Title: string;
  Slug?: string;
  Author?: string;
  Description?: string;
  Image?: string;
  PdfUrl?: string;
  SpotifyUrl?: string;
  Format?: string;
  Barcode?: string;
  PublishYear?: string;
  Language?: string;
  Circulation?: string;
  Publisher?: string;
  PageCount?: string;
  CoverType?: string;
  Paper?: string;
  Size?: string;
};

export const slugifyTitle = (title: string) =>
  (title || "")
    .toLowerCase()
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const getAll = async ({
  limit = 10,
  page = 1,
  excludeId,
}: {
  limit?: number;
  page?: number;
  excludeId?: number;
} = {}): Promise<{ data: Book[]; total: number }> => {
  const where: Record<string, unknown> = { isDeleted: false };
  if (excludeId) {
    where.Id = { [Op.ne]: excludeId };
  }

  const { rows, count } = await BookModel.findAndCountAll({
    where,
    order: [["CreatedDate", "DESC"]],
    limit: Number(limit),
    offset: (Number(page) - 1) * Number(limit),
  });

  return {
    data: rows.map((row: { toJSON: () => Book }) => row.toJSON()),
    total: count,
  };
};

export const getBySlug = async (slug: string): Promise<Book | null> => {
  const book = await BookModel.findOne({
    where: { Slug: slug, isDeleted: false },
  });
  return book ? book.toJSON() : null;
};

export const getById = async (id: number): Promise<Book | null> => {
  const book = await BookModel.findOne({
    where: { Id: id, isDeleted: false },
  });
  return book ? book.toJSON() : null;
};

export const create = async (payload: BookPayload): Promise<Book> => {
  const slug = payload.Slug || slugifyTitle(payload.Title);
  const book = await BookModel.create({
    ...payload,
    Slug: slug,
    CreatedDate: new Date(),
  });
  return book.toJSON();
};

export const update = async (
  id: number,
  payload: Partial<BookPayload>
): Promise<Book> => {
  const data = { ...payload };
  if (data.Title && !data.Slug) {
    data.Slug = slugifyTitle(data.Title);
  }
  await BookModel.update(data, { where: { Id: id, isDeleted: false } });
  const book = await getById(id);
  if (!book) throw new Error("Kitab tapılmadı");
  return book;
};

export const remove = async (id: number): Promise<void> => {
  await BookModel.update({ isDeleted: true }, { where: { Id: id } });
};
