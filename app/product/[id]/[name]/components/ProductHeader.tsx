"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";
import type { Product } from '@/app/data/products';

export default function ProductHeader({ product }: { product?: Product | null }) {
  const router = useRouter();
  const { toggle, isInWishlist } = useWishlist();
  const { settings } = useSiteSettings();
  const currencySymbol = settings.currencySymbol || "₹";

  const firstSize = product?.sizes && product.sizes.length > 0 ? product.sizes[0] : '';
  const [selectedSize, setSelectedSize] = useState<string>(firstSize);
  const productId = product?.id ?? 0;

  const { addItem, isVariantInCart, updateQty } = useCart();
  const inCart = isVariantInCart(productId, selectedSize, "");
  const inWishlist = isInWishlist(productId);

  const selectedVariant = useMemo(() => {
    if (!product) return undefined;
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      return product.variants.find((v) => v.label === selectedSize) ?? product.variants[0];
    }
    return undefined;
  }, [product, selectedSize]);

  const displayPrice = selectedVariant?.price ?? product?.price ?? 0;
  const displayOriginal = selectedVariant?.originalPrice ?? product?.originalPrice;
  const displayImage = selectedVariant?.image
    ?? (product?.images && product.images.length > 0 ? product.images[0] : product?.image)
    ?? '';
  const availableStock = Math.max(
    0,
    Number(
      typeof selectedVariant?.stock === "number"
        ? selectedVariant.stock
        : (product?.quantity ?? 0)
    )
  );
  const isOutOfStock = availableStock <= 0;

  const [qty, setQty] = useState<number>(1);

  const handleAddToCart = () => {
    if (!product || productId <= 0 || isOutOfStock) return;
    if (inCart) {
      router.push("/cart");
      return;
    }

    addItem({
      id: productId,
      name: product?.name ?? 'Product',
      price: displayPrice,
      color: "",
      size: selectedSize,
      image: displayImage,
      collection: product?.collection ?? 'SHOP',
    });

    // If user selected >1 quantity, try to increment to match selection.
    if (qty > 1) {
      try {
        updateQty(productId, selectedSize, qty - 1);
      } catch {
        // ignore
      }
    }
  };

  const handleWishlist = () => {
    if (!product || productId <= 0) return;
    toggle({
      id: productId,
      name: product?.name ?? 'Product',
      price: displayPrice,
      image: displayImage,
      collection: product?.collection ?? 'SHOP',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 items-start mt-1 lg:mt-8 w-full">
      {/* Product Images */}
      <div className="lg:col-span-7 relative">
        <div className="rounded-xl overflow-hidden aspect-[4/5] bg-surface-container-low shadow-sm">
          {displayImage ? (
            <Image
              alt={product?.name ?? 'Product Image'}
              src={displayImage}
              fill
              unoptimized
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="absolute -top-4 -right-2 sm:-right-4 lg:-top-6 lg:-right-6 w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-secondary text-on-secondary flex flex-col items-center justify-center text-center p-3 lg:p-4 shadow-xl rotate-12">
          <span className="font-headline italic text-xs lg:text-sm">Genuine</span>
          <span className="font-bold text-base lg:text-lg uppercase tracking-widest leading-none my-1">100%</span>
          <span className="font-headline italic text-xs lg:text-sm">Natural</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8 px-3 sm:px-2 lg:px-4 w-full min-w-0">
        <div className="space-y-4">
          <nav className="flex gap-2 text-on-surface-variant font-label text-sm uppercase tracking-widest">
            <span>Shop</span>
            <span>/</span>
            <span className="text-secondary font-bold">{product?.name ?? 'Product'}</span>
          </nav>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-none break-words">{product?.name ?? 'Pure Desi Jaggery'}</h1>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-headline text-secondary">{`${currencySymbol}${Number(displayPrice || 0).toFixed(2)}`}</span>
            {displayOriginal && (
              <span className="text-sm sm:text-base font-body text-on-surface-variant line-through">{`${currencySymbol}${Number(displayOriginal || 0).toFixed(2)}`}</span>
            )}
            {/* <span className="text-on-surface-variant text-sm font-label">/ {selectedSize} Package</span> */}
          </div>
        </div>

        <div className="space-y-6 text-on-surface leading-relaxed font-body">
            <p className="text-lg">{product?.description ?? 'Experience the unadulterated sweetness of the earth. Our product is crafted using traditional techniques.'}</p>

          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Select Weight</span>
            <div className="flex gap-3 flex-wrap">
              {(product?.sizes && product.sizes.length > 0 ? product.sizes : ['Default']).map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-6 py-3 rounded-full border-2 text-sm font-bold hover:border-primary transition-all ${s === selectedSize ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-xl text-center">
              <span className="material-symbols-outlined text-primary mb-2 text-2xl">block</span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-tighter text-on-surface-variant">No Chemicals</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-xl text-center">
              <span className="material-symbols-outlined text-primary mb-2 text-2xl">pan_tool</span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Handmade</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-xl text-center">
              <span className="material-symbols-outlined text-primary mb-2 text-2xl">history_edu</span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Traditional</span>
            </div>
          </div>
        </div>

        <div className="pt-6 space-y-6 border-t border-outline-variant/20">
          <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center justify-between w-full sm:w-auto bg-surface-container-highest rounded-full px-4 py-2">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-1 hover:text-primary transition-colors focus:outline-none">
                  <span className="material-symbols-outlined text-lg">remove</span>
                </button>
                <span className="px-6 font-bold text-lg font-headline">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(Math.max(1, availableStock || 1), q + 1))}
                  disabled={isOutOfStock || qty >= availableStock}
                  className="p-1 hover:text-primary transition-colors focus:outline-none disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product || productId <= 0 || isOutOfStock}
              className="flex-1 w-full bg-primary text-on-primary py-4 rounded-full font-bold uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 flex justify-center items-center gap-3 shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined icon-filled">
                {isOutOfStock ? "block" : inCart ? "shopping_cart" : "add_shopping_cart"}
              </span>
              {isOutOfStock ? "Out of Stock" : inCart ? "Added to Cart" : "Add to Cart"}
            </button>
          </div>

          <button
            type="button"
            onClick={handleWishlist}
            disabled={!product || productId <= 0}
            className={`w-full py-4 rounded-full font-bold uppercase tracking-widest transition-all flex justify-center items-center gap-3 border-2 ${inWishlist ? 'bg-secondary text-white border-secondary' : 'border-outline-variant text-primary hover:border-primary hover:bg-primary/5'}`}
          >
            <span className={`material-symbols-outlined icon-filled ${inWishlist ? 'text-white' : 'text-secondary'}`}>
              favorite
            </span>
            {inWishlist ? 'Saved to Wishlist' : 'Add to Wishlist'}
          </button>

          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest justify-center sm:justify-start">
            <span className="material-symbols-outlined text-secondary icon-filled">verified</span>
            Natural & Pure Guaranteed
          </div>
        </div>
      </div>
    </div>
  );
}
