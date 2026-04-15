"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";
import { createProductHref, type Product } from "@/app/data/products";
import ProductGridSkeleton from "@/app/components/ProductGridSkeleton";
import { fetchFeaturedProducts } from "@/app/lib/productsClient";

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { settings } = useSiteSettings();
  const currencySymbol = settings.currencySymbol || "₹";
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pauseUntilRef = useRef<number>(0);
  const [mobileReady, setMobileReady] = useState(false);

  useEffect(() => {
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

  const truncateWords = (text: string | undefined, limit = 4) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    if (words.length <= limit) return words.join(" ");
    return words.slice(0, limit).join(" ") + "...";
  };

  const mobileItems = useMemo(() => {
    if (products.length === 0) return [];
    // Duplicate for seamless looping
    return [...products, ...products];
  }, [products]);

  useEffect(() => {
    const el = mobileTrackRef.current;
    if (!el) return;

    const onResize = () => {
      // Reset to start to avoid odd offsets on breakpoint changes
      el.scrollLeft = 0;
      setMobileReady(true);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const el = mobileTrackRef.current;
    if (!el) return;
    if (!mobileReady) return;
    if (products.length < 2) return;

    // Smooth continuous auto-scroll: ~1 card every 5s.
    let lastT = performance.now();
    const getStep = () => {
      const first = el.querySelector<HTMLElement>("[data-feature-card]");
      const cardW = first?.offsetWidth ?? Math.max(240, Math.floor(el.clientWidth * 0.82));
      const gap = 16;
      return cardW + gap;
    };

    const loop = (t: number) => {
      const dt = Math.max(0, t - lastT);
      lastT = t;

      // Pause briefly when user interacts (touch/drag/scroll) to avoid fighting gestures.
      if (t >= pauseUntilRef.current) {
        const step = getStep();
        const pxPerMs = step / 3000; // 3s per card
        el.scrollLeft += dt * pxPerMs;

        // Seamless reset at midpoint (duplicated list)
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    const pause = (ms: number) => {
      pauseUntilRef.current = performance.now() + ms;
    };

    const onUserIntent = () => pause(2000);
    el.addEventListener("touchstart", onUserIntent, { passive: true });
    el.addEventListener("touchmove", onUserIntent, { passive: true });
    el.addEventListener("pointerdown", onUserIntent, { passive: true });
    el.addEventListener("wheel", onUserIntent, { passive: true });
    el.addEventListener("scroll", onUserIntent, { passive: true });

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      el.removeEventListener("touchstart", onUserIntent);
      el.removeEventListener("touchmove", onUserIntent);
      el.removeEventListener("pointerdown", onUserIntent);
      el.removeEventListener("wheel", onUserIntent);
      el.removeEventListener("scroll", onUserIntent);
    };
  }, [mobileReady, products.length]);

  return (
    <section className="px-3 md:px-0 py-5 lg:pb-20 lg:pt-20 bg-surface-container-low">
      <div className="container mx-auto px-2 lg:px-8">
        <div className="mb-4 lg:mb-10 text-center">
          <h2 className="font-headline text-4xl md:text-5xl text-left text-primary mt-4">Purest Offerings</h2>
        </div>
        {loading ? (
          <>
            {/* Mobile loader: match horizontal carousel card sizing */}
            <div className="md:hidden">
              <div className="hide-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2" aria-label="Featured products loading">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="snap-start min-w-[82%] bg-surface rounded-2xl p-5 shadow-sm border border-outline-variant/40 animate-pulse"
                  >
                    <div className="aspect-square rounded-xl bg-surface-container-high mb-6" />
                    <div className="h-6 rounded bg-surface-container-high w-5/6 mb-3" />
                    <div className="h-4 rounded bg-surface-container-high w-full mb-5" />
                    <div className="flex items-center justify-between gap-3">
                      <div className="h-5 rounded bg-surface-container-high w-28" />
                      <div className="w-11 h-11 rounded-full bg-surface-container-high" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop/tablet loader */}
            <div className="hidden md:block">
              <ProductGridSkeleton count={3} />
            </div>
          </>
        ) : error ? (
          <div className="text-center py-10 text-error">{error}</div>
        ) : (
          <>
            {/* Mobile: horizontal, scrollable, auto-scroll, infinite */}
            <div className="md:hidden">
              {products.length === 0 ? (
                <div className="text-center text-on-surface-variant py-10">No products found.</div>
              ) : (
                <div
                  ref={mobileTrackRef}
                  className="hide-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2"
                  aria-label="Featured products carousel"
                >
                  {mobileItems.map((product, idx) => {
                    const primary = Array.isArray(product.variants) && product.variants.length > 0 ? product.variants[0] : undefined;
                    const displayPrice = Number(product.price ?? primary?.price ?? 0);
                    const displayOriginal =
                      typeof product.originalPrice === "number" && product.originalPrice > displayPrice
                        ? product.originalPrice
                        : primary && typeof primary.originalPrice === "number" && primary.originalPrice > displayPrice
                          ? primary.originalPrice
                          : undefined;
                    const inStock = (primary?.stock ?? product.quantity ?? 0) > 0;

                    return (
                      <div
                        key={`${product.id}-${idx}`}
                        data-feature-card
                        className="snap-start min-w-[82%] bg-surface rounded-2xl p-5 shadow-sm border border-outline-variant/40"
                      >
                        <Link href={createProductHref(product)} className="block">
                          <div className="aspect-square rounded-xl overflow-hidden mb-6 relative bg-surface-container-high">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                unoptimized
                                sizes="82vw"
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <h3 className="font-headline text-xl text-primary mb-2 leading-snug">{product.name}</h3>
                          <p className="text-on-surface-variant mb-4 text-sm">{truncateWords(product.description, 6)}</p>
                        </Link>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-baseline gap-2">
                            <span className="font-label text-lg font-bold text-secondary">
                              {currencySymbol}
                              {displayPrice}.00
                            </span>
                            {displayOriginal && displayOriginal > displayPrice ? (
                              <span className="font-body text-xs text-primary line-through">
                                {currencySymbol}
                                {displayOriginal}.00
                              </span>
                            ) : null}
                          </div>
                          <Link
                            href={createProductHref(product)}
                            aria-label="Book now"
                            className="shrink-0 bg-primary text-on-primary px-5 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all"
                          >
                            Book Now
                          </Link>
                        </div>
                        {!inStock ? (
                          <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-error">Out of stock</div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <style jsx global>{`
              .hide-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {/* Desktop/tablet: original grid */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {products.length === 0 ? (
                <div className="col-span-3 text-center text-on-surface-variant">No products found.</div>
              ) : (
                products.map((product) => {
                  const primary = Array.isArray(product.variants) && product.variants.length > 0 ? product.variants[0] : undefined;

                  // Use normalized product fields (product.price / product.originalPrice) as the source of truth.
                  const displayPrice = Number(product.price ?? primary?.price ?? 0);
                  const displayOriginal =
                    typeof product.originalPrice === "number" && product.originalPrice > displayPrice
                      ? product.originalPrice
                      : primary && typeof primary.originalPrice === "number" && primary.originalPrice > displayPrice
                        ? primary.originalPrice
                        : undefined;

                  return (
                    <div
                      key={product.id}
                      className="group bg-surface rounded-xl p-6 transition-all hover:bg-surface-container-high shadow-sm"
                    >
                      <Link href={createProductHref(product)} className="block">
                        <div className="aspect-square rounded-lg overflow-hidden mb-8 relative">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              unoptimized
                              sizes="(min-width: 768px) 30vw, 90vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-surface-container-high" />
                          )}
                        </div>
                        <h3 className="font-headline text-2xl text-primary mb-2">{product.name}</h3>
                        <p className="text-on-surface-variant mb-6 text-sm">{truncateWords(product.description, 4)}</p>
                      </Link>
                      <div className="space-y-1 mb-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-label text-lg font-bold text-secondary">
                              {currencySymbol}
                              {displayPrice}.00
                            </span>
                            {displayOriginal && displayOriginal > displayPrice && (
                              <span className="font-body text-xs text-primary line-through">
                                {currencySymbol}
                                {displayOriginal}.00
                              </span>
                            )}
                          </div>
                          <div className="mt-4 flex items-center gap-3">
                            <Link
                              href={createProductHref(product)}
                              className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">event_available</span>
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

