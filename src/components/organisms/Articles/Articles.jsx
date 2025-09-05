"use client";
import React from "react";
import Article from "@/components/molecules/Article/Article";
import { useMediaQuery } from "@/utils/useMediaQuery";
import Link from "next/link";
// import { Container } from "@mui/material";

const Articles = ({ data }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
      {isDesktop &&
        data?.map((d, index) => {
          if (d?.highlighted)
            return (
              <Link key={d.id} href={`/articles/${d.id}`}>
                <Article key={d.id} data={d} highlighted />
              </Link>
            );
        })}
      <div className="grid grid-cols-1 gap-4">
        {" "}
        {data?.map((d) => {
          if (!d?.highlighted) {
            return (
              <Link key={d.id} href={`/articles/${d.id}`}>
                <Article key={d.id} data={d} />
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Articles;
