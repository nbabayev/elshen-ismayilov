// src/services/category.service.js
import { Category } from "@/models/index";

function buildTree(rows) {
  const byId = new Map(rows.map((r) => [r.Id, { ...r, children: [] }]));
  const roots = [];

  for (const item of byId.values()) {
    if (item.ParentId) {
      const parent = byId.get(item.ParentId);
      if (parent) parent.children.push(item);
      else roots.push(item);
    } else {
      roots.push(item);
    }
  }

  const sortFn = (a, b) => a.Name.localeCompare(b.Name);

  function dfs(node) {
    node.children.sort(sortFn);
    node.children.forEach(dfs);
  }

  roots.sort(sortFn);
  roots.forEach(dfs);

  return roots;
}

export async function getFlat(type) {
  const where = { isDeleted: 0 };
  if (type !== undefined) {
    where.Type = type;
  }

  const rows = await Category.findAll({
    where,
    order: [
      ["ParentId", "ASC"],
      ["Name", "ASC"],
    ],
    raw: true, // timestamps söndürdüyümüz üçün burada artıq problem YOXDUR
  });

  return rows;
}

export async function getTree(type) {
  const rows = await getFlat(type);
  return buildTree(rows);
}

export async function getById(id) {
  const row = await Category.findByPk(id, { raw: true });
  return row || null;
}

export async function createCategory(body) {
  const created = await Category.create({
    Name: body.name,
    ParentId: body.parentId ?? null,
    Type: body.type ?? 1,
    isHeader: body.isHeader ?? 0,
    isDeleted: 0,
    isHidden: body.isHidden ?? 0,
  });

  return created.get({ plain: true });
}

export async function updateCategory(id, body) {
  const data = {};
  if (body.name !== undefined) data.Name = body.name;
  if (body.parentId !== undefined) data.ParentId = body.parentId;
  if (body.type !== undefined) data.Type = body.type;
  if (body.isHeader !== undefined) data.isHeader = body.isHeader;
  if (body.isHidden !== undefined) data.isHidden = body.isHidden;
  if (body.isDeleted !== undefined) data.isDeleted = body.isDeleted;

  await Category.update(data, { where: { Id: id } });
  return getById(id);
}

export async function moveCategory(id, newParentId) {
  if (newParentId && Number(newParentId) === Number(id)) {
    throw new Error("Cannot set category as its own parent");
  }

  await Category.update(
    { ParentId: newParentId ?? null },
    { where: { Id: id } }
  );

  return getById(id);
}

export async function removeCategory(id) {
  await Category.update({ isDeleted: 1 }, { where: { Id: id } });

  return { ok: true };
}
