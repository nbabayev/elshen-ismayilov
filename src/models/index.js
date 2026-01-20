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
    Thumb_img: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "Thumb_img",
      defaultValue: "",
    },
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

const ArticleCategory = sequelize.define(
  "BlogsCategory",
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ModelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    LastUpdate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "BlogsCategory",
    timestamps: false, // ← Sequelize öz createdAt/updatedAt yaratmasın
  }
);

Category.belongsToMany(Article, {
  through: ArticleCategory,
  foreignKey: "CategoryId",
  otherKey: "ModelId",
  as: "articles",
});

Article.belongsToMany(Category, {
  through: ArticleCategory, // ← Typo ilə yazılmış table adı
  foreignKey: "ModelId", // ← Article ID
  otherKey: "CategoryId", // ← Category ID
  as: "categories",
});

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

const Gallery = sequelize.define(
  "Gallery",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "Title",
    },
    thumbImg: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "Thumb_img",
    },
    viewDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "ViewDate",
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdDate: {
      type: DataTypes.DATE,
      field: "CreatedDate",
    },
    lastUpdate: {
      type: DataTypes.DATE,
      field: "LastUpdate",
    },
  },
  {
    tableName: "Galleries",
    timestamps: false,
  }
);
const GalleryImage = sequelize.define(
  "GalleryImage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    galleryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "GalleryId",
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "ImageUrl",
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdDate: {
      type: DataTypes.DATE,
      field: "CreatedDate",
    },
    lastUpdate: {
      type: DataTypes.DATE,
      field: "LastUpdate",
    },
  },
  {
    tableName: "GalleryImages",
    timestamps: false,
  }
);
const GalleryVideo = sequelize.define(
  "GalleryVideo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    galleryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    videoUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdDate: {
      type: DataTypes.DATE,
    },
    lastUpdate: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "GalleryVideos",
    timestamps: false,
  }
);
Gallery.hasMany(GalleryImage, {
  foreignKey: "GalleryId",
  as: "images",
});
Gallery.hasMany(GalleryVideo, {
  foreignKey: "GalleryId",
  as: "videos",
});

GalleryImage.belongsTo(Gallery, {
  foreignKey: "GalleryId",
  as: "gallery",
});

GalleryVideo.belongsTo(Gallery, {
  foreignKey: "GalleryId",
  as: "gallery",
});

const Subscription = sequelize.define(
  "Subscribes",
  {
    Id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      field: "CreatedDate",
    },
    LastUpdate: {
      type: DataTypes.DATE,
      field: "LastUpdate",
    },
  },
  {
    timestamps: false,
    tableName: "Subscribes",
  }
);

const ArticleNotification = sequelize.define(
  "ArticleNotification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    article_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "articles", // FK relation
        key: "id",
      },
      onDelete: "CASCADE",
    },
    notification_type: {
      type: DataTypes.STRING(50),
      defaultValue: "email",
    },
    status: {
      type: DataTypes.ENUM("pending", "sent", "failed"),
      defaultValue: "pending",
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "article_notifications",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

ArticleNotification.belongsTo(Article, {
  foreignKey: "article_id",
  as: "article",
});

Article.hasMany(ArticleNotification, {
  foreignKey: "article_id",
  as: "notifications",
});

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
  ArticleCategory,
  ArticleNotification,
  Gallery,
  GalleryImage,
  GalleryVideo,
  Contact,
  Subscription,
};
