// // src/@lib/api/db.js   ← sənin faylın
// console.log("ENV YOXLANIŞI:", process.env.DB_PASS);
// import { Sequelize } from "sequelize";
// import mysql2 from "mysql2"; // Bu sətri əlavə etdim (ən vacib xətanı həll edir)

// let sequelizeInstance = null;

// if (!sequelizeInstance) {
//   sequelizeInstance = new Sequelize(
//     process.env.DB_NAME, // ← sənin köhnə adın
//     process.env.DB_USER, // ← sənin köhnə adın
//     process.env.DB_PASS || "", // ← sənin köhnə adın (boş parol üçün də işləsin)
//     {
//       host: process.env.DB_HOST || "localhost",
//       port: Number(process.env.DB_PORT) || 3306,
//       dialect: "mysql",
//       dialectModule: mysql2, // Bu sətir bütün xətaları öldürür (mysql2 tapılmır, critical dependency və s.)
//       logging: false,

//       pool: {
//         max: 10,
//         min: 0,
//         acquire: 30000, // Bağlantı əldə etmək üçün maksimum vaxt
//         idle: 10000,
//       },

//       dialectOptions: {
//         charset: "utf8mb4",
//         connectTimeout: 10000,
//       },

//       define: {
//         charset: "utf8mb4",
//         collate: "utf8mb4_turkish_ci",
//         timestamps: true,
//         underscored: true, // created_at, updated_at
//       },

//       timezone: "+04:00", // Bakı vaxtı
//     }
//   );
// }

// // Hər dəfə yeni obyekt yaratmasın

// const sequelize = sequelizeInstance;

// const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("MySQL bağlantısı uğurludur");

//     // Development-də alter: true → yeni sütun əlavə edəndə avtomatik düzəldir
//     if (process.env.FIRST_TIME_SYNC === "true") {
//       await sequelize.sync({ alter: true });
//     }
//     // await sequelize.sync({
//     //   alter: process.env.NODE_ENV !== "production",
//     // });
//     console.log("Modellər sinxronlaşdırıldı");
//   } catch (err) {
//     console.error("DB bağlantı xətası:", err.message);
//     // Development-də dayansın, production-da crash etməsin
//     if (process.env.NODE_ENV !== "production") {
//       process.exit(1);
//     }
//   }
// };

// // Sənin əvvəlki export-un eynisi
// export { sequelize, connectDB };

// src/@lib/api/db.js
import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

let sequelizeInstance = null;
let hasConnected = false;

export function getSequelize() {
  if (!sequelizeInstance) {
    sequelizeInstance = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS || "",
      {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        dialect: "mysql",
        dialectModule: mysql2, // mysql2 problemini bu həll edir
        logging: false,
        define: {
          charset: "utf8mb4",
          collate: "utf8mb4_turkish_ci",
        },
        timezone: "+04:00", // Bakı vaxtı
      }
    );
  }
  return sequelizeInstance;
}

export async function connectDB() {
  const sequelize = getSequelize();

  if (!hasConnected) {
    await sequelize.authenticate();
    console.log("✅ MySQL bağlantısı uğurludur");
    hasConnected = true;
  }

  return sequelize;
}
