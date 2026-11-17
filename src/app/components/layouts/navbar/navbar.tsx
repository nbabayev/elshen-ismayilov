"use client";
import { ComponentType, useEffect, useRef, useState } from "react";
// import { Box, Container } from "@mui/material";
import Link from "next/link";
// styles
import shared_styles from "../../shared/shared.module.scss";
import Image from "next/image";
import { navLinks } from "@/app/shared";
import { usePathname } from "next/navigation";
import { useCategories, useCategory } from "@/app/hooks/useCategory";
// import Dialog from "packages/ui/src/components/Dialog/Dialog.stories";
// import { Dialog } from "@my/ui";
import SearchModal from "@/app/components/organisms/SaearchPanel/SearchModal";

interface Category {
  Id: number;
  Name: string;
  Type: number;
  children?: Category[];
}

interface NavItemProps {
  nav: {
    type?: number;
    label: string;
    href: string;
    icon?: ComponentType<any>;
    sub?: {
      href: string;
      label: string;
    };
  };
  pathname: string;
  cats: Category[] | undefined | null;
}

function NavItem({ nav, pathname, cats }: NavItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasDropdown = nav.type !== undefined;
  const filteredCats = cats?.filter((cat) => cat.Type === nav.type) || [];

  useEffect(() => {
    const menu = dropdownRef.current;
    if (!isHovered || !menu) return;

    menu.style.transform = "translateX(-50%)";
    const rect = menu.getBoundingClientRect();
    const margin = 16;
    let shift = 0;
    if (rect.left < margin) shift = margin - rect.left;
    if (rect.right > window.innerWidth - margin) {
      shift += window.innerWidth - margin - rect.right;
    }
    if (shift) {
      menu.style.transform = `translateX(calc(-50% + ${shift}px))`;
    }
  }, [isHovered, filteredCats.length]);

  if (!hasDropdown) {
    return (
      <Link
        href={nav.href}
        className={`text-[#003a3cff] text-xs md:text-base hover:text-[#ad6e33ff] ${
          pathname === nav?.href ? "text-[#ad6e33ff]" : ""
        }`}
      >
        {nav.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={nav.href}
        className={`text-[#003a3cff] text-xs md:text-base hover:text-[#ad6e33ff] ${
          pathname === nav?.href ? "text-[#ad6e33ff]" : ""
        }`}
      >
        {nav.label}
      </Link>
      {isHovered && filteredCats.length > 0 && (
        <div
          className="absolute top-[calc(100%+28px)] left-1/2 z-40 min-w-[230px] -translate-x-1/2 rounded-b-[4px] border-t border-[#e6e6e6] bg-[#f7f6f4] px-[22px] pt-[14px] pb-2 drop-shadow-[0_10px_18px_rgba(0,0,0,0.08)] before:absolute before:-top-[7px] before:left-[45%] before:h-[13.471px] before:w-[13.471px] before:shrink-0 before:-rotate-45 before:border-t before:border-r before:border-[#e6e6e6] before:bg-[#fbf9f7] before:content-[''] after:absolute after:right-0 after:bottom-full after:left-0 after:h-9 after:bg-transparent after:content-['']"
          ref={dropdownRef}
        >
          {filteredCats.map((cat, index) => (
            <Link
              key={cat.Id}
              href={`${nav.href}?categoryId=${cat.Id}`}
              className={`block border-b border-[#e6e6e6] px-2 py-3 text-center text-[15px] leading-[1.35] whitespace-nowrap text-[#8a8a8a] transition-colors duration-150 hover:text-[#003a3c] ${
                index === filteredCats.length - 1 ? "border-b-0" : ""
              }`}
              onClick={() => setIsHovered(false)}
            >
              {cat.Name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: categoriesData } = useCategories(true);
  const categories = categoriesData?.data || [];
  const pathname = usePathname();

  const allLinks = navLinks(null);
  const topRightLinks = allLinks?.filter((nav) => nav.position === "top-right");
  const mainLinks = allLinks?.filter((nav) => nav.position === "main");

  return (
    <nav
      className={`z-11 sticky top-0 white_bg flex justify-center`}
      // style={{ position: "sticky", top: 0, zIndex: "1111111" }}
    >
      {/* <Container
        // sx={{ maxWidth: "1168px !important" }}
        fixed
      > */}
      <div className="container px-6 max-w-[1250px] sm:px-4 md:px-6 lg:px-8 relative">
        {/* Top right links row */}

        <div className="flex items-center justify-between py-5 min-[994px]:py-[27px]">
          <div>
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Elshan Ismayilov logo"
                width={163}
                height={26}
                priority
              />
            </Link>
          </div>
          <div className="flex">
            <div>
              <div className="hidden font-lexend  min-[994px]:flex min-[994px]:gap-6 min-[994px]:text-[13px] justify-end">
                {topRightLinks?.map((nav, i) => (
                  <Link
                    href={nav.href}
                    key={i}
                    className={`text-[#003a3cff] text-xs hover:text-[#ad6e33ff] 
            `}
                  >
                    {nav.label}
                  </Link>
                ))}
              </div>
              <div className="hidden items-center justify-center gap-7 font-lexend min-[994px]:inline-flex min-[994px]:flex-row min-[994px]:gap-4 min-[994px]:text-base">
                {mainLinks?.map((nav, i) => (
                  <NavItem
                    key={i}
                    nav={nav}
                    pathname={pathname}
                    cats={categories}
                  />
                ))}
              </div>
            </div>
            <Image
              src="/icons/search.svg"
              alt="hamb icon"
              width={24}
              height={24}
              priority
              className="ml-[clamp(16px,3vw,35px)] hidden cursor-pointer min-[994px]:block"
              // onClick={() => setSearchView(true)}
              onClick={() => setIsSearchOpen(true)}
            />
          </div>
          <button
            type="button"
            className="block cursor-pointer border-0 bg-transparent p-0 min-[994px]:hidden"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Axtarış"
          >
            <Image
              src="/icons/search.svg"
              alt=""
              width={24}
              height={24}
              priority
            />
          </button>
        </div>
      </div>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      {/* </Container> */}
      {/* <Dialog open={searchView} onClose={() => setSearchView(false)} fullScreen>
        <Image
          src="/images/logo.png"
          alt="Elshan Ismayilov logo"
          width={163}
          height={26}
          priority
        />
      </Dialog> */}
    </nav>
  );
}
