import { Article, ArticleCategory, Category } from "@/models/index";
import { Op } from "sequelize";

export const getAll = async ({ limit, page, search }) => {
  const perPage = Number(limit) || 10;
  const currentPage = Number(page) || 1;

  const where = { isDeleted: false };

  // if (search) {
  //   where.Title = { [Op.like]: `%${search}%` };
  // }

  const { count, rows } = await Article.findAndCountAll({
    where,
    limit: perPage,
    offset: (currentPage - 1) * perPage,
    order: [["CreatedDate", "DESC"]],
  });

  return { data: rows, total: count };
};

export const getById = async (id) => {
  const article = await Article.findOne({
    where: { Id: id, isDeleted: false },
    include: [
      {
        model: Category,
        as: "categories",
        through: { attributes: [] },
      },
    ],
  });

  if (article) {
    await Article.increment("viewCount", {
      by: 1,
      where: { Id: id },
    });
  }

  return article;
};

export const create = async (payload) => {
  let article = await Article.create({
    ...payload,
    CreatedDate: new Date(),
  });

  if (payload?.CategoryIds && payload?.CategoryIds.length > 0) {
    const records = payload?.CategoryIds.map((catId) => ({
      CategoryId: catId,
      ModelId: article.Id,
      isDeleted: false,
      CreatedDate: new Date(),
    }));

    await ArticleCategory.bulkCreate(records);
  }

  const articleWithCategories = await Article.findByPk(article.Id, {
    include: [
      {
        model: Category,
        as: "categories",
        through: { attributes: [] },
      },
    ],
  });

  if (shouldNotify) {
    await ArticleNotification.create({
      article_id: article.id,
      notification_type: "email",
      status: "pending",
    });
  }

  async function processNotifications() {
    const pending = await ArticleNotification.findAll({
      where: { status: "pending" },
    });

    for (let notif of pending) {
      try {
        await sendEmail(notif.article_id);
        await notif.update({ status: "sent", sent_at: new Date() });
      } catch (err) {
        await notif.update({ status: "failed", error_message: err.message });
      }
    }
  }

  return articleWithCategories;
};

export const update = async (id, payload) => {
  await Article.update(payload, { where: { Id: id } });

  // 2. Əgər categoryIds varsa, category-ləri yenilə
  if (payload?.CategoryIds && payload?.CategoryIds.length > 0) {
    // Köhnə category-ləri sil
    let deleted = await ArticleCategory.destroy({
      where: { ModelId: id },
    });

    // Yeni category-ləri yarat
    const records = payload?.CategoryIds.map((catId) => ({
      CategoryId: catId,
      ModelId: id,
      isDeleted: false,
      CreatedDate: new Date(),
    }));

    const created = await ArticleCategory.bulkCreate(records);

    const check = await ArticleCategory.findAll({
      where: { ModelId: id },
    });
  }

  // 3. Yenilənmiş article-i gətir
  const articleWithCategories = await Article.findByPk(id, {
    include: [
      {
        model: Category,
        as: "categories",
        through: { attributes: [] },
      },
    ],
  });

  return articleWithCategories.toJSON();
};

export const remove = async (id) => {
  return Article.update(
    { isDeleted: true, LastUpdate: new Date() },
    { where: { Id: id } }
  );
};

export const getSimilar = async (articleId, limit = 4) => {
  // 1. Cari məqaləni və kateqoriyalarını tapırıq
  const article = await Article.findOne({
    where: { Id: articleId, isDeleted: false },
    include: [
      {
        model: Category,
        as: "categories",
        through: { attributes: [] },
      },
    ],
  });

  if (!article || !article.categories || article.categories.length === 0) {
    return [];
  }

  const categoryIds = article.categories.map((cat) => cat.Id);

  // 2. Oxşar məqalələri tapırıq
  const similar = await Article.findAll({
    where: {
      Id: { [Op.ne]: articleId }, // Cari məqaləni çıxarırıq
      isDeleted: false,
    },
    include: [
      {
        model: Category,
        as: "categories",
        where: { Id: categoryIds }, // Kateqoriya ID-ləri burada filtr olunur
        required: true, // VACİB: Bu, yalnız həmin kateqoriyası olanları gətirir
        through: { attributes: [] },
      },
    ],
    limit,
    order: [["ViewDate", "DESC"]],
  });

  return similar.map((item) => item.get({ plain: true }));
};
