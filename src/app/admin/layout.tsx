"use client";

import React from "react";
import AdminProvider from "./store/AdminProvider";
import { AppSidebar, AppHeader, AppFooter } from "./components";
import "@coreui/coreui/dist/css/coreui.min.css";
import "./admin.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminProvider>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 pb-4">
          <div className="container-lg">{children}</div>
        </div>
        <AppFooter />
      </div>
    </AdminProvider>
  );
}
