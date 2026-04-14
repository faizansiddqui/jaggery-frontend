'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
   fetchAdminOrders,
   type AdminOrder,
   updateAdminOrderStatus,
} from '@/app/lib/apiClient';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';

type OrderTab = 'all' | 'active' | 'resolved';
type OrderSortKey = 'time-desc' | 'time-asc' | 'price-desc' | 'price-asc';

const activeStatuses = new Set(['pending', 'processing', 'verified', 'in transit', 'in_transit', 'shipped']);
const resolvedStatuses = new Set(['delivered', 'cancelled', 'returned', 'refunded']);

const normalizeStatus = (status: string) => status.trim().toLowerCase();

const isResolvedStatus = (status: string) => {
   const normalized = normalizeStatus(status).replace(/_/g, ' ');
   if (!normalized) return false;
   if (resolvedStatuses.has(normalized)) return true;
   return ['deliver', 'cancel', 'return', 'refund', 'rto', 'reject'].some((token) => normalized.includes(token));
};

const isActiveStatus = (status: string) => {
   const normalized = normalizeStatus(status).replace(/_/g, ' ');
   if (!normalized) return false;
   if (activeStatuses.has(normalized)) return true;
   return !isResolvedStatus(normalized);
};

const formatStatusLabel = (status: string) => {
   const normalized = status.replace(/_/g, ' ').trim();
   if (!normalized) return 'Pending';
   return normalized
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
};

const getOrderKey = (order: AdminOrder) => {
   if (order.order_id) return String(order.order_id);
   if (order.order_code) return order.order_code;
   return order._id || '';
};

const formatDate = (input?: string) => {
   if (!input) return 'N/A';
   const date = new Date(input);
   if (Number.isNaN(date.getTime())) return 'N/A';
   return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
   }).format(date);
};

const getCustomerName = (order: AdminOrder) => {
   const name = String(order.FullName || '').trim();
   if (name) return name;

   const email = String(order.user_email || '').trim();
   if (!email) return 'Guest user';

   const fromEmail = email
      .split('@')[0]
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .trim();
   return fromEmail || 'Guest user';
};

const getOrderTotal = (order: AdminOrder) => {
   const explicit = Number(order.amount || 0);
   const itemsTotal = (order.items || []).reduce((sum, item) => {
      const price = Number(item.price || 0);
      const qty = Number(item.quantity || 0);
      return sum + (Number.isFinite(price) ? price : 0) * (Number.isFinite(qty) ? qty : 0);
   }, 0);
   if (Number.isFinite(explicit) && explicit > 0) {
      if (itemsTotal > 0 && explicit > itemsTotal * 5) return explicit / 100;
      if (itemsTotal <= 0 && explicit >= 100) return explicit / 100;
      return explicit;
   }
   return itemsTotal;
};

const getOrderAmountNormalized = (order: AdminOrder) => {
   const explicit = Number(order.amount || 0);
   const itemsTotal = (order.items || []).reduce((sum, item) => {
      const price = Number(item.price || 0);
      const qty = Number(item.quantity || 0);
      return sum + (Number.isFinite(price) ? price : 0) * (Number.isFinite(qty) ? qty : 0);
   }, 0);

   if (Number.isFinite(explicit) && explicit > 0) {
      if (itemsTotal > 0 && explicit > itemsTotal * 5) return explicit / 100;
      if (itemsTotal <= 0 && explicit >= 100) return explicit / 100;
      return explicit;
   }
   return itemsTotal;
};

const getOrderTimestamp = (order: AdminOrder) => {
   const value = order.createdAt ? new Date(order.createdAt).getTime() : 0;
   return Number.isFinite(value) ? value : 0;
};

const getStatusIcon = (status: string) => {
   const normalized = normalizeStatus(status);
   if (normalized === 'delivered') return 'check_circle';
   if (normalized === 'cancelled' || normalized === 'returned') return 'cancel';
   if (normalized === 'processing' || normalized === 'verified') return 'inventory_2';
   return 'local_shipping';
};

const isPaidStatus = (order: AdminOrder) => {
   const payment = normalizeStatus(String(order.payment_status || ''));
   if (payment === 'paid') return true;
   const status = normalizeStatus(String(order.status || ''));
   return ['confirmed', 'processing', 'shipped', 'in transit', 'in_transit', 'delivered'].includes(status);
};

