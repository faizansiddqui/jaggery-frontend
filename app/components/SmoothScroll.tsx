"use client";
import { useEffect, useRef } from "react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const LocomotiveScroll = (await import("locomotive-scroll")).default;
        const options = {
          el: scrollRef.current,
          smooth: true,
        } as unknown as ConstructorParameters<typeof LocomotiveScroll>[0];
        new LocomotiveScroll(options);
      } catch (error) {
        console.error("Locomotive scroll error:", error);
      }
    })();
  }, []);

  return <div data-scroll-container ref={scrollRef}>{children}</div>;
}
