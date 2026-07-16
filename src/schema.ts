import { z } from "zod";
const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const gallerySchema = z
  .object({
    title: z.string().min(1, "Başlıq mütləqdir!"),
    type: z.enum(["image", "video"], { message: "Tip seçilməlidir!" }), // 👈 Bax bu sənin union tipini yaradır

    // thumbImg həm File, həm də string (köhnə URL) ola bilər
    thumbImg: z.union(
      [
        z.string().min(1, "Örtük şəkli tələb olunur."),
        z
          .instanceof(File)
          .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            `Maksimum şəkil ölçüsü 5MB ola bilər.`
          )
          .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Yalnız .jpg, .jpeg, .png və .webp formatları dəstəklənir."
          ),
      ],
      { error: () => ({ message: "Örtük şəkli tələb olunur." }) }
    ),

    // images massivdir və hər bir elementi aşağıdakılardan biri ola bilər:
    images: z.array(
      z.union([
        z.string().url("Düzgün şəkil URL'i daxil edin."), // Köhnə kodla uyğunluq üçün
        z.instanceof(File), // Yeni yüklənən fayl
        z.object({
          // API-dən gələn obyekt formatı
          id: z.number(),
          imageUrl: z.string().url(),
        }),
      ])
    ),

    viewDate: z.string().min(1, "Tarix mütləqdir!"), // videos üçün sənin daxili tipin (məsələn url və title)
    videos: z.array(
      z.object({
        url: z.url("Düzgün video linki daxil edin"),
        title: z.string().optional(),
      })
    ),
  })
  // 🔥 Bura qızıl hissədir: type-a görə hansı massivin required olduğunu yoxlayırıq:
  .refine(
    (data) => {
      if (data.type === "image" && data.images.length === 0) return false;
      return true;
    },
    {
      message: "Ən azı bir şəkil əlavə olunmalıdır!",
      path: ["images"], // Xətanın hansı field-ə aid olduğunu bildiririk
    }
  )
  .refine(
    (data) => {
      if (data.type === "video" && data.videos.length === 0) return false;
      return true;
    },
    {
      message: "Ən azı bir video linki əlavə olunmalıdır!",
      path: ["videos"],
    }
  );

export type GalleryFormData = z.infer<typeof gallerySchema>;
