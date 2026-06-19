"use client";
import React from "react";
import Image from "next/image";
// styles
import styles from "./sectionHeader.module.scss";
import { useMediaQuery } from "@/app/utils/useMediaQuery";
import Link from "next/link";
// import { Box } from "@mui/material";

const SectionHeader = ({ label, icon, total, link }) => {
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
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center justify-between ">
          <div className="md:mr-6 mr-4 ">
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
        <div className="md:text-[16px]">
          <Link href={`/${link}`} className="flex items-center text-[#ad6e33]">
            Hamısı
            <Image
              src="/icons/play-circle.svg"
              alt="section-icon"
              width={24}
              height={24}
              priority
              className="ml-2 me-2"
            />
            {total || 0}
          </Link>
        </div>
      </div>
    </div>
    // {/* </div> */}
  );
};

export default SectionHeader;
