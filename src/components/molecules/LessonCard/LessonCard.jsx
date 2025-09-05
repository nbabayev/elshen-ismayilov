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

export default function LessonCard({ lesson }) {
  return (
    <div className={styles.lessonCard}>
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
        <img src={lesson.image} className={styles.image} alt={lesson.title} />
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
        <div className={styles.date}>{lesson.date}</div>

        {lesson.title && (
          <div className={`${styles.cardTitle} ${styles.cardTitleWidth}`}>
            {lesson.title}
          </div>
        )}
      </div>
    </div>
  );
}
