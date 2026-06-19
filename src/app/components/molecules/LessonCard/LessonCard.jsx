"use client";

// import {
//   Card,
//   CardMedia,
//   CardContent,
//   div,
// } from "@mui/material";
import styles from "./lessonCard.module.scss";
import sharedStyles from "../../shared/shared.module.scss";
import Image from "next/image";
import { formatDateISO } from "@/app/utils/formatDate";

export default function LessonCard({ data, setOpen }) {
  return (
    <div
      className="rounded-xl 
      
      overflow-hidden transition-transform transition-shadow duration-200 ease-in-out cursor-pointer group"
      onClick={() => setOpen({ isOpen: true, link: data?.Link })}
    >
      {/* Şəkil */}
      <div className="md:h-[215px] overflow-hidden flex items-center justify-center relative">
        <div className={sharedStyles.playIcon}>
          <Image
            //   className={styles.logo}
            src="/icons/play-white.svg"
            alt="section-icon"
            width={12}
            height={16}
            priority
          />
        </div>
        <img
          src={data?.Thumb_img}
          className="transition-transform duration-200 ease-in-out group-hover:scale-110 group-hover:shadow-lg
    w-100 md:h-[213px] object-cover
          "
          alt={data?.Title}
        />
        {/* {data.badge && (
          <Chip
            label={data.badge}
            color="primary"
            size="small"
            className={styles.badge}
          />
        )} */}
      </div>

      {/* Məlumat hissəsi */}
      <div className="flex bg-white p-[20px] justify-between">
        <div className={styles.date}>
          {formatDateISO(data?.CreatedDate, true)}
        </div>

        {data?.Title && (
          <div
            title={data?.Title}
            className={`transition-transform duration-200 ease-in-out group-hover:text-[#C88445]
              w-[256px]  overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]`}
          >
            {data?.Title}
          </div>
        )}
      </div>
    </div>
  );
}
