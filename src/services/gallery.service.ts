// services/galleryService.ts
import { Gallery, GalleryImage, GalleryVideo, sequelize } from "@/models/index";
import { Op } from "sequelize";

interface GalleryData {
  title: string;
  thumbImg: string;
  viewDate: Date;
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

class GalleryService {
  async createGallery(data: GalleryData) {
    try {
      const gallery = await Gallery.create({
        title: data.title,
        thumbImg: data.thumbImg,
        viewDate: data.viewDate,
        isDeleted: false,
        createdDate: new Date(),
      });
      return gallery;
    } catch (error: any) {
      throw new Error(`Qalereya yaradıla bilmədi: ${error.message}`);
    }
  }

  async createImageGallery(data: any) {
    try {
      // 1. Create Gallery first
      const gallery = await Gallery.create({
        title: data.title,
        type: data.type,
        thumbImg: data.thumbImg,
        viewDate: new Date(data.viewDate),
        isDeleted: false,
        createdDate: new Date(),
      });
      // 2. Create GalleryImage records for each image
      if (data.images && data.images.length > 0) {
        const imageRecords = data.images.map((imageUrl: string) => ({
          galleryId: gallery.id,
          imageUrl: imageUrl,
          isDeleted: false,
          createdDate: new Date(),
        }));

        await GalleryImage.bulkCreate(imageRecords);
      }

      // 3. Return gallery with images
      return await this.getGalleryById(gallery.id);
    } catch (error: any) {
      throw new Error(`Image gallery yaradılarkən xəta: ${error.message}`);
    }
  }

  async createVideoGallery(data: any) {
    try {
      // 1. Create Gallery first
      const gallery = await Gallery.create({
        title: data.title,
        type: data.type,
        thumbImg: data.thumbImg,
        viewDate: new Date(data.viewDate),
        isDeleted: false,
        createdDate: new Date(),
      });

      // 2. Create GalleryVideo records for each video
      if (data.videos && data.videos.length > 0) {
        const videoRecords = data.videos.map(
          (video: { url: string; title?: string }) => ({
            galleryId: gallery.id,
            url: video.url,
            title: video.title || null,
            isDeleted: false,
            createdDate: new Date(),
          })
        );

        await GalleryVideo.bulkCreate(videoRecords);
      }

      // 3. Return gallery with videos
      return await this.getGalleryById(gallery.id);
    } catch (error: any) {
      throw new Error(`Video gallery yaradılarkən xəta: ${error.message}`);
    }
  }

  async getGalleryImages(galleryId: number) {
    try {
      const gallery = await Gallery.findOne({
        where: {
          id: galleryId,
          isDeleted: false,
        },
        attributes: ["id", "title", "thumbImg", "viewDate"],
        include: [
          {
            model: GalleryImage,
            as: "images",
            where: { isDeleted: false },
            required: false,
            attributes: ["id", "imageUrl", "createdDate"],
            order: [["createdDate", "DESC"]],
          },
        ],
      });

      if (!gallery) {
        throw new Error("Qalereya tapılmadı");
      }

      return gallery;
    } catch (error: any) {
      throw new Error(`Qalereya tapıla bilmədi: ${error.message}`);
    }
  }

  async getGalleryVideos(galleryId: number) {
    try {
      const gallery = await Gallery.findOne({
        where: {
          id: galleryId,
          isDeleted: false,
        },
        attributes: ["id", "title", "thumbImg", "viewDate"],
        include: [
          {
            model: GalleryVideo,
            as: "videos",
            where: { isDeleted: false },
            required: false,
            attributes: ["id", "url", "title", "createdDate"],
            order: [["createdDate", "DESC"]],
          },
        ],
      });

      if (!gallery) {
        throw new Error("Qalereya tapılmadı");
      }

      return gallery;
    } catch (error: any) {
      throw new Error(`Qalereya tapıla bilmədi: ${error.message}`);
    }
  }
  // --------------------
  async getGalleryById(id: number) {
    try {
      const gallery = await Gallery.findOne({
        where: {
          id,
          isDeleted: false,
        },
        include: [
          {
            model: GalleryImage,
            as: "images",
            where: { isDeleted: false },
            required: false,
            attributes: ["id", "imageUrl"],
          },
          {
            model: GalleryVideo,
            as: "videos",
            where: { isDeleted: false },
            required: false,
            attributes: ["id", "url", "title"],
          },
        ],
      });

      if (!gallery) {
        throw new Error("Qalereya tapılmadı");
      }

      return gallery;
    } catch (error: any) {
      throw new Error(`Qalereya tapıla bilmədi: ${error.message}`);
    }
  }

