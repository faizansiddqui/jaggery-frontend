"use client";
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const disableSmoothScroll = pathname?.startsWith("/product/");

  useEffect(() => {
    let locomotiveScroll: any;
    
    if (isAdmin || disableSmoothScroll) {
      if (locomotiveScroll) locomotiveScroll.destroy();
      return;
    }

    (async () => {
      try {
        const LocomotiveScroll = (await import("locomotive-scroll")).default;
        locomotiveScroll = new LocomotiveScroll({
          lenisOptions: {
            lerp: 0.1,
            duration: 1.2,
            smoothWheel: true,
          }
        });
      } catch (error) {
        console.error("Locomotive Scroll initialization failed:", error);
      }
    })();

    return () => {
      if (locomotiveScroll) locomotiveScroll.destroy();
    };
  }, [isAdmin, disableSmoothScroll]);

  if (isAdmin) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
