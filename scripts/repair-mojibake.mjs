#!/usr/bin/env node
/**
 * .NET köçürməsində UTF-8 baytları CP857/CP437 kimi oxunub.
 * Hər işarə rəsmi kod səhifəsindən geriyə bayta çevrilir, sonra UTF-8 oxunur.
 * Tək mənalı nəticə olmayan xana dəyişdirilmir.
 *
 *   node scripts/repair-mojibake.mjs
 *   node scripts/repair-mojibake.mjs --apply
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apply = process.argv.includes("--apply");

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

function loadMap(file) {
  const uniToByte = new Map();
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^0x([0-9A-Fa-f]+)\s+0x([0-9A-Fa-f]+)/);
    if (!match) continue;
    const byte = parseInt(match[1], 16);
    const uni = parseInt(match[2], 16);
    if (byte >= 0x80) uniToByte.set(uni, byte);
  }
  return uniToByte;
}

const maps = ["cp437.txt", "cp850.txt", "cp857.txt"].map((name) =>
  loadMap(path.join(root, "scripts", name))
);

function choices(cp) {
  if (cp < 0x80) return [cp];
  const set = new Set();
  for (const map of maps) {
    if (map.has(cp)) set.add(map.get(cp));
  }
  return [...set];
}

function leadLen(byte) {
  if (byte < 0x80) return 1;
  if (byte >= 0xc2 && byte <= 0xdf) return 2;
  if (byte >= 0xe0 && byte <= 0xef) return 3;
  if (byte >= 0xf0 && byte <= 0xf4) return 4;
  return 0;
}

function expectsContinuation(bytes) {
  let index = 0;
  while (index < bytes.length) {
    const size = leadLen(bytes[index]);
    if (size === 0) return false;
    if (index + size > bytes.length) return true;
    index += size;
  }
  return false;
}

function repair(str) {
  if (typeof str !== "string" || str.length === 0) return { status: "skip" };
  if (![...str].some((ch) => ch.codePointAt(0) > 127)) return { status: "skip" };

  const bytes = [];
  for (const ch of str) {
    let options = choices(ch.codePointAt(0));
    if (options.length === 0) return { status: "unfixed" };
    if (options.length > 1) {
      const isContinuation = (byte) => (byte & 0xc0) === 0x80;
      options = expectsContinuation(bytes)
        ? options.filter(isContinuation)
        : options.filter((byte) => !isContinuation(byte) && leadLen(byte) > 0);
    }
    if (options.length !== 1) return { status: "ambiguous", options };
    bytes.push(options[0]);
  }

  if (expectsContinuation(bytes)) return { status: "unfixed" };

  try {
    const out = new TextDecoder("utf-8", { fatal: true }).decode(
      Buffer.from(bytes)
    );
    if (out === str || out.includes("\uFFFD") || /[\u2500-\u259F]/.test(out)) {
      return { status: "unfixed" };
    }
    return { status: "ok", value: out };
  } catch {
    return { status: "unfixed" };
  }
}

function quoteId(name) {
  if (!/^[A-Za-z0-9_]+$/.test(name)) throw new Error(`Bad identifier: ${name}`);
  return `\`${name}\``;
}

const env = loadEnv(path.join(root, ".env"));

const conn = await mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  port: Number(env.DB_PORT) || 3306,
  ssl: { rejectUnauthorized: false },
  charset: "utf8mb4",
});

const [columns] = await conn.query(
  `SELECT TABLE_NAME, COLUMN_NAME
   FROM information_schema.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE()
     AND DATA_TYPE IN ('char','varchar','text','tinytext','mediumtext','longtext')
     AND TABLE_NAME <> '__efmigrationshistory'
   ORDER BY TABLE_NAME, ORDINAL_POSITION`
);

const byTable = new Map();
for (const row of columns) {
  if (!byTable.has(row.TABLE_NAME)) byTable.set(row.TABLE_NAME, []);
  byTable.get(row.TABLE_NAME).push(row.COLUMN_NAME);
}

const summary = [];
let updated = 0;
let ambiguous = 0;
let unfixed = 0;

if (apply) await conn.beginTransaction();

try {
  for (const [table, textColumns] of byTable) {
    const [pkRows] = await conn.query(
      `SELECT k.COLUMN_NAME
       FROM information_schema.TABLE_CONSTRAINTS t
       JOIN information_schema.KEY_COLUMN_USAGE k
         ON t.CONSTRAINT_NAME = k.CONSTRAINT_NAME
        AND t.TABLE_SCHEMA = k.TABLE_SCHEMA
        AND t.TABLE_NAME = k.TABLE_NAME
       WHERE t.CONSTRAINT_TYPE = 'PRIMARY KEY'
         AND t.TABLE_SCHEMA = DATABASE()
         AND t.TABLE_NAME = ?
       ORDER BY k.ORDINAL_POSITION`,
      [table]
    );
    const pk = pkRows.map((row) => row.COLUMN_NAME);
    if (pk.length === 0) {
      summary.push(`${table}: primary key yoxdur, keçildi`);
      continue;
    }

    const selectList = [...pk, ...textColumns].map(quoteId).join(", ");
    const [rows] = await conn.query(
      `SELECT ${selectList} FROM ${quoteId(table)}`
    );

    let tableUpdated = 0;
    for (const row of rows) {
      const changes = [];
      for (const column of textColumns) {
        const current = row[column];
        if (typeof current !== "string" || current.length === 0) continue;
        const result = repair(current);
        if (result.status === "ok") {
          changes.push({ column, from: current, to: result.value });
        } else if (result.status === "ambiguous") {
          ambiguous += 1;
          console.log(
            `AMBIGUOUS ${table} ${pk.map((key) => row[key]).join(",")} ${column}`
          );
          for (const option of result.options) {
            console.log("  -", option.slice(0, 140));
          }
        } else if (result.status === "unfixed") {
          const suspicious =
            /[\u2500-\u259F\u00E3\u0192]/.test(current);
          if (suspicious) {
            unfixed += 1;
            console.log(
              `UNFIXED ${table} ${pk.map((key) => row[key]).join(",")} ${column}: ${current.slice(0, 140)}`
            );
          }
        }
      }

      if (changes.length === 0) continue;
      tableUpdated += 1;
      updated += 1;
      const where = pk.map((key) => `${quoteId(key)} = ?`).join(" AND ");
      const set = changes
        .map((change) => `${quoteId(change.column)} = ?`)
        .join(", ");
      const params = [
        ...changes.map((change) => change.to),
        ...pk.map((key) => row[key]),
      ];
      if (tableUpdated <= 3) {
        console.log(
          `FIX ${table} ${pk.map((key) => row[key]).join(",")} ${changes[0].column}`
        );
        console.log("  <", changes[0].from.slice(0, 140));
        console.log("  >", changes[0].to.slice(0, 140));
      }
      if (apply) {
        await conn.query(
          `UPDATE ${quoteId(table)} SET ${set} WHERE ${where}`,
          params
        );
      }
    }
    if (tableUpdated > 0) summary.push(`${table}: ${tableUpdated} sətir`);
  }

  if (apply) await conn.commit();
} catch (error) {
  if (apply) await conn.rollback();
  throw error;
} finally {
  await conn.end();
}

console.log(apply ? "\nYazıldı" : "\nYoxlama (bazaya yazılmadı)");
for (const line of summary) console.log(line);
console.log(`Cəmi sətir: ${updated}`);
console.log(`Qeyri-müəyyən: ${ambiguous}`);
console.log(`Açılmayan: ${unfixed}`);
