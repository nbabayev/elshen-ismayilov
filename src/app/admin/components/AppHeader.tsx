"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  useColorModes,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilContrast, cilMenu, cilMoon, cilSun } from "@coreui/icons";
import AppBreadcrumb from "./AppBreadcrumb";
import AppHeaderDropdown from "./header/AppHeaderDropdown";
import { AdminState } from "../store";

const AppHeader: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { colorMode, setColorMode } = useColorModes("coreui-admin-theme");

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

  return (
    <CHeader position="sticky" className="mb-4 p-0 pt-2 pb-2" ref={headerRef}>
      <CContainer className="px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: "-14px" }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {mounted ? (
                colorMode === "dark" ? (
                  <CIcon icon={cilMoon} size="lg" />
                ) : colorMode === "auto" ? (
                  <CIcon icon={cilContrast} size="lg" />
                ) : (
                  <CIcon icon={cilSun} size="lg" />
                )
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu className="p-0">
              <CDropdownItem
                active={mounted && colorMode === "light"}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode("light")}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Isiqli
              </CDropdownItem>
              <CDropdownItem
                active={mounted && colorMode === "dark"}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode("dark")}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Qaranlig
              </CDropdownItem>
              <CDropdownItem
                active={mounted && colorMode === "auto"}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode("auto")}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" />{" "}
                Avtomatik
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
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
