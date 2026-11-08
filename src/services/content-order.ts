import { getSequelize } from "@/@lib/api/db";
import { Model, ModelStatic, Order, Transaction, WhereOptions } from "sequelize";

export const contentListOrder: Order = [
  ["SortOrder", "ASC"],
  ["CreatedDate", "DESC"],
  ["Id", "DESC"],
];

export async function moveSortOrder(
  model: ModelStatic<Model>,
  where: WhereOptions,
  id: number,
  direction: "up" | "down"
) {
  const rows = await model.findAll({
    where,
    attributes: ["Id"],
    order: contentListOrder,
  });
  const ids = rows.map((row) => Number(row.get("Id")));
  const index = ids.indexOf(Number(id));
  const target = direction === "up" ? index - 1 : index + 1;

  if (index < 0 || target < 0 || target >= ids.length) {
    return { moved: false };
  }

  const next = [...ids];
  [next[index], next[target]] = [next[target], next[index]];

  const sequelize = getSequelize();
  await sequelize.transaction(async (transaction: Transaction) => {
    for (let i = 0; i < next.length; i++) {
      await model.update(
        { SortOrder: i },
        { where: { Id: next[i] }, transaction }
      );
    }
  });

  return { moved: true };
}

export async function toggleHiddenFlag(
  model: ModelStatic<Model>,
  id: number,
  deletedValue: boolean | number = false
) {
  const row = await model.findOne({
    where: { Id: id, isDeleted: deletedValue },
  });

  if (!row) {
    throw new Error("Tapılmadı");
  }

  const isHidden = !Boolean(row.get("isHidden"));
  await row.update({ isHidden });
  return { isHidden };
}
