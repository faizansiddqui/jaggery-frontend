'use client';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';
import { fetchProductReviews, fetchProductStockNotifyStatus, registerProductStockNotify, submitProductReview } from '@/app/lib/apiClient';
import { getUserEmail } from '@/app/lib/session';
import ProductHeroSection from './sections/ProductHeroSection';
import ReviewSection from './sections/ReviewSection';
import SynchronizedGearSection from './sections/SynchronizedGearSection';
import { sanitizeDescriptionHtml, toReviewDateTime } from './reviewUtils';
import type { ProductDetailProps, Review, ReviewSlide, ReviewSort, ReviewViewerState } from './types';
export default function ProductDetail({ product }: ProductDetailProps) {
    const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Default');
    const [activeImage, setActiveImage] = useState(0);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewViewer, setReviewViewer] = useState<ReviewViewerState | null>(null);
    const [reviewForm, setReviewForm] = useState({ author: '', rating: 0, text: '', images: [] as string[] });
    const [reviewImageFiles, setReviewImageFiles] = useState<File[]>([]);
    const [reviewSort, setReviewSort] = useState<ReviewSort>('latest');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [toast, setToast] = useState('');
    const [notifyPending, setNotifyPending] = useState(false);
    const [notifyLoading, setNotifyLoading] = useState(false);
    const [canScrollGearLeft, setCanScrollGearLeft] = useState(false);
    const [canScrollGearRight, setCanScrollGearRight] = useState(true);
    const gearRailRef = useRef<HTMLDivElement | null>(null);
    const initializedVariantFromQueryRef = useRef(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { items, addItem } = useCart();
    const { toggle, isInWishlist } = useWishlist();
    const { settings } = useSiteSettings();
    const currency = settings.currencySymbol || '$';
    const inWL = isInWishlist(product.id);
    const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];
    const originalPrice = typeof product.originalPrice === 'number' && product.originalPrice > product.price ? product.originalPrice : null;
    const discountPct = originalPrice ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0;
    const colorSwatchMap: Record<string, string> = { red: '#c81f2a', black: '#1e1e1e', white: '#f3f3f3', grey: '#8f8f8f', gray: '#8f8f8f', blue: '#254f93' };
    const colorSwatches = (product.colors && product.colors.length > 0 ? product.colors : ['red', 'black', 'grey']).slice(0, 4);
    const variantInCart = items.some((item) => item.id === product.id && item.size === selectedSize && item.color === selectedColor);
    const selectedVariantKey = `${selectedColor.toLowerCase()}|${selectedSize.toLowerCase()}`;
    const selectedSizeKey = selectedSize.toLowerCase();
    const selectedVariantStock = typeof product.stockByVariant?.[selectedVariantKey] === 'number' ? Number(product.stockByVariant[selectedVariantKey]) : typeof product.stockBySize?.[selectedSizeKey] === 'number' ? Number(product.stockBySize[selectedSizeKey]) : Number(product.quantity || 0);
    const isOutOfStock = selectedVariantStock <= 0;
    const richDescriptionHtml = useMemo(() => product.descriptionHtml ? sanitizeDescriptionHtml(product.descriptionHtml) : '', [product.descriptionHtml]);
    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };
    const handleAddToCart = () => {
        if (isOutOfStock) return showToast('Out of stock. Use Notify button.');
        if (variantInCart) return router.push('/cart');
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
    const handleNotify = async () => {
        if (notifyPending || notifyLoading) return;
        const email = getUserEmail();
        if (!email) return showToast('Login required for stock alerts');
        try {
            setNotifyLoading(true);
            const response = await registerProductStockNotify({
                product_id: product.id,
                product_name: product.name,
                color: selectedColor,
                size: selectedSize,
                source: 'product_detail',
                email,
            });
            if (response.inStock) return showToast('Product is already in stock');
            setNotifyPending(true);
            showToast('You will be notified on restock');
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Could not set stock alert');
        } finally {
            setNotifyLoading(false);
        }
    };
    const handleWishlist = () => {
        toggle({ id: product.id, name: product.name, price: product.price, image: product.image, collection: product.collection });
        showToast(inWL ? 'Removed from Wishlist' : 'Saved to Wishlist');
    };
    const submitReview = async () => {
        if (isSubmittingReview) return;
        if (!reviewForm.author.trim() || !reviewForm.text.trim()) return showToast('Name and review text are required');
        if (reviewForm.rating < 1 || reviewForm.rating > 5) return showToast('Please select a rating');
        try {
            setIsSubmittingReview(true);
            const response = await submitProductReview({
                productId: product.id,
                rating: reviewForm.rating,
                text: reviewForm.text,
                userName: reviewForm.author,
                email: getUserEmail() || undefined,
                images: reviewImageFiles.slice(0, 2),
            });
            const row = (response.review || {}) as Record<string, unknown>;
            const dateMeta = toReviewDateTime(row.createdAt);
            const imageListRaw = Array.isArray(row.review_images) ? row.review_images : row.review_image ? [row.review_image] : [];
            const createdReview: Review = {
                id: String(row.id || Date.now()),
                author: String(row.user_name || reviewForm.author || 'Anonymous'),
                rating: Math.max(1, Math.min(5, Number(row.review_rate || reviewForm.rating))),
                text: String(row.review_text || reviewForm.text),
                dateTime: dateMeta.label,
                createdAt: dateMeta.timestamp,
                images: imageListRaw.map((entry) => String(entry || '').trim()).filter(Boolean).slice(0, 2),
            };
            setReviews((prev) => [createdReview, ...prev.filter((entry) => entry.id !== createdReview.id)]);
            setReviewForm({ author: '', rating: 0, text: '', images: [] });
            setReviewImageFiles([]);
            setShowReviewForm(false);
            showToast('Review submitted — Thank you!');
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to submit review');
        } finally {
            setIsSubmittingReview(false);
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
        Promise.all(selected.map((file) => new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error('Failed to read image'));
            reader.readAsDataURL(file);
        }))).then((encoded) => {
            setReviewForm((prev) => ({ ...prev, images: [...prev.images, ...encoded] }));
            if (fileList.length > remainingSlots) showToast('Only first 2 images were added');
        })
            .catch(() => showToast('Could not upload image. Please try again.'));
        event.target.value = '';
    };
    const removeReviewImage = (index: number) => {
        setReviewForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
        setReviewImageFiles((prev) => prev.filter((_, i) => i !== index));
    };
    const sortedReviews = [...reviews].sort((a, b) => reviewSort === 'highest' ? b.rating - a.rating : reviewSort === 'lowest' ? a.rating - b.rating : b.createdAt - a.createdAt);
    const averageRating = useMemo(() => {
        if (!reviews.length) return 0;
        const total = reviews.reduce((sum, review) => sum + (Number.isFinite(review.rating) ? review.rating : 0), 0);
        return Math.max(0, Math.min(5, total / reviews.length));
    }, [reviews]);
    const reviewSlides = useMemo<ReviewSlide[]>(() => sortedReviews.flatMap((review) => (review.images || []).slice(0, 2).map((src, index) => ({
        key: `${review.id}-${index}`,
        src,
        author: review.author,
        text: review.text,
        dateTime: review.dateTime,
    }))), [sortedReviews]);
    const openReviewViewer = (index: number) => {
        if (!reviewSlides.length || index < 0 || index >= reviewSlides.length) return;
        setReviewViewer({ slides: reviewSlides, index });
    };
    const moveReviewViewer = (direction: 'next' | 'prev') => {
        setReviewViewer((prev) => prev ? {
            ...prev,
            index: direction === 'next'
                ? (prev.index + 1) % prev.slides.length
                : (prev.index - 1 + prev.slides.length) % prev.slides.length,
        } : prev);
    };
    useEffect(() => {
        fetchProductReviews(product.id).then((list) => {
            if (!Array.isArray(list) || list.length === 0) return setReviews([]);
            setReviews(list.map((entry) => {
                const dateMeta = toReviewDateTime(entry.createdAt);
                return {
                    id: String(entry.id || Date.now()),
                    author: String(entry.user_name || 'Anonymous'),
                    rating: Number(entry.review_rate || 5),
                    text: String(entry.review_text || ''),
                    dateTime: dateMeta.label,
                    createdAt: dateMeta.timestamp,
                    images: (Array.isArray(entry.review_images) ? entry.review_images : entry.review_image ? [entry.review_image] : []).map((row: unknown) => String(row || '').trim()).filter(Boolean).slice(0, 2),
                };
            }));
        }).catch(() => {});
    }, [product.id]);
    useEffect(() => {
        const email = getUserEmail();
        if (!email) return setNotifyPending(false);
        fetchProductStockNotifyStatus(product.id, email, selectedColor, selectedSize)
            .then((result) => setNotifyPending(Boolean(result.isNotified)))
            .catch(() => setNotifyPending(false));
    }, [product.id, selectedColor, selectedSize]);
    useEffect(() => {
        if (!showReviewForm && !reviewViewer) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previousOverflow; };
    }, [showReviewForm, reviewViewer]);
    useEffect(() => {
        if (!reviewViewer) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setReviewViewer(null);
            if (event.key === 'ArrowRight') moveReviewViewer('next');
            if (event.key === 'ArrowLeft') moveReviewViewer('prev');
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [reviewViewer]);
    useEffect(() => {
        if (initializedVariantFromQueryRef.current) return;

        const colorParam = String(searchParams.get('color') || '').trim();
        const sizeParam = String(searchParams.get('size') || '').trim();

        if (colorParam && Array.isArray(product.colors)) {
            const match = product.colors.find((color) => color.toLowerCase() === colorParam.toLowerCase());
            if (match) setSelectedColor(match);
        }

        if (sizeParam && Array.isArray(product.sizes)) {
            const match = product.sizes.find((size) => size.toLowerCase() === sizeParam.toLowerCase());
            if (match) setSelectedSize(match);
        }

        initializedVariantFromQueryRef.current = true;
    }, [searchParams, product.colors, product.sizes]);

    useEffect(() => {
        const rail = gearRailRef.current;
        if (!rail) return;
        const updateScrollState = () => {
            const maxLeft = rail.scrollWidth - rail.clientWidth;
            const hasHorizontalScroll = maxLeft > 2;
            if (!hasHorizontalScroll) return setCanScrollGearLeft(false), setCanScrollGearRight(false);
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
    return (
        <main className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
            {toast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-[#1c1b1b] text-[#fcf8f8] px-8 py-4 font-headline text-xs uppercase tracking-widest shadow-xl animate-in fade-in slide-in-from-top-4">
                    {toast}
                </div>
            )}
            <div className="pt-4 pb-6 px-4 md:px-8 max-w-[1920px] mx-auto">
                <ProductHeroSection
                    product={product}
                    galleryImages={galleryImages}
                    activeImage={activeImage}
                    setActiveImage={setActiveImage}
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}
                    colorSwatches={colorSwatches}
                    colorSwatchMap={colorSwatchMap}
                    currency={currency}
                    originalPrice={originalPrice}
                    discountPct={discountPct}
                    richDescriptionHtml={richDescriptionHtml}
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                    isOutOfStock={isOutOfStock}
                    variantInCart={variantInCart}
                    handleAddToCart={handleAddToCart}
                    handleNotify={handleNotify}
                    notifyPending={notifyPending}
                    notifyLoading={notifyLoading}
                    handleWishlist={handleWishlist}
                    inWL={inWL}
                />
                <ReviewSection
                    reviewsCount={reviews.length}
                    averageRating={averageRating}
                    reviewSort={reviewSort}
                    setReviewSort={setReviewSort}
                    onOpenReviewModal={() => setShowReviewForm(true)}
                    showReviewForm={showReviewForm}
                    isSubmittingReview={isSubmittingReview}
                    reviewForm={reviewForm}
                    setReviewForm={setReviewForm}
                    onCloseReviewModal={() => setShowReviewForm(false)}
                    onSubmitReview={submitReview}
                    onReviewImageUpload={handleReviewImageUpload}
                    onRemoveReviewImage={removeReviewImage}
                    reviewViewer={reviewViewer}
                    onCloseReviewViewer={() => setReviewViewer(null)}
                    onMoveReviewViewer={moveReviewViewer}
                    reviewSlides={reviewSlides}
                    onOpenReviewViewer={openReviewViewer}
                    sortedReviews={sortedReviews}
                />
                <SynchronizedGearSection
                    currency={currency}
                    canScrollGearLeft={canScrollGearLeft}
                    canScrollGearRight={canScrollGearRight}
                    onGearScroll={(direction) => {
                        const rail = gearRailRef.current;
                        if (!rail) return;
                        const distance = Math.max(rail.clientWidth * 0.8, 240);
                        rail.scrollBy({ left: direction === 'right' ? distance : -distance, behavior: 'smooth' });
                    }}
                    gearRailRef={gearRailRef}
                />
            </div>
        </main>
    );
}
