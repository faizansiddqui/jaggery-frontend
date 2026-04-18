"use client";
import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

  // Calculate available stock for selected variant/size
  const availableStock = useMemo(() => {
    if (!product) return 0;
    // Check variant stock first
    if (selectedVariant?.stock !== undefined) {
      return selectedVariant.stock;
    }
    // Check stockByVariant
    if (product.stockByVariant && selectedSize) {
      return product.stockByVariant[selectedSize] ?? 0;
    }
    // Check stockBySize
    if (product.stockBySize && selectedSize) {
      return product.stockBySize[selectedSize] ?? 0;
    }
    return 0;
  }, [product, selectedVariant, selectedSize]);

  const [qty, setQty] = useState<number>(1);
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  const handleShare = async () => {
    if (!product) return;
    const productUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name || 'Product',
          text: `Check out this product: ${product.name || 'Awesome item'}`,
          url: productUrl,
        });
        setShareStatus('Product shared successfully');
      } else {
        await navigator.clipboard.writeText(productUrl);
        setShareStatus('Product link copied');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      try {
        await navigator.clipboard.writeText(productUrl);
        setShareStatus('Product link copied');
      } catch {
        setShareStatus('Unable to share this product');
      }
    }

    window.setTimeout(() => setShareStatus(''), 2500);
  };

  // Handle scroll for sticky mobile button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Show sticky button after scrolling past the product details section
      setIsStickyVisible(scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (!product || productId <= 0) return;
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

    if (qty > 1) {
      try {
        updateQty(productId, selectedSize, qty - 1);
      } catch { /* ignore */ }
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

  const handleBuyNow = () => {
    if (!product || productId <= 0) return;

    // Save Buy Now item to localStorage (doesn't affect cart)
    const buyNowItem = {
      id: productId,
      name: product?.name ?? 'Product',
      price: displayPrice,
      color: "",
      size: selectedSize,
      image: displayImage,
      collection: product?.collection ?? 'SHOP',
      qty: qty,
    };

    localStorage.setItem('sr_buy_now_item', JSON.stringify(buyNowItem));

    // Navigate to checkout
    router.push("/checkout?buyNow=true");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mt-2 lg:mt-6 w-full max-w-7xl mx-auto">

      {/* Sticky Product Image Section - Forced Sticky */}
      <div className="lg:col-span-7 order-1 lg:h-fit">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative lg:sticky lg:top-28 rounded-[2rem] overflow-hidden aspect-square bg-surface-container-low shadow-2xl shadow-primary/5 group"
        >
          {displayImage ? (
            <Image
              alt={product?.name ?? 'Product Image'}
              src={displayImage}
              fill
              unoptimized
              priority
              sizes="(min-width: 700px) 40vw, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
            />
          ) : null}

          {/* Floating Badge */}
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute top-4 right-4 w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-secondary/90 backdrop-blur-md text-on-secondary flex flex-col items-center justify-center text-center p-3 shadow-xl z-10 border border-white/20"
          >
            <span className="font-label text-[8px] lg:text-[10px] uppercase tracking-widest opacity-80">Pure</span>
            <span className="font-headline font-black text-lg lg:text-2xl leading-none my-0.5">100%</span>
            <span className="font-headline italic text-[10px] lg:text-xs">Organic</span>
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
        </motion.div>
      </div>

      {/* Product Details Section */}
      <div className="lg:col-span-5 lg:h-fit flex flex-col gap-5 lg:gap-4 px-2 w-full order-2">
        <div className="lg:sticky lg:top-28 space-y-6">
          <div className="space-y-6">
            <nav className="flex items-center gap-3 text-[10px] font-label text-on-surface-variant uppercase tracking-[0.2em]">
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => router.push('/shop')}>Collection</span>
              <span className="opacity-30">/</span>
              <span className="text-secondary font-black">{product?.collection || "Essentials"}</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary tracking-tighter leading-[1] break-words">
                {product?.name ?? 'Premium Product'}
              </h1>
            </div>

            {shareStatus ? (
              <p className="text-xs font-medium text-primary/80">{shareStatus}</p>
            ) : null}

            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4 flex-row">
                <span className="text-4xl font-headline font-bold text-secondary">
                  {currencySymbol}{Number(displayPrice || 0).toFixed(2)}
                </span>
                {displayOriginal && (
                  <span className="text-sm font-body text-on-surface-variant/50 line-through">
                    {currencySymbol}{Number(displayOriginal || 0).toFixed(2)}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex right-2 items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                aria-label="Share this product"
              >
                <span className="material-symbols-outlined">share</span>
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          <div className="space-y-10">
            <p className="text-lg text-on-surface-variant/80 font-body leading-relaxed">
              {product?.description ?? 'Savor the authentic taste of tradition. Handcrafted with care using only the finest natural ingredients.'}
            </p>

            {/* Size Selector */}
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant py-3">Available Options</span>
              <div className="flex gap-3 flex-wrap">
                {(product?.sizes && product.sizes.length > 0 ? product.sizes : ['Standard']).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border ${s === selectedSize
                      ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-105'
                      : 'bg-transparent text-on-surface-variant hover:border-primary border-outline-variant/40'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: 'eco', text: 'Pure' },
                { icon: 'workspace_premium', text: 'Grade A' },
                { icon: 'local_shipping', text: 'Fast Del.' }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/5 text-center transition-all hover:bg-white shadow-sm">
                  <span className="material-symbols-outlined text-secondary mb-1 text-xl">{item.icon}</span>
                  <span className="text-[9px] font-black uppercase tracking-tighter text-on-surface-variant">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky-ready Actions */}
          <div className="pt-8 space-y-4 border-t border-outline-variant/20">
            <div className="flex flex-col sm:flex-row items-stretch gap-4">
              {/* Qty */}
              <div className="flex items-center justify-between bg-surface-container-low rounded-xl px-2 py-2 border border-outline-variant/20">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="px-4 font-headline font-bold text-xl">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(availableStock > 0 ? availableStock : 999, q + 1))}
                  disabled={availableStock > 0 && qty >= availableStock}
                  className="w-10 h-10 flex items-center justify-center hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product || productId <= 0}
                className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl ${inCart
                  ? 'bg-white border border-secondary text-secondary shadow-secondary/20'
                  : 'bg-secondary text-on-secondary shadow-secondary/20 hover:brightness-110'
                  }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {inCart ? "done_all" : "shopping_cart"}
                </span>
                {inCart ? "Go to Cart" : "Add to Cart"}
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!product || productId <= 0}
              className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl bg-primary text-on-primary shadow-primary/20 hover:brightness-110 flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined text-xl">bolt</span>
              Buy Now
            </button>

            <button
              type="button"
              onClick={handleWishlist}
              disabled={!product || productId <= 0}
              className="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 hover:text-secondary transition-colors"
            >
              <span className={`material-symbols-outlined text-lg ${inWishlist ? 'icon-filled text-secondary' : ''}`}>
                favorite
              </span>
              {inWishlist ? 'Remove from Wishlist' : 'Save for later'}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Buy Now Button */}
      {isStickyVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-surface/95 backdrop-blur-md border-t border-outline-variant/20 lg:hidden"
        >
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Price</span>
              <span className="font-headline font-bold text-lg text-primary">{currencySymbol}{Number(displayPrice || 0).toFixed(2)}</span>
            </div>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!product || productId <= 0}
              className="flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl bg-secondary text-on-secondary shadow-secondary/20 hover:brightness-110 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">bolt</span>
              Buy Now
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
