'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchAdminCustomersOverview, fetchAdminOrders, type AdminOrder } from '@/app/lib/apiClient';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';

export default function AdminDashboard() {
   const [orders, setOrders] = useState<AdminOrder[]>([]);
   const [conversionRate, setConversionRate] = useState(0);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState('');
   const { settings } = useSiteSettings();
   const currency = settings.currencySymbol || '$';

   const getOrderAmount = (order: AdminOrder) => {
      const explicit = Number(order.amount || 0);
      if (Number.isFinite(explicit) && explicit > 0) return explicit;

      return (order.items || []).reduce((sum, item) => {
         const price = Number(item.price || 0);
         const qty = Number(item.quantity || 0);
         return sum + (Number.isFinite(price) ? price : 0) * (Number.isFinite(qty) ? qty : 0);
      }, 0);
   };

   const toStatus = (value: string) => String(value || '').trim().toLowerCase();

   const loadDashboard = async () => {
      try {
         setIsLoading(true);
         setError('');
         const [orderRows, customerOverview] = await Promise.all([
            fetchAdminOrders(),
            fetchAdminCustomersOverview(),
         ]);

         setOrders(orderRows);
         setConversionRate(Number(customerOverview.stats.conversionRate || 0));
      } catch (loadError) {
         setError(loadError instanceof Error ? loadError.message : 'Could not load dashboard metrics.');
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      loadDashboard();
   }, []);

   const stats = useMemo(() => {
      const totalRevenue = orders.reduce((sum, order) => sum + getOrderAmount(order), 0);
      const activeShipments = orders.filter((order) => {
         const status = toStatus(order.status || '');
         return ['pending', 'processing', 'verified', 'in transit', 'in_transit', 'shipped'].includes(status);
      }).length;

      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const recentOrders = orders.filter((order) => {
         if (!order.createdAt) return false;
         const ts = new Date(order.createdAt).getTime();
         return Number.isFinite(ts) && ts >= thirtyDaysAgo;
      }).length;

      return [
         { label: 'GROSS PERFORMANCE', value: `${currency}${totalRevenue.toFixed(2)}`, change: 'LIVE', color: '#b90c1b' },
         { label: 'ACTIVE SHIPMENTS', value: String(activeShipments), change: 'LIVE', color: '#ffffff' },
         { label: 'NEW EDITORIALS', value: String(recentOrders), change: 'LAST 30 DAYS', color: '#ffffff' },
         { label: 'CONVERSION RATE', value: `${conversionRate.toFixed(2)}%`, change: 'CUSTOMER BASE', color: '#b90c1b' },
      ];
   }, [orders, conversionRate, currency]);

   const activities = useMemo(() => {
      return orders.slice(0, 4).map((order) => {
         const status = String(order.status || 'pending').toUpperCase();
         const code = order.order_code || `ORDER-${order.order_id || 'N/A'}`;
         const timestamp = order.createdAt ? new Date(order.createdAt) : null;
         const timeText = timestamp && !Number.isNaN(timestamp.getTime())
            ? new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(timestamp)
            : '--:--';

         return {
            time: timeText,
            message: `${code} status: ${status}`,
         };
      });
   }, [orders]);

   return (
      <div className="flex flex-col gap-12">
         <header className="flex flex-col gap-2">
            <span className="font-headline text-[10px] md:text-sm uppercase tracking-[0.4em] text-[#b90c1b] font-black">SYSTEM OVERVIEW</span>
            <h2 className="font-brand text-5xl md:text-7xl lg:text-8xl uppercase leading-none tracking-tighter">Precision Performance Tracking / Q4 PHASE</h2>
         </header>

         {error && (
            <div className="border border-[#b90c1b]/30 bg-[#b90c1b]/10 px-4 py-3 flex items-center justify-between gap-4">
               <p className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b]">{error}</p>
               <button onClick={loadDashboard} className="font-headline text-[10px] uppercase tracking-widest underline underline-offset-4">Retry</button>
            </div>
         )}

         {isLoading && (
            <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-8 flex items-center gap-3">
               <span className="material-symbols-outlined animate-spin text-[#b90c1b]">progress_activity</span>
               <span className="font-headline text-[10px] uppercase tracking-widest opacity-60">Loading dashboard metrics...</span>
            </div>
         )}

         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
               <div key={idx} className="bg-[#1c1b1b] border border-[#ffffff]/10 p-8 flex flex-col justify-between group hover:border-[#b90c1b] transition-all">
                  <div className="flex justify-between items-start">
                     <span className="font-headline text-[10px] uppercase tracking-[0.2em] opacity-40">{stat.label}</span>
                     <span className="material-symbols-outlined text-[10px]" style={{ color: stat.color }}>trending_up</span>
                  </div>
                  <div className="mt-8">
                     <span className="font-brand text-4xl block leading-none">{stat.value}</span>
                     <span className="font-headline text-[9px] uppercase tracking-widest mt-2 block text-[#b90c1b]">{stat.change}</span>
                  </div>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
            {/* Sales Chart Placeholder */}
            <div className="lg:col-span-8 bg-[#1c1b1b] border border-[#ffffff]/10 p-10 flex flex-col justify-between min-h-[450px] relative overflow-hidden">
               <div className="flex justify-between items-center mb-10 border-b border-[#ffffff]/10 pb-6 relative z-10">
                  <h3 className="font-brand text-3xl uppercase tracking-widest">Sales Performance</h3>
                  <div className="flex gap-4 font-headline text-[9px] uppercase tracking-widest">
                     <span className="text-[#b90c1b]">Weekly</span>
                     <span className="opacity-40">Monthly</span>
                     <span className="opacity-40">Yearly</span>
                  </div>
               </div>

               {/* Brutalist "Graph" lines */}
               <div className="relative h-64 flex items-end gap-1 px-4 mb-4 z-10">
                  {[60, 80, 45, 90, 70, 85, 100, 65, 80, 55, 90, 75, 95, 85].map((h, i) => (
                     <div key={i} className="flex-1 bg-[#ffffff]/10 relative group border-t-2 border-[#b90c1b]/30">
                        <div className="absolute bottom-0 left-0 right-0 bg-[#b90c1b] transition-all duration-700" style={{ height: `${h}%` }}></div>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white text-[#1c1b1b] p-2 text-[8px] font-black z-20">
                           VAL: {h * 1234} // PT-{i}
                        </div>
                     </div>
                  ))}
               </div>

               <div className="flex justify-between items-center opacity-40 font-headline text-[8px] uppercase tracking-[0.4em] mt-auto z-10">
                  <span>01 OCT</span>
                  <span>08 OCT</span>
                  <span>15 OCT</span>
                  <span>22 OCT</span>
                  <span>29 OCT</span>
               </div>

               <div className="absolute inset-0 bg-[#1c1b1b] opacity-10 flex flex-col justify-between p-4 pointer-events-none">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <div key={i} className="h-[1px] w-full bg-[#ffffff]"></div>)}
               </div>
            </div>

            {/* Quick Actions / System Activity */}
            <div className="lg:col-span-4 flex flex-col gap-8">
               <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-10 flex flex-col gap-8">
                  <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-[#ffffff]/10 pb-6 text-[#b90c1b]">System Actions</h3>
                  <div className="flex flex-col gap-3">
                     <button className="w-full bg-[#ffffff] text-[#1c1b1b] py-6 font-brand text-xl uppercase hover:bg-[#b90c1b] hover:text-[#ffffff] transition-all flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined text-sm">add</span>
                        Upload Drop
                     </button>
                     <button className="w-full border-2 border-[#ffffff]/10 bg-transparent text-white py-6 font-brand text-xl uppercase hover:border-[#ffffff] transition-all flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined text-sm">broadcast_on_personal</span>
                        Broadcast Drop
                     </button>
                  </div>
               </div>

               <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-10 flex flex-col gap-6 flex-1">
                  <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-[#ffffff]/10 pb-6">Recent Activity</h3>
                  <div className="flex flex-col gap-4 font-headline text-[10px] uppercase tracking-widest opacity-60">
                     {activities.map((act, i) => (
                        <div key={i} className="flex gap-4 items-start border-b border-[#ffffff]/5 pb-4 last:border-none">
                           <span className="opacity-40 whitespace-nowrap">{act.time}</span>
                           <span className="border-l-2 border-[#b90c1b] pl-4">{act.message}</span>
                        </div>
                     ))}
                     <a href="#" className="font-headline font-black text-[9px] text-[#b90c1b] tracking-[0.2em] block text-center mt-6 hover:opacity-80 transition-opacity">View All Records</a>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
