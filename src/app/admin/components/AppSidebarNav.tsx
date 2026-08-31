"use client";

import React, { useEffect, useState } from "react";
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
    const { component, name, badge, icon, to, href } = item;
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

  return (
    <CSidebarNav as={SimpleBar}>
      {items?.map((item, index) =>
        item.items ? (
          <SidebarNavGroup
            key={item.to ?? index}
            item={item}
            pathname={pathname}
            navLink={navLink}
            renderItem={navItem}
          />
        ) : (
          navItem(item, index)
        )
      )}
    </CSidebarNav>
  );
};

function SidebarNavGroup({
  item,
  pathname,
  navLink,
  renderItem,
}: {
  item: NavItem;
  pathname: string;
  navLink: (
    name: string | React.ReactNode,
    icon?: React.ReactNode,
    badge?: { color: string; text: string },
    indent?: boolean
  ) => React.ReactNode;
  renderItem: (item: NavItem, index: number, indent?: boolean) => React.ReactNode;
}) {
  const { name, icon, items: subItems, to, visible } = item;
  const [isOpen, setIsOpen] = useState(
    () => Boolean(visible || (to && pathname.startsWith(to)))
  );

  // Route video səhifəsinə düşəndə group açılsın
  useEffect(() => {
    if (to && pathname.startsWith(to)) {
      setIsOpen(true);
    }
  }, [pathname, to]);

  return (
    <div className={`nav-group${isOpen ? " show" : ""}`}>
      <a
        className="nav-link nav-group-toggle"
        href="#"
        onClick={(event) => {
          event.preventDefault();
          setIsOpen((open) => !open);
        }}
      >
        {navLink(name, icon)}
      </a>
      {isOpen && (
        <div
          className="nav-group-items sidebar-subnav"
          style={{ height: "auto" }}
        >
          {subItems?.map((subItem, subIndex) =>
            subItem.items ? (
              <SidebarNavGroup
                key={subItem.to ?? subIndex}
                item={subItem}
                pathname={pathname}
                navLink={navLink}
                renderItem={renderItem}
              />
            ) : (
              renderItem(subItem, subIndex, true)
            )
          )}
        </div>
      )}
    </div>
  );
}

export default AppSidebarNav;
