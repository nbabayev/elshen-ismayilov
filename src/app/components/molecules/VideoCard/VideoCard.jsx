"use client";

import styles from "./videoCard.module.scss";
import sharedStyles from "../../shared/shared.module.scss";
import Image from "next/image";
import { formatDateISO } from "@/app/utils/formatDate";
import { fixBrokenText } from "@/app/utils/fixBrokenText";
import OptimizedImage from "@/app/components/atoms/OptimizedImage";

export default function VideoCard({ data, setOpen }) {
  // Əgər 'data' propu undefined və ya null olarsa, komponenti render etmə.
  // console.log(data);
  if (!data) {
    return null;
  }
  return (
    <div
      onClick={() => setOpen({ isOpen: true, link: data?.Link })}
      className=" flex-1 flex-col"
      // w-[260px]
    >
      <div className=" w-full mx-auto flex flex-col">
        {" "}
        {/* // max-w-[360px] */}
        <div
          className="relative md:h-[215px] h-[156px] w-full overflow-hidden bg-contain flex items-center justify-center"
          sx={{
            backgroundImage: `url("${data?.Thumb_img}")`,
          }}
        >
          <div className={sharedStyles.playIcon}>
            <Image
              src="/icons/play-white.svg"
              alt="section-icon"
              width={12}
              height={16}
              priority
            />
          </div>
          <OptimizedImage
            src={data?.Thumb_img}
            alt={data?.Title}
            fill
            className="rounded object-cover object-top"
            // priority={index < 2} // İlk 1-2 şəklin (LCP) dərhal yüklənməsi üçün
          />
        </div>
        <div className=" pt-[20px]">
          <div className={styles.date}>{formatDateISO(data?.CreatedDate)}</div>

          {data.Title && (
            <div
              className={`${styles.cardTitle} ${styles.cardTitleWidth} overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]`}
            >
              {fixBrokenText(data.Title)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
