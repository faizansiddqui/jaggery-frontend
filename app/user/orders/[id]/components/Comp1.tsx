'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cancelUserOrder, fetchOrders, requestUserOrderReturn } from '../../../../lib/apiClient';
import { useRequireUserSession } from '../../../../lib/guards';
import { useSiteSettings } from '../../../../context/SiteSettingsContext';

interface UiItem {
    name: string;
    qty: number;
    price: number;
    size: string;
    image: string;
}

interface UiOrder {
    id: string;
    ref: string;
    status: string;
    date: string;
    total: number;
    items: UiItem[];
}

function mapOrder(raw: Record<string, unknown>): UiOrder {
    const items = Array.isArray(raw.items) ? raw.items : [];
    const mappedItems: UiItem[] = items.map((entry) => {
        const row = entry as Record<string, unknown>;
        const product = (row.product || {}) as Record<string, unknown>;
        const imageList = Array.isArray(product.product_image) ? product.product_image : [];
        const image = (typeof imageList[0] === 'string' && imageList[0]) ||
            (typeof row.image === 'string' && row.image) ||
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80';

        return {
            name: String(product.name || row.title || 'Product'),
            qty: Number(row.quantity || row.qty || 1),
            price: Number(row.price || 0),
            size: String(row.size || 'M'),
            image,
        };
    });

    const createdAt = new Date(String(raw.createdAt || Date.now()));
    return {
        id: String(raw._id || raw.order_code || ''),
        ref: String(raw.order_code || raw._id || ''),
        status: String(raw.status || 'PROCESSING').toUpperCase(),
        date: createdAt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
        total: Number(raw.grand_total || raw.total || 0),
        items: mappedItems,
    };
}

