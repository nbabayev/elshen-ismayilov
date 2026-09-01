import { formatDateISO } from "@/app/utils/formatDate";
import Link from "next/link";
import React from "react";

type ArticleDataProps = {
  Image: string;
  Title: string;
  CreatedDate: string;
  ViewCount: number;
  ShortDescription: string;
};
type ArticleCardProps = {
  data: ArticleDataProps;
  highlighted?: boolean;
  stack?: boolean;
};

// data prop-u səndə "data"dır, elə saxladım
export function ArticleCard({
  data,
  highlighted = false,
  stack = false,
}: ArticleCardProps) {
  if (highlighted) {
    // SOL BÖYÜK - dəyişməz
    return (
      <article className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
        <div className="w-full md:h-[450px] h-[200px]">
          <img
            src={data?.Image || ""}
            alt={data?.Title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-8">
          {" "}
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <div className="font-medium">
              {formatDateISO(data?.CreatedDate)}
            </div>
            <div className="flex items-center ml-6 gap-1.5">
              <img src="icons/eye.svg" alt="" />
              <span className="ml-1">{data?.ViewCount}</span>
            </div>
          </div>
          <div className="text-[#003a3c]">
            <h2 className=" md:text-[28px] font-roboto-slab leading-tight md:mb-5 mb-3 h-[50px]">
              {data?.Title}
            </h2>
            <p className=" text-base font-lexend leading-relaxed mb-4 line-clamp-3">
              {data?.ShortDescription}
            </p>
          </div>
          <div className="mt-5">
            <span className="text-[#C88445] underline text-base font-semibold hover:text-[#A66835] transition-colors">
              Ətraflı
            </span>
          </div>
        </div>
      </article>
    );
  }

  // SAĞ KIÇIK - şəkil solda, mətn sağda
  return (
    <article
      className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer ${
        !stack && "md:flex"
      }`}
    >
      <div
        className={`${
          !stack && "md:w-[240px]"
        } md:h-[180px] lg:h-[180px] xl:h-[180px] h-[130px] flex-shrink-0`}
      >
        <img
          src={data?.Image || ""}
          alt={data?.Title}
          className="w-full object-cover md:h-[180px] h-full"
        />
      </div>

      <div className="p-2 sm:p-4 flex-1">
        <div className="flex items-center justify-between text-gray-500 text-xs sm:text-sm mb-3">
          <span className="font-medium">
            {formatDateISO(data?.CreatedDate)}
          </span>
          <div className="flex items-center sm:ml-6 gap-1.5">
            <img src="icons/eye.svg" alt="" />
            <span className="sm:ml-1">{data?.ViewCount}</span>
          </div>
        </div>
        <div className="text-[#003a3c]">
          <h2 className="lg:text-base md:text-base xl:text-xl font-roboto-slab font-medium leading-tight mb-1 sm:mb-3 line-clamp-2  h-[calc(1.3em*2)]">
            {data?.Title}
          </h2>
          <p className="text-xs sm:text-sm font-lexend sm:leading-relaxed line-clamp-2">
            {data?.ShortDescription}
          </p>
        </div>
      </div>
    </article>
  );
}
