"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";
import { createProductHref, type Product } from "@/app/data/products";
import ProductGridSkeleton from "@/app/components/ProductGridSkeleton";
import { fetchFeaturedProducts } from "@/app/lib/productsClient";
import { peekCached } from "@/app/lib/clientCache";

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { settings } = useSiteSettings();
  const currencySymbol = settings.currencySymbol || "₹";
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);
  const pauseUntilRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);
  const [mobileReady, setMobileReady] = useState(false);

  useEffect(() => {
    window.setTimeout(() => {
      const cached = peekCached<Product[]>("products:all").data;
      if (Array.isArray(cached) && cached.length) {
        setProducts(cached);
        setLoading(false);
      }
    }, 0);

    fetchFeaturedProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  // Infinite Scroll Logic for Mobile
  const mobileItems = useMemo(() => {
    if (products.length === 0) return [];
    return [...products, ...products];
  }, [products]);

  useEffect(() => {
    const el = mobileTrackRef.current;
    if (!el) return;
    const onResize = () => {
      el.scrollLeft = 0;
      setMobileReady(true);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const el = mobileTrackRef.current;
    if (!el || !mobileReady || products.length < 2) return;

    const getStep = () => {
      const first = el.querySelector<HTMLElement>("[data-feature-card]");
      return (first?.offsetWidth ?? 0) + 16;
    };

    const normalize = () => {
      const half = el.scrollWidth / 2;
      if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half;
    };

    const startInterval = () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        if (performance.now() < pauseUntilRef.current) return;
        el.scrollBy({ left: getStep(), behavior: "smooth" });
        window.setTimeout(normalize, 600);
      }, 3500);
    };

    const onUserInteraction = () => {
      pauseUntilRef.current = performance.now() + 3000;
    };

    el.addEventListener("touchstart", onUserInteraction, { passive: true });
    el.addEventListener("scroll", normalize, { passive: true });
    startInterval();

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      el.removeEventListener("touchstart", onUserInteraction);
      el.removeEventListener("scroll", normalize);
    };
  }, [mobileReady, products.length]);

  return (
    <section className="py-16 lg:py-24 bg-[#fcfcfd] overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              Purest Offerings
            </h2>
            <p className="text-slate-500 text-lg">
              Carefully curated essentials designed for your lifestyle.
            </p>
          </div>
          <Link 
            href="/shop" 
            className="text-sm font-bold uppercase tracking-widest text-primary border-b-2 border-primary/20 hover:border-primary transition-all pb-1 w-fit"
          >
            View All Collection
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={3} />
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-medium">{error}</div>
        ) : (
          <>
            {/* Mobile Carousel */}
            <div className="md:hidden -mx-4 px-4">
              <div
                ref={mobileTrackRef}
                className="hide-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory"
              >
                {mobileItems.map((product, idx) => (
                  <div 
                    key={`${product.id}-${idx}`} 
                    data-feature-card 
                    className="snap-center min-w-[85vw]"
                  >
                    <ProductCard product={product} currency={currencySymbol} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop/Tablet Grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} currency={currencySymbol} />
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

/**
 * Slick, Reusable Product Card Component
 */
function ProductCard({ product, currency }: { product: Product; currency: string }) {
  const primary = product.variants?.[0];
  const price = Number(product.price ?? primary?.price ?? 0);
  const oldPrice = product.originalPrice ?? primary?.originalPrice;
  const isSale = oldPrice && oldPrice > price;

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-3xl p-3 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500">
      {/* Image Container */}
      <Link href={createProductHref(product)} className="relative aspect-[10/11] overflow-hidden rounded-2xl bg-slate-50">
        {isSale && (
          <div className="absolute top-4 left-4 z-10 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Sale
          </div>
        )}
        
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 768px) 85vw, 33vw"
          />
        )}
        
        {/* Quick Add Overlay (Desktop Only) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <button className="w-full bg-white/90 backdrop-blur-md py-3 rounded-xl text-sm font-bold text-slate-900 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
               Quick View
            </button>
        </div>
      </Link>

      {/* Content */}
      <div className="px-3 pt-6 pb-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex flex-col items-end">
            <span className="text-lg font-bold text-slate-900">
              {currency}{price}
            </span>
            {isSale && (
              <span className="text-xs text-slate-400 line-through">
                {currency}{oldPrice}
              </span>
            )}
          </div>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6">
          {product.description}
        </p>

        <div className="mt-auto">
          <Link
            href={createProductHref(product)}
            className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary transition-all duration-300"
          >
            <span>Book Now</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}