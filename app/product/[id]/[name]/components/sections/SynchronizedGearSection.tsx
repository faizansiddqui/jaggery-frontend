'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState, type RefObject } from 'react';
import type { Product } from '@/app/data/products';
import { createProductHref } from '@/app/data/products';
import { fetchBackendProducts } from '@/app/lib/backendProducts';

interface SynchronizedGearSectionProps {
    currency: string;
    canScrollGearLeft: boolean;
    canScrollGearRight: boolean;
    onGearScroll: (direction: 'left' | 'right') => void;
    gearRailRef: RefObject<HTMLDivElement | null>;
}

export default function SynchronizedGearSection({
    currency,
    canScrollGearLeft,
    canScrollGearRight,
    onGearScroll,
    gearRailRef,
}: SynchronizedGearSectionProps) {
    const [gearProducts, setGearProducts] = useState<Product[]>([]);

    useEffect(() => {
        let active = true;
        fetchBackendProducts()
            .then((products) => {
                if (!active) return;
                const deduped = products.filter((item, index, array) => array.findIndex((entry) => entry.id === item.id) === index);
                setGearProducts(deduped.slice(0, 12));
            })
            .catch(() => {
                if (!active) return;
                setGearProducts([]);
            });

        return () => {
            active = false;
        };
    }, []);

    const visibleGearProducts = useMemo(() => gearProducts.slice(0, 8), [gearProducts]);

    return (
        <section className="mt-24 pb-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-brand text-5xl uppercase tracking-tight">Synchronized Gear</h2>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => onGearScroll('left')}
                        aria-label="Scroll synchronized gear left"
                        disabled={!canScrollGearLeft}
                        className={`h-10 w-10 border-2 transition-all ${canScrollGearLeft ? 'border-[#1c1b1b]/30 bg-white text-[#1c1b1b] hover:bg-[#f2efef]' : 'border-[#1c1b1b]/10 bg-[#efebea] text-[#1c1b1b]/30 cursor-not-allowed'}`}
                    >
                        ←
                    </button>
                    <button
                        type="button"
                        onClick={() => onGearScroll('right')}
                        aria-label="Scroll synchronized gear right"
                        disabled={!canScrollGearRight}
                        className={`h-10 w-10 border-2 transition-all ${canScrollGearRight ? 'border-[#111] text-black hover:bg-[#2a2a2a]' : 'border-[#1c1b1b]/10 bg-[#efebea] text-[#1c1b1b]/30 cursor-not-allowed'}`}
                    >
                        →
                    </button>
                </div>
            </div>
            <div ref={gearRailRef} className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-3 md:pb-0 px-1 md:px-0 snap-x snap-mandatory x-rail">
                {visibleGearProducts.length === 0 ? (
                    <div className="min-w-full border border-[#1c1b1b]/10 bg-[#f6f3f2] p-6">
                        <p className="font-headline text-[10px] uppercase tracking-widest opacity-65">No synchronized products available right now.</p>
                    </div>
                ) : (
                    visibleGearProducts.map((item) => (
                        <Link key={item.id} href={createProductHref(item)} className="group min-w-[78%] sm:min-w-[56%] md:min-w-0 snap-start block">
                            <div className="aspect-[4/5] bg-[#f1efef] overflow-hidden border border-[#1c1b1b]/10">
                                <Image
                                    src={item.images?.[0] || item.image}
                                    alt={item.name}
                                    width={900}
                                    height={1125}
                                    unoptimized
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <h4 className="mt-3 font-headline text-[11px] uppercase tracking-widest">{item.name}</h4>
                            <p className="font-headline text-[11px] opacity-70">{currency}{Number(item.price || 0).toFixed(2)}</p>
                        </Link>
                    ))
                )}
            </div>
        </section>
    );
}
