#!/usr/bin/env node
/**
 * Admin şifrəsini bcrypt hash-ə çevirir.
 *
 * İstifadə:
 *   node scripts/hash-admin-password.mjs "SeninSifren"
 *   pnpm auth:hash -- "SeninSifren"
 */
import bcrypt from "bcryptjs";

const args = process.argv.slice(2);
if (args[0] === "--") args.shift();
const password = args[0];

if (!password) {
  console.error('İstifadə: node scripts/hash-admin-password.mjs "Sifre"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
const escaped = hash.replaceAll("$", "\\$");
console.log("\nADMIN_PASSWORD_HASH-i .env-ə belə yazın ($ işarələri qaçırılıb):\n");
console.log(`ADMIN_PASSWORD_HASH=${escaped}`);
console.log("");
