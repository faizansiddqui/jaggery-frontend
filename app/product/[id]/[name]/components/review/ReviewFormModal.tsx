'use client';

import Image from 'next/image';
import { createPortal } from 'react-dom';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import type { ReviewFormState } from '../types';

interface ReviewFormModalProps {
    show: boolean;
    isSubmittingReview: boolean;
    reviewForm: ReviewFormState;
    setReviewForm: Dispatch<SetStateAction<ReviewFormState>>;
    onClose: () => void;
    onSubmit: () => void;
    onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (index: number) => void;
}

export default function ReviewFormModal({
    show,
    isSubmittingReview,
    reviewForm,
    setReviewForm,
    onClose,
    onSubmit,
    onImageUpload,
    onRemoveImage,
}: ReviewFormModalProps) {
    if (!show) return null;
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[110] overflow-hidden animate-in fade-in duration-300">
            <button
                type="button"
                aria-label="Close review modal"
                className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
                onClick={() => {
                    if (isSubmittingReview) return;
                    onClose();
                }}
            />
            <div
                className="relative h-full overflow-y-auto overscroll-contain touch-pan-y x-rail"
                onWheel={(event) => event.stopPropagation()}
                onTouchMove={(event) => event.stopPropagation()}
            >
                <div className="min-h-full flex items-start md:items-center justify-center pb-12 md:px-4 md:py-6">
                    <div className="relative w-full max-w-3xl bg-[#f6f3f2] p-6 md:p-10 border-l-8 border-[#b90c1b] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <div className="flex items-start justify-between gap-4 mb-8">
                            <div>
                                <h3 className="font-brand text-3xl md:text-4xl uppercase">Your Review</h3>
                                <p className="font-headline text-[10px] uppercase tracking-widest opacity-60 mt-1">Share rating, experience and optional photos</p>
                            </div>
                            <button
                                type="button"
                                className="h-10 w-10 border-2 border-[#1c1b1b]/20 bg-white hover:bg-[#1c1b1b] hover:text-white transition-all disabled:opacity-50"
                                onClick={onClose}
                                disabled={isSubmittingReview}
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>
                        <div className="flex flex-col gap-6">
                            <input
                                value={reviewForm.author}
                                onChange={(e) => setReviewForm((p) => ({ ...p, author: e.target.value }))}
                                className="bg-white border-2 border-[#1c1b1b]/20 px-6 py-4 font-headline text-sm uppercase tracking-widest focus:outline-none focus:border-[#b90c1b] transition-colors"
                                placeholder="YOUR NAME"
                            />
                            <div className="flex items-center gap-3">
                                <span className="font-headline text-[10px] uppercase tracking-widest opacity-60">Rating:</span>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} type="button" onClick={() => setReviewForm((p) => ({ ...p, rating: star }))}
                                        className={`material-symbols-outlined text-2xl transition-colors ${star <= reviewForm.rating ? 'text-[#b90c1b]' : 'text-[#1c1b1b]/20'}`}
                                        style={{ fontVariationSettings: star <= reviewForm.rating ? "'FILL' 1" : "'FILL' 0" }}>grade</button>
                                ))}
                            </div>
                            <textarea
                                value={reviewForm.text}
                                onChange={(e) => setReviewForm((p) => ({ ...p, text: e.target.value }))}
                                rows={5}
                                className="bg-white border-2 border-[#1c1b1b]/20 px-6 py-4 font-headline text-sm normal-case tracking-wide leading-relaxed focus:outline-none focus:border-[#b90c1b] transition-colors resize-none break-words whitespace-pre-wrap"
                                placeholder="SHARE YOUR EXPERIENCE..."
                            />

                            <div className="flex flex-col gap-3">
                                <p className="font-headline text-[10px] uppercase tracking-widest opacity-60">Upload Photos (Optional, max 2)</p>
                                <label className="w-fit border-2 border-[#1c1b1b]/20 bg-white px-5 py-3 font-headline text-[11px] uppercase tracking-widest cursor-pointer hover:border-[#b90c1b] transition-colors">
                                    <span className="material-symbols-outlined text-base align-middle mr-2">add_photo_alternate</span>
                                    Add Images
                                    <input type="file" accept="image/*" multiple className="hidden" onChange={onImageUpload} />
                                </label>
                                {reviewForm.images.length > 0 && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {reviewForm.images.map((src, index) => (
                                            <div key={`${src}-${index}`} className="relative border-2 border-[#1c1b1b]/15 bg-white overflow-hidden">
                                                <Image src={src} alt={`Review Upload ${index + 1}`} width={400} height={300} unoptimized className="w-full aspect-[4/3] object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveImage(index)}
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

                            <button
                                onClick={onSubmit}
                                disabled={isSubmittingReview}
                                className="self-start bg-[#b90c1b] text-white px-10 py-4 font-brand text-xl uppercase hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isSubmittingReview ? 'Submitting Review...' : 'Submit Review'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
