import React from "react";
import Image from "next/image";
import Link from "next/link";
import SectionTotal from "@/app/components/atoms/SectionTotal";

const SectionHeader = ({
  label,
  icon,
  TotalComponent,
  FilterButton = null,
  link,
  isPriority = false,
  isLoading = false,
}) => {
  console.log(icon, label);
  return (
    <div className="flex items-center text-[#003a3c] w-full font-normal md:text-[32px] text-[20px] leading-[100%] font-lexend">
      <div className="flex items-center justify-between w-full">
        {/* Sol tərəf: İkon və Başlıq */}
        <div className="flex items-center">
          {icon && (
            <div className="md:mr-6 mr-4 relative md:w-20 md:h-20 w-10 h-10 flex-shrink-0">
              <Image
                src={icon}
                alt="section-icon"
                fill
                sizes="(max-width: 768px) 40px, 80px"
                priority={isPriority}
                className="object-contain"
              />
            </div>
          )}
          <span>{label}</span>
        </div>

        {/* Sağ tərəf: Link olub-olmamasına görə render edilir */}

        {isLoading ? (
          // Skeleton UI
          <div className="space-y-3">
            <div className="h-[32px] w-[120px] bg-gray-300 rounded animate-pulse" />
            {/* Repeat for other elements */}
          </div>
        ) : (
          <div className="text-[14px] md:text-[16px] flex items-center">
            {link && <span className="text-[#ad6e33]">Hamısı</span>}
            {link ? (
              <Link
                href={`/${link}`}
                className="flex items-center text-[#ad6e33] hover:opacity-80 transition-opacity"
              >
                {TotalComponent}
              </Link>
            ) : (
              <div className="flex items-center text-[#003a3c]/70 select-none">
                {TotalComponent}
              </div>
            )}
            {FilterButton && (
              <div className="md:hidden inline-block">{FilterButton}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
