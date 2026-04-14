"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";
import { createProductHref, type Product } from "@/app/data/products";
import ProductGridSkeleton from "@/app/components/ProductGridSkeleton";
import { fetchFeaturedProducts } from "@/app/lib/productsClient";

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addItem, isVariantInCart } = useCart();
  const { settings } = useSiteSettings();
  const currencySymbol = settings.currencySymbol || "₹";

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

  return (
    <section className="py-15 lg:py-28 bg-surface-container-low">
      <div className="container mx-auto px-2 lg:px-8">
        <div className="mb-4 lg:mb-10 text-center">
          <h2 className="font-headline text-6xl text-primary mt-4">Purest Offerings</h2>
        </div>
        {loading ? (
          <ProductGridSkeleton count={3} />
        ) : error ? (
          <div className="text-center py-10 text-error">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {products.length === 0 ? (
              <div className="col-span-3 text-center text-on-surface-variant">No products found.</div>
            ) : (
              products.map((product) => {
                const primary = Array.isArray(product.variants) && product.variants.length > 0 ? product.variants[0] : undefined;

                // Use normalized product fields (product.price / product.originalPrice) as the source of truth.
                const displayPrice = Number(product.price ?? primary?.price ?? 0);
                const displayOriginal = (typeof product.originalPrice === "number" && product.originalPrice > displayPrice)
                  ? product.originalPrice
                  : (primary && typeof primary.originalPrice === "number" && primary.originalPrice > displayPrice ? primary.originalPrice : undefined);

                const weightLabel = primary?.label ?? (product.sizes && product.sizes[0]) ?? "";
                const inStock = (primary?.stock ?? product.quantity ?? 0) > 0;
                const inCart = isVariantInCart(product.id, weightLabel || "");

                const handleAdd = () => {
                  if (!inStock) return;
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
                          <span className="font-label text-lg font-bold text-secondary">{currencySymbol}{displayPrice}.00</span>
                          {displayOriginal && displayOriginal > displayPrice && (
                            <span className="font-body text-xs text-primary line-through">{currencySymbol}{displayOriginal}.00</span>
                          )}
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                          <button
                            onClick={handleAdd}
                            disabled={!inStock || inCart}
                            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary-container transition-all disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-sm">{inCart ? "check_circle" : "add_shopping_cart"}</span>
                            {inCart ? "Added" : "Add"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}

