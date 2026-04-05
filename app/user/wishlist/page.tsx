'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Comp1 from '@/app/journal/components/Comp1';
import Comp7 from '@/app/components/Comp7';
import { createProductHref } from '@/app/data/products';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCart } from '@/app/context/CartContext';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';
import GridSkeleton from '@/app/components/GridSkeleton';
import { useRequireUserSession } from '@/app/lib/guards';

export default function WishlistRoute() {
  const { settings } = useSiteSettings();
  const currency = settings.currencySymbol || '$';
  const [isLoading, setIsLoading] = useState(true);
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { ready, authenticated } = useRequireUserSession('/user/auth');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  if (!ready || !authenticated) {
    return <main className="min-h-screen bg-[#fcf8f8]" />;
  }

  return (
    <main className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
      <Comp1 />

      <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto" data-scroll-section>
        <header className="mb-16 md:mb-24 border-b-2 border-[#1c1b1b] pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="font-brand text-6xl md:text-8xl lg:text-9xl uppercase leading-[0.8] tracking-tighter mb-4">
              My <br className="md:hidden" /> Wishlist
            </h1>
            <p className="font-headline text-sm md:text-base uppercase tracking-widest opacity-60">Personal collection of upcoming technical gear drops.</p>
          </div>
          <div className="flex flex-col gap-2 items-start md:items-end">
            <span className="font-headline font-bold text-xs tracking-widest text-[#b90c1b]">SAVED ITEMS: {String(items.length).padStart(2, '0')}</span>
            <div className="h-[2px] w-24 bg-[#b90c1b]"></div>
          </div>
        </header>

        {isLoading ? (
          <GridSkeleton count={6} />
        ) : items.length === 0 ? (
          <div className="border-l-8 border-[#b90c1b] bg-[#f6f3f2] p-10">
            <h2 className="font-brand text-4xl uppercase mb-3">Wishlist Empty</h2>
            <p className="font-headline text-[11px] uppercase tracking-widest opacity-60 mb-6">Save products to build your collection.</p>
            <Link href="/shop" className="border-2 border-[#1c1b1b] px-8 py-3 font-headline text-[11px] uppercase tracking-widest hover:bg-[#1c1b1b] hover:text-white transition-colors">Go to Shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="group bg-[#fcf8f8] relative overflow-hidden flex flex-col border border-[#1c1b1b]/5 hover:border-[#b90c1b]/30 transition-colors p-2">
                <Link
                  href={createProductHref({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    collection: item.collection,
                    image: item.image,
                    category: 'Wishlist',
                  })}
                  className="absolute inset-0 z-10"
                  aria-label={`Open ${item.name}`}
                />
                <div className="relative aspect-[4/5] bg-[#f6f3f2] mb-6 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={900}
                    height={1125}
                    unoptimized
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button onClick={(e) => { e.preventDefault(); removeItem(item.id); }} className="relative z-20 bg-[#fcf8f8] text-[#1c1b1b] p-3 hover:bg-[#b90c1b] hover:text-white transition-all flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-[#b90c1b] text-white px-4 py-2 font-headline text-[10px] uppercase tracking-widest opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-center">
                    In Wishlist
                  </div>
                </div>

                <div className="flex flex-col gap-2 px-2 pb-4 flex-1">
                  <h3 className="font-brand text-2xl md:text-3xl uppercase leading-none">{item.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-brand text-xl text-[#b90c1b]">{currency}{item.price.toFixed(2)}</span>
                    <button className="relative z-20 font-headline font-bold text-[10px] uppercase tracking-widest underline underline-offset-8 hover:text-[#b90c1b] transition-colors">
                      Quick View
                    </button>
                  </div>
                </div>

                <div className="px-2 pb-4">
                  <button onClick={(e) => { e.preventDefault(); addItem({ id: item.id, name: item.name, price: item.price, color: 'Default', size: 'M', image: item.image, collection: item.collection }); }} className="relative z-20 w-full bg-[#1c1b1b] text-white py-4 font-brand text-xl uppercase hover:bg-[#b90c1b] transition-colors active:scale-95">
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <section className="mt-32 p-12 md:p-24 bg-[#f6f3f2] border-l-8 border-[#b90c1b] flex flex-col items-center text-center">
          <h2 className="font-brand text-4xl md:text-6xl uppercase leading-none mb-6">Complete The Fit</h2>
          <p className="font-headline text-sm md:text-base uppercase tracking-widest opacity-60 mb-10 max-w-2xl">
            Pair your selections with our latest technical accessories and racing-inspired essentials.
          </p>
          <button className="border-2 border-[#1c1b1b] px-12 py-4 font-brand text-xl md:text-2xl uppercase hover:bg-[#1c1b1b] hover:text-white transition-all active:scale-95">
            Shop Accessories
          </button>
        </section>
      </div>

      <Comp7 />
    </main>
  );
}