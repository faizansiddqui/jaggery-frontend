"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { fetchPublicBanners } from "@/app/lib/apiClient";
import { peekCached } from "@/app/lib/clientCache";

export default function HeroSection() {
  const [banners, setBanners] = useState<Array<{ id: string; title: string; subtitle: string; href: string; img: string }>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const cached = peekCached<any[]>("banners:public").data;
    const processData = (rows: any[]) => 
      rows
        .filter((row) => row.imageUrl && row.targetUrl && row.title)
        .map((row) => ({
          id: row.id,
          title: row.title,
          subtitle: row.subtitle || "",
          href: row.targetUrl,
          img: row.imageUrl,
        }));

    if (Array.isArray(cached) && cached.length) {
      setBanners(processData(cached));
    }
    
    fetchPublicBanners()
      .then((rows) => setBanners(processData(rows)))
      .catch(() => setBanners([]));
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current === banners.length - 1 ? 0 : current + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleSlide = (direction: "prev" | "next") => {
    if (!banners.length) return;
    setActiveIndex((current) => {
      if (direction === "prev") return current === 0 ? banners.length - 1 : current - 1;
      return current === banners.length - 1 ? 0 : current + 1;
    });
  };

  if (banners.length === 0) return <div className="h-[60vh] md:h-[80vh] mt-16 md:mt-20 bg-stone-100 animate-pulse" />;

  return (
    // Note the mt-16 md:mt-20 exactly offsets the Navbar height to prevent overlap!
    <section className="relative h-[30vh] sm:h-[70vh] md:h-[80vh] mt-16 md:mt-20 w-full overflow-hidden bg-stone-900">
      {banners.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            activeIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image with Ken Burns Effect */}
          <Image
            src={slide.img}
            alt={slide.title}
            fill
            priority={index === 0}
            className={`object-cover transition-transform duration-[10000ms] ease-linear ${
              activeIndex === index ? "scale-110" : "scale-100"
            }`}
          />
          
          {/* Gradients: Left to right for text readability, and bottom-up for carousel dots */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Content Container */}
          <div className="absolute inset-0 flex items-center justify-start pb-10 md:pb-0">
            <div className="container mx-auto px-6 sm:px-8 md:px-12">
              <div className="max-w-2xl space-y-3 sm:space-y-4 md:space-y-6">
                
                <span className={`inline-block font-bold tracking-[0.25em] text-[10px] sm:text-xs md:text-sm text-amber-400 uppercase transform transition-all duration-700 delay-300 ${
                  activeIndex === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}>
                  {slide.subtitle}
                </span>
                
                <h1 className={`text-2xl sm:text-6xl md:text-7xl lg:text-6xl font-black text-white leading-[1.05] sm:leading-[1.1] transition-all duration-1000 delay-500 drop-shadow-xl ${
                  activeIndex === index ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}>
                  {slide.title}
                </h1>

                <div className={`pt-4 sm:pt-6 transition-all duration-700 delay-700 ${
                  activeIndex === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}>
                  <Link
                    href={slide.href}
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-amber-500 px-4 py-2 md:px-8 md:py-4 font-bold text-stone-900 shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400 hover:shadow-[0_4px_25px_rgba(245,158,11,0.5)] active:scale-95"
                  >
                    <ShoppingBag size={18} className="md:w-5 md:h-5" strokeWidth={2.5} />
                    <span className="uppercase tracking-wide text-xs sm:text-sm">Shop Collection</span>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Modern Navigation Controls (Dots & Arrows) */}
      <div className="absolute bottom-3 md:bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:gap-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-2 py-0 sm:px-6 sm:py-3 shadow-2xl">
        <button
          onClick={() => handleSlide("prev")}
          className="text-white hover:text-amber-400 transition-colors p-1"
          aria-label="Previous"
        >
          <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
        </button>

        <div className="flex gap-2.5 sm:gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative h-1.5 transition-all duration-500 rounded-full ${
                activeIndex === index 
                  ? "w-6 sm:w-8 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" 
                  : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => handleSlide("next")}
          className="text-white hover:text-amber-400 transition-colors p-1"
          aria-label="Next"
        >
          <ChevronRight size={20} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Decorative side elements for Desktop (Hidden on Mobile) */}
      <div className="absolute right-10 top-1/2 hidden -translate-y-1/2 flex-col gap-6 text-white/40 xl:flex z-20 items-center">
        <span className="h-24 w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent" />
        <p className="vertical-text text-[11px] tracking-[0.4em] uppercase rotate-180 font-semibold font-headline">Premium Agrarian</p>
        <span className="h-24 w-[1px] bg-gradient-to-b from-white/50 via-white/50 to-transparent" />
      </div>
    </section>
  );
}