  async getAllGalleries(
    page: number = 1,
    limit: number = 10,
    type?: "image" | "video"
  ) {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = {
        isDeleted: false,
      };

      if (type) {
        whereClause.type = type;
      }

      const { count, rows } = await Gallery.findAndCountAll({
        where: whereClause,
        limit: Number(limit),
        offset: Number(offset),
        distinct: true, // ID təkrarlanmasının qarşısını alır
        order: [["viewDate", "DESC"]],
        include: [
          {
            model: GalleryImage,
            as: "images",
            where: { isDeleted: false },
            required: false, // Boş olsa belə gətirsin
          },
          {
            model: GalleryVideo,
            as: "videos",
            where: { isDeleted: false },
            required: false, // Boş olsa belə gətirsin
          },
        ],
        // Diqqət: Attributes və Group-u sınaq üçün çıxarırıq
      });

      return {
        data: rows,
        total: count,
      };
    } catch (error: any) {
      throw new Error(`Xəta: ${error.message}`);
    }
  }

  // async updateGallery(galleryId: number, data: any) {
  //   const t = await sequelize.transaction(); // Start a transaction
  //   try {
  //     const gallery = await Gallery.findByPk(galleryId, { transaction: t });

  //     if (!gallery) {
  //       throw new Error("Qalereya tapılmadı");
  //     }

  //     // Update gallery basic info
  //     const updateData: any = { lastUpdate: new Date() };
  //     if (data.title !== undefined) updateData.title = data.title;
  //     if (data.thumbImg !== undefined) updateData.thumbImg = data.thumbImg;
  //     if (data.viewDate !== undefined)
  //       updateData.viewDate = new Date(data.viewDate);
  //     await gallery.update(updateData, { transaction: t });

  //     // ==================== IMAGE UPDATE LOGIC (WITHIN TRANSACTION) ====================
  //     if (data.images && Array.isArray(data.images)) {
  //       const restImages_id = data.restImages_id || [];

  //       // 1. Soft-delete images that are no longer present
  //       const whereCondition: any = {
  //         galleryId,
  //         isDeleted: false,
  //       };
  //       if (restImages_id.length > 0) {
  //         whereCondition.id = { [Op.notIn]: restImages_id };
  //       }
  //       await GalleryImage.update(
  //         { isDeleted: true, lastUpdate: new Date() },
  //         { where: whereCondition, transaction: t }
  //       );

  //       // 2. Find existing image URLs to prevent duplicates
  //       const existingImages = await GalleryImage.findAll({
  //         where: { galleryId, isDeleted: false },
  //         attributes: ["imageUrl"],
  //         transaction: t, // Ensure this read is part of the transaction
  //       });
  //       const existingUrls = existingImages.map((img: any) => img.imageUrl);

  //       // 3. Filter out only the new URLs to be created
  //       const newUrlsToCreate = data.images.filter(
  //         (url: string) => !existingUrls.includes(url)
  //       );

  //       // 4. Bulk create new images if any
  //       if (newUrlsToCreate.length > 0) {
  //         const imageRecords = newUrlsToCreate.map((imageUrl: string) => ({
  //           galleryId,
  //           imageUrl,
  //           isDeleted: false,
  //           createdDate: new Date(),
  //         }));
  //         await GalleryImage.bulkCreate(imageRecords, { transaction: t });
  //       }
  //     }
  //     // =================================================================================

  //     // ==================== VIDEO UPDATE LOGIC (WITHIN TRANSACTION) ====================
  //     if (data.videos !== undefined && Array.isArray(data.videos)) {
  //       // 1. Soft-delete all existing videos for this gallery
  //       await GalleryVideo.update(
  //         { isDeleted: true, lastUpdate: new Date() },
  //         { where: { galleryId, isDeleted: false }, transaction: t }
  //       );

