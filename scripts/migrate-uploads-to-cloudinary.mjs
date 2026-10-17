#!/usr/bin/env node
/**
 * public/assets/uploads içindəki şəkilləri Cloudinary-yə yükləyir
 * və bazada /assets/uploads/... yollarını həmin ünvana dəyişir.
 * Lokal fayllar silinmir. Yarımçıq qalsa, eyni əmri yenidən işlət.
 *
 *   node scripts/migrate-uploads-to-cloudinary.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import { v2 as cloudinary } from "cloudinary";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const uploadsDir = path.join(root, "public", "assets", "uploads");
const mapFile = path.join(root, "scripts", ".cloudinary-upload-map.json");
const folder = "elshan_uploads";
const concurrency = 4;
const imageExt = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function loadEnv(file) {
  const env = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
  return env;
}

function ident(value) {
  if (!/^[A-Za-z0-9_]+$/.test(value)) {
    throw new Error(`Unexpected identifier: ${value}`);
  }
  return `\`${value}\``;
}

function publicId(name) {
  return `${folder}/${name.replace(/\.[^.]+$/, "")}`;
}

function loadMap() {
  if (!fs.existsSync(mapFile)) return {};
  return JSON.parse(fs.readFileSync(mapFile, "utf8"));
}

let mapWrite = Promise.resolve();
function saveMap(map) {
  const body = JSON.stringify(map, null, 2);
  mapWrite = mapWrite.then(() => fs.promises.writeFile(mapFile, body));
  return mapWrite;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(work) {
  let delay = 1000;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      return await work();
    } catch (error) {
      const code = error?.http_code;
      const retry = code === 420 || code === 429 || code === 499 || code >= 500;
      if (!retry || attempt === 5) throw error;
      await sleep(delay);
      delay *= 2;
    }
  }
}

async function uploadOne(filePath, name) {
  const id = publicId(name);
  try {
    const result = await withRetry(() =>
      cloudinary.uploader.upload(filePath, {
        public_id: id,
        overwrite: false,
        resource_type: "image",
        unique_filename: false,
      })
    );
    return result.secure_url;
  } catch (error) {
    const message = String(error?.message || error);
    if (!/already exists/i.test(message)) throw error;
    const existing = await withRetry(() =>
      cloudinary.api.resource(id, { resource_type: "image" })
    );
    return existing.secure_url;
  }
}

async function pool(items, worker) {
  let index = 0;
  async function run() {
    while (index < items.length) {
      const current = index;
      index += 1;
      await worker(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
}

async function columnsWithUploads(conn, database) {
  const [cols] = await conn.query(
    `SELECT TABLE_NAME, COLUMN_NAME
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ?
       AND DATA_TYPE IN ('varchar','char','text','tinytext','mediumtext','longtext')`,
    [database]
  );
  const hits = [];
  for (const col of cols) {
    if (!/^[A-Za-z0-9_]+$/.test(col.TABLE_NAME) || !/^[A-Za-z0-9_]+$/.test(col.COLUMN_NAME)) {
      continue;
    }
    const [rows] = await conn.query(
      `SELECT COUNT(*) AS c FROM ${ident(col.TABLE_NAME)} WHERE ${ident(col.COLUMN_NAME)} LIKE '%/assets/uploads/%'`
    );
    if (Number(rows[0].c) > 0) {
      const [keys] = await conn.query(
        `SELECT COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND CONSTRAINT_NAME = 'PRIMARY'
         ORDER BY ORDINAL_POSITION LIMIT 1`,
        [database, col.TABLE_NAME]
      );
      hits.push({
        table: col.TABLE_NAME,
        column: col.COLUMN_NAME,
        pk: keys[0]?.COLUMN_NAME || null,
        count: Number(rows[0].c),
      });
    }
  }
  return hits;
}

const env = loadEnv(path.join(root, ".env"));
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

const map = loadMap();
const files = fs
  .readdirSync(uploadsDir)
  .filter((name) => imageExt.has(path.extname(name).toLowerCase()) && /^[\w.-]+$/.test(name));

const pending = files.filter((name) => !map[name]);
console.log(
  JSON.stringify({
    files: files.length,
    alreadyUploaded: files.length - pending.length,
    pending: pending.length,
  })
);

const failed = [];
let uploaded = 0;
await pool(pending, async (name) => {
  try {
    map[name] = await uploadOne(path.join(uploadsDir, name), name);
    uploaded += 1;
    await saveMap(map);
    if (uploaded % 25 === 0 || uploaded === pending.length) {
      console.log(`uploaded ${uploaded}/${pending.length}`);
    }
  } catch (error) {
    failed.push(`${name} ${error?.http_code || ""} ${error?.message || error}`.trim());
  }
});
await mapWrite;

const conn = await mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  port: Number(env.DB_PORT) || 3306,
  ssl: { rejectUnauthorized: false },
  charset: "utf8mb4",
});

const hits = await columnsWithUploads(conn, env.DB_NAME);
let updated = 0;
let leftWithoutFile = 0;
const missingNames = new Set();

for (const hit of hits) {
  if (!hit.pk) {
    console.log(`skip ${hit.table}.${hit.column}: primary key yoxdur`);
    continue;
  }
  const [rows] = await conn.query(
    `SELECT ${ident(hit.pk)} AS id, ${ident(hit.column)} AS value
     FROM ${ident(hit.table)}
     WHERE ${ident(hit.column)} LIKE '%/assets/uploads/%'`
  );
  for (const row of rows) {
    let changed = false;
    const next = String(row.value).replace(/\/assets\/uploads\/([\w.-]+)/g, (full, name) => {
      if (!map[name]) {
        missingNames.add(name);
        return full;
      }
      changed = true;
      return map[name];
    });
    if (!changed) {
      leftWithoutFile += 1;
      continue;
    }
    await conn.query(
      `UPDATE ${ident(hit.table)} SET ${ident(hit.column)} = ? WHERE ${ident(hit.pk)} = ?`,
      [next, row.id]
    );
    updated += 1;
  }
}

const remaining = await columnsWithUploads(conn, env.DB_NAME);
await conn.end();

console.log(
  JSON.stringify(
    {
      uploaded,
      failed: failed.length,
      dbUpdated: updated,
      stillLocal: remaining,
      missingFiles: [...missingNames],
    },
    null,
    2
  )
);
if (failed.length) console.log(failed.slice(0, 30).join("\n"));
