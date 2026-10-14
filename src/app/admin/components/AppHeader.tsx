"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  CBadge,
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  useColorModes,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilEnvelopeClosed, cilMenu, cilMoon, cilSun } from "@coreui/icons";
import AppHeaderDropdown from "./header/AppHeaderDropdown";
import { AdminState } from "../store";
import { useUnreadMessages } from "@/app/hooks/useContacts";

const AppHeader: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { colorMode, setColorMode } = useColorModes("coreui-admin-theme");
  const { data: unreadData } = useUnreadMessages(mounted);
  const unreadCount = Number(unreadData?.count || 0);

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state: AdminState) => state.sidebarShow);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle(
          "shadow-sm",
          document.documentElement.scrollTop > 0
        );
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  const isDark = mounted && colorMode === "dark";

  const toggleTheme = () => {
    setColorMode(isDark ? "light" : "dark");
  };

  return (
    <CHeader position="sticky" className="mb-4 p-0 pt-2 pb-2" ref={headerRef}>
      <CContainer className="px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: "-14px" }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="ms-auto">
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <li className="nav-item d-flex align-items-center">
            <Link
              href="/admin/messages"
              className="header-mail-link"
              title="Mesajlar"
              aria-label="Mesajlar"
            >
              <CIcon icon={cilEnvelopeClosed} size="lg" />
              {unreadCount > 0 && (
                <CBadge
                  color="danger"
                  className="header-mail-badge"
                  shape="rounded-pill"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </CBadge>
              )}
            </Link>
          </li>
          <li className="nav-item d-flex align-items-center">
            <button
              type="button"
              className="header-mail-link border-0 bg-transparent"
              onClick={toggleTheme}
              title={isDark ? "İşıqlı rejim" : "Qaranlıq rejim"}
              aria-label={isDark ? "İşıqlı rejimə keç" : "Qaranlıq rejimə keç"}
            >
              <CIcon icon={isDark ? cilMoon : cilSun} size="lg" />
            </button>
          </li>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
