#!/usr/bin/env node
/**
 * public/assets/uploads içində olmayan video şəkillərini
 * həmin sətirin YouTube linkindən endirir və bazanın gözlədiyi adla saxlayır.
 *
 *   node scripts/fill-missing-thumbs.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const uploadsDir = path.join(root, "public", "assets", "uploads");

function loadEnv(file) {
  const env = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
  return env;
}

function youtubeId(link) {
  const value = String(link || "");
  const match = value.match(
    /(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)([\w-]{11})/
  );
  return match ? match[1] : null;
}

function fileName(thumb) {
  const name = String(thumb || "").split("/").pop();
  if (!name || !/^[\w.-]+$/.test(name)) return null;
  return name;
}

async function downloadThumb(id) {
  const qualities = ["maxresdefault", "sddefault", "hqdefault"];
  for (const quality of qualities) {
    const url = `https://img.youtube.com/vi/${id}/${quality}.jpg`;
    const response = await fetch(url);
    if (!response.ok) continue;
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 5000) continue;
    return { bytes, quality };
  }
  return null;
}

const env = loadEnv(path.join(root, ".env"));
fs.mkdirSync(uploadsDir, { recursive: true });

const conn = await mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  port: Number(env.DB_PORT) || 3306,
  ssl: { rejectUnauthorized: false },
  charset: "utf8mb4",
});

const [rows] = await conn.query(
  "SELECT Id, Title, Thumb_img, Link FROM videos WHERE Thumb_img LIKE '/assets/uploads/%'"
);
await conn.end();

let saved = 0;
let skipped = 0;
const failed = [];

for (const row of rows) {
  const name = fileName(row.Thumb_img);
  if (!name) continue;
  const target = path.join(uploadsDir, name);
  if (fs.existsSync(target)) continue;

  const id = youtubeId(row.Link);
  if (!id) {
    failed.push(`${row.Id} link yoxdur`);
    continue;
  }

  const image = await downloadThumb(id);
  if (!image) {
    failed.push(`${row.Id} ${id}`);
    continue;
  }

  fs.writeFileSync(target, image.bytes);
  saved += 1;
  if (saved <= 5 || saved % 25 === 0) {
    console.log(`saved ${name} <- ${id} (${image.quality})`);
  }
}

skipped = rows.length - saved - failed.length;
console.log(
  JSON.stringify({ checked: rows.length, saved, alreadyThere: skipped, failed: failed.length })
);
if (failed.length) console.log(failed.slice(0, 20).join("\n"));
