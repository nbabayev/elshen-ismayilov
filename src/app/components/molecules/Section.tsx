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
}: SectionProps) {
  return (
    <>
      <div
        className="max-w-[1250px] mx-auto px-6 sm:px-4 md:px-6 lg:px-8 mb-15"
        ref={ref}
      >
        <div className={patternClass ? "md:mb-45 mb-15" : ""}>
          <div className="flex items-center justify-between w-full text-[#003A3C] font-lexend pb-8">
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
      <div className={`flex justify-center ${patternClass ?? ""} mb-15`}>
        <div className="container md:px-0 px-6 max-w-[1180px]">{children}</div>
      </div>
    </>
  );
}
