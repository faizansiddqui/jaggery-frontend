'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Product } from '@/app/data/products';
import { fetchPublicPromos, type PublicPromo } from '@/app/lib/apiClient';

interface ProductHeroSectionProps {
    product: Product;
    galleryImages: string[];
    activeImage: number;
    setActiveImage: (index: number) => void;
    selectedColor: string;
    setSelectedColor: (color: string) => void;
    colorSwatches: string[];
    colorSwatchMap: Record<string, string>;
    currency: string;
    originalPrice: number | null;
    discountPct: number;
    richDescriptionHtml: string;
    selectedSize: string;
    setSelectedSize: (size: string) => void;
    isOutOfStock: boolean;
    variantInCart: boolean;
    handleAddToCart: () => void;
    handleNotify: () => void;
    notifyPending: boolean;
    notifyLoading: boolean;
    handleWishlist: () => void;
    inWL: boolean;
}

export default function ProductHeroSection({
    product,
    galleryImages,
    activeImage,
    setActiveImage,
    selectedColor,
    setSelectedColor,
    colorSwatches,
    colorSwatchMap,
    currency,
    originalPrice,
    discountPct,
    richDescriptionHtml,
    selectedSize,
    setSelectedSize,
    isOutOfStock,
    variantInCart,
    handleAddToCart,
    handleNotify,
    notifyPending,
    notifyLoading,
    handleWishlist,
    inWL,
}: ProductHeroSectionProps) {
    const [shareState, setShareState] = useState('');
    const [promos, setPromos] = useState<PublicPromo[]>([]);
    const [promosLoading, setPromosLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const loadPromos = async () => {
            setPromosLoading(true);
            try {
                const rows = await fetchPublicPromos(product.id);
                if (!active) return;
                setPromos(rows);
            } catch {
                if (!active) return;
                setPromos([]);
            } finally {
                if (!active) return;
                setPromosLoading(false);
            }
        };

        loadPromos();
        return () => {
            active = false;
        };
    }, [product.id]);

    const handleShare = async () => {
        if (typeof window === 'undefined') return;

        const shareUrl = new URL(window.location.href);
        shareUrl.searchParams.set('color', selectedColor);
        shareUrl.searchParams.set('size', selectedSize);

        const shareText = `${product.name} | Color: ${selectedColor} | Size: ${selectedSize}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: product.name,
                    text: shareText,
                    url: shareUrl.toString(),
                });
                return;
            }

            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(`${shareText}\n${shareUrl.toString()}`);
                setShareState('Link copied');
                window.setTimeout(() => setShareState(''), 1800);
            }
        } catch {
            // Ignore user-cancelled share and clipboard failures
        }
    };

    return (
        <>
            <nav className="mb-6 font-headline text-[10px] uppercase tracking-widest opacity-40 flex items-center gap-2">
                <Link href="/" className="hover:text-[#b90c1b]">Home</Link>
                <span>/</span><Link href="/shop" className="hover:text-[#b90c1b]">{product.category}</Link>
                <span>/</span><span className="opacity-100">{product.collection}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
                <div className="lg:col-span-7 space-y-3">
                    <div className="aspect-[4/5] bg-[#f1efef] overflow-hidden relative group">
                        <Image src={galleryImages[activeImage]} alt={product.name} width={1200} height={1500} unoptimized className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    {galleryImages.length > 1 && (
                        <div className="grid grid-cols-2 gap-3">
                            {galleryImages.map((img, idx) => (
                                <button
                                    key={`${img}-${idx}`}
                                    onClick={() => setActiveImage(idx)}
                                    className={`overflow-hidden bg-[#f1efef] border-2 ${idx === activeImage ? 'border-[#b90c1b]' : 'border-transparent'} ${idx === 2 ? 'col-span-2' : ''}`}
                                >
                                    <Image src={img} alt={`Thumb ${idx + 1}`} width={800} height={600} unoptimized className="w-full h-full object-cover aspect-[4/3]" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-5 lg:sticky lg:top-24 self-start flex flex-col gap-8">
                    <header>
                        <div className='flex items-center justify-between'>
                            <span className="inline-block bg-[#b90c1b] text-white px-3 py-1 font-headline text-[9px] font-bold uppercase tracking-widest mb-4">Limited Edition</span>
                            <div className="mb-3 flex items-center justify-end lg:hidden">
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="h-10 w-10 border border-[#1c1b1b]/20 bg-white/70 flex items-center justify-center hover:border-[#b90c1b]"
                                    aria-label="Share product"
                                >
                                    <span className="material-symbols-outlined text-[20px] text-[#1c1b1b]">ios_share</span>
                                </button>
                            </div>
                        {shareState ? (
                                <p className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b] mb-2 lg:hidden">{shareState}</p>
                            ) : null}
                        </div>
                        <h1 className="font-brand text-5xl md:text-6xl uppercase leading-[0.85] tracking-tight mb-4">{product.name}</h1>
                        <div className="flex items-center gap-3">
                            <span className="font-brand text-4xl">{currency}{product.price.toFixed(2)}</span>
                            {originalPrice && (
                                <>
                                    <span className="font-headline text-sm line-through opacity-40">{currency}{originalPrice.toFixed(2)}</span>
                                    <span className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b] font-bold">{discountPct}% Off</span>
                                </>
                            )}
                        </div>
                    </header>
                    {promosLoading && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-13">
                                {Array.from({ length: 1 }).map((_, idx) => (
                                    <div
                                        key={`promo-skeleton-${idx}`}
                                        className="min-w-[340px] bg-white border border-[#1c1b1b]/15 p-4 border-l-5 border-[#b90c1b] shadow-[0_8px_30px_rgba(15,15,15,0.08)] flex flex-col gap-3 animate-pulse"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="h-3 w-24 bg-[#1c1b1b]/10" />
                                            <div className="h-3 w-16 bg-[#b90c1b]/10" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-3 w-full bg-[#1c1b1b]/10" />
                                            <div className="h-3 w-5/6 bg-[#1c1b1b]/10" />
                                        </div>
                                        <div className="h-3 w-24 bg-[#1c1b1b]/10" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {promos.length > 0 && !promosLoading && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                {/* <p className="font-headline text-[9px] uppercase tracking-[0.32em] text-[#b90c1b]">Promo Codes</p> */}
                            </div>
                                <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
                                {promos.map((promo, idx) => {
                                    const discountLabel = promo.discountType === 'PERCENT'
                                        ? `${promo.discountValue}% OFF`
                                        : `${currency}${promo.discountValue.toFixed(0)} OFF`;
                                        const requirement = promo.scope === 'PRODUCT'
                                            ? promo.requiredProductId
                                                ? `Min Qty ${promo.requiredQty}`
                                                : `Requires ${promo.requiredQty} pcs`
                                            : 'Applies on cart total';

                                    return (
                                        <div
                                            key={`${promo.code}-${idx}`}
                                            className="min-w-[340px] bg-white border border-[#1c1b1b]/15 p-4 border-l-5 border-[#b90c1b] border- shadow-[0_8px_30px_rgba(15,15,15,0.08)] snap-start flex flex-col gap-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-headline text-[11px] uppercase tracking-[0.2em] text-[#1c1b1b]">{promo.code}</span>
                                                <span className="font-headline text-[9px] uppercase tracking-[0.2em] text-[#b90c1b]">{discountLabel}</span>
                                            </div>
                                            <p className="font-headline text-[11px] leading-relaxed tracking-wide text-[#1c1b1b]/75">{promo.description}</p>
                                            <span className="font-headline text-[9px] uppercase tracking-[0.2em] text-[#1c1b1b]/50">{requirement}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="bg-[#f6f3f2] border-l-5 border-[#b90c1b] p-6 flex flex-col gap-6">

                        {richDescriptionHtml ? (
                            <div
                                className="font-headline text-[11px] tracking-wide leading-relaxed opacity-80 text-[#4e4d4d] [&_h1]:font-brand [&_h1]:text-2xl [&_h1]:uppercase [&_h1]:leading-tight [&_h2]:font-brand [&_h2]:text-xl [&_h2]:uppercase [&_h2]:leading-tight [&_h3]:font-headline [&_h3]:text-sm [&_h3]:font-bold [&_h3]:uppercase [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold"
                                dangerouslySetInnerHTML={{ __html: richDescriptionHtml }}
                            />
                        ) : (
                            <p className="font-headline text-[11px] tracking-wider leading-relaxed opacity-70 text-[#4e4d4d]">{product.description}</p>
                        )}
                        <div>
                            <span className="font-headline text-[9px] uppercase tracking-[0.2em] opacity-60">Color</span>
                            <div className="flex items-center gap-2 mt-2">
                                {colorSwatches.map((colorName, index) => (
                                    <button
                                        key={`${colorName}-${index}`}
                                        title={colorName}
                                        onClick={() => {
                                            setSelectedColor(colorName);
                                            setActiveImage(Math.min(index, galleryImages.length - 1));
                                        }}
                                        className={`h-6 w-6 border-2 inline-block transition-all ${selectedColor === colorName ? 'border-[#1c1b1b] scale-110' : 'border-[#1c1b1b]/20'}`}
                                        style={{ backgroundColor: colorSwatchMap[colorName.toLowerCase()] || colorName }}
                                        aria-label={`Select ${colorName} color`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-headline text-[10px] uppercase tracking-widest opacity-50">Select Size</span>
                                <Link href="/journal/size-guide" target="_blank" rel="noopener noreferrer" className="font-headline text-[10px] uppercase tracking-widest underline underline-offset-4 opacity-50 hover:opacity-100">Size Guide</Link>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {product.sizes.map((size) => (
                                    <button key={size} onClick={() => setSelectedSize(size)}
                                        className={`h-11 border-2 font-headline text-[11px] uppercase tracking-widest transition-all ${selectedSize === size ? 'bg-[#1c1b1b] text-white border-[#1c1b1b]' : 'border-[#1c1b1b]/20 hover:border-[#1c1b1b]'}`}>
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className="w-full bg-[#111] text-white py-4 font-headline text-[12px] uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isOutOfStock ? 'Out Of Stock' : variantInCart ? 'Go To Cart' : 'Add To Shopping Cart'}
                        </button>
                        {isOutOfStock && (
                            <button
                                onClick={handleNotify}
                                disabled={notifyPending || notifyLoading}
                                className="w-full py-3 border-2 border-[#1c1b1b] font-headline text-[12px] uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1c1b1b] hover:text-white"
                            >
                                {notifyPending ? 'Notify Set' : notifyLoading ? 'Saving...' : 'Notify Me'}
                            </button>
                        )}
                        <button onClick={handleWishlist} className={`w-full py-3 border-2 font-headline text-[12px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${inWL ? 'bg-[#1c1b1b] text-white border-[#1c1b1b]' : 'border-[#1c1b1b]/20 hover:border-[#1c1b1b]'}`}>
                            <span className="material-symbols-outlined text-[#111]" style={{ fontVariationSettings: inWL ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                            Wishlist
                        </button>
                    </div>
                    <details className="group border-b-2 border-[#1c1b1b]/10 bg-white/40 px-4">
                        <summary className="list-none cursor-pointer py-4 flex items-center justify-between [&::-webkit-details-marker]:hidden">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[18px] text-[#b90c1b]">tune</span>
                                <div>
                                    <p className="font-headline text-lg uppercase tracking-[0.18em]">Specifications</p>
                                    <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">{product.details.length} Technical Details</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-[22px] text-[#1c1b1b]/70 transition-transform duration-300 group-open:rotate-180">expand_more</span>
                        </summary>
                        <div className="grid transition-all duration-500 ease-out [grid-template-rows:0fr] opacity-0 -translate-y-1 group-open:[grid-template-rows:1fr] group-open:opacity-100 group-open:translate-y-0">
                            <div className="overflow-hidden">
                                <div className="pb-5 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {product.details.map((d, i) => (
                                        <div key={i} className="flex items-start gap-3 bg-white border border-[#1c1b1b]/15 px-3 py-3">
                                            <span className="material-symbols-outlined text-[16px] mt-0.5 text-[#b90c1b]">check_circle</span>
                                            <p className="font-headline text-[11px] uppercase tracking-widest leading-relaxed text-[#1c1b1b]/80">{d}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </details>
                    <details className="group border-b-2 border-[#1c1b1b]/10 bg-white/40 px-4">
                        <summary className="list-none cursor-pointer py-4 flex items-center justify-between [&::-webkit-details-marker]:hidden">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[18px] text-[#b90c1b]">local_shipping</span>
                                <div>
                                    <p className="font-headline text-lg uppercase tracking-[0.18em]">Shipping & Returns</p>
                                    <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">Delivery, Exchange & Refund Policy</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-[22px] text-[#1c1b1b]/70 transition-transform duration-300 group-open:rotate-180">expand_more</span>
                        </summary>
                        <div className="grid transition-all duration-500 ease-out [grid-template-rows:0fr] opacity-0 -translate-y-1 group-open:[grid-template-rows:1fr] group-open:opacity-100 group-open:translate-y-0">
                            <div className="overflow-hidden">
                                <div className="pb-5 pt-1 flex flex-col gap-3">
                                    <div className="flex items-start gap-3 bg-white border border-[#1c1b1b]/15 px-3 py-3">
                                        <span className="material-symbols-outlined text-[16px] mt-0.5 text-[#b90c1b]">schedule</span>
                                        <p className="font-headline text-[11px] uppercase tracking-widest leading-relaxed text-[#1c1b1b]/80">Standard dispatch within 24-48 hours. Delivery timeline: 3-7 business days.</p>
                                    </div>
                                    <div className="flex items-start gap-3 bg-white border border-[#1c1b1b]/15 px-3 py-3">
                                        <span className="material-symbols-outlined text-[16px] mt-0.5 text-[#b90c1b]">keyboard_return</span>
                                        <p className="font-headline text-[11px] uppercase tracking-widest leading-relaxed text-[#1c1b1b]/80">Returns and refund requests are accepted within 7 days of delivery.</p>
                                    </div>
                                    <div className="flex items-start gap-3 bg-white border border-[#1c1b1b]/15 px-3 py-3">
                                        <span className="material-symbols-outlined text-[16px] mt-0.5 text-[#b90c1b]">verified_user</span>
                                        <p className="font-headline text-[11px] uppercase tracking-widest leading-relaxed text-[#1c1b1b]/80">Items must be unused with original tags and packaging for successful approval.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </details>
                </div>
            </div>
        </>
    );
}
