'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchAdminOrders, type AdminOrder, updateAdminOrderStatus } from '@/app/lib/apiClient';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';

type OrderTab = 'all' | 'active' | 'resolved';

const statusOptions = [
   'pending',
   'processing',
   'verified',
   'in transit',
   'delivered',
   'cancelled',
   'returned',
];

const activeStatuses = new Set(['pending', 'processing', 'verified', 'in transit', 'in_transit', 'shipped']);
const resolvedStatuses = new Set(['delivered', 'cancelled', 'returned', 'refunded']);

const normalizeStatus = (status: string) => status.trim().toLowerCase();

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
   if (order.order_code) return order.order_code;
   if (order.order_id) return String(order.order_id);
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
   }).format(date).toUpperCase();
};

const getCustomerName = (order: AdminOrder) => {
   const name = String(order.FullName || '').trim();
   if (name) return name.toUpperCase();

   const email = String(order.user_email || '').trim();
   if (!email) return 'GUEST USER';

   return email
      .split('@')[0]
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .trim()
      .toUpperCase() || 'GUEST USER';
};

const getOrderTotal = (order: AdminOrder) => {
   const explicit = Number(order.amount || 0);
   if (Number.isFinite(explicit) && explicit > 0) return explicit;

   return (order.items || []).reduce((sum, item) => {
      const price = Number(item.price || 0);
      const qty = Number(item.quantity || 0);
      return sum + (Number.isFinite(price) ? price : 0) * (Number.isFinite(qty) ? qty : 0);
   }, 0);
};

const getStatusIcon = (status: string) => {
   const normalized = normalizeStatus(status);
   if (normalized === 'delivered') return 'check_circle';
   if (normalized === 'cancelled' || normalized === 'returned') return 'cancel';
   if (normalized === 'processing' || normalized === 'verified') return 'inventory_2';
   return 'local_shipping';
};

