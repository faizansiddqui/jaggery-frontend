'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cancelUserOrder, fetchOrders, requestUserOrderReturn } from '../../../../lib/apiClient';
import { useRequireUserSession } from '../../../../lib/guards';
import { useSiteSettings } from '../../../../context/SiteSettingsContext';

interface UiItem {
    productId: number;
    name: string;
    qty: number;
    unitPrice: number;
    price: number;
    size: string;
    color: string;
    image: string;
}

interface UiAddress {
    fullName: string;
    email: string;
    phone1: string;
    phone2: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    addressType: string;
}

interface UiOrder {
    id: string;
    ref: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    razorpayPaymentId: string;
    courierName: string;
    date: string;
    createdAtIso: string;
    total: number;
    subtotal: number;
    currency: string;
    address: UiAddress;
    items: UiItem[];
}

function resolveOrderTotal(raw: Record<string, unknown>, items: UiItem[]) {
    const explicitTotal = Number(raw.grand_total || raw.total || 0);
    if (explicitTotal > 0) return explicitTotal;

    const amount = Number(raw.amount || 0);
    if (amount > 0) {
        const hasRazorpayOrder = typeof raw.razorpay_order_id === 'string' && raw.razorpay_order_id.length > 0;
        return hasRazorpayOrder ? amount / 100 : amount;
    }

    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function toLower(value: unknown) {
    return String(value || '').trim().toLowerCase();
}

function toUpperWords(value: unknown, fallback = 'N/A') {
    const text = String(value || '').trim();
    if (!text) return fallback;
    return text
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .toUpperCase();
}

function isShippedOrLater(status: string) {
    const normalized = toLower(status);
    const blocked = [
        'shipped',
        'in transit',
        'in_transit',
        'out for delivery',
        'out_for_delivery',
        'delivered',
        'rto',
        'return_requested',
        'returned',
        'cancelled',
        'rejected',
    ];
    return blocked.includes(normalized);
}

function getProgressStep(status: string) {
    const normalized = toLower(status);
    if (['cancelled', 'rejected', 'rto', 'return_requested', 'returned'].includes(normalized)) {
        return -1;
    }
    if (normalized === 'delivered') return 4;
    if (['out for delivery', 'out_for_delivery'].includes(normalized)) return 3;
    if (['shipped', 'in transit', 'in_transit', 'dispatched'].includes(normalized)) return 2;
    if (['confirmed', 'processing', 'packed', 'ready to ship'].includes(normalized)) return 1;
    return 0;
}

function formatMoney(amount: number) {
    return Number.isFinite(amount) ? amount.toFixed(2) : '0.00';
}

async function loadLogoDataUrl(logoUrl?: string) {
    const targetUrl = String(logoUrl || '').trim() || '/logo.png';
    try {
        const response = await fetch(targetUrl, { cache: 'force-cache' });
        if (!response.ok) return '';
        const blob = await response.blob();
        return await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : '');
            reader.onerror = () => resolve('');
            reader.readAsDataURL(blob);
        });
    } catch {
        return '';
    }
}

