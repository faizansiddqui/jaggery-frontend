'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Comp7 from '@/app/components/Comp7';
import { useCart } from '@/app/context/CartContext';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';
import { formatProductNameForPath } from '@/app/data/products';
import { fetchPublicPromos, type PublicPromo, type PromoValidationResult, validatePromoCode } from '@/app/lib/apiClient';
import { clearCheckoutPromoState, getCheckoutPromoState, setCheckoutPromoState } from '@/app/lib/session';

export default function CartPage() {
  const { items, removeItem, updateQty, total, itemCount, isHydrating, isSyncing, syncError, refreshCart } = useCart();
  const { settings } = useSiteSettings();
  const currency = settings.currencySymbol || '$';

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoValidationResult | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [publicPromos, setPublicPromos] = useState<PublicPromo[]>([]);
  const [productPromos, setProductPromos] = useState<PublicPromo[]>([]);
  const [publicPromosLoading, setPublicPromosLoading] = useState(true);
  const [productPromosLoading, setProductPromosLoading] = useState(false);

  const cartPayloadItems = useMemo(
    () =>
      items.map((item) => ({
        product_id: Number(item.id || 0),
        quantity: Number(item.qty || 1),
        size: String(item.size || ''),
        color: String(item.color || ''),
        price: Number(item.price || 0),
      })),
    [items],
  );
  const promoTiles = useMemo(() => {
    const map = new Map<string, PublicPromo>();
    const ordered = [...productPromos, ...publicPromos];
    ordered.forEach((promo) => {
      const key = promo.code.toUpperCase();
      if (!map.has(key)) {
        map.set(key, { ...promo, code: key });
      }
    });
    return Array.from(map.values());
  }, [productPromos, publicPromos]);
  const promosSectionLoading = publicPromosLoading || productPromosLoading;

  const discount = Math.max(0, Number(appliedPromo?.discountAmount || 0));
  const finalTotal = Math.max(0, total - discount);

  useEffect(() => {
    const saved = getCheckoutPromoState();
    if (saved?.code) {
      setPromoCode(saved.code);
      validatePromoCode({ code: saved.code, items: cartPayloadItems })
        .then((result) => {
          setAppliedPromo(result);
          setPromoError('');
          setCheckoutPromoState({
            code: result.code,
            discountAmount: result.discountAmount,
            description: result.description,
          });
        })
        .catch(() => {
          clearCheckoutPromoState();
          setAppliedPromo(null);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let active = true;

    const loadPublicPromos = async () => {
      setPublicPromosLoading(true);
      try {
        const promos = await fetchPublicPromos();
        if (!active) return;
        setPublicPromos(promos);
      } catch {
        if (!active) return;
        setPublicPromos([]);
      } finally {
        if (!active) return;
        setPublicPromosLoading(false);
      }
    };

    loadPublicPromos();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const ids = Array.from(
      new Set(
        items
          .map((item) => Number(item.id || 0))
          .filter((id) => Number.isFinite(id) && id > 0),
      ),
    );

    if (!ids.length) {
      setProductPromos([]);
      setProductPromosLoading(false);
      return;
    }

    const loadProductPromos = async () => {
      setProductPromosLoading(true);
      try {
        const batch = await Promise.all(ids.map((id) => fetchPublicPromos(id)));
        if (!active) return;
        setProductPromos(batch.flat());
      } catch {
        if (!active) return;
        setProductPromos([]);
      } finally {
        if (!active) return;
        setProductPromosLoading(false);
      }
    };

    loadProductPromos();
    return () => {
      active = false;
    };
  }, [items]);

  useEffect(() => {
    if (!appliedPromo?.code) return;
    if (!items.length) {
      setAppliedPromo(null);
      setPromoCode('');
      setPromoError('');
      clearCheckoutPromoState();
      return;
    }

    validatePromoCode({ code: appliedPromo.code, items: cartPayloadItems })
      .then((result) => {
        setAppliedPromo(result);
        setPromoError('');
        setCheckoutPromoState({
          code: result.code,
          discountAmount: result.discountAmount,
          description: result.description,
        });
      })
      .catch((error) => {
        setAppliedPromo(null);
        setPromoError(error instanceof Error ? error.message : 'Promo is no longer valid.');
        clearCheckoutPromoState();
      });
  }, [appliedPromo?.code, cartPayloadItems, items.length]);

  const applyPromo = async (codeArg?: string) => {
    const code = (codeArg ?? promoCode).trim().toUpperCase();
    if (!code) {
      setPromoError('Enter a promo code first.');
      return;
    }

    setPromoCode(code);
    setPromoLoading(true);
    setPromoError('');
    try {
      const result = await validatePromoCode({
        code,
        items: cartPayloadItems,
      });
      setAppliedPromo(result);
      setPromoCode(result.code);
      setCheckoutPromoState({
        code: result.code,
        discountAmount: result.discountAmount,
        description: result.description,
      });
    } catch (error) {
      setAppliedPromo(null);
      clearCheckoutPromoState();
      setPromoError(error instanceof Error ? error.message : 'Invalid promo code');
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError('');
    setPromoCode('');
    clearCheckoutPromoState();
  };

  return (
    <main className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
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
                Retry
              </button>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
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
                          -
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

          {items.length > 0 && (
            <div className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
              <div className="bg-[#f6f3f2] p-8 flex flex-col gap-6 border-l-8 border-[#b90c1b]">
                <h2 className="font-brand text-3xl uppercase tracking-widest border-b border-[#1c1b1b]/10 pb-4">Order Summary</h2>
                <div className="flex flex-col gap-4 font-headline text-xs uppercase tracking-[0.15em]">
                  <div className="flex justify-between"><span className="opacity-40">Subtotal</span><span className="font-black">{currency}{total.toFixed(2)}</span></div>
                  {appliedPromo && (
                    <div className="flex justify-between">
                      <span className="text-[#b90c1b] font-black">Promo ({appliedPromo.code})</span>
                      <span className="text-[#b90c1b] font-black">-{currency}{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between"><span className="opacity-40">Shipping</span><span className="text-[#b90c1b] font-black">Free</span></div>
                </div>

                {!appliedPromo && (
                  <div className="flex border border-[#1c1b1b]/20">
                    <input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-grow bg-white px-4 py-3 font-headline text-xs uppercase tracking-widest focus:outline-none placeholder:opacity-30"
                      placeholder="PROMO CODE"
                    />
                    <button
                      onClick={applyPromo}
                      disabled={promoLoading}
                      className="bg-[#1c1b1b] cursor-pointer text-white px-4 font-headline text-[10px] uppercase tracking-widest hover:bg-[#b90c1b] transition-colors disabled:opacity-50"
                    >
                      {promoLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                )}

                {promosSectionLoading && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Array.from({ length: 1 }).map((_, idx) => (
                        <div
                          key={`promo-skeleton-${idx}`}
                          className="min-w-[200px] bg-white border border-[#1c1b1b]/15 p-4 border-l-5 border-[#b90c1b] shadow-[0_8px_30px_rgba(15,15,15,0.08)] flex flex-col gap-3 animate-pulse"
                        >
                          <div className="flex items-center justify-between">
                            <div className="h-3 w-20 bg-[#1c1b1b]/10" />
                            <div className="h-3 w-14 bg-[#b90c1b]/10" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 w-full bg-[#1c1b1b]/10" />
                            <div className="h-3 w-4/5 bg-[#1c1b1b]/10" />
                          </div>
                          {/* <div className="h-3 w-24 bg-[#1c1b1b]/10" /> */}
                          <div className="h-9 w-full border border-[#1c1b1b]/10 bg-[#1c1b1b]/[0.03]" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {promoTiles.length > 0 && !promosSectionLoading && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                    </div>
                    <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
                      {promoTiles.map((promo, idx) => {
                        const discountLabel = promo.discountType === 'PERCENT'
                          ? `${promo.discountValue}% OFF`
                          : `${currency}${promo.discountValue.toFixed(0)} OFF`;
                        const requirement = promo.scope === 'PRODUCT'
                          ? promo.requiredProductId
                            ? `Min Qty ${promo.requiredQty}`
                            : `Requires ${promo.requiredQty} pcs`
                          : 'Applies on cart total';
                        const isSelected = appliedPromo?.code === promo.code;

                        return (
                          <div
                            key={`${promo.code}-${idx}`}
                            className={`min-w-[280px] md:min-w-[200px] bg-white border ${isSelected ? 'border-[#b90c1b] bg-[#fff7f5]' : 'border-[#1c1b1b]/15 border-l-5 border-[#b90c1b]'} p-4 shadow-[0_8px_30px_rgba(15,15,15,0.08)] snap-start flex flex-col gap-2`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-headline text-[11px] uppercase tracking-[0.2em] text-[#1c1b1b]">{promo.code}</span>
                              <span className="font-headline text-[9px] uppercase tracking-[0.2em] text-[#b90c1b]">{discountLabel}</span>
                            </div>
                            <p className="font-headline text-[11px] leading-relaxed tracking-wide text-[#1c1b1b]/75 break-words">{promo.description}</p>
                            {/* <span className="font-headline text-[9px] uppercase tracking-[0.2em] text-[#1c1b1b]/50">{requirement}</span> */}
                            <button
                              type="button"
                              onClick={() => applyPromo(promo.code)}
                              className={`w-full mt-2 py-2 cursor-pointer font-headline text-[10px] uppercase tracking-[0.2em] border ${isSelected ? 'border-[#b90c1b] bg-[#b90c1b] text-white' : 'border-[#1c1b1b]/30 hover:border-[#b90c1b]'}`}
                            >
                              {isSelected ? 'Applied' : 'Apply'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              {promoError && (
                <p className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b]">{promoError}</p>
              )}
                {appliedPromo && (
                  <div className="flex items-center justify-between border border-[#b90c1b]/30 bg-[#b90c1b]/5 px-4 py-3 gap-3">
                    <p className="font-headline text-[10px] uppercase tracking-widest">{appliedPromo.description}</p>
                    <button
                      onClick={removePromo}
                      className="font-headline text-[10px] uppercase tracking-widest underline underline-offset-4 hover:opacity-70"
                    >
                      Remove
                    </button>
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
