"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdminProvider from "./store/AdminProvider";
import { AppSidebar, AppHeader, AppFooter } from "./components";
import "@coreui/coreui/dist/css/coreui.min.css";
import "./admin.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Səhifə qorunması proxy + httpOnly cookie ilə aparılır.
  // Client-side localStorage token yoxlanışı artıq yoxdur.

  return (
    <AdminProvider>
      {!isLoginPage && <AppSidebar />}

      <div
        className="wrapper d-flex flex-column min-vh-100"
        data-coreui-theme={isLoginPage ? "dark" : undefined}
      >
        {!isLoginPage && <AppHeader />}
        <div className="body flex-grow-1 pb-4">
          <div className="container-lg">{children}</div>
        </div>
        {!isLoginPage && <AppFooter />}
      </div>
    </AdminProvider>
  );
}
