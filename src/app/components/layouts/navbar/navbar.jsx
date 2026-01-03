"use client";
import { useState } from "react";
// import { Box, Container } from "@mui/material";
import Link from "next/link";
// styles
import styles from "./navbar.module.scss";
import shared_styles from "../../shared/shared.module.scss";
import Image from "next/image";
import { navLinks } from "@/app/shared";
import { usePathname } from "next/navigation";
// import Dialog from "packages/ui/src/components/Dialog/Dialog.stories";
// import { Dialog } from "@my/ui";
export default function Navbar() {
  const pathname = usePathname();
  const [searchView, setSearchView] = useState(false);

  return (
    <nav
      className={`z-11 sticky top-0 white_bg flex justify-center`}
      // style={{ position: "sticky", top: 0, zIndex: "1111111" }}
    >
      {/* <Container
        // sx={{ maxWidth: "1168px !important" }}
        fixed
      > */}
      <div className="container px-2 max-w-[1250px] sm:px-4 md:px-6 lg:px-8">
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
            {navLinks()?.map((nav, i) => (
              <Link
                href={nav.href}
                key={i}
                className={`text-[#003a3cff] text-xs   md:text-base hover:text-[#ad6e33ff] ${
                  pathname === nav?.href && "text-[#ad6e33ff]"
                }`}
              >
                {nav.label}
              </Link>
            ))}
            <Image
              //   className={styles.logo}
              src="/icons/search.svg"
              alt="hamb icon"
              width={24}
              height={24}
              priority
              className={styles.search_icon}
              onClick={() => setSearchView(true)}
            />
          </div>
          <div className={styles.hamburger}>
            <Image
              //   className={styles.logo}
              src="/icons/hamburger.svg"
              alt="hamb icon"
              width={24}
              height={24}
              priority
            />
          </div>
        </div>
      </div>
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
