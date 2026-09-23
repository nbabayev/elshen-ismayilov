// src/@lib/api/db.js
import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

const DB_STATE_KEY = Symbol.for("elshan.sequelize.connection");
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

  return sequelize;
}
