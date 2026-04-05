'use client';

import Image from 'next/image';
import type { ReviewSlide } from '../types';

interface ReviewImageStreamProps {
    slides: ReviewSlide[];
    onOpen: (index: number) => void;
}

export default function ReviewImageStream({ slides, onOpen }: ReviewImageStreamProps) {
    if (!slides.length) return null;

    return (
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="font-brand text-2xl md:text-3xl uppercase tracking-tight mb-3">Review Image Stream</h3>
            <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory x-rail x-rail-lux scroll-smooth">
                {slides.map((slide, index) => (
                    <button
                        key={slide.key}
                        type="button"
                        onClick={() => onOpen(index)}
                            className="relative min-w-[150px] sm:min-w-[170px] md:min-w-[185px] lg:min-w-[200px] max-w-[220px] aspect-[4/3] snap-start shrink-0 overflow-hidden border border-[#1c1b1b]/20 bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
                        aria-label={`View review image ${index + 1} full screen`}
                    >
                        <Image src={slide.src} alt={`Review stream ${index + 1}`} width={440} height={330} unoptimized className="w-full h-full object-cover" />
                        <span className="absolute left-2 bottom-2  bg-black/70 text-white px-2 py-1 font-headline text-[9px] uppercase tracking-widest">
                            {slide.author}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