function buildInvoiceHtml(order: UiOrder, currency: string, brandName: string, logoDataUrl = '') {
    const addressLines = [
        order.address.fullName,
        order.address.line1,
        order.address.line2,
        `${order.address.city}, ${order.address.state}`,
        `${order.address.country} - ${order.address.pinCode}`,
        order.address.phone1,
        order.address.email,
    ].filter(Boolean);

    const rows = order.items
        .map(
            (item, index) => `
            <tr>
                            <td style="padding:12px;border-bottom:1px solid #e9e2e2;">${index + 1}</td>
                            <td style="padding:12px;border-bottom:1px solid #e9e2e2;">${item.name}</td>
                            <td style="padding:12px;border-bottom:1px solid #e9e2e2;">${item.color || '-'}</td>
                            <td style="padding:12px;border-bottom:1px solid #e9e2e2;">${item.size || '-'}</td>
                            <td style="padding:12px;border-bottom:1px solid #e9e2e2;">${item.qty}</td>
                            <td style="padding:12px;border-bottom:1px solid #e9e2e2;">${currency}${formatMoney(item.unitPrice)}</td>
                            <td style="padding:12px;border-bottom:1px solid #e9e2e2;font-weight:700;">${currency}${formatMoney(item.price)}</td>
            </tr>`,
        )
        .join('');

    const shippingFee = Math.max(0, order.total - order.subtotal);
    const logoMarkup = logoDataUrl
        ? `<img src="${logoDataUrl}" alt="${brandName}" style="height:48px;width:auto;display:block;" />`
        : `<div style="font-family:Arial,Helvetica,sans-serif;font-weight:900;font-size:24px;letter-spacing:1px;">${brandName}</div>`;

    return `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Invoice ${order.ref}</title>
      </head>
            <body style="font-family:Arial,Helvetica,sans-serif;background:#fcf8f8;padding:20px;color:#1c1b1b;">
                <div style="max-width:980px;margin:0 auto;background:#ffffff;border:1px solid #ebe3e3;">
                    <div style="padding:20px 22px;border-bottom:4px solid #1c1b1b;display:flex;justify-content:space-between;align-items:center;gap:18px;">
                        ${logoMarkup}
                        <div style="text-align:right;">
                            <div style="font-size:11px;letter-spacing:2px;font-weight:700;color:#b90c1b;">OFFICIAL INVOICE</div>
                            <div style="font-size:26px;font-weight:900;letter-spacing:0.4px;">${order.ref}</div>
                            <div style="font-size:12px;opacity:0.7;">DATE ${order.date}</div>
                        </div>
                    </div>

                    <div style="padding:18px 22px;background:#f6f3f2;border-bottom:1px solid #ebe3e3;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;">
                        <div>
                            <div style="font-size:10px;letter-spacing:1.5px;font-weight:700;opacity:0.6;margin-bottom:6px;">PAYMENT</div>
                            <div style="font-size:13px;font-weight:700;">${toUpperWords(order.paymentMethod)}</div>
                            <div style="font-size:12px;opacity:0.75;">${toUpperWords(order.paymentStatus)}</div>
                        </div>
                        <div>
                            <div style="font-size:10px;letter-spacing:1.5px;font-weight:700;opacity:0.6;margin-bottom:6px;">ORDER</div>
                            <div style="font-size:13px;font-weight:700;">${toUpperWords(order.status)}</div>
                            <div style="font-size:12px;opacity:0.75;">Order Ref: ${order.ref || 'N/A'}</div>
                        </div>
                    </div>

                    <div style="padding:18px 22px;">
                        <div style="font-size:11px;letter-spacing:1.5px;font-weight:700;opacity:0.6;margin-bottom:8px;">SHIPPING ADDRESS</div>
                        <div style="font-size:13px;line-height:1.6;">${addressLines.join('<br/>')}</div>
                    </div>

                    <div style="padding:0 22px 20px;">
                        <table style="border-collapse:collapse;width:100%;font-size:13px;border:1px solid #e9e2e2;">
                            <thead>
                                <tr style="background:#1c1b1b;color:#ffffff;">
                                    <th style="padding:12px;text-align:left;">#</th>
                                    <th style="padding:12px;text-align:left;">Item</th>
                                    <th style="padding:12px;text-align:left;">Color</th>
                                    <th style="padding:12px;text-align:left;">Size</th>
                                    <th style="padding:12px;text-align:left;">Qty</th>
                                    <th style="padding:12px;text-align:left;">Unit</th>
                                    <th style="padding:12px;text-align:left;">Amount</th>
                                </tr>
                            </thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>

                    <div style="padding:0 22px 22px;display:flex;justify-content:flex-end;">
                        <div style="min-width:290px;border:1px solid #e9e2e2;">
                            <div style="display:flex;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #e9e2e2;font-size:13px;"><span>Subtotal</span><strong>${currency}${formatMoney(order.subtotal)}</strong></div>
                            <div style="display:flex;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #e9e2e2;font-size:13px;"><span>Shipping</span><strong>${currency}${formatMoney(shippingFee)}</strong></div>
                            <div style="display:flex;justify-content:space-between;padding:12px;background:#b90c1b;color:#ffffff;font-size:15px;"><span style="letter-spacing:1px;">TOTAL</span><strong>${currency}${formatMoney(order.total)}</strong></div>
                        </div>
                    </div>

                    <div style="padding:14px 22px;border-top:1px solid #ebe3e3;font-size:11px;letter-spacing:0.7px;opacity:0.65;">
                        ${brandName} | ENGINEERED FOR THE STREETS
                    </div>
                </div>
      </body>
      </html>
    `;
}

