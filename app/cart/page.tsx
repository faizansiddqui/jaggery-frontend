'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Comp7 from '@/app/components/Comp7';
import { useCart } from '@/app/context/CartContext';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';
import { formatProductNameForPath } from '@/app/data/products';

export default function CartPage() {
  const { items, removeItem, updateQty, total, itemCount, isHydrating, isSyncing, syncError, refreshCart } = useCart();
  const { settings } = useSiteSettings();
  const currency = settings.currencySymbol || '$';
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const discount = promoApplied ? total * 0.1 : 0;
  const finalTotal = total - discount;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'KINETIC10') { setPromoApplied(true); }
    else { alert('Invalid promo code. Try KINETIC10'); }
  };

  return (
    <main className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
      {/* <Comp1 /> */}
      <div className="pt-8 pb-5 px-4 md:px-8 max-w-[1440px] mx-auto" data-scroll-section>
        <header className="mb-20 border-b-4 border-[#1c1b1b] pb-10">
          <span className="font-headline text-[10px] uppercase tracking-[0.4em] text-[#b90c1b] font-black">YOUR SELECTION</span>
          <h1 className="font-brand text-7xl md:text-9xl uppercase tracking-tighter mt-4">THE BAG</h1>
          {itemCount > 0 && <p className="font-headline text-sm uppercase tracking-widest opacity-50 mt-2">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>}
          {isSyncing && (
            <p className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b] mt-3 animate-pulse">Syncing bag with server...</p>
          )}
          {syncError && (
            <div className="mt-4 border border-[#b90c1b]/30 bg-[#b90c1b]/5 px-4 py-3 flex items-center justify-between gap-3">
              <p className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b]">{syncError}</p>
              <button
                onClick={() => refreshCart()}
                className="font-headline text-[10px] uppercase tracking-widest underline underline-offset-4 hover:opacity-70"
              >
                Retry Sync
              </button>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Items */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {isHydrating && (
              <div className="py-16 border border-[#1c1b1b]/10 bg-[#f6f3f2] flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-5xl opacity-30 animate-pulse">sync</span>
                <p className="font-headline text-[10px] uppercase tracking-[0.2em] opacity-60">Loading your cart...</p>
              </div>
            )}
            {items.length === 0 && !isHydrating && (
              <div className="py-20 flex flex-col items-center text-center gap-6">
                <span className="material-symbols-outlined text-6xl opacity-20">shopping_bag</span>
                <h3 className="font-brand text-3xl uppercase tracking-widest opacity-40">Bag is Empty</h3>
                <Link href="/shop" className="underline underline-offset-8 font-headline text-xs uppercase tracking-widest font-black hover:text-[#b90c1b] transition-colors">Continue Shopping</Link>
              </div>
            )}
            {items.map((item, index) => (
              <div key={`${item.id || 'na'}-${item.color || 'na'}-${item.size || 'na'}-${item.name || 'item'}-${index}`} className="flex flex-col md:flex-row gap-8 border-b border-[#1c1b1b]/10 pb-10 group transition-all">
                <Link href={`/product/${item.id}/${formatProductNameForPath(item.name)}`} className="w-full md:w-40 aspect-[4/5] bg-[#f6f3f2] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 flex-shrink-0">
                  <Image src={item.image} alt={item.name} width={320} height={400} unoptimized className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <span className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b] font-black">{item.collection}</span>
                    <h3 className="font-brand text-3xl uppercase tracking-tight mt-1">{item.name}</h3>
                    <span className="font-headline text-xs uppercase tracking-widest opacity-40">Color: {item.color || 'Default'} | Size: {item.size || 'M'}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-[#1c1b1b]/20">
                        <button
                          disabled={isSyncing}
                          onClick={() => updateQty(item.id, item.size, -1, item.color)}
                          className="w-10 h-10 font-brand text-xl hover:bg-[#b90c1b] hover:text-white transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <span className="w-10 h-10 font-headline font-black text-sm flex items-center justify-center border-x border-[#1c1b1b]/10">{item.qty}</span>
                        <button
                          disabled={isSyncing}
                          onClick={() => updateQty(item.id, item.size, 1, item.color)}
                          className="w-10 h-10 font-brand text-xl hover:bg-[#b90c1b] hover:text-white transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                      <button
                        disabled={isSyncing}
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        className="font-headline text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-[#b90c1b] transition-all underline underline-offset-4 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    </div>
                    <span className="font-brand text-3xl">{currency}{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          {items.length > 0 && (
            <div className="lg:col-span-4">
              <div className="bg-[#f6f3f2] p-8 flex flex-col gap-6 sticky top-32 border-l-8 border-[#b90c1b]">
                <h2 className="font-brand text-3xl uppercase tracking-widest border-b border-[#1c1b1b]/10 pb-4">Order Summary</h2>
                <div className="flex flex-col gap-4 font-headline text-xs uppercase tracking-[0.15em]">
                  <div className="flex justify-between"><span className="opacity-40">Subtotal</span><span className="font-black">{currency}{total.toFixed(2)}</span></div>
                  {promoApplied && <div className="flex justify-between"><span className="text-[#b90c1b] font-black">Promo (KINETIC10)</span><span className="text-[#b90c1b] font-black">−{currency}{discount.toFixed(2)}</span></div>}
                  <div className="flex justify-between"><span className="opacity-40">Shipping</span><span className="text-[#b90c1b] font-black">Complementary</span></div>
                  <div className="flex justify-between"><span className="opacity-40">Tax</span><span className="opacity-40">At checkout</span></div>
                </div>

                {/* Promo */}
                {!promoApplied && (
                  <div className="flex border border-[#1c1b1b]/20">
                    <input value={promoCode} onChange={e => setPromoCode(e.target.value)}
                      className="flex-grow bg-white px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none placeholder:opacity-30"
                      placeholder="PROMO CODE" />
                    <button onClick={applyPromo} className="bg-[#1c1b1b] text-white px-4 font-headline text-[10px] uppercase tracking-widest hover:bg-[#b90c1b] transition-colors">Apply</button>
                  </div>
                )}

                <div className="border-t-2 border-[#1c1b1b] pt-4 flex justify-between items-end">
                  <span className="font-headline text-[10px] uppercase tracking-[0.4em] font-black opacity-40">Total</span>
                  <span className="font-brand text-4xl text-[#b90c1b]">{currency}{finalTotal.toFixed(2)}</span>
                </div>
                <Link href="/checkout" className="w-full bg-[#1c1b1b] text-[#fcf8f8] py-5 font-brand text-2xl uppercase text-center hover:bg-[#b90c1b] transition-all active:scale-95 block">
                  Secure Checkout
                </Link>
                <div className="flex flex-col gap-4 pt-2 border-t border-[#1c1b1b]/10">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-sm text-[#b90c1b] mt-0.5">verified_user</span>
                    <div><p className="font-headline text-[9px] font-black uppercase tracking-widest">Secure Payments</p><p className="font-headline text-[8px] uppercase tracking-[0.1em] opacity-40 mt-1">All transactions encrypted by our global partners.</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-sm text-[#b90c1b] mt-0.5">local_shipping</span>
                    <div><p className="font-headline text-[9px] font-black uppercase tracking-widest">Express Global Delivery</p><p className="font-headline text-[8px] uppercase tracking-[0.1em] opacity-40 mt-1">Real-time tracking on every StreetRiot order.</p></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Comp7 />
    </main>
  );
}