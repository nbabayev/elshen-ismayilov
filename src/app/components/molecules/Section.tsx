"use client";

import { type ReactNode, type Ref } from "react";
import SectionHeader from "@/app/components/atoms/SectionHeader";

export type SectionProps = {
  children?: ReactNode;
  label?: string;
  icon?: string;
  total?: number;
  totalIcon?: string | null;
  patternClass?: string | null;
  link?: string | null;
  isPriority?: boolean;
  isLoading?: boolean;
  ref?: Ref<HTMLDivElement>;
  sideFluid?: boolean;
};

export default function Section({
  children,
  label,
  icon,
  total,
  totalIcon = null,
  patternClass = null,
  link = null,
  isPriority = false,
  isLoading = false,
  ref = null,
  sideFluid = false,
}: SectionProps) {
  return (
    <>
      <div
        className="pl-5 pr-5 md:pl-0 md:pr-0 md:container mb-15"
        // mx-auto
        // px-5
        // sm:px-5
        // md:px-5
        // lg:px-8
        ref={ref}
      >
        <div className={patternClass ? "md:mb-45 mb-15" : ""}>
          <div className="flex items-center justify-between w-full text-[#003A3C] font-lexend">
            <SectionHeader
              label={label}
              icon={icon}
              link={link}
              total={total}
              totalIcon={totalIcon}
              isPriority={isPriority}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      <div className={`flex md:justify-center ${patternClass ?? ""} mb-15`}>
        <div
          className={`${sideFluid && "w-full pl-5"} md:container
           md:px-0 `}
        >
          {children}
        </div>
      </div>
    </>
  );
}
