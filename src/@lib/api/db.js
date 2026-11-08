// src/@lib/api/db.js
import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

const DB_STATE_KEY = Symbol.for("elshan.sequelize.connection");
let contentColumnsReady = false;
let contentColumnsPromise = null;
const dbState = (globalThis[DB_STATE_KEY] ??= {
  sequelizeInstance: null,
  hasConnected: false,
  connectPromise: null,
});

export function getSequelize() {
  if (!dbState.sequelizeInstance) {
    const host = process.env.DB_HOST;
    const user = process.env.DB_USER;
    const name = process.env.DB_NAME;
    const port = Number(process.env.DB_PORT) || 12952; // Aiven default portu

    console.log("Connecting to database host:", host);

    if (
      process.env.NODE_ENV === "production" &&
      process.env.ALLOW_LOCAL_DB_IN_PRODUCTION !== "true"
    ) {
      if (!host || host === "localhost" || host === "127.0.0.1") {
        throw new Error(
          "CRITICAL: DB_HOST is not set correctly in production environment variables!"
        );
      }
    }

    dbState.sequelizeInstance = new Sequelize(
      name,
      user,
      process.env.DB_PASS || "",
      {
        host: host,
        port: port,
        dialect: "mysql",
        dialectModule: mysql2,
        logging: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 30000,
          evict: 10000,
        },
        dialectOptions: {
          ssl: {
            rejectUnauthorized: false,
          },
          connectTimeout: 20000,
        },
        define: {
          charset: "utf8mb4",
          collate: "utf8mb4_turkish_ci",
        },
        timezone: "+04:00", // Bakı vaxtı
      }
    );
  }
  return dbState.sequelizeInstance;
}

async function ensureContentColumns(sequelize) {
  const [rows] = await sequelize.query(`
    SELECT TABLE_NAME, COLUMN_NAME
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND (
        (TABLE_NAME = 'blogs' AND COLUMN_NAME IN ('SortOrder', 'isHidden'))
        OR (TABLE_NAME = 'videos' AND COLUMN_NAME IN ('SortOrder', 'isHidden'))
      )
  `);
  const have = new Set(rows.map((row) => `${row.TABLE_NAME}.${row.COLUMN_NAME}`));
  const statements = [];

  if (!have.has("blogs.SortOrder")) {
    statements.push(
      "ALTER TABLE `blogs` ADD COLUMN `SortOrder` INT NOT NULL DEFAULT 0"
    );
  }
  if (!have.has("blogs.isHidden")) {
    statements.push(
      "ALTER TABLE `blogs` ADD COLUMN `isHidden` TINYINT(1) NOT NULL DEFAULT 0"
    );
  }
  if (!have.has("videos.SortOrder")) {
    statements.push(
      "ALTER TABLE `videos` ADD COLUMN `SortOrder` INT NOT NULL DEFAULT 0"
    );
  }
  if (!have.has("videos.isHidden")) {
    statements.push(
      "ALTER TABLE `videos` ADD COLUMN `isHidden` TINYINT(1) NOT NULL DEFAULT 0"
    );
  }

  for (const sql of statements) {
    await sequelize.query(sql);
  }
}

export async function connectDB() {
  const sequelize = getSequelize();

  if (!dbState.hasConnected) {
    if (!dbState.connectPromise) {
      dbState.connectPromise = (async () => {
        try {
          await sequelize.authenticate();
          if (process.env.FIRST_TIME_SYNC === "true") {
            await sequelize.sync({ alter: true });
          }
          console.log("✅ MySQL bağlantısı uğurludur");
          dbState.hasConnected = true;
          return sequelize;
        } catch (err) {
          dbState.connectPromise = null;
          throw err;
        }
      })();
    }
    await dbState.connectPromise;
  }

  if (!contentColumnsReady) {
    if (!contentColumnsPromise) {
      contentColumnsPromise = ensureContentColumns(sequelize)
        .then(() => {
          contentColumnsReady = true;
        })
        .catch((err) => {
          contentColumnsPromise = null;
          throw err;
        });
    }
    await contentColumnsPromise;
  }

  return sequelize;
}