function mapOrder(raw: Record<string, unknown>): UiOrder {
    const items = Array.isArray(raw.items) ? raw.items : [];
    const addressObj = (raw.address || {}) as Record<string, unknown>;
    const mappedItems: UiItem[] = items.map((entry) => {
        const row = entry as Record<string, unknown>;
        const product = (row.product || {}) as Record<string, unknown>;
        const imageList = Array.isArray(product.product_image) ? product.product_image : [];
        const qty = Number(row.quantity || row.qty || 1);
        const unitPrice = Number(row.price || product.selling_price || product.price || 0);
        const image = (typeof imageList[0] === 'string' && imageList[0]) ||
            (typeof row.image === 'string' && row.image) ||
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80';

        return {
            productId: Number(row.product_id || product.product_id || 0),
            name: String(product.name || row.title || 'Product'),
            qty,
            unitPrice,
            price: unitPrice * qty,
            size: String(row.size || 'M'),
            color: String(row.color || ''),
            image,
        };
    });

    const createdAt = new Date(String(raw.createdAt || Date.now()));
    const computedSubtotal = mappedItems.reduce((sum, item) => sum + item.price, 0);
    const total = resolveOrderTotal(raw, mappedItems);
    return {
        id: String(raw._id || raw.order_code || ''),
        ref: String(raw.order_code || raw._id || ''),
        status: String(raw.status || 'processing'),
        paymentStatus: String(raw.payment_status || 'pending'),
        paymentMethod: String(raw.payment_method || 'prepaid'),
        razorpayPaymentId: String(raw.razorpay_payment_id || ''),
        courierName: String(raw.courier_name || ''),
        date: createdAt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
        createdAtIso: createdAt.toISOString(),
        total,
        subtotal: computedSubtotal,
        currency: String(raw.currency || 'INR').toUpperCase(),
        address: {
            fullName: String(raw.FullName || addressObj.FullName || addressObj.full_name || ''),
            email: String(raw.user_email || addressObj.email || ''),
            phone1: String(raw.phone1 || addressObj.phone1 || addressObj.phone || ''),
            phone2: String(raw.phone2 || addressObj.phone2 || addressObj.alt_phone || ''),
            line1: String(raw.address_line1 || addressObj.address || addressObj.address_line1 || ''),
            line2: String(raw.address_line2 || addressObj.address_line2 || addressObj.district || ''),
            city: String(raw.city || addressObj.city || ''),
            state: String(raw.state || addressObj.state || ''),
            country: String(raw.country || addressObj.country || ''),
            pinCode: String(raw.pinCode || addressObj.pinCode || addressObj.postal_code || ''),
            addressType: String(raw.addressType || addressObj.addressType || ''),
        },
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
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
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

    const statusLower = toLower(order?.status || '');
    const canCancel = Boolean(order) && !isShippedOrLater(statusLower);
    const canReturn = Boolean(order) && ['delivered'].includes(statusLower);
    const canDownloadInvoice = ['delivered', 'return_requested', 'returned'].includes(statusLower);
    const progressStep = getProgressStep(order?.status || '');
    const deliverySteps = ['Order Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

    const handleDownloadInvoice = async () => {
        if (!order || !canDownloadInvoice) return;
        const brandName = String(settings.siteName || 'STREETRIOT').toUpperCase();
        const logoDataUrl = await loadLogoDataUrl(settings.logoUrl);
        const html = buildInvoiceHtml(order, currency, brandName, logoDataUrl);
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `invoice-${order.ref || order.id}.html`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    };

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
                <span className="font-brand text-3xl uppercase text-[#b90c1b]">{toUpperWords(order.status)}</span>
            </header>

            <section className="mb-10 border border-[#1c1b1b]/10 bg-white p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-brand text-3xl uppercase tracking-widest">Delivery Progress</h2>
                </div>

                {progressStep >= 0 ? (
                    <div className="overflow-x-auto pb-2">
                        <ol className="flex min-w-[760px] md:min-w-0 md:grid md:grid-cols-5">
                            {deliverySteps.map((step, index) => {
                                const active = index <= progressStep;
                                const connectorActive = index < progressStep;
                                const isLast = index === deliverySteps.length - 1;
                                return (
                                    <li key={step} className="relative flex-1 min-w-[152px] px-2">
                                        {!isLast && (
                                            <span
                                                className={`absolute top-2 left-1/2 ml-2 h-[2px] w-[calc(100%-1rem)] ${connectorActive ? 'bg-[#b90c1b]' : 'bg-[#1c1b1b]/15'}`}
                                            />
                                        )}
                                        <div className="relative z-10 flex flex-col items-center text-center gap-2">
                                            <span className={`h-4 w-4 rounded-full border ${active ? 'bg-[#b90c1b] border-[#b90c1b]' : 'bg-white border-[#1c1b1b]/25'}`} />
                                            <p className={`font-headline text-[10px] uppercase tracking-widest leading-tight ${active ? 'opacity-100' : 'opacity-40'}`}>
                                                {step}
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                ) : (
                    <p className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b]">
                        This order is {toUpperWords(order.status)} and no longer in delivery pipeline.
                    </p>
                )}
            </section>

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
                                    <p className="font-headline text-[10px] uppercase tracking-widest opacity-40 mt-1">
                                        Size: {item.size || '-'} | Color: {item.color || '-'} | Qty: {item.qty}
                                    </p>
                                    <p className="font-headline text-[10px] uppercase tracking-widest opacity-40 mt-1">Unit: {currency}{formatMoney(item.unitPrice)}</p>
                                </div>
                                <span className="font-brand text-2xl text-[#b90c1b]">{currency}{formatMoney(item.price)}</span>
                            </div>
                        </div>
                    ))}

                    <section className="border border-[#1c1b1b]/10 bg-white p-6 md:p-8">
                        <h3 className="font-brand text-2xl uppercase tracking-widest border-b border-[#1c1b1b]/10 pb-3 mb-5">Shipping Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-headline text-[11px] uppercase tracking-widest">
                            <p><span className="opacity-40">Name:</span> {order.address.fullName || 'N/A'}</p>
                            <p><span className="opacity-40">Email:</span> {order.address.email || 'N/A'}</p>
                            <p><span className="opacity-40">Phone:</span> {order.address.phone1 || 'N/A'}</p>
                            <p><span className="opacity-40">Alt Phone:</span> {order.address.phone2 || '-'}</p>
                            <p className="md:col-span-2"><span className="opacity-40">Address:</span> {[order.address.line1, order.address.line2].filter(Boolean).join(', ') || 'N/A'}</p>
                            <p><span className="opacity-40">City/State:</span> {[order.address.city, order.address.state].filter(Boolean).join(', ') || 'N/A'}</p>
                            <p><span className="opacity-40">Country/Pin:</span> {[order.address.country, order.address.pinCode].filter(Boolean).join(' - ') || 'N/A'}</p>
                            <p><span className="opacity-40">Address Type:</span> {order.address.addressType || '-'}</p>
                        </div>
                    </section>

                    <section className="border border-[#1c1b1b]/10 bg-white p-6 md:p-8">
                        <h3 className="font-brand text-2xl uppercase tracking-widest border-b border-[#1c1b1b]/10 pb-3 mb-5">Payment Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-headline text-[11px] uppercase tracking-widest">
                            <p><span className="opacity-40">Payment Method:</span> {toUpperWords(order.paymentMethod)}</p>
                            <p><span className="opacity-40">Payment Status:</span> {toUpperWords(order.paymentStatus)}</p>
                            <p><span className="opacity-40">Order Ref:</span> {order.ref || 'N/A'}</p>
                            <p><span className="opacity-40">Courier:</span> {order.courierName || 'N/A'}</p>
                            <p><span className="opacity-40">Payment Ref:</span> {order.razorpayPaymentId || 'N/A'}</p>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-[#f6f3f2] border-l-8 border-[#b90c1b] p-8 sticky top-28">
                        <h2 className="font-brand text-3xl uppercase tracking-widest border-b border-[#1c1b1b]/10 pb-4 mb-6">Order Summary</h2>
                        <div className="space-y-3 border-b border-[#1c1b1b]/10 pb-5 mb-5">
                            <div className="flex justify-between items-center">
                                <span className="font-headline text-[10px] uppercase tracking-[0.25em] font-black opacity-40">Subtotal</span>
                                <span className="font-brand text-xl">{currency}{formatMoney(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-headline text-[10px] uppercase tracking-[0.25em] font-black opacity-40">Shipping</span>
                                <span className="font-brand text-xl">{currency}{formatMoney(Math.max(0, order.total - order.subtotal))}</span>
                            </div>
                            <div className="flex justify-between items-end pt-2 border-t border-[#1c1b1b]/10">
                                <span className="font-headline text-[10px] uppercase tracking-[0.4em] font-black opacity-40">Total</span>
                                <span className="font-brand text-4xl text-[#b90c1b]">{currency}{formatMoney(order.total)}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-2">
                            {canDownloadInvoice ? (
                                <button
                                    onClick={() => { void handleDownloadInvoice(); }}
                                    className="w-full border border-[#1c1b1b]/20 py-3 font-headline text-[10px] uppercase tracking-widest hover:border-[#1c1b1b]"
                                >
                                    Download Invoice
                                </button>
                            ) : (
                                <p className="w-full border border-[#1c1b1b]/10 bg-white px-3 py-2 text-center font-headline text-[9px] uppercase tracking-widest opacity-60">
                                    Invoice download available after delivery
                                </p>
                            )}

                            {canCancel && (
                                <>
                                    {!showCancelConfirm ? (
                                        <button
                                            disabled={actionBusy}
                                            onClick={() => setShowCancelConfirm(true)}
                                            className="w-full border border-[#1c1b1b]/30 py-2 font-headline text-[9px] uppercase tracking-widest hover:border-[#1c1b1b] disabled:opacity-70"
                                        >
                                            Cancel Order
                                        </button>
                                    ) : (
                                        <div className="border border-[#b90c1b]/20 bg-[#fff7f7] p-3">
                                            <p className="font-headline text-[9px] uppercase tracking-widest text-[#b90c1b] mb-3">Are you sure you want to cancel this order?</p>
                                            <div className="flex gap-2">
                                                <button
                                                    disabled={actionBusy}
                                                    onClick={async () => {
                                                        try {
                                                            setActionBusy(true);
                                                            await cancelUserOrder(order.ref || order.id);
                                                            setOrders((prev) => prev.map((entry) => entry.id === order.id ? { ...entry, status: 'cancelled' } : entry));
                                                            setActionMessage('Order cancelled successfully');
                                                            setShowCancelConfirm(false);
                                                        } catch (error) {
                                                            setActionMessage(error instanceof Error ? error.message : 'Could not cancel order');
                                                        } finally {
                                                            setActionBusy(false);
                                                        }
                                                    }}
                                                    className="flex-1 bg-[#1c1b1b] text-white py-2 font-headline text-[9px] uppercase tracking-widest hover:bg-[#b90c1b] disabled:opacity-70"
                                                >
                                                    {actionBusy ? 'Updating...' : 'Yes, Cancel'}
                                                </button>
                                                <button
                                                    disabled={actionBusy}
                                                    onClick={() => setShowCancelConfirm(false)}
                                                    className="flex-1 border border-[#1c1b1b]/30 py-2 font-headline text-[9px] uppercase tracking-widest hover:border-[#1c1b1b]"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {!canCancel && !canReturn && (
                                <p className="font-headline text-[9px] uppercase tracking-widest opacity-50">
                                    This order cannot be cancelled now.
                                </p>
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