export default function OrdersManagement() {
   const [orders, setOrders] = useState<AdminOrder[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState('');
   const [query, setQuery] = useState('');
   const [activeTab, setActiveTab] = useState<OrderTab>('all');
   const [updatingKey, setUpdatingKey] = useState('');
   const [notice, setNotice] = useState('');
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
            if (activeStatuses.has(status)) acc.active += 1;
            if (resolvedStatuses.has(status)) acc.resolved += 1;
            return acc;
         },
         { all: 0, active: 0, resolved: 0 },
      );
   }, [orders]);

   const filteredOrders = useMemo(() => {
      const term = query.trim().toLowerCase();
      return orders.filter((order) => {
         const status = normalizeStatus(order.status || '');
         const matchesTab =
            activeTab === 'all' ||
            (activeTab === 'active' ? activeStatuses.has(status) : resolvedStatuses.has(status));

         if (!matchesTab) return false;
         if (!term) return true;

         const key = getOrderKey(order).toLowerCase();
         const customer = getCustomerName(order).toLowerCase();
         const email = String(order.user_email || '').toLowerCase();
         return key.includes(term) || customer.includes(term) || email.includes(term);
      });
   }, [orders, activeTab, query]);

   const updateStatus = async (order: AdminOrder, nextStatus: string) => {
      const orderKey = getOrderKey(order);
      if (!orderKey) {
         setNotice('Order identifier missing for this entry.');
         return;
      }

      const normalizedNext = normalizeStatus(nextStatus);
      const normalizedCurrent = normalizeStatus(order.status || '');
      if (normalizedCurrent === normalizedNext) return;

      try {
         setUpdatingKey(orderKey);
         setError('');
         await updateAdminOrderStatus(orderKey, normalizedNext);
         setOrders((prev) =>
            prev.map((entry) =>
               getOrderKey(entry) === orderKey ? { ...entry, status: normalizedNext } : entry,
            ),
         );
         setNotice(`Status updated: ${orderKey} -> ${formatStatusLabel(normalizedNext)}`);
         window.setTimeout(() => setNotice(''), 2200);
      } catch (statusError) {
         setError(statusError instanceof Error ? statusError.message : 'Could not update order status.');
      } finally {
         setUpdatingKey('');
      }
   };

   return (
      <div className="flex flex-col gap-12">
         <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="flex flex-col gap-2">
               <span className="font-headline text-[10px] md:text-sm uppercase tracking-[0.4em] text-[#b90c1b] font-black">LOGISTICS HUB</span>
               <h2 className="font-brand text-5xl md:text-7xl uppercase leading-none tracking-tighter">Editorial Fulfillment</h2>
            </div>
            <div className="flex flex-col md:items-end gap-4 w-full md:w-auto">
               <div className="flex bg-[#1c1b1b] border border-[#ffffff]/10 p-2 gap-2 w-full md:w-auto overflow-x-auto">
                  <button
                     onClick={() => setActiveTab('all')}
                     className={`px-6 py-3 font-headline text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'all'
                           ? 'bg-[#ffffff] text-[#1c1b1b]'
                           : 'opacity-40 hover:opacity-100'
                        }`}
                  >
                     All Orders ({counts.all})
                  </button>
                  <button
                     onClick={() => setActiveTab('active')}
                     className={`px-6 py-3 font-headline text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'active'
                           ? 'bg-[#ffffff] text-[#1c1b1b]'
                           : 'opacity-40 hover:opacity-100'
                        }`}
                  >
                     Active ({counts.active})
                  </button>
                  <button
                     onClick={() => setActiveTab('resolved')}
                     className={`px-6 py-3 font-headline text-[10px] uppercase font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'resolved'
                           ? 'bg-[#ffffff] text-[#1c1b1b]'
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
                     className="w-full md:w-80 bg-[#1c1b1b] border border-[#ffffff]/10 px-4 py-3 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b]"
                  />
                  <button
                     onClick={loadOrders}
                     className="px-5 bg-[#1c1b1b] border border-[#ffffff]/10 font-headline text-[10px] uppercase tracking-widest hover:border-[#b90c1b]"
                  >
                     Refresh
                  </button>
               </div>
            </div>
         </header>

         {notice && (
            <div className="border border-[#b90c1b]/20 bg-[#b90c1b]/10 px-4 py-3 font-headline text-[10px] uppercase tracking-widest text-[#b90c1b]">
               {notice}
            </div>
         )}

         {error && (
            <div className="border border-[#b90c1b]/30 bg-[#b90c1b]/10 px-4 py-3 flex items-center justify-between gap-4">
               <p className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b]">{error}</p>
               <button onClick={loadOrders} className="font-headline text-[10px] uppercase tracking-widest underline underline-offset-4">Retry</button>
            </div>
         )}

         {isLoading && (
            <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-10 flex items-center gap-3">
               <span className="material-symbols-outlined animate-spin text-[#b90c1b]">progress_activity</span>
               <span className="font-headline text-[10px] uppercase tracking-widest opacity-60">Loading orders...</span>
            </div>
         )}

         {/* Orders List */}
         <div className="flex flex-col gap-4">
            {!isLoading && filteredOrders.length === 0 && (
               <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-12 text-center">
                  <p className="font-brand text-4xl uppercase tracking-widest opacity-30">No orders found</p>
               </div>
            )}

            {filteredOrders.map((order) => {
               const orderKey = getOrderKey(order) || `${order.user_email || 'guest'}-${order.createdAt || ''}-${order.status || 'pending'}`;
               const status = normalizeStatus(order.status || 'pending');
               const isUpdating = updatingKey === orderKey;
               const total = getOrderTotal(order);
               const rowStatusOptions = statusOptions.includes(status) ? statusOptions : [status, ...statusOptions];

               return (
                  <div key={orderKey} className="bg-[#1c1b1b] border border-[#ffffff]/10 p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-[#b90c1b] transition-all relative overflow-hidden">
                     <div className="flex flex-col gap-1 z-10">
                        <span className="font-headline text-[9px] uppercase tracking-widest opacity-40">
                           {order.order_code || `ORDER-${order.order_id || 'N/A'}`} / {String(order.payment_method || 'ONLINE').toUpperCase()}
                        </span>
                        <h3 className="font-brand text-3xl uppercase tracking-widest">{getCustomerName(order)}</h3>
                        <p className="font-headline text-[10px] uppercase tracking-widest opacity-40 mt-1">PLACED ON: {formatDate(order.createdAt)}</p>
                     </div>

                     <div className="flex flex-col md:flex-row items-start md:items-center gap-8 z-10 w-full md:w-auto justify-between md:justify-end">
                        <div className="flex flex-col min-w-[180px]">
                           <span className="font-headline text-[10px] font-black tracking-[0.2em] text-[#b90c1b] uppercase">Status</span>
                           <div className="flex items-center gap-2 mt-2">
                              <span className="material-symbols-outlined text-[12px]">{getStatusIcon(status)}</span>
                              <span className="font-headline text-xs font-bold uppercase tracking-widest">{formatStatusLabel(status)}</span>
                           </div>
                           <select
                              value={status}
                              disabled={isUpdating}
                              onChange={(event) => updateStatus(order, event.target.value)}
                              className="mt-3 bg-[#0f0f0f] border border-[#ffffff]/15 px-3 py-2 font-headline text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#b90c1b] disabled:opacity-50"
                           >
                              {rowStatusOptions.map((option) => (
                                 <option key={option} value={option}>
                                    {formatStatusLabel(option)}
                                 </option>
                              ))}
                           </select>
                        </div>
                        <div className="flex flex-col">
                           <span className="font-headline text-[10px] font-black tracking-[0.2em] opacity-40 uppercase">Total</span>
                           <span className="font-brand text-3xl mt-1">
                              {currency}
                              {total.toFixed(2)}
                           </span>
                           <span className="font-headline text-[9px] uppercase tracking-widest opacity-40 mt-2">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                           </span>
                        </div>
                     </div>

                     <span className="absolute -right-4 -bottom-10 font-brand text-[200px] opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                        {(order.order_code || String(order.order_id || '')).split('-').pop()}
                     </span>
                  </div>
               );
            })}
         </div>

         {/* Pagination / Footer Info */}
         <div className="mt-12 flex justify-center items-center gap-8 border-t border-[#ffffff]/10 pt-10 font-headline text-[10px] font-bold uppercase tracking-widest opacity-40">
            <button className="hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Top</button>
            <div className="flex gap-4">
               <span className="text-[#b90c1b]">LIVE</span>
               <span>{filteredOrders.length} SHOWN</span>
            </div>
            <button className="hover:text-white transition-colors" onClick={loadOrders}>Reload</button>
         </div>
      </div>
   );
}