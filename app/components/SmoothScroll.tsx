"use client";
import { useEffect, useRef } from "react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const LocomotiveScroll = (await import("locomotive-scroll")).default;
        // @ts-ignore - beta version options may mismatch current types
        new LocomotiveScroll({
          el: scrollRef.current,
          smooth: true,
        });
      } catch (error) {
        console.error("Locomotive scroll error:", error);
      }
    })();
  }, []);

  return <div data-scroll-container ref={scrollRef}>{children}</div>;
}
