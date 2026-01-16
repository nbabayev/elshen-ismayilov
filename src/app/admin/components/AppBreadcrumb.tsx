"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";

interface BreadcrumbItem {
  pathname: string;
  name: string;
  active: boolean;
}

const routes: { path: string; name: string }[] = [
  { path: "/admin", name: "Dashboard" },
  { path: "/admin/about", name: "Haqqinda" },
  { path: "/admin/gallery", name: "Qalereya" },
  { path: "/admin/gallery/add", name: "Qalereya yarat" },
  { path: "/admin/sliders", name: "Slayderler" },
  { path: "/admin/sliders/add", name: "Slayder elave et" },
  { path: "/admin/mini-sliders", name: "Mini Slayderler" },
  { path: "/admin/mini-sliders/add", name: "Mini Slayder elave et" },
  { path: "/admin/categories", name: "Kateqoriyalar" },
  { path: "/admin/categories/add", name: "Kateqoriya elave et" },
  { path: "/admin/videos", name: "Videolar" },
  { path: "/admin/articles", name: "Meqaleler" },
  { path: "/admin/articles/add", name: "Meqale elave et" },
  { path: "/admin/books", name: "Kitablar" },
  { path: "/admin/books/add", name: "Kitab elave et" },
];

const AppBreadcrumb = () => {
  const pathname = usePathname();

  const getRouteName = (path: string): string | false => {
    const currentRoute = routes.find((route) => route.path === path);
    return currentRoute ? currentRoute.name : false;
  };

  const getBreadcrumbs = (location: string): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];
    location.split("/").reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`.replace("//", "/");
      const routeName = getRouteName(currentPathname);
      if (routeName) {
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length,
        });
      }
      return currentPathname;
    }, "");
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem>
        <Link href="/admin">Home</Link>
      </CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem
          {...(breadcrumb.active ? { active: true } : {})}
          key={index}
        >
          {breadcrumb.active ? (
            breadcrumb.name
          ) : (
            <Link href={breadcrumb.pathname}>{breadcrumb.name}</Link>
          )}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  );
};

export default React.memo(AppBreadcrumb);