  //       // 2. Create new videos if any are provided in the payload
  //       if (data.videos.length > 0) {
  //         const videoRecords = data.videos.map(
  //           (video: { url: string; title?: string }) => ({
  //             galleryId,
  //             url: video.url,
  //             title: video.title || null,
  //             isDeleted: false,
  //             createdDate: new Date(),
  //           })
  //         );
  //         await GalleryVideo.bulkCreate(videoRecords, { transaction: t });
  //       }
  //     }
  //     // =================================================================================

  //     await t.commit(); // If all goes well, commit the transaction
  //     return await this.getGalleryById(galleryId);
  //   } catch (error: any) {
  //     await t.rollback(); // If any error occurs, rollback all changes
  //     throw new Error(`Qalereya yenilənə bilmədi: ${error.message}`);
  //   }
  // }
  // asagidaki versiyada race condition var onu yoxla mutleq musahibede lazimdir
  async updateGallery(galleryId: number, data: any) {
    try {
      const gallery = await Gallery.findByPk(galleryId);

      if (!gallery) {
        throw new Error("Qalereya tapılmadı");
      }
      // Update gallery basic info
      const updateData: any = {
        lastUpdate: new Date(),
      };

      if (data.title !== undefined) updateData.title = data.title;
      if (data.thumbImg !== undefined) updateData.thumbImg = data.thumbImg;
      if (data.viewDate !== undefined)
        updateData.viewDate = new Date(data.viewDate);

      await gallery.update(updateData);

      // Update images if provided
      if (data.restImages_id && Array.isArray(data.restImages_id)) {
        const restImages_id = data.restImages_id;

        if (restImages_id !== undefined) {
          const whereCondition: any = {
            galleryId,
            isDeleted: false,
          };

          if (restImages_id.length > 0) {
            whereCondition.id = {
              [Op.notIn]: restImages_id,
            };
          }

          // Delete (soft-delete) existing images
          await GalleryImage.update(
            { isDeleted: true, lastUpdate: new Date() },
            { where: whereCondition }
          );
        }
      }

      if (data.images && data.images.length > 0) {
        const imageRecords = data.images.map((imageUrl: string) => ({
          galleryId,
          imageUrl,
          isDeleted: false,
          createdDate: new Date(),
        }));

        await GalleryImage.bulkCreate(imageRecords);
      }

      // Update videos if provided
      if (data.videos && Array.isArray(data.videos)) {
        // Delete existing videos
        await GalleryVideo.update(
          { isDeleted: true, lastUpdate: new Date() },
          { where: { galleryId, isDeleted: false } }
        );

        // Create new videos
        if (data.videos.length > 0) {
          const videoRecords = data.videos.map(
            (video: { url: string; title?: string }) => ({
              galleryId,
              url: video.url,
              title: video.title || null,
              isDeleted: false,
              createdDate: new Date(),
            })
          );
          await GalleryVideo.bulkCreate(videoRecords);
        }
      }

      // Return updated gallery with relations
      return {
        message: "Qalereya yeniləndi",
        data: await this.getGalleryById(galleryId),
      };
    } catch (error: any) {
      throw new Error(`Qalereya yenilənə bilmədi: ${error.message}`);
    }
  }

  async deleteVideo(videoId: number) {
    try {
      const video = await GalleryVideo.findByPk(videoId);

      if (!video) {
        throw new Error("Video tapılmadı");
      }

      await video.update({
        isDeleted: true,
        lastUpdate: new Date(),
      });

      return { message: "Video silindi" };
    } catch (error: any) {
      throw new Error(`Video silinə bilmədi: ${error.message}`);
    }
  }

  async deleteImage(imageId: number) {
    try {
      const image = await GalleryImage.findByPk(imageId);

      if (!image) {
        throw new Error("Şəkil tapılmadı");
      }

      await image.update({
        isDeleted: true,
        lastUpdate: new Date(),
      });

      return { message: "Şəkil silindi" };
    } catch (error: any) {
      throw new Error(`Şəkil silinə bilmədi: ${error.message}`);
    }
  }

  async deleteGallery(id: number) {
    try {
      const gallery = await Gallery.findByPk(id);

      if (!gallery) {
        throw new Error("Qalereya tapılmadı");
      }

      await gallery.update({
        isDeleted: true,
        lastUpdate: new Date(),
      });

      return { message: "Qalereya silindi" };
    } catch (error: any) {
      throw new Error(`Qalereya silinə bilmədi: ${error.message}`);
    }
  }
}

export default new GalleryService();
