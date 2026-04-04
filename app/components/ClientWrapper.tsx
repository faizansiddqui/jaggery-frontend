"use client";
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SmoothScroll from "./SmoothScroll";
import { usePathname } from "next/navigation";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <SmoothScroll>
        <main className="flex-grow">
          {children}
        </main>
        {!isAdmin && <Footer />}
      </SmoothScroll>
    </>
  );
}
