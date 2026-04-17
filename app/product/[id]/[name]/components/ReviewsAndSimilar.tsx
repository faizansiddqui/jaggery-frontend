"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";
import ReviewFormModal from "./review/ReviewFormModal";
import { fetchBackendProducts } from "@/app/lib/backendProducts";
import { fetchProductReviews, submitProductReview } from "@/app/lib/apiClient";
import { createProductHref } from "@/app/data/products";
import type { ReviewFormState } from "./types";
import type { Product } from "@/app/data/products";

type DynamicReview = {
  id: string;
  author: string;
  date: string;
  content: string;
  rating: number;
};

const formatDateLabel = (value?: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
};

export default function ReviewsAndSimilar({ product }: { product?: Product | null }) {
  const { addItem, isVariantInCart } = useCart();
  const { settings } = useSiteSettings();
  const currencySymbol = settings.currencySymbol || "₹";
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewFormState>({
    rating: 5,
    author: "",
    text: "",
    images: []
  });
  const [reviews, setReviews] = useState<DynamicReview[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  const productId = Number(product?.id || 0);
  const productPublicId = String(product?.publicId || "").trim();

  const loadReviews = useCallback(async () => {
    if (!productId) return;
    try {
      const rows = await fetchProductReviews(productId);
      const mapped = (Array.isArray(rows) ? rows : []).map((row) => {
        const item = row as Record<string, unknown>;
        return {
          id: String(item.id || ""),
          author: String(item.user_name || "Anonymous"),
          date: formatDateLabel(String(item.createdAt || "")),
          content: String(item.review_text || ""),
          rating: Number(item.review_rate || 0),
        } as DynamicReview;
      });
      setReviews(mapped);
    } catch {
      setReviews([]);
    }
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    const loadSimilar = async () => {
      try {
        const all = await fetchBackendProducts();
        const normalizedCurrentCollection = String(product?.collection || "").trim().toLowerCase();

        const basePool = all.filter((p) => {
          if (!p || !p.id) return false;
          if (productId > 0 && p.id === productId) return false;
          if (productPublicId && p.publicId === productPublicId) return false;
          const hasStock = Number(p.quantity || 0) > 0;
          const variantStock = Object.values(p.stockByVariant || {}).some((qty) => Number(qty || 0) > 0);
          if (!hasStock && !variantStock) return false;
          return true;
        });

        const sameCollection = normalizedCurrentCollection
          ? basePool.filter(
            (p) =>
              String(p.collection || "")
                .trim()
                .toLowerCase() === normalizedCurrentCollection
          )
          : [];

        const selected = (sameCollection.length ? sameCollection : basePool).slice(0, 8);
        setSimilarProducts(selected);
      } catch {
        setSimilarProducts([]);
      }
    };
    loadSimilar();
  }, [product?.collection, productId, productPublicId]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length;
  }, [reviews]);

  const handleSubmitReview = async () => {
    if (!productId) return;
    try {
      setIsSubmitting(true);
      await submitProductReview({
        productId,
        rating: reviewForm.rating,
        text: reviewForm.text,
        title: "",
        userName: reviewForm.author,
      });
      setShowReviewModal(false);
      setReviewForm({ rating: 5, author: "", text: "", images: [] });
      await loadReviews();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = (item: Product) => {
    addItem({
      id: item.id,
      name: item.name,
      price: Number(item.price || 0),
      color: "",
      size: "Default",
      image: item.image || "",
      collection: item.collection || "SIMILAR COLLECTIONS",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: i + 1 <= rating ? "'FILL' 1" : "'FILL' 0" }}>
        {i + 0.5 === rating ? 'star_half' : 'star'}
      </span>
    ));
  };

  return (
    <div>
      <ReviewFormModal
        show={showReviewModal}
        isSubmittingReview={isSubmitting}
        reviewForm={reviewForm}
        setReviewForm={setReviewForm}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitReview}
      />
      {/* Customer Reviews */}
     <section className="mt-12 lg:mt-24 px-4 md:px-0">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
    <div className="space-y-3">
      <h3 className="font-headline text-3xl md:text-4xl font-extrabold text-primary tracking-tight">Customer Stories</h3>
      <div className="flex items-center gap-3">
        <div className="flex text-secondary text-lg">{renderStars(Math.round(averageRating || 0))}</div>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-on-surface text-lg md:text-xl">{(averageRating || 0).toFixed(1)} / 5.0</span>
          <span className="text-on-surface-variant text-sm font-medium">({reviews.length} Reviews)</span>
        </div>
      </div>
    </div>
    <button
      onClick={() => setShowReviewModal(true)}
      className="w-full md:w-auto px-8 py-3.5 bg-secondary text-on-secondary rounded-full font-semibold text-sm uppercase tracking-wide hover:opacity-90 hover:shadow-lg transition-all shadow-md active:scale-95 flex justify-center items-center gap-2"
    >
      <span className="material-symbols-outlined text-sm">edit_square</span>
      Write a Review
    </button>
  </div>

  <div 
    className="flex gap-4 md:gap-8 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0" 
    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
  >
    {reviews.map((review) => (
      <div 
        key={review.id} 
        className="bg-surface-container-low p-6 md:p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-[85vw] sm:w-[320px] md:w-[400px] snap-center md:snap-start flex-shrink-0 flex flex-col justify-between group"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex text-secondary text-base">{renderStars(review.rating)}</div>
            <span className="material-symbols-outlined text-outline-variant/20 text-4xl leading-none group-hover:text-secondary/20 transition-colors">format_quote</span>
          </div>
          
          {/* Yahan Line Clamp ka use karke Word Limit lagayi hai */}
          <p className="font-headline text-on-surface text-base md:text-lg leading-relaxed line-clamp-4 md:line-clamp-5">
            {review.content}
          </p>
        </div>

        <div className="flex items-center gap-4 pt-6 mt-auto border-t border-outline-variant/10">
          <div className="w-12 h-12 rounded-full bg-surface-container-highest overflow-hidden shadow-sm flex items-center justify-center border border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">person</span>
          </div>
          <div>
            <div className="font-bold text-on-surface text-sm md:text-base">{review.author}</div>
            <div className="text-[11px] text-on-surface-variant uppercase tracking-wider font-medium mt-0.5">{review.date}</div>
          </div>
        </div>
      </div>
    ))}

    {/* Fallback state when there are no reviews - Fully Responsive */}
    {reviews.length === 0 && (
      <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10 w-[85vw] md:w-[700px] snap-start flex-shrink-0 flex flex-col items-center justify-center min-h-[250px] text-center">
        <span className="material-symbols-outlined text-4xl text-outline-variant/30 mb-3">rate_review</span>
        <p className="text-on-surface-variant font-medium">No reviews yet for this product.</p>
      </div>
    )}
  </div>
</section>

      {/* Frequently Bought Together / Cross-Sell */}
      <section className=" px-3 pt-10 lg:pt-24 border-t border-outline-variant/30">
        <h3 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-12">{product?.collection ? `${product.collection} — Similar Collections` : 'Similar Collections'}</h3>
        <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar">
          {similarProducts.map((item) => (
            <div key={item.id} className="group w-[70vw] max-w-[260px] sm:w-[240px] md:w-[230px] lg:w-[220px] snap-start flex-shrink-0">
              <Link href={createProductHref(item)}>
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-surface-container mb-6 shadow-sm">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} width={300} height={400} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant/50">
                      <span className="material-symbols-outlined">image</span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="flex justify-between items-start flex-col lg:flex-row gap-4">
                <div>
                  <Link href={createProductHref(item)} className="font-headline text-xl font-bold text-primary group-hover:text-secondary transition-colors">
                    {item.name}
                  </Link>
                </div>
              </div>
              <div className="flex items-baseline gap-2 shrink-0">
                <span className="font-headline text-lg font-bold text-secondary">{currencySymbol}{Number(item.price || 0).toFixed(2)}</span>
                {!!item.originalPrice && item.originalPrice > (item.price || 0) && (
                  <span className="font-body text-xs text-on-surface-variant line-through">{currencySymbol}{Number(item.originalPrice).toFixed(2)}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleAddToCart(item)}
                disabled={isVariantInCart(item.id, "Default", "")}
                className={`mt-6 w-full py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all active:scale-95 border-[1.5px] flex items-center justify-center gap-2 ${isVariantInCart(item.id, "Default", "") ? "border-primary bg-primary text-on-primary disabled:opacity-75" : "border-primary text-primary hover:bg-primary hover:text-on-primary"
                  }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isVariantInCart(item.id, "Default", "") ? "done" : "add_shopping_cart"}
                </span>
                {isVariantInCart(item.id, "Default", "") ? "Added" : "Add to Cart"}
              </button>
            </div>
          ))}
          {similarProducts.length === 0 && (
            <div className="text-on-surface-variant text-sm px-1">No similar products available.</div>
          )}
        </div>
      </section>
    </div>
  );
}