export default function OrderDetail({ orderId }: { orderId: string }) {
    const { settings } = useSiteSettings();
    const currency = settings.currencySymbol || '$';
    const [orders, setOrders] = useState<UiOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionBusy, setActionBusy] = useState(false);
    const [actionMessage, setActionMessage] = useState('');
    const { ready, authenticated } = useRequireUserSession('/user/auth');

    useEffect(() => {
        if (!authenticated) return;
        fetchOrders()
            .then((rows: unknown[]) => {
                const normalized = rows.map((entry: unknown) => mapOrder(entry as Record<string, unknown>));
                setOrders(normalized);
            })
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, [authenticated]);

    const order = useMemo(() => {
        const target = String(orderId || '').toLowerCase();
        return orders.find((entry) => entry.id.toLowerCase() === target || entry.ref.toLowerCase() === target) || null;
    }, [orders, orderId]);

    const statusLower = String(order?.status || '').toLowerCase();
    const canCancel = Boolean(order) && !['cancelled', 'delivered', 'returned', 'return_requested'].includes(statusLower);
    const canReturn = Boolean(order) && ['delivered'].includes(statusLower);

    if (!ready || !authenticated) return <main className="min-h-screen bg-[#fcf8f8]" />;

    if (loading) {
        return (
            <div className="pt-24 pb-16 px-4 md:px-8 max-w-[1440px] mx-auto animate-pulse">
                <div className="h-10 bg-[#ece8e8] w-64 mb-8" />
                <div className="h-20 bg-[#ece8e8] w-full mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-52 bg-[#ece8e8]" />
                    <div className="h-52 bg-[#ece8e8]" />
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="pt-28 pb-20 px-8 text-center">
                <h1 className="font-brand text-7xl uppercase mb-6">Order Not Found</h1>
                <Link href="/user/orders" className="underline font-headline text-sm uppercase tracking-widest hover:text-[#b90c1b]">
                    Back to Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-8 pb-5 px-4 md:px-8 max-w-[1440px] mx-auto">
            <div className="mb-10 flex items-center gap-3">
                <Link href="/user/orders" className="font-headline text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-[#b90c1b] transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> All Orders
                </Link>
                <span className="opacity-20">/</span>
                <span className="font-headline text-[10px] uppercase tracking-widest">{order.ref}</span>
            </div>

            <header className="mb-12 border-b-4 border-[#1c1b1b] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="font-headline text-[10px] uppercase tracking-[0.4em] text-[#b90c1b] font-black">Order Reference</span>
                    <h1 className="font-brand text-5xl md:text-7xl uppercase tracking-tighter mt-2">{order.ref}</h1>
                    <p className="font-headline text-xs opacity-40 uppercase tracking-widest mt-2">Placed on {order.date}</p>
                </div>
                <span className="font-brand text-3xl uppercase text-[#b90c1b]">{order.status}</span>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <h2 className="font-brand text-3xl uppercase tracking-widest border-b border-[#1c1b1b]/10 pb-4">Items Ordered</h2>
                    {order.items.map((item, idx) => (
                        <div key={`${item.name}-${idx}`} className="flex gap-5 border-b border-[#1c1b1b]/5 pb-8">
                            <div className="w-24 h-28 bg-[#f6f3f2] overflow-hidden flex-shrink-0">
                                <Image src={item.image} alt={item.name} width={240} height={280} unoptimized className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-brand text-2xl uppercase">{item.name}</h3>
                                    <p className="font-headline text-[10px] uppercase tracking-widest opacity-40 mt-1">Size: {item.size} · Qty: {item.qty}</p>
                                </div>
                                <span className="font-brand text-2xl text-[#b90c1b]">{currency}{(item.price * item.qty).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-[#f6f3f2] border-l-8 border-[#b90c1b] p-8 sticky top-28">
                        <h2 className="font-brand text-3xl uppercase tracking-widest border-b border-[#1c1b1b]/10 pb-4 mb-6">Order Summary</h2>
                        <div className="flex justify-between items-end">
                            <span className="font-headline text-[10px] uppercase tracking-[0.4em] font-black opacity-40">Total</span>
                            <span className="font-brand text-4xl text-[#b90c1b]">{currency}{order.total.toFixed(2)}</span>
                        </div>
                        <div className="mt-6 flex flex-col gap-2">
                            {canCancel && (
                                <button
                                    disabled={actionBusy}
                                    onClick={async () => {
                                        try {
                                            setActionBusy(true);
                                            await cancelUserOrder(order.ref || order.id);
                                            setOrders((prev) => prev.map((entry) => entry.id === order.id ? { ...entry, status: 'CANCELLED' } : entry));
                                            setActionMessage('Order cancelled successfully');
                                        } catch (error) {
                                            setActionMessage(error instanceof Error ? error.message : 'Could not cancel order');
                                        } finally {
                                            setActionBusy(false);
                                        }
                                    }}
                                    className="w-full bg-[#1c1b1b] text-white py-3 font-headline text-[10px] uppercase tracking-widest hover:bg-[#b90c1b] disabled:opacity-70"
                                >
                                    {actionBusy ? 'Updating...' : 'Cancel Order'}
                                </button>
                            )}
                            {canReturn && (
                                <button
                                    disabled={actionBusy}
                                    onClick={async () => {
                                        try {
                                            setActionBusy(true);
                                            await requestUserOrderReturn(order.ref || order.id);
                                            setOrders((prev) => prev.map((entry) => entry.id === order.id ? { ...entry, status: 'RETURN_REQUESTED' } : entry));
                                            setActionMessage('Return requested successfully');
                                        } catch (error) {
                                            setActionMessage(error instanceof Error ? error.message : 'Could not request return');
                                        } finally {
                                            setActionBusy(false);
                                        }
                                    }}
                                    className="w-full border border-[#1c1b1b]/20 py-3 font-headline text-[10px] uppercase tracking-widest hover:border-[#1c1b1b] disabled:opacity-70"
                                >
                                    {actionBusy ? 'Updating...' : 'Request Return'}
                                </button>
                            )}
                            {actionMessage && <p className="font-headline text-[9px] uppercase tracking-widest text-[#b90c1b]">{actionMessage}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
