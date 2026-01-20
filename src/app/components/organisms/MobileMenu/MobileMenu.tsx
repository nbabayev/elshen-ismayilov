"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/app/shared";
import styles from "./mobileMenu.module.scss";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchOpen: () => void;
}

const MobileMenu = ({ isOpen, onClose, onSearchOpen }: MobileMenuProps) => {
  const pathname = usePathname();
  const allLinks = navLinks(null);

  // Filter out the gallery and contact links if you want to match the desktop logic,
  // but usually mobile menus show everything. 
  // Based on the screenshot, it shows "Əsas səhifə", "Haqqında", "Dərslər", etc.
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.menuOverlay}>
      <div className={styles.header}>
        <button className={styles.iconBtn} onClick={() => {
          onClose();
          onSearchOpen();
        }}>
          <Image src="/icons/search.svg" alt="Search" width={24} height={24} className={styles.whiteIcon} />
        </button>
        <button className={styles.iconBtn} onClick={onClose}>
          <Image 
            src="/icons/hamburger.svg" 
            alt="Close" 
            width={24} 
            height={24} 
            className={styles.whiteIcon}
            style={{ transform: "rotate(45deg)" }}
          />
        </button>
      </div>

      <div className={styles.linksContainer}>
        {allLinks.map((nav, i) => (
          <div key={i} className={styles.linkWrapper}>
            <Link
              href={nav.href}
              className={`${styles.navLink} ${pathname === nav.href ? styles.active : ""}`}
              onClick={onClose}
            >
              {nav.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
