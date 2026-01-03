"use client";
import Link from "next/link";
import shared_styles from "../../shared/shared.module.scss";
import { navLinks } from "@/app/shared";
import { usePathname } from "next/navigation";
const Breadcrumb = ({ page, sub }) => {
  const pathname = usePathname();
  let mainslug = `/${pathname.split("/")[1]}`;
  let subslug = pathname.split("/")[2];
  return (
    <div
      className="flex py-4"
      // className="mx-auto px-2 sm:px-4 md:px-6 lg:px-8 max-w-[1180px] flex items-center py-4 text-xs mb-4 "
    >
      <img src="/icons/mosque.svg" alt="" className="w-5" />
      <Link href="/" className="text-[#878787] hover:text-gray-700">
        Əsas səhifə /
      </Link>
      <span className="text-[#878787] hover:text-gray-700">
        {navLinks(subslug).map((link, i) => {
          if (link.href === mainslug && !subslug) {
            return (
              <span key={i}>
                <span href={link.href} className="text-[#C88445] ml-1">
                  {link.label}
                </span>
              </span>
            );
          }
          if (link.href === mainslug && subslug && link.sub) {
            return (
              <span key={i}>
                <Link
                  href={link.href}
                  className="text-[#C88445] hover:text-gray-700 ml-1 mr-1"
                >
                  {link.label}
                </Link>
                /
                <Link
                  href={link.sub.href}
                  className="text-[#C88445] hover:text-gray-700 ml-1"
                >
                  {link.sub.label ?? subslug}
                </Link>
              </span>
            );
          }

          return null; // uyğun deyilsə göstərməsin
        })}
      </span>
      {/* <Link
        href="/about"
        className="text-[#C88445] hover:text-gray-700 ml-1"
      ></Link>
      {} */}
    </div>
  );
};

export default Breadcrumb;
