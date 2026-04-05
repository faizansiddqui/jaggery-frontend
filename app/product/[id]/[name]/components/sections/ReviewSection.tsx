'use client';

import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import ReviewCards from '../review/ReviewCards';
import ReviewFormModal from '../review/ReviewFormModal';
import ReviewImageStream from '../review/ReviewImageStream';
import ReviewImageViewerModal from '../review/ReviewImageViewerModal';
import type { Review, ReviewFormState, ReviewSlide, ReviewSort, ReviewViewerState } from '../types';

interface ReviewSectionProps {
    reviewsCount: number;
    averageRating: number;
    reviewSort: ReviewSort;
    setReviewSort: (value: ReviewSort) => void;
    onOpenReviewModal: () => void;
    showReviewForm: boolean;
    isSubmittingReview: boolean;
    reviewForm: ReviewFormState;
    setReviewForm: Dispatch<SetStateAction<ReviewFormState>>;
    onCloseReviewModal: () => void;
    onSubmitReview: () => void;
    onReviewImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
    onRemoveReviewImage: (index: number) => void;
    reviewViewer: ReviewViewerState | null;
    onCloseReviewViewer: () => void;
    onMoveReviewViewer: (direction: 'prev' | 'next') => void;
    reviewSlides: ReviewSlide[];
    onOpenReviewViewer: (index: number) => void;
    sortedReviews: Review[];
}

export default function ReviewSection({
    reviewsCount,
    averageRating,
    reviewSort,
    setReviewSort,
    onOpenReviewModal,
    showReviewForm,
    isSubmittingReview,
    reviewForm,
    setReviewForm,
    onCloseReviewModal,
    onSubmitReview,
    onReviewImageUpload,
    onRemoveReviewImage,
    reviewViewer,
    onCloseReviewViewer,
    onMoveReviewViewer,
    reviewSlides,
    onOpenReviewViewer,
    sortedReviews,
}: ReviewSectionProps) {
    const roundedAverage = Math.round(averageRating);

    return (
        <section className="mt-14 border-t-2 border-[#1c1b1b] pt-14">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                <div>
                    <h2 className="font-brand text-5xl md:text-6xl uppercase leading-none tracking-tighter">Technical Verdicts</h2>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4">
                        <div className="flex text-[#b90c1b]">{[1, 2, 3, 4, 5].map((star) => <span key={star} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: star <= roundedAverage ? "'FILL' 1" : "'FILL' 0" }}>grade</span>)}</div>
                        <span className="font-headline text-xs uppercase tracking-widest opacity-75">{averageRating.toFixed(1)} / 5</span>
                        <span className="font-headline text-xs uppercase tracking-widest opacity-60">{reviewsCount} Reviews</span>
                    </div>
                </div>
                <div className="flex flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                    <label className="border-2 border-[#1c1b1b]/20 bg-white px-2 py-2 font-headline text-[11px] uppercase tracking-widest flex items-center  w-full sm:w-auto">
                        <span className="material-symbols-outlined text-base text-[#b90c1b]">sort</span>
                        <select
                            value={reviewSort}
                            onChange={(e) => setReviewSort(e.target.value as ReviewSort)}
                            className="bg-transparent outline-none"
                        >
                            <option value="latest">Latest</option>
                            <option value="highest">Highest Rating</option>
                            <option value="lowest">Lowest Rating</option>
                        </select>
                    </label>
                    <button onClick={onOpenReviewModal}
                        className="w-full border-2 border-[#1c1b1b] px-5 py-2 md:p-2  font-brand text-xl uppercase transition-all active:scale-95 flex items-center justify-center gap-1 hover:bg-[#1c1b1b] hover:text-white">
                        <span className="material-symbols-outlined text-base">rate_review</span>
                        Write a Review
                    </button>
                </div>
            </div>

            <ReviewFormModal
                show={showReviewForm}
                isSubmittingReview={isSubmittingReview}
                reviewForm={reviewForm}
                setReviewForm={setReviewForm}
                onClose={onCloseReviewModal}
                onSubmit={onSubmitReview}
                onImageUpload={onReviewImageUpload}
                onRemoveImage={onRemoveReviewImage}
            />

            <ReviewImageViewerModal
                reviewViewer={reviewViewer}
                onClose={onCloseReviewViewer}
                onMove={onMoveReviewViewer}
            />

            <ReviewImageStream slides={reviewSlides} onOpen={onOpenReviewViewer} />

            <ReviewCards
                sortedReviews={sortedReviews}
                reviewSlides={reviewSlides}
                onOpenSlide={onOpenReviewViewer}
            />
        </section>
    );
}
