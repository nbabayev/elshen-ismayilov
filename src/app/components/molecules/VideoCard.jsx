"use client";

import { formatDateISO } from "@/app/utils/formatDate";
import { fixBrokenText } from "@/app/utils/fixBrokenText";
import OptimizedImage from "@/app/components/atoms/OptimizedImage";
import PlayIcon from "@/app/components/molecules/PlayIcon";

export default function VideoCard({ data, setOpen, variant = "slider" }) {
  if (!data) {
    return null;
  }
  const imageHeight = variant === "content" ? "" : "h-[156px] md:h-[215px]";
  return (
    <div
      onClick={() => setOpen({ isOpen: true, link: data?.Link })}
      className=" flex-1 flex-col"
    >
      <div className=" w-full mx-auto flex flex-col">
        <div
          className={`relative ${imageHeight} w-full overflow-hidden bg-contain flex items-center justify-center`}
          sx={{
            backgroundImage: `url("${data?.Thumb_img}")`,
          }}
        >
          <PlayIcon />
          <img
            src={data?.Thumb_img}
            alt={data?.Title}
            className="w-full object-cover  h-full object-top"
          />
          {/* <OptimizedImage
            src={data?.Thumb_img}
            alt={data?.Title}
            fill
            className="w-full object-cover md:h-[180px] h-full object-top"
            // priority={index < 2} // İlk 1-2 şəklin (LCP) dərhal yüklənməsi üçün
          /> */}
        </div>
        <div className=" pt-[20px]">
          <div className="font-roboto-slab text-[14px] font-normal leading-none text-[#878787]">
            {formatDateISO(data?.CreatedDate)}
          </div>

          {data.Title && (
            <div
              className={`mt-[10px] font-roboto-slab lg:text-base md:text-base xl:text-xl font-normal leading-[140%] text-[#003A3C] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]`}
            >
              {fixBrokenText(data.Title)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
