"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as apiClient from "../lib/apiClient";
import { TestimonialsGridSkeleton } from "./Skeletons";

type TestimonialItem = {
  id?: string | number;
  quote: string;
  name: string;
  role: string;
};

const FALLBACK_TESTIMONIALS: TestimonialItem[] = [];
const TESTIMONIALS_STORAGE_KEY = 'sr_testimonials';
const TESTIMONIALS_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(FALLBACK_TESTIMONIALS);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstCardRef = useRef<HTMLDivElement | null>(null);

  // Load testimonials from localStorage (fast initial load)
  const getCachedTestimonials = (): TestimonialItem[] | null => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = window.localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
      if (!cached) return null;
      const data = JSON.parse(cached);
      if (data.timestamp && Date.now() - data.timestamp < TESTIMONIALS_CACHE_TIME) {
        return data.testimonials;
      }
      return null;
    } catch {
      return null;
    }
  };

  const saveToCache = (items: TestimonialItem[]) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify({
        testimonials: items,
        timestamp: Date.now(),
      }));
    } catch { /* ignore */ }
  };

  useEffect(() => {
    // Try to load from cache first for fast initial display
    const cached = getCachedTestimonials();
    if (cached && cached.length > 0) {
      setTestimonials(cached);
      setIsLoading(false);
    }

    // Then fetch from API
    const fetchFnUnknown =
      (apiClient as Record<string, unknown>).fetchAdminTestimonials ??
      (apiClient as Record<string, unknown>).fetchAdminTestimonial;

    if (typeof fetchFnUnknown !== "function") {
      setIsLoading(false);
      return;
    }

    (fetchFnUnknown as () => Promise<unknown>)()
      .then((rowsUnknown) => {
        if (!Array.isArray(rowsUnknown) || rowsUnknown.length === 0) return;

        type RawRow = { id: string | number; quote: string; name: string; role?: string | null };
        const rows = rowsUnknown as RawRow[];

        const mappedTestimonials = rows.map((row) => ({
          id: row.id,
          quote: row.quote,
          name: row.name,
          role: row.role || "",
        }));

        setTestimonials(mappedTestimonials);
        saveToCache(mappedTestimonials);
      })
      .catch(() => {
        // If API fails, keep cached data if available
        if (!cached || cached.length === 0) {
          setTestimonials(FALLBACK_TESTIMONIALS);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setActiveIndex(0);
    }, 100);
  }, [testimonials.length]);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const firstCard = firstCardRef.current;

    if (!track || !firstCard) return;

    const trackStyles = window.getComputedStyle(track);
    const gapValue = trackStyles.columnGap || trackStyles.gap || "0";
    const gap = Number.parseFloat(gapValue) || 0;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const nextStep = cardWidth + gap;

    const parentWidth = track.parentElement?.getBoundingClientRect().width || 0;
    const nextMaxOffset = Math.max(track.scrollWidth - parentWidth, 0);

    setStep(nextStep);
    setMaxOffset(nextMaxOffset);
  }, []);

  useLayoutEffect(() => {
    measure();

    const ro = new ResizeObserver(() => {
      measure();
    });

    if (trackRef.current) ro.observe(trackRef.current);
    if (firstCardRef.current) ro.observe(firstCardRef.current);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, testimonials.length]);

  const maxIndex = Math.max(testimonials.length - 1, 0);

  const clampIndex = useCallback(
    (nextIndex: number) => Math.max(0, Math.min(nextIndex, maxIndex)),
    [maxIndex]
  );

  const scrollToIndex = useCallback(
    (nextIndex: number) => {
      setActiveIndex(clampIndex(nextIndex));
    },
    [clampIndex]
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      const swipePower = Math.abs(info.offset.x) + Math.abs(info.velocity.x) * 0.2;

      if (info.offset.x < -40 || info.velocity.x < -500 || swipePower > 120) {
        setActiveIndex((i) => clampIndex(i + 1));
        return;
      }

      if (info.offset.x > 40 || info.velocity.x > 500 || swipePower > 120) {
        setActiveIndex((i) => clampIndex(i - 1));
      }
    },
    [clampIndex]
  );

  const currentOffset = Math.min(activeIndex * step, maxOffset);

  return (
    <section className="py-10 lg:py-32 bg-surface overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8 md:mb-16">
          <div className="max-w-2xl">
            <h2 className="font-headline text-4xl md:text-5xl text-primary leading-tight">
              Shared Stories from the <br className="hidden md:block" />
              <span className="italic text-secondary">Modern Agrarian</span>{" "}
              Table
            </h2>
          </div>

          <div className="hidden md:flex gap-3 justify-end">
            <button
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous Testimonial"
              type="button"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <button
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex >= maxIndex}
              className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next Testimonial"
              type="button"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex md:hidden justify-end gap-3 mb-5">
          <button
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous Testimonial"
            type="button"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex >= maxIndex}
            className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next Testimonial"
            type="button"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TestimonialsGridSkeleton count={3} />
              </motion.div>
            ) : testimonials.length === 0 ? (
              <motion.div
                key="notfound"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-16 md:py-24 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">chat_bubble_outline</span>
                </div>
                <h3 className="font-headline text-2xl md:text-3xl text-primary mb-3">
                  No Testimonials Yet
                </h3>
                <p className="text-on-surface-variant/70 max-w-md mx-auto">
                  Be the first to share your experience with our community. Your feedback helps others discover the authentic taste of tradition.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="testimonials"
                ref={trackRef}
                drag="x"
                dragConstraints={{ left: -maxOffset, right: 0 }}
                dragElastic={0.08}
                dragMomentum
                onDragEnd={handleDragEnd}
                animate={{ x: -currentOffset }}
                transition={{ type: "spring", stiffness: 240, damping: 30 }}
                className="flex gap-6 md:gap-8 cursor-grab active:cursor-grabbing touch-pan-y"
              >
                {testimonials.map((t, index) => (
                  <motion.div
                    key={t.id || `${t.name}-${index}`}
                    ref={index === 0 ? firstCardRef : null}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="testimonial-card [flex:0_0_85%] md:[flex:0_0_45%] lg:[flex:0_0_30%] shrink-0 p-8 md:p-10 bg-surface-container-low rounded-[2rem] hover:shadow-sm transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <svg
                        className="w-10 h-10 text-secondary/30 mb-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          d="M3.983 21L3.983 18C3.983 16.8954 4.87843 16 5.983 16H8.983C9.53528 16 9.983 15.5523 9.983 15V9C9.983 8.44772 9.53528 8 8.983 8H4.983C4.43071 8 3.983 8.44772 3.983 9V11"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>

                      <p className="text-on-surface text-lg md:text-xl font-headline italic mb-10 leading-relaxed">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-4 border-t border-primary/10 pt-6 mt-auto">
                      <div
                        className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center font-headline text-xl text-primary font-bold shrink-0 shadow-sm"
                        aria-hidden="true"
                      >
                        {t.name.trim().charAt(0).toLocaleUpperCase() || "?"}
                      </div>
                      <div>
                        <h5 className="font-bold text-on-surface text-sm md:text-base">
                          {t.name}
                        </h5>
                        <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-widest">
                          {t.role}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;