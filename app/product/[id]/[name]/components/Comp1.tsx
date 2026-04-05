'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';
import type { Product } from '@/app/data/products';
import { fetchProductReviews, submitProductReview } from '@/app/lib/apiClient';
import { getUserEmail } from '@/app/lib/session';

interface ProductDetailProps {
    product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Default');
    const [activeImage, setActiveImage] = useState(0);
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({ author: '', rating: 5, text: '', images: [] as string[] });
    const [reviewImageFiles, setReviewImageFiles] = useState<File[]>([]);
    const [reviewSort, setReviewSort] = useState<'latest' | 'highest' | 'lowest'>('latest');
    const [toast, setToast] = useState('');
    const [canScrollGearLeft, setCanScrollGearLeft] = useState(false);
    const [canScrollGearRight, setCanScrollGearRight] = useState(true);
    const gearRailRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const { items, addItem } = useCart();
    const { toggle, isInWishlist } = useWishlist();
    const { settings } = useSiteSettings();
    const currency = settings.currencySymbol || '$';
    const inWL = isInWishlist(product.id);
    const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];
    const originalPrice = typeof product.originalPrice === 'number' && product.originalPrice > product.price ? product.originalPrice : null;
    const discountPct = originalPrice ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0;

    const colorSwatchMap: Record<string, string> = {
        red: '#c81f2a',
        black: '#1e1e1e',
        white: '#f3f3f3',
        grey: '#8f8f8f',
        gray: '#8f8f8f',
        blue: '#254f93',
    };
    const colorSwatches = (product.colors && product.colors.length > 0 ? product.colors : ['red', 'black', 'grey']).slice(0, 4);
    const variantInCart = items.some(
        (item) => item.id === product.id && item.size === selectedSize && item.color === selectedColor
    );

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

    const handleAddToCart = () => {
        if (variantInCart) {
            router.push('/cart');
            return;
        }

        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            color: selectedColor,
            size: selectedSize,
            image: galleryImages[activeImage] || product.image,
            collection: product.collection,
        });
        showToast(`Added to bag — ${selectedColor}, Size ${selectedSize}`);
    };

    const handleWishlist = () => {
        toggle({ id: product.id, name: product.name, price: product.price, image: product.image, collection: product.collection });
        showToast(inWL ? 'Removed from Wishlist' : 'Saved to Wishlist');
    };

    const submitReview = async () => {
        if (!reviewForm.author.trim() || !reviewForm.text.trim()) return;
        try {
            await submitProductReview({
                productId: product.id,
                rating: reviewForm.rating,
                text: reviewForm.text,
                userName: reviewForm.author,
                email: getUserEmail() || undefined,
                image: reviewImageFiles[0],
            });

            setReviews(prev => [...prev, { id: Date.now(), ...reviewForm, date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase() }]);
            setReviewForm({ author: '', rating: 5, text: '', images: [] });
            setReviewImageFiles([]);
            setShowReviewForm(false);
            showToast('Review submitted — Thank you!');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to submit review';
            showToast(message);
        }
    };

    const handleReviewImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (!fileList || fileList.length === 0) return;

        const remainingSlots = 2 - reviewForm.images.length;
        if (remainingSlots <= 0) {
            showToast('Maximum 2 images allowed per review');
            event.target.value = '';
            return;
        }

        const selected = Array.from(fileList).slice(0, remainingSlots);
        setReviewImageFiles((prev) => [...prev, ...selected]);
        const readers = selected.map((file) => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result || ''));
                reader.onerror = () => reject(new Error('Failed to read image'));
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers)
            .then((encoded) => {
                setReviewForm((prev) => ({ ...prev, images: [...prev.images, ...encoded] }));
                if (fileList.length > remainingSlots) showToast('Only first 2 images were added');
            })
            .catch(() => showToast('Could not upload image. Please try again.'));

        event.target.value = '';
    };

    const removeReviewImage = (idx: number) => {
        setReviewForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== idx),
        }));
        setReviewImageFiles((prev) => prev.filter((_, index) => index !== idx));
    };

    const openReviewModal = () => setShowReviewForm(true);

    const sortedReviews = [...reviews].sort((a, b) => {
        if (reviewSort === 'highest') return b.rating - a.rating;
        if (reviewSort === 'lowest') return a.rating - b.rating;
        return b.id - a.id;
    });

    const handleGearScroll = (direction: 'left' | 'right') => {
        const rail = gearRailRef.current;
        if (!rail) return;
        const distance = Math.max(rail.clientWidth * 0.8, 240);
        rail.scrollBy({
            left: direction === 'right' ? distance : -distance,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const rail = gearRailRef.current;
        if (!rail) return;

        const updateScrollState = () => {
            const maxLeft = rail.scrollWidth - rail.clientWidth;
            const hasHorizontalScroll = maxLeft > 2;
            if (!hasHorizontalScroll) {
                setCanScrollGearLeft(false);
                setCanScrollGearRight(false);
                return;
            }
            setCanScrollGearLeft(rail.scrollLeft > 4);
            setCanScrollGearRight(rail.scrollLeft < maxLeft - 4);
        };

        updateScrollState();
        rail.addEventListener('scroll', updateScrollState, { passive: true });
        window.addEventListener('resize', updateScrollState);

        return () => {
            rail.removeEventListener('scroll', updateScrollState);
            window.removeEventListener('resize', updateScrollState);
        };
    }, []);

    useEffect(() => {
        fetchProductReviews(product.id)
            .then((list) => {
                if (!Array.isArray(list) || list.length === 0) return;
                const mapped: Review[] = list.map((entry) => ({
                    id: Number(entry.id || Date.now()),
                    author: String(entry.user_name || 'Anonymous'),
                    rating: Number(entry.review_rate || 5),
                    text: String(entry.review_text || ''),
                    date: new Date(String(entry.createdAt || Date.now())).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase(),
                    images: entry.review_image ? [String(entry.review_image)] : [],
                }));
                setReviews(mapped);
            })
            .catch(() => { });
    }, [product.id]);

    useEffect(() => {
        if (!showReviewForm) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [showReviewForm]);

    return (
        <main className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
            {toast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-[#1c1b1b] text-[#fcf8f8] px-8 py-4 font-headline text-xs uppercase tracking-widest shadow-xl animate-in fade-in slide-in-from-top-4">
                    {toast}
                </div>
            )}
            <div className="pt-4 pb-6 px-4 md:px-8 max-w-[1920px] mx-auto">
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
                            <span className="inline-block bg-[#b90c1b] text-white px-3 py-1 font-headline text-[9px] font-bold uppercase tracking-widest mb-4">Limited Edition</span>
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

                        <div className="bg-[#f6f3f2] border-l-5 border-[#b90c1b] p-6 flex flex-col gap-6">
                            <p className="font-headline text-[11px] uppercase tracking-wider leading-relaxed opacity-70 text-[#4e4d4d]">{product.description}</p>
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
                            <button onClick={handleAddToCart} className="w-full bg-[#111] text-white py-4 font-headline text-[12px] uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-2">
                                {variantInCart ? 'Go To Cart' : 'Add To Shopping Cart'}
                            </button>
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

                <section className="mt-14 border-t-2 border-[#1c1b1b] pt-14">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                        <div>
                            <h2 className="font-brand text-5xl md:text-6xl uppercase leading-none tracking-tighter">Technical Verdicts</h2>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="flex text-[#b90c1b]">{[1, 2, 3, 4, 5].map(s => <span key={s} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>grade</span>)}</div>
                                <span className="font-headline text-xs uppercase tracking-widest opacity-60">{reviews.length} Reviews</span>
                            </div>
                        </div>
                        <div className="flex flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                            <label className="border-2 border-[#1c1b1b]/20 bg-white px-2 py-2 font-headline text-[11px] uppercase tracking-widest flex items-center  w-full sm:w-auto">
                                <span className="material-symbols-outlined text-base text-[#b90c1b]">sort</span>
                                <select
                                    value={reviewSort}
                                    onChange={(e) => setReviewSort(e.target.value as 'latest' | 'highest' | 'lowest')}
                                    className="bg-transparent outline-none"
                                >
                                    <option value="latest">Latest</option>
                                    <option value="highest">Highest Rating</option>
                                    <option value="lowest">Lowest Rating</option>
                                </select>
                            </label>
                            <button onClick={openReviewModal}
                                className="w-full border-2 border-[#1c1b1b] px-5 py-2 md:p-2  font-brand text-xl uppercase transition-all active:scale-95 flex items-center justify-center gap-1 hover:bg-[#1c1b1b] hover:text-white">
                                <span className="material-symbols-outlined text-base">rate_review</span>
                                Write a Review
                            </button>
                        </div>
                    </div>

                    {showReviewForm && (
                        <div className="fixed inset-0 z-[110] overflow-y-auto">
                            <button
                                type="button"
                                aria-label="Close review modal"
                                className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
                                onClick={() => setShowReviewForm(false)}
                            />
                            <div className="relative min-h-full flex items-start md:items-center justify-center p-4 md:p-8">
                                <div className="relative w-full max-w-3xl my-6 md:my-10 max-h-none md:max-h-[90vh] overflow-y-auto overscroll-contain x-rail bg-[#f6f3f2] p-6 md:p-10 border-l-8 border-[#b90c1b] shadow-2xl">
                                    <div className="flex items-start justify-between gap-4 mb-8">
                                        <div>
                                            <h3 className="font-brand text-3xl md:text-4xl uppercase">Your Review</h3>
                                            <p className="font-headline text-[10px] uppercase tracking-widest opacity-60 mt-1">Share rating, experience and optional photos</p>
                                        </div>
                                        <button
                                            type="button"
                                            className="h-10 w-10 border-2 border-[#1c1b1b]/20 bg-white hover:bg-[#1c1b1b] hover:text-white transition-all"
                                            onClick={() => setShowReviewForm(false)}
                                        >
                                            <span className="material-symbols-outlined text-lg">close</span>
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        <input value={reviewForm.author} onChange={e => setReviewForm(p => ({ ...p, author: e.target.value }))}
                                            className="bg-white border-2 border-[#1c1b1b]/20 px-6 py-4 font-headline text-sm uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                                            placeholder="YOUR NAME" />
                                        <div className="flex items-center gap-3">
                                            <span className="font-headline text-[10px] uppercase tracking-widest opacity-60">Rating:</span>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button key={star} type="button" onClick={() => setReviewForm(p => ({ ...p, rating: star }))}
                                                    className={`material-symbols-outlined text-2xl transition-colors ${star <= reviewForm.rating ? 'text-[#b90c1b]' : 'text-[#1c1b1b]/20'}`}
                                                    style={{ fontVariationSettings: star <= reviewForm.rating ? "'FILL' 1" : "'FILL' 0" }}>grade</button>
                                            ))}
                                        </div>
                                        <textarea value={reviewForm.text} onChange={e => setReviewForm(p => ({ ...p, text: e.target.value }))}
                                            rows={5} className="bg-white border-2 border-[#1c1b1b]/20 px-6 py-4 font-headline text-sm uppercase tracking-widest focus:outline-none focus:border-[#b90c1b] resize-none"
                                            placeholder="SHARE YOUR EXPERIENCE..." />

                                        <div className="flex flex-col gap-3">
                                            <p className="font-headline text-[10px] uppercase tracking-widest opacity-60">Upload Photos (Optional, max 2)</p>
                                            <label className="w-fit border-2 border-[#1c1b1b]/20 bg-white px-5 py-3 font-headline text-[11px] uppercase tracking-widest cursor-pointer hover:border-[#b90c1b] transition-colors">
                                                <span className="material-symbols-outlined text-base align-middle mr-2">add_photo_alternate</span>
                                                Add Images
                                                <input type="file" accept="image/*" multiple className="hidden" onChange={handleReviewImageUpload} />
                                            </label>
                                            {reviewForm.images.length > 0 && (
                                                <div className="grid grid-cols-2 gap-3">
                                                    {reviewForm.images.map((src, index) => (
                                                        <div key={`${src}-${index}`} className="relative border-2 border-[#1c1b1b]/15 bg-white overflow-hidden">
                                                            <Image src={src} alt={`Review Upload ${index + 1}`} width={400} height={300} unoptimized className="w-full aspect-[4/3] object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeReviewImage(index)}
                                                                className="absolute top-2 right-2 h-8 w-8 bg-black/75 text-white flex items-center justify-center"
                                                                aria-label="Remove uploaded image"
                                                            >
                                                                <span className="material-symbols-outlined text-base">close</span>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <button onClick={submitReview} className="self-start bg-[#b90c1b] text-white px-10 py-4 font-brand text-xl uppercase hover:scale-[1.02] transition-transform active:scale-95">
                                            Submit Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-3 md:pb-0 px-1 md:px-0 snap-x snap-mandatory x-rail">
                        {sortedReviews.map(r => (
                            <div key={r.id} className="min-w-[84%] sm:min-w-[70%] md:min-w-0 snap-start flex flex-col gap-4 border-l-4 border-[#1c1b1b]/20 hover:border-red-600 pl-6 bg-white/70 p-5">
                                <div className="flex text-[#b90c1b]">{[1, 2, 3, 4, 5].map(s => <span key={s} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: s <= r.rating ? "'FILL' 1" : "'FILL' 0" }}>grade</span>)}</div>
                                <p className="font-headline text-xs uppercase tracking-widest italic opacity-70">&quot;{r.text}&quot;</p>
                                {r.images && r.images.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2">
                                        {r.images.map((src, idx) => (
                                            <Image key={`${src}-${idx}`} src={src} alt={`Review image ${idx + 1}`} width={220} height={160} unoptimized className="w-full aspect-[4/3] object-cover border border-[#1c1b1b]/15" />
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="font-headline text-[10px] font-bold uppercase tracking-widest">— {r.author}</span>
                                    <span className="font-headline text-[9px] uppercase tracking-widest opacity-40">{r.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-24 pb-10">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-brand text-5xl uppercase tracking-tight">Synchronized Gear</h2>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleGearScroll('left')}
                                aria-label="Scroll synchronized gear left"
                                disabled={!canScrollGearLeft}
                                className={`h-10 w-10 border-2 transition-all ${canScrollGearLeft ? 'border-[#1c1b1b]/30 bg-white text-[#1c1b1b] hover:bg-[#f2efef]' : 'border-[#1c1b1b]/10 bg-[#efebea] text-[#1c1b1b]/30 cursor-not-allowed'}`}
                            >
                                ←
                            </button>
                            <button
                                type="button"
                                onClick={() => handleGearScroll('right')}
                                aria-label="Scroll synchronized gear right"
                                disabled={!canScrollGearRight}
                                className={`h-10 w-10 border-2 transition-all ${canScrollGearRight ? 'border-[#111] text-black hover:bg-[#2a2a2a]' : 'border-[#1c1b1b]/10 bg-[#efebea] text-[#1c1b1b]/30 cursor-not-allowed'}`}
                            >
                                →
                            </button>
                        </div>
                    </div>
                    <div ref={gearRailRef} className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-3 md:pb-0 px-1 md:px-0 snap-x snap-mandatory x-rail">
                        {[
                            { name: 'Apex Track Pants', price: '189.00', image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=900&q=80' },
                            { name: 'Velocity Essential Hoodie', price: '145.00', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80' },
                            { name: 'Circuit Racing Cap', price: '45.00', image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=900&q=80' },
                        ].map((item) => (
                            <div key={item.name} className="group min-w-[78%] sm:min-w-[56%] md:min-w-0 snap-start">
                                <div className="aspect-[4/5] bg-[#f1efef] overflow-hidden">
                                    <Image src={item.image} alt={item.name} width={900} height={1125} unoptimized className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <h4 className="mt-3 font-headline text-[11px] uppercase tracking-widest">{item.name}</h4>
                                <p className="font-headline text-[11px] opacity-70">{currency}{item.price}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}

interface Review { id: number; author: string; rating: number; text: string; date: string; images?: string[]; }

const initialReviews: Review[] = [
    { id: 1, author: 'ALEX. V', rating: 5, text: 'The structural integrity of this jacket is insane. Like wearing motorsport engineering.', date: 'OCT 2024' },
    { id: 2, author: 'SEOUL_KINETIC', rating: 5, text: 'Fit is true to size. Turns heads everywhere — heavyweight but breathable.', date: 'SEP 2024' },
];