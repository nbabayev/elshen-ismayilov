const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

// export default (sequelize, DataTypes) => {
//   const VideoCategory = sequelize.define(
//     "VideoCategory",
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       videoId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       categoryId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//     },
//     {
//       tableName: "video_categories",
//       timestamps: true,
//     }
//   );

//   return VideoCategory;
// };

const VideoCategory = sequelize.define(
  "VideoCategory",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "Id",
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "categories", key: "Id" },
      field: "CategoryId",
    },
    ModelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "videos", key: "Id" },
      field: "ModelId",
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: "isDeleted",
    },
  },
  {
    tableName: "VideoCategory",
    timestamps: true,
    createdAt: "CreatedDate",
    updatedAt: "LastUpdate",
  }
);

module.exports = VideoCategory;
