import { GetSelectedResult, SelectedArticleWithArticle } from "@/app/types";
import {
  Article as ArticleModel,
  ArticleCategory,
  Category,
  SelectedArticle,
} from "@/models/index";
import { Op, WhereOptions, FindOptions, InferAttributes } from "sequelize";
type Article = InferAttributes<typeof ArticleModel>;

async function getAllDescendantCategoryIds(
  categoryIds: number[]
): Promise<number[]> {
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

    children.forEach((child: { Id: number }) => {
      if (!allIds.has(child.Id)) {
        allIds.add(child.Id);
        toProcess.push(child.Id);
      }
    });
  }

  return Array.from(allIds);
}

interface GetAllArticlesParams {
  search?: string;
  categoryIds?: (string | number)[] | string;
  selectedOnly?: boolean;
  limit: number;
  page: number;
}

export const getAll = async ({
  categoryIds,
  search,
  selectedOnly,
  limit,
  page,
}: GetAllArticlesParams): Promise<{
  data: (Article & { isSelected: boolean })[];
  total: number;
}> => {
  // if (forHomepage === "homepage") {
  //   const homepageResult = await getHomepageArticles(Number(limit) || 4);
  //   return {
  //     ...homepageResult,
  //     data: homepageResult.data.map((article) => ({
  //       ...article,
  //       isSelected: false,
  //     })),
  //   };
  // }

  const perPage = Number(limit) || 10;
  const currentPage = Number(page) || 1;

  const where: WhereOptions<Article> = { isDeleted: false };

  if (search) {
    where.Title = { [Op.like]: `%${search}%` };
  }

  const selectedArticles = await SelectedArticle.findAll({
    where: { isDeleted: false },
    attributes: ["ObjectId"],
    raw: true,
  });
  const selectedIds = new Set(selectedArticles.map((s: any) => s.ObjectId));

  if (selectedOnly) {
    (where as any).Id = { [Op.in]: Array.from(selectedIds) };
  }

  let formattedCategoryIds: number[] = [];
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

  // Expand parent categories to include all their descendants
  if (formattedCategoryIds.length > 0) {
    formattedCategoryIds = await getAllDescendantCategoryIds(
      formattedCategoryIds
    );
  }

  const options: FindOptions<Article> = {
    where,
    limit: perPage,
    offset: (currentPage - 1) * perPage,
    order: [["CreatedDate", "DESC"]],
  };

  const isUmumi =
    !formattedCategoryIds?.length || formattedCategoryIds.includes(9999);

  if (!isUmumi) {
    options.include = [
      {
        model: Category,
        as: "categories",
        where: { Id: { [Op.in]: formattedCategoryIds }, isDeleted: 0 },
        through: { attributes: [], where: { isDeleted: 0 } },
        required: true,
      },
    ];
  }

  const total = await ArticleModel.count({
    ...options,
    distinct: true, // 👈 Dublikatları və JOIN çaşqınlığını aradan qaldırır
  });

  const rows = await ArticleModel.findAll(options);

  const data = rows.map((row: InstanceType<typeof ArticleModel>) => {
    const plain = row.toJSON() as Article;
    return { ...plain, isSelected: selectedIds.has(plain.Id) };
  });

  return { data, total };
};

export const getById = async (slug: string): Promise<Article | null> => {
  // Bu funksiyanın yeganə məsuliyyəti məlumatı çəkməkdir.
  // Baxış sayını artırmaq kimi "side effect"-lər burada olmamalıdır.
  // Bu məsuliyyəti `ViewCounter` komponenti və onun Server Action-ı daşıyır.
  const article = await ArticleModel.findOne({
    where: { Slug: slug, isDeleted: false },
    include: [
      {
        model: Category,
        as: "categories",
        through: { attributes: [] },
      },
    ],
  });
  if (!article) return null;

  return article.toJSON();
};

export const findBySlug = async (slug: string): Promise<Article | null> => {
  return ArticleModel.findOne({
    where: { Slug: slug, isDeleted: false },
  });
};

interface CreateArticlePayload {
  Title: string;
  Slug: string;
  ShortDescription?: string;
  Content?: string;
  Image?: string;
  ViewDate?: Date;
  ReadMinute?: number;
  NotifyUsers?: boolean;
  CategoryIds?: number[];
}

