'use client';

import Image from 'next/image';
import type { CartItem } from '@/app/context/CartContext';

interface CheckoutSummaryProps {
    items: CartItem[];
    itemCount: number;
    currency: string;
    subtotal: number;
    shipping: number;
    total: number;
}

export default function CheckoutSummary({ items, itemCount, currency, subtotal, shipping, total }: CheckoutSummaryProps) {
    return (
        <aside className="xl:col-span-5 xl:sticky xl:top-28">
            <div className="bg-[#f6f3f2] border-l-8 border-[#b90c1b] p-6 md:p-8">
                <h2 className="font-brand text-2xl uppercase tracking-widest border-b border-[#1c1b1b]/10 pb-4 mb-5">Your Order</h2>
                <div className="flex flex-col gap-3 mb-5">
                    {items.map((item, index) => (
                        <div key={`${item.id}-${item.color}-${item.size}-${index}`} className="flex items-center gap-3">
                            <div className="w-14 h-16 bg-[#1c1b1b]/5 overflow-hidden flex-shrink-0">
                                <Image src={item.image} alt={item.name} width={112} height={128} unoptimized className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="font-brand text-lg uppercase leading-tight">{item.name}</p>
                                <p className="font-headline text-[9px] uppercase tracking-widest opacity-40">{item.color} / {item.size} / Qty {item.qty}</p>
                            </div>
                            <span className="font-brand text-lg">{currency}{(item.price * item.qty).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-2 font-headline text-xs uppercase tracking-widest border-t border-[#1c1b1b]/10 pt-4">
                    <div className="flex justify-between"><span className="opacity-50">Items</span><span>{itemCount}</span></div>
                    <div className="flex justify-between"><span className="opacity-50">Subtotal</span><span>{currency}{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="opacity-50">Shipping</span><span>{shipping === 0 ? 'Free' : `${currency}${shipping.toFixed(2)}`}</span></div>
                    <div className="flex justify-between border-t border-[#1c1b1b]/15 pt-3 mt-1">
                        <span>Total</span>
                        <span className="font-brand text-2xl text-[#b90c1b]">{currency}{total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