const isRefundStatus = (order: AdminOrder) => {
   const payment = normalizeStatus(String(order.payment_status || ''));
   if (payment.includes('refund')) return true;
   const status = normalizeStatus(String(order.status || ''));
   return ['cancelled', 'returned', 'refunded', 'rto'].some((token) => status.includes(token));
};

const formatAddress = (order: AdminOrder) => {
   const primary = [
      order.address?.address,
      order.address?.address_line2,
      order.address_line1,
   ]
      .map((value) => String(value || '').trim())
      .filter(Boolean);

   const region = [
      order.address?.city || order.city,
      order.address?.state || order.state,
      order.address?.country || order.country,
      order.address?.pinCode || order.pinCode,
   ]
      .map((value) => String(value || '').trim())
      .filter(Boolean);

   return [...primary, ...region].join(', ') || 'N/A';
};

export default function OrdersManagement() {
   const [orders, setOrders] = useState<AdminOrder[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState('');
   const [query, setQuery] = useState('');
   const [activeTab, setActiveTab] = useState<OrderTab>('all');
   const [sortBy, setSortBy] = useState<OrderSortKey>('time-desc');
   const [startDate, setStartDate] = useState('');
   const [endDate, setEndDate] = useState('');
   const [activeOrderKey, setActiveOrderKey] = useState('');
   const [statusUpdate, setStatusUpdate] = useState('');
   const [statusBusy, setStatusBusy] = useState(false);
   const [statusMessage, setStatusMessage] = useState('');
   const { settings } = useSiteSettings();
   const currency = settings.currencySymbol || '$';

   const loadOrders = async () => {
      try {
         setIsLoading(true);
         setError('');
         const rows = await fetchAdminOrders();
         setOrders(rows);
      } catch (loadError) {
         setError(loadError instanceof Error ? loadError.message : 'Could not load orders.');
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      loadOrders();
   }, []);

   const counts = useMemo(() => {
      return orders.reduce(
         (acc, order) => {
            const status = normalizeStatus(order.status || '');
            acc.all += 1;
            if (isActiveStatus(status)) acc.active += 1;
            if (isResolvedStatus(status)) acc.resolved += 1;
            return acc;
         },
         { all: 0, active: 0, resolved: 0 },
      );
   }, [orders]);

   const salesStats = useMemo(() => {
      let totalSales = 0;
      let totalProcessing = 0;
      let totalRefund = 0;
      let totalPending = 0;
      let paidCount = 0;
      let refundCount = 0;

      const productAgg = new Map<number, { name: string; qty: number; revenue: number }>();

      orders.forEach((order) => {
         const amount = getOrderAmountNormalized(order);
         const paid = isPaidStatus(order);
         const refund = isRefundStatus(order);
         const active = isActiveStatus(normalizeStatus(order.status || ''));
         const payment = normalizeStatus(String(order.payment_status || ''));

         if (paid && !refund) {
            totalSales += amount;
            paidCount += 1;
         }
         if (active) totalProcessing += amount;
         if (refund) {
            totalRefund += amount;
            refundCount += 1;
         }
         if (!paid && !refund && payment === 'pending') {
            totalPending += amount;
         }

         (order.items || []).forEach((item) => {
            const productId = Number(item.product_id || 0);
            if (!productId) return;
            const qty = Math.max(0, Number(item.quantity || 0));
            const price = Math.max(0, Number(item.price || 0));
            const name = String(item.product_name || `Product ${productId}`);
            const current = productAgg.get(productId) || { name, qty: 0, revenue: 0 };
            current.qty += qty;
            current.revenue += qty * price;
            productAgg.set(productId, current);
         });
      });

      const topProducts = Array.from(productAgg.entries())
         .sort((a, b) => b[1].qty - a[1].qty || b[1].revenue - a[1].revenue)
         .slice(0, 6)
         .map(([productId, data]) => ({
            productId,
            name: data.name,
            qty: data.qty,
            revenue: data.revenue,
         }));

      const avgOrderValue = paidCount > 0 ? totalSales / paidCount : 0;

      return {
         totalSales,
         totalProcessing,
         totalRefund,
         totalPending,
         paidCount,
         refundCount,
         avgOrderValue,
         topProducts,
      };
   }, [orders]);

   const filteredOrders = useMemo(() => {
      const term = query.trim().toLowerCase();
      const startTs = startDate ? new Date(`${startDate}T00:00:00`).getTime() : null;
      const endTs = endDate ? new Date(`${endDate}T23:59:59.999`).getTime() : null;

      return orders.filter((order) => {
         const status = normalizeStatus(order.status || '');
         const matchesTab =
            activeTab === 'all' ||
            (activeTab === 'active' ? isActiveStatus(status) : isResolvedStatus(status));

         if (!matchesTab) return false;

         if (startTs !== null || endTs !== null) {
            const orderTs = getOrderTimestamp(order);
            if (startTs !== null && orderTs < startTs) return false;
            if (endTs !== null && orderTs > endTs) return false;
         }

         if (!term) return true;

         const key = getOrderKey(order).toLowerCase();
         const customer = getCustomerName(order).toLowerCase();
         const email = String(order.user_email || '').toLowerCase();
         return key.includes(term) || customer.includes(term) || email.includes(term);
      });
   }, [orders, activeTab, query, startDate, endDate]);

   const filteredAndSortedOrders = useMemo(() => {
      const rows = [...filteredOrders];

      if (sortBy === 'time-asc') {
         rows.sort((a, b) => getOrderTimestamp(a) - getOrderTimestamp(b));
         return rows;
      }

      if (sortBy === 'price-desc') {
         rows.sort((a, b) => getOrderTotal(b) - getOrderTotal(a));
         return rows;
      }

      if (sortBy === 'price-asc') {
         rows.sort((a, b) => getOrderTotal(a) - getOrderTotal(b));
         return rows;
      }

      rows.sort((a, b) => getOrderTimestamp(b) - getOrderTimestamp(a));
      return rows;
   }, [filteredOrders, sortBy]);

   const activeOrder = useMemo(() => {
      if (!activeOrderKey) return null;
      return orders.find((order) => getOrderKey(order) === activeOrderKey) || null;
   }, [orders, activeOrderKey]);

   useEffect(() => {
      if (!activeOrder) return;
      setStatusUpdate(String(activeOrder.status || 'pending'));
      setStatusMessage('');
   }, [activeOrder]);

   useEffect(() => {
      if (!activeOrderKey) return;

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const onEscape = (event: KeyboardEvent) => {
         if (event.key === 'Escape') {
            setActiveOrderKey('');
         }
      };

      window.addEventListener('keydown', onEscape);
      return () => {
         window.removeEventListener('keydown', onEscape);
         document.body.style.overflow = originalOverflow;
      };
   }, [activeOrderKey]);

   return (
      <div className="flex flex-col gap-12">
         <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="flex flex-col gap-2">
               <span className="font-headline text-[10px] md:text-sm tracking-[0.4em] text-primary font-black">LOGISTICS HUB</span>
               <h2 className="font-brand text-5xl md:text-7xl leading-none tracking-tighter">Editorial Fulfillment</h2>
            </div>
            <div className='flex flex-col'>
               <div className="flex flex-col md:items-end gap-4 w-full md:w-auto">
                  <div className="flex bg-surface border border-outline/10 p-2 gap-2 w-full md:w-auto overflow-x-auto">
                     <button
                        onClick={() => setActiveTab('all')}
                        className={`px-6 py-3 font-headline text-[10px] font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'all'
                           ? 'bg-on-primary text-primary'
                           : 'opacity-40 hover:opacity-100'
                           }`}
                     >
                        All Orders ({counts.all})
                     </button>
                     <button
                        onClick={() => setActiveTab('active')}
                        className={`px-6 py-3 font-headline text-[10px] font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'active'
                           ? 'bg-on-primary text-primary'
                           : 'opacity-40 hover:opacity-100'
                           }`}
                     >
                        Active ({counts.active})
                     </button>
                     <button
                        onClick={() => setActiveTab('resolved')}
                        className={`px-6 py-3 font-headline text-[10px] font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'resolved'
                           ? 'bg-on-primary text-primary'
                           : 'opacity-40 hover:opacity-100'
                           }`}
                     >
                        Resolved ({counts.resolved})
                     </button>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                     <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search order ID / customer / email"
                        className="w-full md:w-80 bg-surface border border-outline/10 px-4 py-3 font-headline text-[10px] tracking-widest focus:outline-none focus:border-primary"
                     />
                     <button
                        onClick={loadOrders}
                        className="px-5 bg-surface border border-outline/10 font-headline text-[10px] tracking-widest hover:border-primary"
                     >
                        Refresh
                     </button>
                  </div>
               </div>
            </div>
         </header>
         <div className="grid grid-cols-1 md:grid-cols-[170px_170px_190px] gap-2 w-full md:w-auto">
            <input
               type="date"
               value={startDate}
               onChange={(event) => setStartDate(event.target.value)}
               className="w-full bg-surface border border-outline/10 px-3 py-3 font-headline text-[10px] tracking-widest focus:outline-none focus:border-primary"
               aria-label="Start date filter"
            />
            <input
               type="date"
               value={endDate}
               onChange={(event) => setEndDate(event.target.value)}
               className="w-full bg-surface border border-outline/10 px-3 py-3 font-headline text-[10px] tracking-widest focus:outline-none focus:border-primary"
               aria-label="End date filter"
            />
            <select
               value={sortBy}
               onChange={(event) => setSortBy(event.target.value as OrderSortKey)}
               className="w-full bg-surface border border-outline/10 px-3 py-3 font-headline text-[10px] tracking-widest focus:outline-none focus:border-primary"
               aria-label="Sort orders"
            >
               <option value="time-desc">Sort: Time (Newest)</option>
               <option value="time-asc">Sort: Time (Oldest)</option>
               <option value="price-desc">Sort: Price (High to Low)</option>
               <option value="price-asc">Sort: Price (Low to High)</option>
            </select>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-surface border border-outline/10 p-6">
               <p className="font-headline text-[10px] tracking-[0.2em] opacity-60">TOTAL SALES</p>
               <p className="font-brand text-3xl mt-3">{currency}{salesStats.totalSales.toFixed(2)}</p>
               <p className="font-headline text-[9px] tracking-widest opacity-40 mt-2">{salesStats.paidCount} paid orders</p>
            </div>
            <div className="bg-surface border border-outline/10 p-6">
               <p className="font-headline text-[10px] tracking-[0.2em] opacity-60">PROCESSING AMOUNT</p>
               <p className="font-brand text-3xl mt-3">{currency}{salesStats.totalProcessing.toFixed(2)}</p>
               <p className="font-headline text-[9px] tracking-widest opacity-40 mt-2">{counts.active} active shipments</p>
            </div>
            <div className="bg-surface border border-outline/10 p-6">
               <p className="font-headline text-[10px] tracking-[0.2em] opacity-60">REFUND AMOUNT</p>
               <p className="font-brand text-3xl mt-3">{currency}{salesStats.totalRefund.toFixed(2)}</p>
               <p className="font-headline text-[9px] tracking-widest opacity-40 mt-2">{salesStats.refundCount} refund orders</p>
            </div>
            <div className="bg-surface border border-outline/10 p-6">
               <p className="font-headline text-[10px] tracking-[0.2em] opacity-60">PENDING AMOUNT</p>
               <p className="font-brand text-3xl mt-3">{currency}{salesStats.totalPending.toFixed(2)}</p>
               <p className="font-headline text-[9px] tracking-widest opacity-40 mt-2">awaiting payment</p>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-surface border border-outline/10 p-6">
               <p className="font-headline text-[10px] tracking-[0.2em] opacity-60">AVERAGE ORDER VALUE</p>
               <p className="font-brand text-3xl mt-3">{currency}{salesStats.avgOrderValue.toFixed(2)}</p>
            </div>
            <div className="bg-surface border border-outline/10 p-6">
               <p className="font-headline text-[10px] tracking-[0.2em] opacity-60">TOTAL ORDERS</p>
               <p className="font-brand text-3xl mt-3">{counts.all}</p>
            </div>
            <div className="bg-surface border border-outline/10 p-6">
               <p className="font-headline text-[10px] tracking-[0.2em] opacity-60">RESOLVED ORDERS</p>
               <p className="font-brand text-3xl mt-3">{counts.resolved}</p>
            </div>
         </div>

         <div className="bg-surface border border-outline/10 p-6">
            <h3 className="font-brand text-2xl tracking-widest border-b border-primary pb-4 mb-4">Top Product Orders</h3>
            {salesStats.topProducts.length === 0 ? (
               <p className="font-headline text-[10px] tracking-widest opacity-40">No product order data available.</p>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {salesStats.topProducts.map((prod) => (
                     <div key={prod.productId} className="border border-outline/10 p-4">
                        <p className="font-headline text-[10px] tracking-widest opacity-60">PRODUCT {prod.productId}</p>
                        <p className="font-headline text-xs tracking-widest mt-2">{prod.name}</p>
                        <div className="flex justify-between mt-3 font-headline text-[10px] tracking-widest opacity-60">
                           <span>Qty {prod.qty}</span>
                           <span>{currency}{prod.revenue.toFixed(2)}</span>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

         {error && (
            <div className="border border-primary/30 bg-primary/10 px-4 py-3 flex items-center justify-between gap-4">
               <p className="font-headline text-[10px] tracking-widest text-primary">{error}</p>
               <button onClick={loadOrders} className="font-headline text-[10px] tracking-widest underline underline-offset-4">Retry</button>
            </div>
         )}

         {isLoading && (
            <div className="bg-surface border border-outline/10 p-10 flex items-center gap-3">
               <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
               <span className="font-headline text-[10px] tracking-widest opacity-60">Loading orders...</span>
            </div>
         )}

         {/* Orders List */}
         <div className="flex flex-col gap-4">
            {!isLoading && filteredAndSortedOrders.length === 0 && (
               <div className="bg-surface border border-outline/10 p-12 text-center">
                  <p className="font-brand text-4xl tracking-widest opacity-30">No orders found</p>
               </div>
            )}

            {filteredAndSortedOrders.map((order) => {
               const orderKey = getOrderKey(order) || `${order.user_email || 'guest'}-${order.createdAt || ''}-${order.status || 'pending'}`;
               const status = normalizeStatus(order.status || 'pending');
               const total = getOrderTotal(order);

               return (
                  <div
                     key={orderKey}
                     role="button"
                     tabIndex={0}
                     onClick={() => setActiveOrderKey(getOrderKey(order))}
                     onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                           event.preventDefault();
                           setActiveOrderKey(getOrderKey(order));
                        }
                     }}
                     className="bg-surface border border-outline/10 p-8 flex flex-col gap-8 group hover:border-primary transition-all relative overflow-hidden cursor-pointer"
                  >
                     <div className="flex flex-col md:flex-row items-start justify-between gap-8 z-10">
                        <div className="flex flex-col gap-1">
                           <span className="font-headline text-[9px] tracking-widest opacity-40">
                              {order.order_id || order.order_code || 'N/A'} / {String(order.payment_method || 'Online')}
                           </span>
                           <h3 className="font-brand text-3xl tracking-widest">{getCustomerName(order)}</h3>
                           <p className="font-headline text-[10px] tracking-widest opacity-40 mt-1">PLACED ON: {formatDate(order.createdAt)}</p>
                           <p className="font-headline text-[10px] tracking-widest opacity-40 mt-1">EMAIL: {String(order.user_email || 'N/A')}</p>
                           <p className="font-headline text-[10px] tracking-widest opacity-40 mt-1">PHONE: {String(order.address?.phone1 || order.phone1 || 'N/A')}</p>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-3">
                           <span className="font-headline text-[10px] font-black tracking-[0.2em] opacity-40">Total</span>
                           <span className="font-brand text-3xl mt-1">
                              {currency}
                              {total.toFixed(2)}
                           </span>
                           <span className="font-headline text-[9px] tracking-widest opacity-40 mt-2">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                           </span>
                        </div>
                     </div>

                     <div className="flex flex-col min-w-[220px] z-10">
                        <span className="font-headline text-[10px] font-black tracking-[0.2em] text-primary">Status</span>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="material-symbols-outlined text-[12px]">{getStatusIcon(status)}</span>
                           <span className="font-headline text-xs font-bold tracking-widest">{formatStatusLabel(status)}</span>
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>

         {activeOrder && typeof document !== 'undefined' && createPortal(
            <div className="fixed inset-0 z-[220] flex items-center justify-center p-3 md:p-8">
               <button
                  type="button"
                  className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
                  onClick={() => setActiveOrderKey('')}
                  aria-label="Close order details modal"
               />

               <div className="relative z-10 w-full max-w-5xl max-h-[92vh] bg-surface border border-outline/15 overflow-hidden flex flex-col text-on-surface">
                  <div className="px-4 md:px-6 py-4 border-b border-outline/10 flex items-start justify-between gap-4">
                     <div className="min-w-0">
                        <p className="font-headline text-[9px] tracking-widest opacity-70">
                           {activeOrder.order_id || activeOrder.order_code || 'N/A'}
                        </p>
                        <h3 className="font-brand text-2xl md:text-4xl tracking-widest mt-1 break-words">{getCustomerName(activeOrder)}</h3>
                     </div>
                     <button
                        type="button"
                        onClick={() => setActiveOrderKey('')}
                        className="h-10 w-10 border border-primary/20 bg-[#ffffff] hover:border-[#b90c1b] flex items-center justify-center"
                        aria-label="Close order details"
                     >
                        <span className="material-symbols-outlined text-lg">close</span>
                     </button>
                  </div>

                  <div className="flex-1 overflow-y-auto overscroll-contain p-4 md:p-6 space-y-5 text-[#fcf8f8]" onWheel={(event) => event.stopPropagation()}>
                     <div className="border border-primary p-4 bg-[#ffffff]">
                        <p className="font-headline text-[10px] tracking-widest text-primary">Order Controls</p>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3">
                           <select
                              value={statusUpdate}
                              onChange={(event) => setStatusUpdate(event.target.value)}
                              className="w-full bg-[#ffffff] text-primary border border-primary px-3 py-3 font-headline text-[10px] tracking-widest focus:outline-none focus:border-[#b90c1b]"
                              aria-label="Update order status"
                           >
                              {['confirmed', 'processed', 'in_transit', 'delivered', 'rto', 'return', 'refund', 'cancelled'].map((status) => (
                                 <option key={status} value={status}>
                                    {formatStatusLabel(status)}
                                 </option>
                              ))}
                           </select>
                           <button
                              type="button"
                              onClick={async () => {
                                 if (!activeOrder) return;
                                 const orderId = getOrderKey(activeOrder);
                                 if (!orderId) return;
                                 setStatusBusy(true);
                                 setStatusMessage('');
                                 try {
                                    await updateAdminOrderStatus(orderId, statusUpdate);
                                    setStatusMessage('Status updated');
                                    await loadOrders();
                                 } catch (err) {
                                    setStatusMessage(err instanceof Error ? err.message : 'Status update failed');
                                 } finally {
                                    setStatusBusy(false);
                                 }
                              }}
                              disabled={statusBusy}
                              className="px-5 bg-[#ffffff] border border-primary font-headline text-[10px] text-primary tracking-widest hover:border-[#b90c1b] disabled:opacity-50"
                           >
                              {statusBusy ? 'Updating...' : 'Update Status'}
                           </button>
                        </div>
                        {statusMessage && (
                           <p className="font-headline text-[10px] tracking-widest opacity-70 mt-3">{statusMessage}</p>
                        )}
                     </div>

                     <div className="border border-primary p-4 bg-[#ffffff]">
                        <p className="font-headline text-[10px] tracking-widest text-primary">Shipping Address</p>
                        <p className="font-headline text-[10px] tracking-widest text-secondary opacity-90 mt-2 break-words">{formatAddress(activeOrder)}</p>
                        <p className="font-headline text-[10px] tracking-widest text-secondary opacity-80 mt-2">
                           Type: {String(activeOrder.address?.addressType || activeOrder.addressType || 'N/A')}
                        </p>
                     </div>

                     <div className="border border-primary p-4 bg-[#ffffff]">
                        <p className="font-headline text-[10px] tracking-widest text-primary">Payment Details</p>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                           <p className="font-headline text-[10px] tracking-widest text-secondary opacity-90 break-words">Method: {String(activeOrder.payment_method || 'N/A')}</p>
                           <p className="font-headline text-[10px] tracking-widest text-secondary opacity-90 break-words">Payment Status: {formatStatusLabel(String(activeOrder.payment_status || 'pending'))}</p>
                           <p className="font-headline text-[10px] tracking-widest text-secondary opacity-90 break-words">Order ID: {String(activeOrder.order_id || activeOrder.order_code || 'N/A')}</p>
                           <p className="font-headline text-[10px] tracking-widest text-secondary opacity-90 break-words">Transaction ID: {String(activeOrder.razorpay_payment_id || 'N/A')}</p>
                        </div>
                     </div>

                     <div className="border border-primary p-4 bg-[#ffffff]">
                        <p className="font-headline text-[10px] tracking-widest text-primary">Order Items</p>
                        <div className="mt-3 flex flex-col gap-3">
                           {activeOrder.items.map((item, index) => (
                              <div
                                 key={`${activeOrderKey}-${item.product_id}-${item.size || 'na'}-${item.color || 'na'}-${index}`}
                                 className="border border-primary text-secondary p-3 grid grid-cols-1 md:grid-cols-5 gap-2"
                              >
                                 <p className="font-headline text-[10px] text-secondary tracking-widest opacity-70 md:col-span-2 break-words">
                                    {String(item.product_name || `Product ${item.product_id || ''}`)}
                                 </p>
                                 <p className="font-headline text-[10px] tracking-widest text-secondary opacity-80">ID: {item.product_id}</p>
                                 <p className="font-headline text-[10px] tracking-widest text-secondary  opacity-80">Qty: {item.quantity}</p>
                                 <p className="font-headline text-[10px] tracking-widest text-secondary opacity-80">Price: {currency}{Number(item.price || 0).toFixed(2)}</p>
                                 <p className="font-headline text-[10px] tracking-widest text-secondary opacity-80 break-words">Color: {String(item.color || 'N/A')}</p>
                                 <p className="font-headline text-[10px] tracking-widest text-secondary opacity-80 break-words">Size: {String(item.size || 'N/A')}</p>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="border border-primary p-4 bg-[#ffffff]">
                        <p className="font-headline text-[10px] tracking-widest text-primary">Status Update History</p>
                        {(activeOrder.status_history || []).length === 0 ? (
                           <p className="font-headline text-[10px] tracking-widest text-primary opacity-80 mt-2">No status updates yet.</p>
                        ) : (
                           <div className="mt-3 flex flex-col gap-2 max-h-72 overflow-y-auto pr-1 overscroll-contain">
                              {(activeOrder.status_history || []).map((entry, index) => (
                                 <div key={`${activeOrderKey}-track-${index}`} className="border border-primary px-3 py-2">
                                    <p className="font-headline text-[10px] text-secondary tracking-widest opacity-95">{formatStatusLabel(entry.status)}</p>
                                    <p className="font-headline text-[9px] text-secondary tracking-widest opacity-80 mt-1 break-words">
                                       {String(entry.timestamp || 'N/A')}
                                    </p>
                                    {entry.activity ? (
                                       <p className="font-headline text-[9px] text-secondary tracking-widest opacity-80 mt-1 break-words">By: {entry.activity}</p>
                                    ) : null}
                                    {entry.location ? (
                                       <p className="font-headline text-[9px] text-secondary tracking-widest opacity-80 mt-1 break-words">Note: {entry.location}</p>
                                    ) : null}
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>,
            document.body,
         )}

         {/* Pagination / Footer Info */}
         <div className="mt-12 flex justify-center items-center gap-8 border-t border-primary pt-10 font-headline text-[10px] font-bold tracking-widest opacity-40">
            <button className="hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Top</button>
            <div className="flex gap-4">
               <span className="text-primary">LIVE</span>
               <span>{filteredAndSortedOrders.length} SHOWN</span>
            </div>
            <button className="hover:text-white transition-colors" onClick={loadOrders}>Reload</button>
         </div>
      </div>
   );
}
