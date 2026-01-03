"use client";

import styles from "./videoCard.module.scss";
import sharedStyles from "../../shared/shared.module.scss";
import Image from "next/image";
import { formatDateISO } from "@/app/utils/formatDate";

export default function VideoCard({ video, setOpen }) {
  return (
    <div onClick={() => setOpen({ isOpen: true, link: video?.Link })}>
      <div className={styles.card}>
        <div
          className={styles.imageWrapper}
          sx={{ backgroundImage: `url("${video.image}")` }}
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
          <img
            src={video.Thumb_img}
            className={styles.image}
            alt={video.title}
          />
        </div>
        <div className=" pt-[20px]">
          <div className={styles.date}>{formatDateISO(video.CreatedDate)}</div>

          {video.Title && (
            <div
              className={`${styles.cardTitle} ${styles.cardTitleWidth} overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]`}
            >
              {video.Title}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
