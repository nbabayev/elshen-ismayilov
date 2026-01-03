const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Video = sequelize.define(
  "Video",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "Id",
    },
    Title: { type: DataTypes.TEXT, allowNull: false, field: "Title" },
    Thumb_img: { type: DataTypes.TEXT, allowNull: false, field: "Thumb_img" },
    Selected_Thumb_img: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "Selected_Thumb_img",
    },
    Link: { type: DataTypes.TEXT, allowNull: false, field: "Link" },
    NonEmbedLink: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "NonEmbedLink",
    },
    Type: { type: DataTypes.INTEGER, allowNull: false, field: "Type" },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: "isDeleted",
    },
  },
  {
    tableName: "videos",
    timestamps: true,
    createdAt: "CreatedDate",
    updatedAt: "LastUpdate",
  }
);

module.exports = Video;
