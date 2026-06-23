"use client";
import Link from "next/link";
import { navLinks } from "@/app/shared";
import { usePathname } from "next/navigation";
import { formatArticleBreadcrumb } from "@/app/utils/formatBreadcrumb";

const Breadcrumb = ({ title }: { title: string }) => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // boş sətirləri təmizləyir
  const mainslug = `/${segments[0] || ""}`;
  const subslug = segments[1];
  const currentLink = navLinks(subslug).find((link) => link.href === mainslug);

  if (!currentLink) {
    return (
      <div className="flex py-4 items-center">
        <img src="/icons/mosque.svg" alt="" className="w-5 mr-1" />
        <Link
          href="/"
          className="text-[#878787] hover:text-gray-700 text-xs md:text-sm"
        >
          Əsas səhifə
        </Link>
      </div>
    );
  }
  return (
    <div className="flex py-4 items-center text-xs md:text-sm">
      <img src="/icons/mosque.svg" alt="" className="w-5 mr-1" />
      <Link href="/" className="text-[#878787] hover:text-gray-700 mr-1">
        Əsas səhifə /
      </Link>

      {/* 🚀 Ssenari 1: Alt səhifə YOXDURSA (Məsələn: /about) */}
      {!subslug && (
        <span className="text-[#C88445] ml-1 font-medium">
          {currentLink.label}
        </span>
      )}

      {/* 🚀 Ssenari 2: Alt səhifə VARSA (Məsələn: /videos/sermons) */}
      {subslug && (
        <span className="flex items-center">
          <Link
            href={currentLink.href}
            className="text-[#C88445] hover:text-gray-700 ml-1 mr-1"
          >
            {currentLink.label}
          </Link>
          <span className="text-[#878787]">/</span>
          <span className="text-[#C88445] ml-1 font-medium">{title}</span>
        </span>
      )}
    </div>
  );
};

export default Breadcrumb;
