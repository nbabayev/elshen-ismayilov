// services/galleryService.ts
import { Gallery, GalleryImage, GalleryVideo, sequelize } from "@/models/index";

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

  //   async addImageToGallery(galleryId: number, imageUrl: string) {
  //     try {
  //       const image = await GalleryImage.create({
  //         galleryId,
  //         imageUrl,
  //         isDeleted: false,
  //         createdDate: new Date(),
  //       });
  //       return image;
  //     } catch (error: any) {
  //       throw new Error(`Şəkil əlavə edilə bilmədi: ${error.message}`);
  //     }
  //   }

  //   async addVideoToGallery(
  //     galleryId: number,
  //     videoUrl: string,
  //     title: string | null = null
  //   ) {
  //     try {
  //       const video = await GalleryVideo.create({
  //         galleryId,
  //         videoUrl,
  //         title,
  //         isDeleted: false,
  //         createdDate: new Date(),
  //       });
  //       return video;
  //     } catch (error: any) {
  //       throw new Error(`Video əlavə edilə bilmədi: ${error.message}`);
  //     }
  //   }

  async createImageGallery(data: any) {
    try {
      // 1. Create Gallery first
      const gallery = await Gallery.create({
        title: data.title,
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
            videoUrl: video.url,
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
            attributes: ["id", "videoUrl", "title", "createdDate"],
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
            attributes: ["id", "videoUrl", "title"],
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

      const { count, rows } = await Gallery.findAndCountAll({
        where: { isDeleted: false },
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

  async updateGallery(id: number, data: any) {
    try {
      const gallery = await Gallery.findByPk(id);

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
      if (data.images && Array.isArray(data.images)) {
        // Delete existing images
        await GalleryImage.update(
          { isDeleted: true, lastUpdate: new Date() },
          { where: { galleryId: id, isDeleted: false } }
        );

        // Create new images
        if (data.images.length > 0) {
          const imageRecords = data.images.map((imageUrl: string) => ({
            galleryId: id,
            imageUrl: imageUrl,
            isDeleted: false,
            createdDate: new Date(),
          }));

          await GalleryImage.bulkCreate(imageRecords);
        }
      }

      // Update videos if provided
      if (data.videos && Array.isArray(data.videos)) {
        // Delete existing videos
        await GalleryVideo.update(
          { isDeleted: true, lastUpdate: new Date() },
          { where: { galleryId: id, isDeleted: false } }
        );

        // Create new videos
        if (data.videos.length > 0) {
          const videoRecords = data.videos.map(
            (video: { url: string; title?: string }) => ({
              galleryId: id,
              videoUrl: video.url,
              title: video.title || null,
              isDeleted: false,
              createdDate: new Date(),
            })
          );

          await GalleryVideo.bulkCreate(videoRecords);
        }
      }

      // Return updated gallery with relations
      return await this.getGalleryById(id);
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