export const create = async (
  payload: CreateArticlePayload
): Promise<Article> => {
  let article = await ArticleModel.create({
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

  const articleWithCategories = await ArticleModel.findByPk(article.Id, {
    include: [
      {
        model: Category,
        as: "categories",
        through: { attributes: [] },
      },
    ],
  });

  if (!articleWithCategories) {
    throw new Error("Could not retrieve the article after creation.");
  }

  return articleWithCategories;
};

export const update = async (
  id: number,
  payload: Partial<CreateArticlePayload>
): Promise<Article> => {
  await ArticleModel.update(payload, { where: { Id: id } });

  // 2. Əgər categoryIds varsa, category-ləri yenilə
  if (payload?.CategoryIds && payload?.CategoryIds.length > 0) {
    // Köhnə category-ləri sil
    await ArticleCategory.destroy({
      where: { ModelId: id },
    });

    // Yeni category-ləri yarat
    const records = payload?.CategoryIds.map((catId) => ({
      CategoryId: catId,
      ModelId: id,
      isDeleted: false,
      CreatedDate: new Date(),
    }));

    await ArticleCategory.bulkCreate(records);
  }

  // 3. Yenilənmiş article-i gətir
  const articleWithCategories = await ArticleModel.findByPk(id, {
    include: [
      {
        model: Category,
        as: "categories",
        through: { attributes: [] },
      },
    ],
  });

  if (!articleWithCategories) {
    throw new Error("Could not retrieve the article after update.");
  }

  return articleWithCategories.toJSON();
};

export const remove = async (id: number): Promise<[number]> => {
  return ArticleModel.update(
    { isDeleted: true, LastUpdate: new Date() },
    { where: { Id: id } }
  );
};

export const getSimilar = async (
  slug: string,
  limit: number = 4
): Promise<Article[]> => {
  // 1. Cari məqaləni tapırıq
  const currentArticle = await ArticleModel.findOne({
    where: { Slug: slug, isDeleted: false },
    include: [
      {
        model: Category,
        as: "categories",
        through: { attributes: [] },
      },
    ],
  });

  if (
    !currentArticle ||
    !currentArticle.categories ||
    currentArticle.categories.length === 0
  ) {
    return [];
  }

  const categoryIds = currentArticle.categories.map((cat: any) => cat.Id);

  // 2. Oxşar məqalələri tapırıq
  const similar = await ArticleModel.findAll({
    where: {
      Slug: { [Op.ne]: slug }, // Cari məqaləni çıxarırıq
      isDeleted: false,
    },
    include: [
      {
        model: Category,
        as: "categories",
        where: { Id: { [Op.in]: categoryIds } },
        required: true,
        through: { attributes: [] },
      },
    ],
    raw: true,
    nest: true,
    limit,
    order: [["CreatedDate", "DESC"]],
  });

  // 3. Sequelize obyektlərini sadə JS obyektinə (plain JSON) çeviririk
  return JSON.parse(JSON.stringify(similar));
};

export const getHomepageArticles = async (
  limit: number = 4
): Promise<{ data: Article[]; total: number }> => {
  const options: FindOptions<Article> = {
    where: { isDeleted: false },
    order: [["CreatedDate", "DESC"]],
  };

  const total = await ArticleModel.count(options);
  const rows = await ArticleModel.findAll({ ...options, limit: Number(limit) });

  return { data: rows, total };
};

/**
 * Ana səhifə üçün admin tərəfindən seçilmiş məqalələri gətirir.
 * @param {number} limit - Gətiriləcək məqalə sayı
 */
export const getSelectedArticles = async (): Promise<GetSelectedResult> => {
  const result = await SelectedArticle.findAndCountAll({
    where: { isDeleted: false },
    include: [
      {
        model: ArticleModel,
        as: "article",
        where: { isDeleted: false },
        required: true,
        attributes: [
          "Id",
          "Title",
          "Slug",
          "ShortDescription",
          "Image",
          "CreatedDate",
          "ViewCount",
        ],
      },
    ],
    order: [["CreatedDate", "DESC"]],
    // distinct: true,
  });

  const total = await ArticleModel.count({
    where: {
      isDeleted: 0,
    },
  });
  return {
    data: result.rows.map((item: SelectedArticleWithArticle) => ({
      selectionId: item.Id,
      selectedDate: item.CreatedDate,
      article: {
        Id: item.article.Id,
        Title: item.article.Title,
        Slug: item.article.Slug,
        ShortDescription: item.article.ShortDescription,
        Image: item.article.Image,
        CreatedDate: item.article.CreatedDate,
        ViewCount: item.article.ViewCount,
      },
    })),
    total,
    count: result.count,
  };
};

/**
 * Bir məqalənin "seçilmiş" statusunu dəyişir (toggle).
 * @param {number} articleId - Məqalənin ID-si
 */
export const toggleArticleSelection = async (
  articleId: number
): Promise<{
  success: boolean;
  message: string;
  action: "removed" | "added";
}> => {
  const existing = await SelectedArticle.findOne({
    where: { ObjectId: articleId, isDeleted: false },
  });

  if (existing) {
    // Əgər artıq seçilibsə, seçimdən çıxar (soft delete)
    await existing.update({ isDeleted: true });
    return {
      success: true,
      message: "Məqalə seçimdən çıxarıldı",
      action: "removed",
    };
  } else {
    // Əgər seçilməyibsə, seçilmişlərə əlavə et
    const previouslyDeleted = await SelectedArticle.findOne({
      where: { ObjectId: articleId, isDeleted: true },
    });

    if (previouslyDeleted) {
      // Əgər əvvəl silinibse, statusunu bərpa et
      await previouslyDeleted.update({ isDeleted: false });
    } else {
      // Əgər heç vaxt olmayıbsa, yeni qeyd yarat
      await SelectedArticle.create({
        ObjectId: articleId,
        isDeleted: false,
      });
    }
    return { success: true, message: "Məqalə seçildi", action: "added" };
  }
};
