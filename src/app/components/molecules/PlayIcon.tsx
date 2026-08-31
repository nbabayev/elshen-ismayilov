import Image from "next/image";
import React from "react";

const PlayIcon = ({
  className,
  width,
  height,
}: {
  className: string;
  width: number;
  height: number;
}) => {
  return (
    <div
      className={`absolute z-[1] flex  items-center justify-center rounded-full bg-[rgba(240,237,234,0.3)] ${
        className || "h-10 w-10"
      }`}
    >
      <Image
        src="/icons/play-white.svg"
        alt="play-icon"
        width={width || 12}
        height={height || 14}
      />
    </div>
  );
};

export default PlayIcon;
