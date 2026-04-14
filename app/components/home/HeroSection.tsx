"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchPublicBanners } from "@/app/lib/apiClient";

export default function HeroSection() {
  const [banners, setBanners] = useState<Array<{ id: string; title: string; subtitle: string; href: string; img: string }>>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPublicBanners()
      .then((rows) => {
        setBanners(
          rows
            .filter((row) => row.imageUrl && row.targetUrl && row.title && row.subtitle)
            .map((row) => ({
              id: row.id,
              title: row.title,
              subtitle: row.subtitle,
              href: row.targetUrl,
              img: row.imageUrl,
            }))
        );
      })
      .catch(() => {
        setBanners([]);
      });
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => {
        return current === banners.length - 1 ? 0 : current + 1;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleSlide = (direction: "prev" | "next") => {
    if (!banners.length) return;
    setActiveIndex((current) => {
      if (direction === "prev") return current === 0 ? banners.length - 1 : current - 1;
      return current === banners.length - 1 ? 0 : current + 1;
    });
  };

  return (
    <>
      <section className="relative h-[40vh] sm:h-[36vh] md:h-[80vh] pt-16 md:pt-20 bg-primary/20">
        <div ref={heroRef} className="relative h-full w-full overflow-hidden">
          {banners.map((slide, index) => (
            <Link
              href={slide.href}
              key={slide.id}
              className={`absolute inset-0 w-full h-full ${activeIndex === index ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                } transition-opacity duration-1000 ease-in-out`}
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                unoptimized
                sizes="100vw"
                className={`object-cover object-center transition-transform duration-[6000ms] ease-out origin-center ${activeIndex === index ? "scale-100" : "scale-105"}`}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className={`absolute inset-x-0 top-1/2 mx-auto w-full max-w-4xl px-8 text-white transition-all duration-[1200ms] delay-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] transform ${activeIndex === index ? "-translate-y-1/2 opacity-100" : "translate-y-4 opacity-0"}`}>
                <h1 className="font-headline text-2xl md:text-7xl leading-tight mt-4 sm:mt-6 max-w-3xl">
                  {slide.title}
                </h1>
                <span className="font-label uppercase tracking-[0.3em] text-[6px] lg:text-[10px] sm:text-sm text-white">
                  {slide.subtitle}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="absolute md:bottom-8 mt-2 left-1/2 flex items-center gap-4 -translate-x-1/2 z-20">
        <button
          type="button"
          onClick={() => handleSlide("prev")}
          className="text-primary flex items-center justify-center hover:text-secondary transition-all"
          aria-label="Previous banner"
        >
          <ChevronLeft />
        </button>

        <div className="flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-3 w-3 rounded-full transition-colors ${activeIndex === index ? "bg-primary" : "bg-white border border-primary"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleSlide("next")}
          className="text-primary flex items-center justify-center hover:text-secondary transition-all"
          aria-label="Next banner"
        >
          <ChevronRight />
        </button>
      </div>
    </>
  );
}

