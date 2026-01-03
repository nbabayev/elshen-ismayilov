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

export default function LessonCard({ lesson, setOpen }) {
  return (
    <div
      className={styles.lessonCard}
      onClick={() => setOpen({ isOpen: true, link: lesson?.link })}
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
        <img
          src={lesson.thumbnail}
          className={styles.image}
          alt={lesson.title}
        />
        {/* {lesson.badge && (
          <Chip
            label={lesson.badge}
            color="primary"
            size="small"
            className={styles.badge}
          />
        )} */}
      </div>

      {/* Məlumat hissəsi */}
      <div className="flex bg-white p-[20px]">
        <div className={styles.date}>
          {formatDateISO(lesson.createdDate, true)}
        </div>

        {lesson.title && (
          <div
            className={`${styles.cardTitle} ${styles.cardTitleWidth} overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]`}
          >
            {lesson.title}
          </div>
        )}
      </div>
    </div>
  );
}
