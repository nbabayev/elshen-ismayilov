import { DataTypes } from "sequelize";
import { sequelize } from "@/@lib/api/db";

const Category = sequelize.define(
  "Category",
  {
    Id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: "Id",
    },
    Name: { type: DataTypes.STRING(255), allowNull: false, field: "Name" },
    ParentId: { type: DataTypes.BIGINT, allowNull: true, field: "ParentId" },
    Type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      field: "Type",
    },
    isHeader: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: "isHeader",
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: "isDeleted",
    },
    // Sequence:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: "Sequence" }, // istəsən sonra açarıq
    isHidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: "isHidden",
    },
  },
  {
    tableName: "categories",
    timestamps: true,
    createdAt: "CreatedDate",
    updatedAt: "LastUpdate",
  }
);

Category.hasMany(Category, {
  as: "children",
  foreignKey: "ParentId",
  sourceKey: "Id",
});
Category.belongsTo(Category, {
  as: "parent",
  foreignKey: "ParentId",
  targetKey: "Id",
});

Category.addScope("visible", { where: { isDeleted: 0, isHidden: 0 } });

export { Category };
