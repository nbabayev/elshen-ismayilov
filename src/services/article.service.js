import { Article, ArticleCategory, Category } from "@/models/index";
import { Op } from "sequelize";

// Helper function to get all descendant category IDs
async function getAllDescendantCategoryIds(categoryIds) {
  if (!categoryIds || categoryIds.length === 0) return [];

  const allIds = new Set(categoryIds);
  const toProcess = [...categoryIds];

  while (toProcess.length > 0) {
    const currentIds = toProcess.splice(0, 100); // Process in batches
    const children = await Category.findAll({
      where: {
        ParentId: { [Op.in]: currentIds },
        isDeleted: 0,
      },
      attributes: ["Id"],
      raw: true,
    });

    children.forEach((child) => {
      if (!allIds.has(child.Id)) {
        allIds.add(child.Id);
        toProcess.push(child.Id);
      }
    });
  }

  return Array.from(allIds);
}

export const getAll = async ({ limit, page, search, categoryIds }) => {
  const perPage = Number(limit) || 10;
  const currentPage = Number(page) || 1;
  console.log("request coming here", categoryIds);
  const where = { isDeleted: false };

  // if (search) {
  //   where.Title = { [Op.like]: `%${search}%` };
  // }

  let formattedCategoryIds = [];
  if (categoryIds !== undefined && categoryIds !== null) {
    if (Array.isArray(categoryIds)) {
      formattedCategoryIds = categoryIds.map(Number);
    } else if (typeof categoryIds === "string") {
      const trimmed = categoryIds.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            formattedCategoryIds = parsed.map(Number);
          } else {
            formattedCategoryIds = [Number(parsed)];
          }
        } catch {
          formattedCategoryIds = trimmed
            .slice(1, -1)
            .split(",")
            .map((item) => Number(item.trim()));
        }
      } else if (trimmed.includes(",")) {
        formattedCategoryIds = trimmed
          .split(",")
          .map((item) => Number(item.trim()));
      } else {
        formattedCategoryIds = [Number(trimmed)];
      }
    } else {
      formattedCategoryIds = [Number(categoryIds)];
    }
  }

  formattedCategoryIds = formattedCategoryIds.filter((id) =>
    Number.isFinite(id)
  );

  // Expand parent categories to include all their descendants
  if (formattedCategoryIds.length > 0) {
    formattedCategoryIds = await getAllDescendantCategoryIds(
      formattedCategoryIds
    );
  }

  const options = {
    where,
    limit: perPage,
    offset: (currentPage - 1) * perPage,
    order: [["CreatedDate", "DESC"]],
  };

  const isUmumi =
    !formattedCategoryIds?.length || formattedCategoryIds.includes(9999);

  if (!isUmumi) {
    const includeConfig = {
      model: Category,
      as: "categories",
      where: { Id: { [Op.in]: formattedCategoryIds }, isDeleted: 0 },
      through: { where: { isDeleted: 0 } },
      required: true,
    };
    options.include = [includeConfig];
  }

  const total = await Article.count({
    ...options,
    distinct: true, // 👈 Dublikatları və JOIN çaşqınlığını aradan qaldırır
  });

  const rows = await Article.findAll(options);
  return { data: rows, total };
};

export const getById = async (slug) => {
  const article = await Article.findOne({
    where: { Slug: slug, isDeleted: false },
    include: [
      {
        model: Category,
        as: "categories",
        through: { attributes: [] },
      },
    ],
  });

  if (article) {
    await article.increment("viewCount", {
      by: 1,
      // where: { Id: id },
    });
  }

  return article;
};

export const findBySlug = async (slug) => {
  return Article.findOne({
    where: { Slug: slug, isDeleted: false },
  });
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

  // if (shouldNotify) {
  //   await ArticleNotification.create({
  //     article_id: article.id,
  //     notification_type: "email",
  //     status: "pending",
  //   });
  // }

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
