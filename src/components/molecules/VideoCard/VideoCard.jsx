"use client";

// import {
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   div,
//   Chip,
// } from "@mui/material";
import styles from "./videoCard.module.scss";
import sharedStyles from "../../shared/shared.module.scss";
import Image from "next/image";

export default function VideoCard({ lesson }) {
  return (
    <div className={styles.card}>
      {/* Şəkil */}
      <div
        className={styles.imageWrapper}
        sx={{ backgroundImage: `url("${lesson.image}")` }}
      >
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
        {/* <CardMedia
          component="img"
          image={lesson.image}
          alt={lesson.title}
          className={styles.image}
        /> */}
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
      <div className=" pt-[20px]">
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
