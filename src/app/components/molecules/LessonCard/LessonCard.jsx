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
      className={styles.lessonCard}
      onClick={() => setOpen({ isOpen: true, link: data?.Link })}
    >
      {/* Şəkil */}
      <div className={styles.imageWrapper}>
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
        <img src={data?.Thumb_img} className={styles.image} alt={data?.Title} />
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
      <div className="flex bg-white p-[20px]">
        <div className={styles.date}>
          {formatDateISO(data?.CreatedDate, true)}
        </div>

        {data?.Title && (
          <div
            className={`${styles.cardTitle} ${styles.cardTitleWidth} overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]`}
          >
            {data?.Title}
          </div>
        )}
      </div>
    </div>
  );
}
