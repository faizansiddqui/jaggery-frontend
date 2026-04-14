'use client';

import { useEffect, useMemo, useState } from 'react';
import {
   fetchAdminCustomersOverview,
   fetchAdminOrders,
   fetchAdminProductsLite,
   type AdminOrder,
   type AdminProductLite,
} from '@/app/lib/apiClient';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';

type TrendRange = 'weekly' | 'monthly' | 'yearly';

type ChartPoint = {
   label: string;
   key: string;
   value: number;
};

const toStatus = (value: string) => String(value || '').trim().toLowerCase();

const toDate = (value?: string) => {
   if (!value) return null;
   const d = new Date(value);
   return Number.isNaN(d.getTime()) ? null : d;
};

const formatKeyDay = (date: Date) => {
   const y = date.getFullYear();
   const m = String(date.getMonth() + 1).padStart(2, '0');
   const d = String(date.getDate()).padStart(2, '0');
   return `${y}-${m}-${d}`;
};

const formatKeyMonth = (date: Date) => {
   const y = date.getFullYear();
   const m = String(date.getMonth() + 1).padStart(2, '0');
   return `${y}-${m}`;
};

const normalizeOrderAmount = (order: AdminOrder) => {
   const explicit = Number(order.amount || 0);
   const itemsTotal = (order.items || []).reduce((sum, item) => {
      const price = Number(item.price || 0);
      const qty = Number(item.quantity || 0);
      return sum + (Number.isFinite(price) ? price : 0) * (Number.isFinite(qty) ? qty : 0);
   }, 0);

   if (explicit > 0) {
      if (itemsTotal > 0 && explicit > itemsTotal * 5) return explicit / 100;
      if (itemsTotal <= 0 && explicit >= 100) return explicit / 100;
      return explicit;
   }

   return itemsTotal;
};

const buildChartPoints = (orders: AdminOrder[], range: TrendRange): ChartPoint[] => {
   const now = new Date();

   if (range === 'weekly') {
      const points: ChartPoint[] = [];
      const seed = new Map<string, number>();

      for (let i = 13; i >= 0; i -= 1) {
         const d = new Date(now);
         d.setHours(0, 0, 0, 0);
         d.setDate(now.getDate() - i);
         const key = formatKeyDay(d);
         const label = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short' }).format(d).toUpperCase();
         points.push({ label, key, value: 0 });
         seed.set(key, 0);
      }

      for (const order of orders) {
         const date = toDate(order.createdAt);
         if (!date) continue;
         const key = formatKeyDay(date);
         if (!seed.has(key)) continue;
         seed.set(key, (seed.get(key) || 0) + normalizeOrderAmount(order));
      }

      return points.map((point) => ({ ...point, value: Number(seed.get(point.key) || 0) }));
   }

   if (range === 'monthly') {
      const points: ChartPoint[] = [];
      const seed = new Map<string, number>();

      for (let i = 11; i >= 0; i -= 1) {
         const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
         const key = formatKeyMonth(d);
         const label = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d).toUpperCase();
         points.push({ label, key, value: 0 });
         seed.set(key, 0);
      }

      for (const order of orders) {
         const date = toDate(order.createdAt);
         if (!date) continue;
         const key = formatKeyMonth(date);
         if (!seed.has(key)) continue;
         seed.set(key, (seed.get(key) || 0) + normalizeOrderAmount(order));
      }

      return points.map((point) => ({ ...point, value: Number(seed.get(point.key) || 0) }));
   }

   const points: ChartPoint[] = [];
   const seed = new Map<string, number>();
   for (let i = 4; i >= 0; i -= 1) {
      const year = String(now.getFullYear() - i);
      points.push({ label: year, key: year, value: 0 });
      seed.set(year, 0);
   }

   for (const order of orders) {
      const date = toDate(order.createdAt);
      if (!date) continue;
      const key = String(date.getFullYear());
      if (!seed.has(key)) continue;
      seed.set(key, (seed.get(key) || 0) + normalizeOrderAmount(order));
   }

   return points.map((point) => ({ ...point, value: Number(seed.get(point.key) || 0) }));
};

