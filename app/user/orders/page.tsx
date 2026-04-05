'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Comp7 from '@/app/components/Comp7';
import GridSkeleton from '@/app/components/GridSkeleton';
import { cancelUserOrder, fetchOrders, requestUserOrderReturn } from '@/app/lib/apiClient';
import { useRequireUserSession } from '@/app/lib/guards';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';

interface UiOrder {
  id: string;
  ref: string;
  status: string;
  total: number;
  date: string;
  previewImage: string;
}

const FALLBACK_ORDER_IMAGE =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80';

const resolveOrderPreviewImage = (entry: Record<string, unknown>) => {
  const items = Array.isArray(entry.items) ? entry.items : [];
  for (const rawItem of items) {
    const item = (rawItem || {}) as Record<string, unknown>;
    const product = (item.product || {}) as Record<string, unknown>;
    const productImages = Array.isArray(product.product_image) ? product.product_image : [];

    const candidate =
      (typeof productImages[0] === 'string' && productImages[0]) ||
      (typeof item.image === 'string' && item.image) ||
      (typeof product.image === 'string' && product.image) ||
      '';

    if (candidate) return candidate;
  }

  return FALLBACK_ORDER_IMAGE;
};

const resolveOrderTotal = (entry: Record<string, unknown>) => {
  const explicitTotal = Number(entry.grand_total || entry.total || 0);
  if (explicitTotal > 0) return explicitTotal;

  const amount = Number(entry.amount || 0);
  if (amount <= 0) return 0;

  const hasRazorpayOrder = typeof entry.razorpay_order_id === 'string' && entry.razorpay_order_id.length > 0;
  return hasRazorpayOrder ? amount / 100 : amount;
};

export default function OrderHistoryRoute() {
  const { settings } = useSiteSettings();
  const currency = settings.currencySymbol;
  const [orders, setOrders] = useState<UiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { ready, authenticated } = useRequireUserSession('/user/auth');

  useEffect(() => {
    if (!authenticated) return;
    fetchOrders()
      .then((rows) => {
        const mapped = rows.map((entry) => ({
          id: String(entry._id || entry.order_code || Date.now()),
          ref: String(entry.order_code || entry._id || ''),
          status: String(entry.status || 'PROCESSING').toUpperCase(),
          total: resolveOrderTotal(entry as Record<string, unknown>),
          date: new Date(String(entry.createdAt || Date.now())).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
          previewImage: resolveOrderPreviewImage(entry as Record<string, unknown>),
        }));
        setOrders(mapped);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [authenticated]);

  if (!ready || !authenticated) {
    return <main className="min-h-screen bg-[#fcf8f8]" />;
  }

  return (
    <main className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
      <div className="pt-8 pb-20 px-4 md:px-8 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-8 border-b-4 border-[#1c1b1b] pb-10">
          <div>
            <h1 className="font-brand text-6xl md:text-8xl uppercase tracking-tighter mt-2">Order History</h1>
            <p className="mt-4 font-headline text-sm uppercase tracking-wider opacity-60 max-w-md">All orders are now synced from backend.</p>
          </div>
        </div>

        {loading ? (
          <GridSkeleton count={3} />
        ) : orders.length === 0 ? (
          <div className="border-l-8 border-[#b90c1b] bg-[#f6f3f2] p-10">
            <h2 className="font-brand text-4xl uppercase mb-3">No Orders Found</h2>
            <Link href="/shop" className="border-2 border-[#1c1b1b] px-8 py-3 font-headline text-[11px] uppercase tracking-widest hover:bg-[#1c1b1b] hover:text-white transition-colors">Start Shopping</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              (() => {
                const normalizedStatus = order.status.toLowerCase();
                const canCancel = ![
                  'cancelled',
                  'rejected',
                  'shipped',
                  'in transit',
                  'in_transit',
                  'out for delivery',
                  'out_for_delivery',
                  'delivered',
                  'returned',
                  'return_requested',
                  'rto',
                ].includes(normalizedStatus);

                return (
                  <article
                    key={order.id}
                    className="group bg-[#fcf8f8] border border-[#1c1b1b]/10 border-l-4 border-l-transparent hover:border-l-[#b90c1b] p-6 md:p-8 flex flex-row md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:bg-[#f6f3f2]"
                  >
                    <Link href={`/user/orders/${order.id}`} className="w-24 h-28 bg-[#f6f3f2] overflow-hidden flex-shrink-0 border border-[#1c1b1b]/10">
                      <Image
                        src={order.previewImage}
                        alt={`Order ${order.ref} item preview`}
                        width={192}
                        height={224}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <Link href={`/user/orders/${order.id}`} className="flex-1 flex flex-col gap-1">
                    
                      <span className="font-headline text-[9px] font-bold tracking-wider opacity-40 uppercase">{order.ref}</span>
                      <h3 className="font-brand text-2xl md:text-3xl uppercase group-hover:text-[#b90c1b] transition-colors">{order.status}</h3>
                      <p className="font-headline text-xs uppercase tracking-wide opacity-40 mt-1">Placed: {order.date}</p>
                    </Link>

                  </article>
                );
              })()
            ))}
          </div>
        )}
      </div>
      <Comp7 />
    </main>
  );
}