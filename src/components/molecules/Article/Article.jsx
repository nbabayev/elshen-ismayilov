"use client";
import { formatDateISO } from "@/utils/formatDate";
import { useMediaQuery } from "@/utils/useMediaQuery";
import Link from "next/link";
import React from "react";

const Article = ({ data, highlighted }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <>
      {highlighted ? (
        <article className="">
          <img src={data?.image} alt="" className="w-full" />
          <div className="mt-4 flex flex-col justify-between">
            <header className="text-[#878787] text-base font-[roboto] flex mb-2">
              {formatDateISO(data?.date)}
              <div className="text-[#878787] text-sm font-[roboto] flex items-center ml-4">
                <img src="icons/eye.svg" alt="" />
                <span className="ml-1">{data?.views}</span>
              </div>
            </header>
            <div className="text-[#003A3C]">
              <h2 className="text-[#003A3C] text-xl font-[robotoSlab] font-medium leading-[100%]">
                {data?.title}
              </h2>
              <p className="mt-2 font-[lexend] text-base leading-[140%]">
                {data?.subtitle}
              </p>
            </div>
            <footer className="mt-4 text-[#C88445] !underline font-[roboto] text-base">
              Ətraflı
            </footer>
          </div>
        </article>
      ) : (
        <article className={`${isDesktop && "flex"} `}>
          <img
            src={data?.image}
            alt=""
            className={`${!isDesktop && "w-full"}`}
          />
          <div
            className={`${isDesktop && "w-[280px] ml-5"} ${
              !isDesktop && "mt-3 "
            }flex flex-col justify-between`}
          >
            <header>
              <span
                // dateTime={data?.date}
                className="text-[#878787] text-base font-[roboto]"
              >
                {formatDateISO(data?.date)}
              </span>
            </header>
            <div className="text-[#003A3C] mt-2">
              <h2 className="text-[#003A3C] text-xl font-[robotoSlab] font-medium leading-[100%]">
                {data?.title}
              </h2>
              <p className="mt-2 font-[lexend] text-base leading-[140%] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
                {data?.subtitle}
              </p>
            </div>
            <footer className="mt-4">
              <div className="text-[#878787] text-sm font-[roboto] flex">
                <img src="icons/eye.svg" alt="" />
                <span className="ml-1">{data?.views}</span>
              </div>
            </footer>
          </div>
        </article>
      )}
    </>
  );
};

export default Article;
