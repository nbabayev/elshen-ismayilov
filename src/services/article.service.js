import { Article } from "@/models/index";
import { Op } from "sequelize";

export const getAll = async ({ limit, page, search }) => {
  const perPage = Number(limit) || 10;
  const currentPage = Number(page) || 1;

  const where = { isDeleted: false };

  if (search) {
    where.Title = { [Op.like]: `%${search}%` };
  }

  const { count, rows } = await Article.findAndCountAll({
    where,
    limit: perPage,
    offset: (currentPage - 1) * perPage, // ✅ Express-də səndə "page" yazılıb, bu yanlışdır; offset olmalıdır
    order: [["CreatedDate", "DESC"]],
  });

  return { data: rows, total: count };
};

export const getById = async (id) => {
  return Article.findOne({ where: { Id: id, isDeleted: false } });
};

export const create = async (payload) => {
  return Article.create({
    ...payload,
    CreatedDate: new Date(),
  });
};

export const update = async (id, payload) => {
  await Article.update({ ...payload }, { where: { Id: id } });

  return Article.findByPk(id);
};

export const remove = async (id) => {
  return Article.update(
    { isDeleted: true, LastUpdate: new Date() },
    { where: { Id: id } }
  );
};
