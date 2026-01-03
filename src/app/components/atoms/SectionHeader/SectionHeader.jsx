import React from "react";
import Image from "next/image";
// styles
import styles from "./sectionHeader.module.scss";
// import { Box } from "@mui/material";

const SectionHeader = ({ label, icon }) => {
  return (
    // <div className="container px-2 max-w-[1180px]">
    <div className={styles.sectionHeader}>
      <div className={styles.sectionIcon}>
        <Image src={icon} alt="section-icon" width={80} height={80} priority />
      </div>
      {label}
    </div>
    // {/* </div> */}
  );
};

export default SectionHeader;
