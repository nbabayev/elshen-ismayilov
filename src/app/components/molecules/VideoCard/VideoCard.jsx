"use client";

import styles from "./videoCard.module.scss";
import sharedStyles from "../../shared/shared.module.scss";
import Image from "next/image";
import { formatDateISO } from "@/app/utils/formatDate";

export default function VideoCard({ data, setOpen }) {
  return (
    <div onClick={() => setOpen({ isOpen: true, link: data?.Link })}>
      <div className={styles.card}>
        <div
          className={styles.imageWrapper}
          sx={{ backgroundImage: `url("${data.thumbnail}")` }}
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
            src={data.thumbnail}
            className={styles.image}
            // alt={data.thumbnail}
          />
        </div>
        <div className=" pt-[20px]">
          <div className={styles.date}>{formatDateISO(data.createdDate)}</div>

          {data.title && (
            <div
              className={`${styles.cardTitle} ${styles.cardTitleWidth} overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]`}
            >
              {data.title}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
