"use client";
import React from "react";
import Image from "next/image";
// styles
// import styles from "./button.module.scss";
// import { Box, Container } from "@mui/material";
import SectionHeader from "@/app/components/atoms/SectionHeader/SectionHeader";

const Section = ({ sectionHeader, content, patternClass }) => {
  return (
    <>
      <div className="flex justify-center mb-15">
        {/* <Container sx={{ mt: 20 }}> */}
        <div
          className={`container md:px-6 px-6 max-w-[1180px] ${
            patternClass ? "md:mb-35 mb-15" : ""
          }`}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "rgba(0, 58, 60, 1)",
              fontFamily: "var(--font-lexend)",
              width: "100%",
              borderBottom: "1px solid rgba(191, 191, 191, 1)",
              // marginBottom: "36px",
              paddingBottom: "32px",
            }}
          >
            {sectionHeader}

            {/* // her sehife ucun ayirca div formatinda hazirlayb bura gonderecem prop
      kimi */}
          </div>
        </div>
        {/* </Container> */}
      </div>
      <div className={`flex justify-center ${patternClass} mb-15`}>
        <div className="container md:px-6 px-6 max-w-[1180px]">{content}</div>
      </div>
    </>
  );
};

export default Section;
