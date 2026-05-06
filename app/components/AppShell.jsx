"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";

  const contentClassName = isAdminLogin
    ? ""
    : isAdminRoute
      ? "pt-16 lg:pt-0"
      : "pt-16 sm:pt-20";

  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <div className={contentClassName}>{children}</div>
    </>
  );
}
