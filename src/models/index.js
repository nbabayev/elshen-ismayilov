// ✅ models/index.js – yalnız modellər və əlaqələr
// const { DataTypes } = require("sequelize");
// const { sequelize } = require("../config/db"); // Artıq hazır sequelize obyektini alırıq
import { DataTypes } from "sequelize";
import { getSequelize } from "@/@lib/api/db";

const sequelize = getSequelize();
const Settings = sequelize.define(
  "Settings",
  {
    LogoHeader: DataTypes.STRING,
    LogoFooter: DataTypes.STRING,
    SubscribeImage: DataTypes.STRING,
    SubscribeTitle: DataTypes.STRING,
    SubscribeSignature: DataTypes.STRING,
    Instagram: DataTypes.STRING,
    Facebook: DataTypes.STRING,
    Youtube: DataTypes.STRING,
    Tiktok: DataTypes.STRING,
    Telegram: DataTypes.STRING,
    Spotify: DataTypes.STRING,
    ShowStats: DataTypes.BOOLEAN,
    StudentCount: DataTypes.INTEGER,
  },
  {
    tableName: "Settings",
    timestamps: true,
    createdAt: "CreatedDate",
    updatedAt: "LastUpdate",
    underscored: false,
  }
);

// ✅ About modeli
const About = sequelize.define(
  "About",
  {
    poster: { type: DataTypes.STRING },
    logo: { type: DataTypes.STRING },
    education: { type: DataTypes.TEXT },
    activity: { type: DataTypes.TEXT },
    books: { type: DataTypes.TEXT },
  },
  {
    timestamps: true,
    underscored: false,
  }
);

const Slider = sequelize.define(
  "Slider",
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    Title: { type: DataTypes.TEXT, allowNull: true, field: "Title" },
    Image: { type: DataTypes.TEXT, allowNull: false, field: "Image" },
    Link: { type: DataTypes.TEXT, allowNull: true, field: "Link" },
    EmbedLink: { type: DataTypes.TEXT, allowNull: true, field: "EmbedLink" },
    isVideo: { type: DataTypes.BOOLEAN, allowNull: false, field: "isVideo" },
    isContent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isContent",
    },
    Signature: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "Signature",
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: "isDeleted",
    },
  },
  {
    tableName: "Sliders",
    timestamps: true,
    createdAt: "CreatedDate",
    updatedAt: "LastUpdate",
    underscored: false,
  }
);

const MiniSlider = sequelize.define(
  "MiniSlider",
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    ImageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "ImageUrl",
    },
    Link: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "Link",
    },
    NonEmbedLink: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "NonEmbedLink",
    },
    ListingNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "ListingNumber",
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "isDeleted",
    },
  },
  {
    tableName: "MiniSliders",
    timestamps: true,
    createdAt: "CreatedDate",
    updatedAt: "LastUpdate",
    underscored: false,
  }
);

/* -------------------- Category (mövcud cədvəl) -------------------- */

const Category = sequelize.define(
  "Category",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "Id",
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "Name",
    },
    ParentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "ParentId",
    },
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
    isHidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: "isHidden",
    },
  },
  {
    tableName: "categories",
    freezeTableName: true,
    timestamps: false,
  }
);

/* -------------------- Video (sənin verdiyin kimi) -------------------- */
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
    underscored: false,
  }
);

/* -------------------- VideoCategory (join table) -------------------- */
/* QEYD: səndə cədvəlin adı **videocategory**-dir, sütunlar: CategoryId, ModelId */
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
      field: "CategoryId",
    },
    ModelId: { type: DataTypes.INTEGER, allowNull: false, field: "ModelId" }, // = VideoId
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: "isDeleted",
    },
  },
  {
    tableName: "VideoCategory", // <<— səndə bu addır
    timestamps: true,
    createdAt: "CreatedDate",
    updatedAt: "LastUpdate",
    underscored: false,
    freezeTableName: true,
  }
);

const SelectedVideos = sequelize.define(
  "SelectedVideo",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ObjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "Videos",
        key: "Id",
      },
      onDelete: "CASCADE",
      onUpdate: "NO ACTION",
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    LastUpdate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "Selected_Videos",
    timestamps: false, // Çünki öz tarixi sahələriniz var
  }
);
/* -------------------- Assosiasiyalar (Many-to-Many) -------------------- */
// Video <-> Category (through videocategory)
Video.belongsToMany(Category, {
  through: {
    model: VideoCategory,
    unique: true,
  },
  foreignKey: "ModelId", // videocategory.ModelId  (Video Id)
  otherKey: "CategoryId", // videocategory.CategoryId
  as: "categories",
});

Category.belongsToMany(Video, {
  through: {
    model: VideoCategory,
    unique: true,
  },
  foreignKey: "CategoryId", // videocategory.CategoryId
  otherKey: "ModelId", // videocategory.ModelId
  as: "videos",
});

SelectedVideos.belongsTo(Video, {
  foreignKey: "ObjectId",
  as: "video",
});

const Article = sequelize.define(
  "Article",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "Id",
    },
    Title: { type: DataTypes.TEXT, allowNull: false, field: "Title" },
    ShortDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "ShortDescription",
    },
    Thumb_img: { type: DataTypes.TEXT, allowNull: false, field: "Thumb_img" },
    ViewCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "ViewCount",
    },
    ReadMinute: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "ReadMinute",
    },
    Image: { type: DataTypes.TEXT, allowNull: false, field: "Image" },
    Content: { type: DataTypes.TEXT, allowNull: false, field: "Content" },
    Slug: { type: DataTypes.TEXT, allowNull: false, field: "Slug" },
    ViewDate: { type: DataTypes.DATE, allowNull: false, field: "ViewDate" },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: "isDeleted",
    },
  },
  {
    tableName: "Blogs",
    timestamps: true,
    createdAt: "CreatedDate",
    updatedAt: "LastUpdate",
    underscored: false,
  }
);

const Contact = sequelize.define(
  "Contact",
  {
    Id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Name: { type: DataTypes.TEXT, allowNull: false },
    LastName: { type: DataTypes.TEXT, allowNull: false },
    Email: { type: DataTypes.TEXT, allowNull: false },
    Phone: { type: DataTypes.TEXT, allowNull: false },
    Message: { type: DataTypes.TEXT, allowNull: false },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isOwn: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "Contacts",
    timestamps: true,
    createdAt: "CreatedDate",
    updatedAt: "LastUpdate",
    underscored: false,
  }
);

export {
  sequelize,
  Slider,
  MiniSlider,
  Settings,
  About,
  Category,
  Video,
  VideoCategory,
  SelectedVideos,
  Article,
  Contact,
};
