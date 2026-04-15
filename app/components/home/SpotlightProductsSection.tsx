"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";
import { createProductHref, type Product } from "@/app/data/products";
import { fetchFeaturedProducts } from "@/app/lib/productsClient";
import { peekCached } from "@/app/lib/clientCache";

function formatMoney(currencySymbol: string, value: number) {
  const amount = Number.isFinite(value) ? value : 0;
  return `${currencySymbol}${Math.round(amount)}.00`;
}

function discountPct(original: number | undefined, selling: number) {
  if (!original || !Number.isFinite(original) || original <= 0) return 0;
  if (!Number.isFinite(selling) || selling <= 0) return 0;
  if (original <= selling) return 0;
  return Math.min(95, Math.max(1, Math.round(((original - selling) / original) * 100)));
}

export default function SpotlightProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addItem, isVariantInCart } = useCart();
  const { settings } = useSiteSettings();
  const currencySymbol = settings.currencySymbol || "₹";

  useEffect(() => {
    // Hydrate from cache after mount to avoid SSR hydration mismatch.
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

  const spotlight = useMemo(() => products.slice(0, 5), [products]);

  return (
    <section className="pt-20 pb-5 px-2 md:px-0 mb-5 lg:pb-20 lg:pt-30 bg-surface">
      <div className="container mx-auto px-2 lg:px-4">
        <div className="flex items-end justify-between gap-6 mb-6 lg:mb-10">
          <div>
            {/* <p className="font-label text-on-surface-variant uppercase tracking-widest text-xs">Fresh picks</p> */}
            <h2 className="font-headline text-4xl md:text-5xl text-primary mt-2">Today&rsquo;s Spotlight</h2>
          </div>
          {/* <div className="hidden md:flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="inline-flex w-2 h-2 rounded-full bg-secondary" />
            Curated, limited
          </div> */}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`relative bg-surface-container-low border border-outline-variant/40 shadow-sm overflow-hidden rounded-[26px] animate-pulse ${i === 4 ? "hidden lg:block" : ""}`}
                style={{
                  clipPath: "polygon(0% 0%, calc(100% - 28px) 0%, 100% 28px, 100% 100%, 0% 100%)",
                }}
              >
                <div className="p-3 lg:p-4">
                  <div className="aspect-square rounded-[18px] bg-surface-container-high" />
                  <div className="pt-3 lg:pt-4 space-y-3">
                    <div className="h-5 lg:h-6 rounded bg-surface-container-high w-5/6" />
                    <div className="flex items-center justify-between gap-3">
                      <div className="h-4 lg:h-5 rounded bg-surface-container-high w-24" />
                      <div className="w-10 h-10 rounded-full bg-surface-container-high" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 text-error">{error}</div>
        ) : spotlight.length === 0 ? (
          <div className="text-center py-10 text-on-surface-variant">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            {spotlight.map((product) => {
              const primary = Array.isArray(product.variants) && product.variants.length > 0 ? product.variants[0] : undefined;

              const displayPrice = Number(product.price ?? primary?.price ?? 0);
              const displayOriginal =
                typeof product.originalPrice === "number" && product.originalPrice > displayPrice
                  ? product.originalPrice
                  : primary && typeof primary.originalPrice === "number" && primary.originalPrice > displayPrice
                    ? primary.originalPrice
                    : undefined;

              const weightLabel = primary?.label ?? (product.sizes && product.sizes[0]) ?? "";
              const inStock = (primary?.stock ?? product.quantity ?? 0) > 0;
              const inCart = isVariantInCart(product.id, weightLabel || "");
              const pct = discountPct(displayOriginal, displayPrice);

              const handleAdd = () => {
                if (!inStock || inCart) return;
                addItem({
                  id: product.id,
                  name: product.name,
                  price: displayPrice,
                  color: "",
                  size: weightLabel || "",
                  image: product.image,
                  collection: product.collection || "",
                });
              };

              return (
                <div
                  key={product.id}
                  className="group relative bg-surface-container-low border border-outline-variant/40 shadow-sm hover:shadow-md transition-all overflow-hidden rounded-[26px]"
                  style={{
                    clipPath:
                      "polygon(0% 0%, calc(100% - 28px) 0%, 100% 28px, 100% 100%, 0% 100%)",
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background:
                        "radial-gradient(1200px circle at 20% 0%, rgba(183,94,12,0.12), transparent 50%), radial-gradient(900px circle at 90% 40%, rgba(37,99,235,0.08), transparent 55%)",
                    }}
                  />

                  <Link href={createProductHref(product)} className="block p-2 lg:p-3">
                    <div className="relative aspect-square rounded-[18px] overflow-hidden bg-surface-container-high">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          unoptimized
                          sizes="(min-width: 1024px) 25vw, 46vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : null}

                      {pct > 0 ? (
                        <div className="absolute top-2 left-2 lg:top-3 lg:left-3 bg-secondary text-on-secondary px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                          {pct}% off
                        </div>
                      ) : null}
                    </div>

                    <div className="pt-3 lg:pt-4">
                      <h3 className="font-headline text-[15px] lg:text-lg text-primary leading-snug line-clamp-2">
                        {product.name}
                      </h3>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="font-label font-bold text-secondary text-sm lg:text-base">
                              {formatMoney(currencySymbol, displayPrice)}
                            </span>
                            {displayOriginal && displayOriginal > displayPrice ? (
                              <span className="text-[11px] lg:text-xs text-on-surface-variant line-through">
                                {formatMoney(currencySymbol, displayOriginal)}
                              </span>
                            ) : null}
                          </div>
                          {/* {weightLabel ? (
                            <div className="text-[10px] lg:text-xs text-on-surface-variant uppercase tracking-widest mt-1">
                              {weightLabel}
                            </div>
                          ) : null} */}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAdd();
                          }}
                          disabled={!inStock || inCart}
                          aria-label={inCart ? "Added to cart" : "Add to cart"}
                          className="shrink-0 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50 disabled:hover:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {inCart ? "check" : "shopping_cart"}
                          </span>
                        </button>
                      </div>

                      {/* {!inStock ? (
                        <div className="mt-2 text-[10px] lg:text-xs font-bold uppercase tracking-widest text-error">
                          Out of stock
                        </div>
                      ) : null} */}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

