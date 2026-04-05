'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { deleteAdminReview, fetchAdminReviews, type AdminReview } from '@/app/lib/apiClient';

const formatDateTime = (value: string | null) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<AdminReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [stats, setStats] = useState({ totalReviews: 0, totalUsers: 0, totalProducts: 0 });

    const load = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await fetchAdminReviews();
            setReviews(data.reviews);
            setStats(data.stats);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : 'Could not load reviews.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const filteredReviews = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return reviews;
        return reviews.filter((review) => {
            const productName = review.product?.product_name || '';
            const productCode = review.product?.product_code || '';
            return [
                review.user_name,
                review.review_text,
                review.review_title,
                productName,
                productCode,
                String(review.product_id || ''),
            ]
                .join(' ')
                .toLowerCase()
                .includes(query);
        });
    }, [reviews, search]);

    const onDeleteReview = async (reviewId: string) => {
        const confirmDelete = window.confirm('Delete this review permanently?');
        if (!confirmDelete) return;

        try {
            setDeletingId(reviewId);
            setMessage('');
            setError('');
            await deleteAdminReview(reviewId);
            setReviews((prev) => prev.filter((item) => item.id !== reviewId));
            setStats((prev) => ({ ...prev, totalReviews: Math.max(0, prev.totalReviews - 1) }));
            setMessage('Review deleted successfully.');
        } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete review.');
        } finally {
            setDeletingId('');
        }
    };

    return (
        <div className="flex flex-col gap-10">
            <header className="flex flex-col gap-2">
                <span className="font-headline text-[10px] md:text-sm uppercase tracking-[0.4em] text-[#b90c1b] font-black">REVIEWS CONTROL</span>
                <h2 className="font-brand text-5xl md:text-7xl uppercase leading-none tracking-tighter">Reviews Management</h2>
                <p className="font-headline text-[11px] uppercase tracking-widest opacity-60">
                    Check all reviews, user contribution counts, reviewed products and delete spam reviews.
                </p>
            </header>

            {error && (
                <div className="border border-[#b90c1b]/30 bg-[#b90c1b]/10 px-4 py-3">
                    <p className="font-headline text-[10px] uppercase tracking-widest text-[#ff929d]">{error}</p>
                </div>
            )}

            {message && (
                <div className="border border-green-500/30 bg-green-500/10 px-4 py-3">
                    <p className="font-headline text-[10px] uppercase tracking-widest text-green-300">{message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-5">
                    <p className="font-headline text-[9px] uppercase tracking-widest opacity-50 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">reviews</span>
                        Total Reviews
                    </p>
                    <p className="font-brand text-4xl mt-4">{stats.totalReviews}</p>
                </div>
                <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-5">
                    <p className="font-headline text-[9px] uppercase tracking-widest opacity-50 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">group</span>
                        Unique Users
                    </p>
                    <p className="font-brand text-4xl mt-4">{stats.totalUsers}</p>
                </div>
                <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-5">
                    <p className="font-headline text-[9px] uppercase tracking-widest opacity-50 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">inventory_2</span>
                        Reviewed Products
                    </p>
                    <p className="font-brand text-4xl mt-4">{stats.totalProducts}</p>
                </div>
            </div>

            <section className="bg-[#1c1b1b] border border-[#ffffff]/10 p-6 md:p-8 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                    <h3 className="font-brand text-3xl uppercase tracking-widest">Review Feed</h3>
                    <div className="relative w-full md:w-[380px]">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-base">search</span>
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search user, product, text"
                            className="w-full bg-[#0f0f0f] border border-[#ffffff]/15 pl-10 pr-3 py-3 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                        />
                    </div>
                </div>

                {loading ? (
                    <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">Loading reviews...</p>
                ) : filteredReviews.length === 0 ? (
                    <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">No reviews found.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filteredReviews.map((review) => (
                            <article key={review.id} className="border border-[#ffffff]/10 p-4 md:p-5 grid grid-cols-1 xl:grid-cols-12 gap-4">
                                <div className="xl:col-span-7 flex flex-col gap-3">
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <span className="font-headline text-[9px] uppercase tracking-widest px-2 py-1 border border-[#ffffff]/20 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">person</span>
                                            {review.user_name}
                                        </span>
                                        <span className="font-headline text-[9px] uppercase tracking-widest px-2 py-1 border border-[#ffffff]/20 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">star</span>
                                            {review.review_rate}/5
                                        </span>
                                        <span className="font-headline text-[9px] uppercase tracking-widest px-2 py-1 border border-[#ffffff]/20 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">schedule</span>
                                            {formatDateTime(review.createdAt)}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <p className="font-brand text-2xl uppercase leading-none">{review.product?.product_name || `PRODUCT ${review.product_id}`}</p>
                                        <p className="font-headline text-[10px] uppercase tracking-widest opacity-60">
                                            {review.product?.product_code || `PID-${review.product_id}`}
                                        </p>
                                    </div>

                                    {review.review_title ? (
                                        <p className="font-headline text-[10px] uppercase tracking-widest text-[#ff929d]">{review.review_title}</p>
                                    ) : null}
                                    <p className="font-headline text-xs leading-6 opacity-90 whitespace-pre-wrap">{review.review_text || '-'}</p>

                                    {review.review_images.length > 0 && (
                                        <div className="flex gap-2 overflow-x-auto">
                                            {review.review_images.map((src, index) => (
                                                <Image
                                                    key={`${review.id}-${index}`}
                                                    src={src}
                                                    alt={`Review image ${index + 1}`}
                                                    width={120}
                                                    height={90}
                                                    unoptimized
                                                    className="w-[120px] h-[90px] object-cover border border-[#ffffff]/10"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="xl:col-span-5 flex flex-col gap-4">
                                    <div className="border border-[#ffffff]/10 p-3">
                                        <p className="font-headline text-[9px] uppercase tracking-widest opacity-60 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">insights</span>
                                            User Review Stats
                                        </p>
                                        <p className="font-brand text-3xl mt-3">{review.user_stats.totalReviews}</p>
                                        <p className="font-headline text-[9px] uppercase tracking-widest opacity-60">Total reviews by this user</p>
                                    </div>

                                    <div className="border border-[#ffffff]/10 p-3">
                                        <p className="font-headline text-[9px] uppercase tracking-widest opacity-60 mb-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">inventory</span>
                                            Reviewed Products By User
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {review.user_stats.reviewedProducts.map((product) => (
                                                <Link
                                                    key={`${review.id}-${product.product_id}`}
                                                    href={`/product/${product.product_id}/${encodeURIComponent((product.product_name || '').toLowerCase().replace(/\s+/g, '-'))}`}
                                                    target="_blank"
                                                    className="font-headline text-[9px] uppercase tracking-widest px-2 py-1 border border-[#ffffff]/20 hover:border-[#b90c1b]"
                                                >
                                                    {product.product_name || `PRODUCT ${product.product_id}`}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onDeleteReview(review.id)}
                                        disabled={deletingId === review.id}
                                        className="w-full bg-[#b90c1b] text-white py-3 font-headline text-[10px] uppercase tracking-widest hover:bg-[#d21628] disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                        {deletingId === review.id ? 'Deleting...' : 'Delete Review'}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
