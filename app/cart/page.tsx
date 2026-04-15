"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";
import { fetchBackendProducts, stockForCartLine } from "@/app/lib/backendProducts";
import { createProductHref } from "@/app/data/products";

const SHIPPING = 0;

export default function CartCheckoutPage() {
    const router = useRouter();
    const { items, removeItem, updateQty, itemCount } = useCart();
    const { isAuthenticated } = useAuth();
    const { settings } = useSiteSettings();
    const currencySymbol = settings.currencySymbol || "₹";
    const [stockByCartKey, setStockByCartKey] = useState<Record<string, number>>({});
    const [productHrefById, setProductHrefById] = useState<Record<number, string>>({});
    const [isCheckingStock, setIsCheckingStock] = useState(false);

    useEffect(() => {
        let active = true;
        const loadStock = async () => {
            if (!items.length) {
                if (active) {
                    setStockByCartKey({});
                    setProductHrefById({});
                    setIsCheckingStock(false);
                }
                return;
            }
            setIsCheckingStock(true);
            try {
                const products = await fetchBackendProducts();
                const productMap = new Map(products.map((product) => [Number(product.id), product]));
                const next: Record<string, number> = {};
                const hrefs: Record<number, string> = {};
                for (const item of items) {
                    const product = productMap.get(Number(item.id));
                    const key = `${Number(item.id)}|${String(item.size || "").trim().toLowerCase()}|${String(item.color || "").trim().toLowerCase()}`;
                    if (!product) {
                        next[key] = 0;
                        continue;
                    }
                    hrefs[Number(item.id)] = createProductHref(product);
                    next[key] = stockForCartLine(product, item.size);
                }
                if (active) {
                    setStockByCartKey(next);
                    setProductHrefById(hrefs);
                }
            } catch {
                if (active) {
                    setStockByCartKey({});
                    setProductHrefById({});
                }
            } finally {
                if (active) setIsCheckingStock(false);
            }
        };
        loadStock();
        return () => {
            active = false;
        };
    }, [items]);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const total = subtotal + SHIPPING;
    const getCartKey = (id: number, size: string, color: string) =>
        `${Number(id)}|${String(size || "").trim().toLowerCase()}|${String(color || "").trim().toLowerCase()}`;
    const hasStockIssue = items.some((item) => {
        const available = stockByCartKey[getCartKey(item.id, item.size, item.color || "")];
        return typeof available === "number" && (available <= 0 || item.qty > available);
    });

    const canContinue = itemCount > 0 && !isCheckingStock && !hasStockIssue;
    const totalLabel = useMemo(() => `${currencySymbol}${total.toFixed(2)}`, [currencySymbol, total]);

    if (!itemCount) {
        return (
            <main className="min-h-screen pt-24 pb-12 px-6 max-w-6xl mx-auto flex items-center justify-center">
                <div className="text-center space-y-6">
                    <span className="material-symbols-outlined text-7xl text-secondary opacity-30">shopping_cart</span>
                    <h1 className="font-headline text-4xl text-primary font-bold">Your cart is empty</h1>
                    <p className="text-on-surface-variant">Start adding products to your collection.</p>
                    <Link href="/shop" className="inline-block mt-6 px-8 py-3 bg-primary text-white rounded-full font-bold hover:opacity-90 transition-opacity">
                        Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-24 pb-5 lg:pb-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 overflow-x-hidden">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <section className="flex-1 space-y-8 min-w-0 w-full overflow-x-hidden">
                <header className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container-low px-3 py-1 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-[15px] text-secondary">shopping_bag</span>
                        Cart overview
                    </div>
                    <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-primary">
                        Your Harvest Selection
                    </h1>
                    <p className="mt-2 text-on-surface-variant font-body">{itemCount} items in your cart.</p>
                </header>

                <div className="space-y-6 w-full overflow-x-hidden">
                    {items.map((item) => (
                        <div
                            key={`${item.id}-${item.size}-${item.color}`}
                            className="group w-full max-w-full overflow-hidden bg-surface-container-low rounded-2xl border border-outline-variant/20 p-4 sm:p-5 flex gap-4 sm:gap-5 items-start shadow-sm hover:shadow-md hover:border-outline-variant/40 transition-all"
                        >
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-surface-container-highest shrink-0 relative ring-1 ring-outline-variant/20">
                                {productHrefById[item.id] ? (
                                    <Link href={productHrefById[item.id]} className="block w-full h-full relative" aria-label={`View ${item.name}`}>
                                        <Image src={item.image} alt={item.name} fill unoptimized className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="96px" />
                                    </Link>
                                ) : (
                                    <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" sizes="96px" />
                                )}
                            </div>

                            {(() => {
                                const available = stockByCartKey[getCartKey(item.id, item.size, item.color || "")];
                                const outOfStock = typeof available === "number" && available <= 0;
                                return (
                            <div className="flex-1 min-w-0">
                                <h3 className="font-headline text-lg sm:text-xl text-primary font-bold leading-snug break-words">{item.name}</h3>
                                <p className="text-on-surface-variant text-xs sm:text-sm font-label break-words mt-1">
                                    {item.size}{item.color ? ` • ${item.color}` : ""}
                                </p>
                                {outOfStock ? (
                                    <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-error/10 text-error px-2 py-1 text-[11px] font-semibold">
                                        <span className="material-symbols-outlined text-[14px]">error</span>
                                        Out of stock
                                    </p>
                                ) : null}

                                <div className="grid grid-cols-1 sm:grid-cols-[auto,1fr] items-center gap-3 mt-4 min-w-0">
                                    <div className="flex items-center bg-surface-container-high rounded-full px-2 py-1.5 gap-2 w-fit max-w-full ring-1 ring-outline-variant/20">
                                        <button
                                            type="button"
                                            onClick={() => updateQty(item.id, item.size, -1, item.color)}
                                            className="w-8 h-8 rounded-full border border-outline-variant/30 text-primary hover:text-secondary hover:border-secondary transition-colors flex items-center justify-center"
                                        >
                                            <span className="material-symbols-outlined text-sm">remove</span>
                                        </button>
                                        <span className="font-body font-semibold text-sm min-w-8 text-center">{String(item.qty).padStart(2, "0")}</span>
                                        <button
                                            type="button"
                                            onClick={() => updateQty(item.id, item.size, 1, item.color)}
                                            disabled={outOfStock || (typeof available === "number" && item.qty >= available)}
                                            className="w-8 h-8 rounded-full border border-outline-variant/30 text-primary hover:text-secondary hover:border-secondary transition-colors flex items-center justify-center disabled:opacity-50"
                                        >
                                            <span className="material-symbols-outlined text-sm">add</span>
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 min-w-0 sm:justify-end">
                                        <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-3 py-1.5">
                                            <span className="material-symbols-outlined text-[16px] text-secondary">payments</span>
                                            <span className="font-headline text-lg sm:text-xl font-bold text-secondary">
                                                {currencySymbol}{(item.price * item.qty).toFixed(2)}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.id, item.size, item.color)}
                                            className="w-9 h-9 rounded-full border border-outline-variant/30 text-on-surface-variant hover:text-secondary hover:border-secondary transition-colors flex items-center justify-center shrink-0"
                                            aria-label={`Remove ${item.name}`}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">delete</span>                                        </button>
                                    </div>
                                </div>
                            </div>
                                );
                            })()}
                        </div>
                    ))}
                </div>
            </section>

            {/* Order summary (right sticky) */}
            <aside className="w-full lg:w-[420px] lg:sticky lg:top-28 self-start">
                <div className="bg-surface-container-low border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
                    <h2 className="font-headline text-2xl text-primary font-bold">Order Summary</h2>
                    <div className="mt-6 space-y-3">
                        <div className="flex justify-between text-on-surface-variant">
                            <span>Subtotal</span>
                            <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-on-surface-variant">
                            <span>Shipping</span>
                            <span>{currencySymbol}{SHIPPING.toFixed(2)}</span>
                        </div>
                        <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-baseline">
                            <span className="font-headline text-xl font-bold text-primary">Total</span>
                            <span className="font-headline text-2xl font-black text-secondary">{currencySymbol}{total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            if (!isAuthenticated) {
                                router.push("/user/auth");
                                return;
                            }
                            router.push("/checkout");
                        }}
                        disabled={!canContinue}
                        className="mt-6 w-full bg-primary text-on-primary py-4 rounded-full font-headline text-lg font-bold tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl"
                    >
                        <span>{isCheckingStock ? "Verifying stock..." : hasStockIssue ? "Stock issue in cart" : "Continue"}</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>

                    <p className="text-center text-on-surface-variant text-xs font-body mt-3">
                        Next: delivery address & payment
                    </p>
                </div>
            </aside>
            </div>

            {/* Mobile sticky bottom summary */}
            <div className="lg:hidden fixed left-0 right-0 bottom-0 z-40 bg-surface/90 backdrop-blur border-t border-outline-variant/20">
                <div className="max-w-[1440px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                        <div className="text-[11px] text-on-surface-variant">Total</div>
                        <div className="font-headline text-lg font-black text-secondary truncate">{totalLabel}</div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            if (!isAuthenticated) {
                                router.push("/user/auth");
                                return;
                            }
                            router.push("/checkout");
                        }}
                        disabled={!canContinue}
                        className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs disabled:opacity-60"
                    >
                        
                        Continue
                    </button>
                </div>
            </div>
        </main>
    );
}
