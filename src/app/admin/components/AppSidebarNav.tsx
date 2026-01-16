"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { CBadge, CNavLink, CSidebarNav } from "@coreui/react";
import { NavItem } from "../_nav";

interface AppSidebarNavProps {
  items: NavItem[];
}

export const AppSidebarNav: React.FC<AppSidebarNavProps> = ({ items }) => {
  const pathname = usePathname();

  const navLink = (
    name: string | React.ReactNode,
    icon?: React.ReactNode,
    badge?: { color: string; text: string },
    indent = false
  ) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto" size="sm">
            {badge.text}
          </CBadge>
        )}
      </>
    );
  };

  const navItem = (item: NavItem, index: number, indent = false) => {
    const { component, name, badge, icon, to, href, ...rest } = item;
    const Component = component;
    const isActive = to ? pathname === to : false;

    return (
      <Component as="div" key={index}>
        {to ? (
          <CNavLink as={Link} href={to} active={isActive}>
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : href ? (
          <CNavLink href={href} target="_blank" rel="noopener noreferrer">
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    );
  };

  const navGroup = (item: NavItem, index: number) => {
    const { component, name, icon, items: subItems, to, ...rest } = item;
    const Component = component;

    return (
      <Component
        compact
        as="div"
        key={index}
        toggler={navLink(name, icon)}
        {...rest}
      >
        {subItems?.map((subItem, subIndex) =>
          subItem.items
            ? navGroup(subItem, subIndex)
            : navItem(subItem, subIndex, true)
        )}
      </Component>
    );
  };

  return (
    <CSidebarNav as={SimpleBar}>
      {items &&
        items.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index)
        )}
    </CSidebarNav>
  );
};

export default AppSidebarNav;
