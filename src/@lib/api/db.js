// src/@lib/api/db.js
import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

let sequelizeInstance = null;
let hasConnected = false;

export function getSequelize() {
  if (!sequelizeInstance) {
    const host = process.env.DB_HOST;
    const user = process.env.DB_USER;
    const name = process.env.DB_NAME;
    const port = Number(process.env.DB_PORT) || 12952; // Aiven default portu

    console.log("Connecting to database host:", host);

    if (!host || host === "localhost" || host === "127.0.0.1") {
      throw new Error(
        "CRITICAL: DB_HOST is not set correctly in production environment variables!"
      );
    }

    sequelizeInstance = new Sequelize(name, user, process.env.DB_PASS || "", {
      host: host,
      port: port,
      dialect: "mysql",
      dialectModule: mysql2,
      logging: false,
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
    });
  }
  return sequelizeInstance;
}

export async function connectDB() {
  const sequelize = getSequelize();

  if (!hasConnected) {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("✅ MySQL bağlantısı uğurludur");
    hasConnected = true;
  }

  return sequelize;
}
