"use client";
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileBottomTabs from "./MobileBottomTabs";
import SmoothScroll from "./SmoothScroll";
import { usePathname } from "next/navigation";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <SmoothScroll>
        <main className="flex-grow pb-20 lg:pb-0">
          {children}
        </main>
        <Footer />
      </SmoothScroll>
      <MobileBottomTabs />
    </>
  );
}
