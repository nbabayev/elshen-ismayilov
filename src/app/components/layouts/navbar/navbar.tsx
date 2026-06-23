"use client";
import { ComponentType, ElementType, useState } from "react";
// import { Box, Container } from "@mui/material";
import Link from "next/link";
// styles
import styles from "./navbar.module.scss";
import shared_styles from "../../shared/shared.module.scss";
import Image from "next/image";
import { navLinks } from "@/app/shared";
import { usePathname } from "next/navigation";
import { useCategories, useCategory } from "@/app/hooks/useCategory";
// import Dialog from "packages/ui/src/components/Dialog/Dialog.stories";
// import { Dialog } from "@my/ui";
import SearchModal from "@/app/components/organisms/SaearchPanel/SearchModal";
import MobileMenu from "@/app/components/organisms/MobileMenu/MobileMenu";

interface Category {
  Id: number;
  Name: string;
  Type: number;
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
  const hasDropdown = nav.type !== undefined;
  // For items without dropdown, render simple link
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
  const filteredCats = cats?.filter((cat) => cat.Type === nav.type) || [];
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
      {isHovered && filteredCats && filteredCats?.length > 0 && (
        <div className={styles.dropdown}>
          {filteredCats?.map((cat: Category) => (
            <Link
              key={cat.Id}
              href={`${nav.href}?categoryId=${cat.Id}`}
              className={styles.dropdownItem}
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      <div className="container px-2 max-w-[1250px] sm:px-4 md:px-6 lg:px-8 relative">
        {/* Top right links row */}
        <div className={styles.topRightRow}>
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
        <div className={styles.navbar}>
          <div>
            <Link href="/">
              <Image
                //   className={styles.logo}
                src="/images/logo.png"
                alt="Elshan Ismayilov logo"
                width={163}
                height={26}
                priority
              />
            </Link>
          </div>
          <div className={styles.navLinks}>
            {mainLinks?.map((nav, i) => (
              <NavItem
                key={i}
                nav={nav}
                pathname={pathname}
                cats={categories}
              />
            ))}
            <Image
              //   className={styles.logo}
              src="/icons/search.svg"
              alt="hamb icon"
              width={24}
              height={24}
              priority
              className={styles.search_icon}
              // onClick={() => setSearchView(true)}
              onClick={() => setIsSearchOpen(true)} // Open the modal here
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className={styles.hamburger} onClick={() => setIsMenuOpen(true)}>
            <Image
              //   className={styles.logo}
              src="/icons/hamburger.svg"
              alt="hamb icon"
              width={24}
              height={24}
              priority
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSearchOpen={() => setIsSearchOpen(true)}
      />
      {/* </Container> */}
      {/* <Dialog open={searchView} onClose={() => setSearchView(false)} fullScreen>
        <Image
          //   className={styles.logo}
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
