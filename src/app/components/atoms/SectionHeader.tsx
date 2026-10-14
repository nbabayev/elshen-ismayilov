"use client";

import Image from "next/image";
import Link from "next/link";
import SectionTotal from "@/app/components/atoms/SectionTotal";
import FilterComponent from "@/app/components/molecules/FilterComponent";

export type SectionHeaderProps = {
  label?: string;
  icon?: string;
  total?: number;
  totalIcon?: string | null;
  link?: string | null;
  filter?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
  isPriority?: boolean;
  isLoading?: boolean;
};

export default function SectionHeader({
  label,
  icon,
  total,
  totalIcon,
  link = null,
  filter = false,
  setIsSidebarOpen,
  isPriority = false,
  isLoading = false,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center text-[#003a3c] w-full font-normal md:text-[32px] text-[20px] leading-[100%] font-lexend">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {icon && (
            <div className="md:mr-6 mr-4 relative xl:w-20 xl:h-20 w-10 h-10 flex-shrink-0">
              <Image
                src={icon}
                alt=""
                fill
                sizes="(max-width: 768px) 40px, 80px"
                priority={isPriority}
                className="object-contain"
              />
            </div>
          )}
          <span>{label}</span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="h-[32px] w-[120px] bg-gray-300 rounded animate-pulse" />
          </div>
        ) : (
          <div className="text-[14px] md:text-[16px] flex items-center">
            {link ? (
              <Link
                href={`/${link}`}
                className="flex items-center text-[#ad6e33] hover:opacity-80 transition-opacity"
              >
                <span className="text-[#ad6e33]">Hamısı</span>{" "}
                {totalIcon && <SectionTotal total={total} icon={totalIcon} />}
              </Link>
            ) : (
              <div className="flex items-center text-[#ad6e33] select-none">
                {totalIcon && <SectionTotal total={total} icon={totalIcon} />}
              </div>
            )}
            {filter && setIsSidebarOpen && (
              <div className="xl:hidden inline-block">
                <FilterComponent setIsSidebarOpen={setIsSidebarOpen} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
