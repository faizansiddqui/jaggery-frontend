'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
}

export default function OrderHistoryRoute() {
  const { settings } = useSiteSettings();
  const currency = settings.currencySymbol || '$';
  const [orders, setOrders] = useState<UiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const { ready, authenticated } = useRequireUserSession('/user/auth');

  useEffect(() => {
    if (!authenticated) return;
    fetchOrders()
      .then((rows) => {
        const mapped = rows.map((entry) => ({
          id: String(entry._id || entry.order_code || Date.now()),
          ref: String(entry.order_code || entry._id || ''),
          status: String(entry.status || 'PROCESSING').toUpperCase(),
          total: Number(entry.grand_total || entry.total || 0),
          date: new Date(String(entry.createdAt || Date.now())).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
        }));
        setOrders(mapped);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [authenticated]);

  if (!ready || !authenticated) {
    return <main className="min-h-screen bg-[#fcf8f8]" />;
  }

  const updateOrderStatus = (targetId: string, nextStatus: string) => {
    setOrders((prev) => prev.map((entry) => (entry.id === targetId ? { ...entry, status: nextStatus } : entry)));
  };

  const setOrderMessage = (targetId: string, message: string) => {
    setMessages((prev) => ({ ...prev, [targetId]: message }));
  };

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
              <article
                key={order.id}
                className="group bg-[#fcf8f8] border border-[#1c1b1b]/10 border-l-4 border-l-transparent hover:border-l-[#b90c1b] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:bg-[#f6f3f2]"
              >
                <Link href={`/user/orders/${order.id}`} className="flex-1 flex flex-col gap-1">
                  <span className="font-headline text-[9px] font-bold tracking-wider opacity-40 uppercase">{order.ref}</span>
                  <h3 className="font-brand text-2xl md:text-3xl uppercase group-hover:text-[#b90c1b] transition-colors">{order.status}</h3>
                  <p className="font-headline text-xs uppercase tracking-wide opacity-40 mt-1">Placed: {order.date}</p>
                </Link>

                <div className="w-full md:w-auto flex flex-col md:items-end gap-3">
                  <div className="font-brand text-2xl">{currency}{order.total.toFixed(2)}</div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/user/orders/${order.id}`}
                      className="border border-[#1c1b1b]/20 px-3 py-2 font-headline text-[10px] uppercase tracking-widest hover:border-[#1c1b1b]"
                    >
                      View
                    </Link>

                    {!['cancelled', 'delivered', 'returned', 'return_requested'].includes(order.status.toLowerCase()) && (
                      <button
                        disabled={busyOrderId === order.id}
                        onClick={async () => {
                          try {
                            setBusyOrderId(order.id);
                            await cancelUserOrder(order.ref || order.id);
                            updateOrderStatus(order.id, 'CANCELLED');
                            setOrderMessage(order.id, 'Order cancelled successfully');
                          } catch (error) {
                            setOrderMessage(order.id, error instanceof Error ? error.message : 'Could not cancel order');
                          } finally {
                            setBusyOrderId(null);
                          }
                        }}
                        className="bg-[#1c1b1b] text-white px-3 py-2 font-headline text-[10px] uppercase tracking-widest hover:bg-[#b90c1b] disabled:opacity-70"
                      >
                        {busyOrderId === order.id ? 'Updating...' : 'Cancel'}
                      </button>
                    )}

                    {order.status.toLowerCase() === 'delivered' && (
                      <button
                        disabled={busyOrderId === order.id}
                        onClick={async () => {
                          try {
                            setBusyOrderId(order.id);
                            await requestUserOrderReturn(order.ref || order.id);
                            updateOrderStatus(order.id, 'RETURN_REQUESTED');
                            setOrderMessage(order.id, 'Return requested successfully');
                          } catch (error) {
                            setOrderMessage(order.id, error instanceof Error ? error.message : 'Could not request return');
                          } finally {
                            setBusyOrderId(null);
                          }
                        }}
                        className="border border-[#1c1b1b]/20 px-3 py-2 font-headline text-[10px] uppercase tracking-widest hover:border-[#1c1b1b] disabled:opacity-70"
                      >
                        {busyOrderId === order.id ? 'Updating...' : 'Return'}
                      </button>
                    )}
                  </div>
                  {messages[order.id] && <p className="font-headline text-[9px] uppercase tracking-widest text-[#b90c1b]">{messages[order.id]}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <Comp7 />
    </main>
  );
}