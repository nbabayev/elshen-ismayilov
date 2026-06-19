"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminProvider from "./store/AdminProvider";
import { AppSidebar, AppHeader, AppFooter } from "./components";
import "@coreui/coreui/dist/css/coreui.min.css";
import "./admin.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname.includes("/admin");
  // const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // if (isLoginPage) {
    //   // setIsReady(true);
    //   return;
    // }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    // setIsReady(true);
  }, [isLoginPage, router]);

  // if (!isReady) {
  //   return null;
  // }

  // if (isLoginPage) {
  //   return (
  //     <div className="wrapper d-flex flex-column min-vh-100">
  //       {/* <AppHeader /> */}
  //       <div className="body flex-grow-1 pb-4">
  //         <div className="container-lg">{children}</div>
  //       </div>
  //       {/* <AppFooter /> */}
  //     </div>
  //   );
  // }
  console.log(children);
  return (
    <AdminProvider>
      {isLoginPage && <AppSidebar />}

      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 pb-4">
          <div className="container-lg">{children}</div>
        </div>
        {isLoginPage && <AppFooter />}
      </div>
    </AdminProvider>
  );
}
