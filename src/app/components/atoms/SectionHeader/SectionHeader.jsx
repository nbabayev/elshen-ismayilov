"use client";
import React from "react";
import Image from "next/image";
// styles
import styles from "./sectionHeader.module.scss";
import { useMediaQuery } from "@/app/utils/useMediaQuery";
// import { Box } from "@mui/material";

const SectionHeader = ({ label, icon }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    // <div className="container px-2 max-w-[1180px]">
    <div
      className="
    flex 
    items-center 
    text-[#003a3c] 
    w-full 
    font-normal 
    md:text-[32px] 
    leading-[100%] 
    text-center
    font-lexend
  "
    >
      <div className="md:mr-16 mr-4">
        <Image
          src={icon}
          alt="section-icon"
          width={isDesktop ? 80 : 40}
          height={isDesktop ? 80 : 40}
          priority
        />
      </div>
      {label}
    </div>
    // {/* </div> */}
  );
};

export default SectionHeader;