export default function AdminDashboard() {
   const [orders, setOrders] = useState<AdminOrder[]>([]);
   const [products, setProducts] = useState<AdminProductLite[]>([]);
   const [conversionRate, setConversionRate] = useState(0);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState('');
   const [range, setRange] = useState<TrendRange>('weekly');
   const { settings } = useSiteSettings();
   const currency = settings.currencySymbol || '$';

   const loadDashboard = async () => {
      try {
         setIsLoading(true);
         setError('');
         const [orderRows, customerOverview, productRows] = await Promise.all([
            fetchAdminOrders(),
            fetchAdminCustomersOverview(),
            fetchAdminProductsLite(),
         ]);

         setOrders(orderRows);
         setProducts(productRows);
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
      const totalRevenue = orders.reduce((sum, order) => sum + normalizeOrderAmount(order), 0);
      const activeShipments = orders.filter((order) => {
         const status = toStatus(order.status || '');
         return ['pending', 'processing', 'verified', 'in transit', 'in_transit', 'shipped'].includes(status);
      }).length;

      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const recentEditorials = products.filter((product) => {
         const ts = toDate(product.createdAt)?.getTime();
         return typeof ts === 'number' && Number.isFinite(ts) && ts >= thirtyDaysAgo;
      }).length;

      return [
         { label: 'GROSS PERFORMANCE', value: `${currency}${totalRevenue.toFixed(2)}`, change: 'LIVE', color: '#b90c1b' },
         { label: 'ACTIVE SHIPMENTS', value: String(activeShipments), change: 'LIVE', color: '#ffffff' },
         { label: 'NEW EDITORIALS', value: String(recentEditorials), change: 'LAST 30 DAYS', color: '#ffffff' },
         { label: 'CONVERSION RATE', value: `${conversionRate.toFixed(2)}%`, change: 'CUSTOMER BASE', color: '#b90c1b' },
      ];
   }, [orders, products, conversionRate, currency]);

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

   const chartPoints = useMemo(() => buildChartPoints(orders, range), [orders, range]);

   const maxChartValue = useMemo(() => {
      const max = chartPoints.reduce((acc, point) => Math.max(acc, point.value), 0);
      return max > 0 ? max : 1;
   }, [chartPoints]);

   const labelIndices = useMemo(() => {
      if (!chartPoints.length) return [] as number[];
      if (chartPoints.length <= 5) return chartPoints.map((_, idx) => idx);
      return [0, Math.floor(chartPoints.length * 0.25), Math.floor(chartPoints.length * 0.5), Math.floor(chartPoints.length * 0.75), chartPoints.length - 1];
   }, [chartPoints]);

   return (
      <div className="flex flex-col gap-12">
         <header className="flex flex-col gap-2">
            <span className="font-headline text-[10px] md:text-sm uppercase tracking-[0.4em] text-primary font-black">SYSTEM OVERVIEW</span>
            <h2 className="font-brand text-5xl md:text-7xl lg:text-8xl uppercase leading-none tracking-tighter">Dashboard</h2>
         </header>

         {error && (
            <div className="border border-primary/30 bg-primary/10 px-4 py-3 flex items-center justify-between gap-4">
               <p className="font-headline text-[10px] uppercase tracking-widest text-primary">{error}</p>
               <button onClick={loadDashboard} className="font-headline text-[10px] uppercase tracking-widest underline underline-offset-4">Retry</button>
            </div>
         )}

         {isLoading && (
            <div className="bg-surface border border-outline/10 p-8 flex items-center gap-3">
               <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
               <span className="font-headline text-[10px] uppercase tracking-widest opacity-60">Loading dashboard metrics...</span>
            </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
               <div key={idx} className="bg-surface border border-outline/10 p-8 flex flex-col justify-between group hover:border-primary transition-all">
                  <div className="flex justify-between items-start">
                     <span className="font-headline text-[10px] uppercase tracking-[0.2em] opacity-40">{stat.label}</span>
                     <span className="material-symbols-outlined text-[10px]" style={{ color: stat.color }}>trending_up</span>
                  </div>
                  <div className="mt-8">
                     <span className="font-brand text-4xl block leading-none">{stat.value}</span>
                     <span className="font-headline text-[9px] uppercase tracking-widest mt-2 block text-primary">{stat.change}</span>
                  </div>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
            <div className="lg:col-span-8 bg-surface border border-outline/10 p-10 flex flex-col justify-between min-h-[450px] relative overflow-hidden">
               <div className="flex justify-between items-center mb-10 border-b border-outline/10 pb-6 relative z-10">
                  <h3 className="font-brand text-3xl uppercase tracking-widest">Sales Performance</h3>
                  <div className="flex gap-4 font-headline text-[9px] uppercase tracking-widest">
                     {(['weekly', 'monthly', 'yearly'] as TrendRange[]).map((option) => (
                        <button
                           key={option}
                           onClick={() => setRange(option)}
                           className={range === option ? 'text-primary' : 'opacity-40 hover:opacity-80'}
                        >
                           {option}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="relative h-64 flex items-end gap-1 px-4 mb-4 z-10">
                  {chartPoints.map((point, i) => {
                     const h = point.value <= 0 ? 2 : Math.max(6, Math.round((point.value / maxChartValue) * 100));
                     return (
                        <div key={point.key} className="flex-1 bg-on-surface/10 relative group border-t-2 border-primary/30">
                           <div className="absolute bottom-0 left-0 right-0 bg-primary transition-all duration-700" style={{ height: `${h}%` }}></div>
                           <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white text-on-primary p-2 text-[8px] font-black z-20">
                              VAL: {Math.round(point.value)} // PT-{i}
                           </div>
                        </div>
                     );
                  })}
               </div>

               <div className="flex justify-between items-center opacity-40 font-headline text-[8px] uppercase tracking-[0.4em] mt-auto z-10">
                  {labelIndices.map((index) => (
                     <span key={chartPoints[index]?.key || index}>{chartPoints[index]?.label || '--'}</span>
                  ))}
               </div>

               <div className="absolute inset-0 bg-surface opacity-10 flex flex-col justify-between p-4 pointer-events-none">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <div key={i} className="h-[1px] w-full bg-on-surface"></div>)}
               </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-8">
               <div className="bg-surface border border-outline/10 p-10 flex flex-col gap-6 flex-1">
                  <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-[#ffffff]/10 pb-6">Recent Activity</h3>
                  <div className="flex flex-col gap-4 font-headline text-[10px] uppercase tracking-widest opacity-60">
                     {activities.length ? activities.map((act, i) => (
                        <div key={i} className="flex gap-4 items-start border-b border-[#ffffff]/5 pb-4 last:border-none">
                           <span className="opacity-40 whitespace-nowrap">{act.time}</span>
                           <span className="border-l-2 border-[#b90c1b] pl-4">{act.message}</span>
                        </div>
                     )) : (
                        <p className="opacity-40">No recent order activity</p>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
