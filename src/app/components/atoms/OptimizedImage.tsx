import Image, { ImageProps } from "next/image";

interface OptimizedImageProps extends Omit<ImageProps, "src"> {
  src: string;
  type?: "slider" | "card" | "thumbnail";
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  type = "card",
  alt,
  ...props
}: OptimizedImageProps) {
  // src propu boş ("") və ya təyin edilməyibsə, xətanın qarşısını almaq üçün
  // heç bir şey render etmirik.
  if (!src) {
    return null;
  }
  // 1. Cloudinary URL-ni avtomatik optimallaşdırmaq
  let optimizedSrc = src;

  if (src && src.includes("res.cloudinary.com")) {
    // Slayder, kart və ya kiçik thumbnail olmasına görə ölçü təyin edirik
    let transformParams = "w_800,q_auto,f_auto"; // default olaraq orta ölçü (kartlar üçün)

    if (type === "slider") {
      transformParams = "w_1600,q_80,f_auto"; // böyük ekran slayderi üçün
    } else if (type === "thumbnail") {
      transformParams = "w_300,q_auto,f_auto"; // profil və ya kiçik şəkillər üçün
    }

    // URL-dəki "/upload/" hissəsindən dərhal sonra parametrləri əlavə edirik
    optimizedSrc = src.replace("/upload/", `/upload/${transformParams}/`);
  }

  // 2. Təbəqəsinə görə "sizes" atributunu təyin etmək
  let sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"; // default card üçün

  if (type === "slider") {
    sizes = "100vw"; // slayder həmişə tam ekran
  } else if (type === "thumbnail") {
    sizes = "150px"; // kiçik profil şəkli
  }

  return (
    <Image
      src={optimizedSrc}
      alt={alt || "Galereya şəkili"}
      sizes={sizes}
      {...props}
    />
  );
}
