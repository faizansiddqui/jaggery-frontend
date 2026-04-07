'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchAdminAnalyticsOverview, type AdminAnalyticsOverview } from '@/app/lib/apiClient';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const formatTrend = (value: number) => {
   const safe = Number(value || 0);
   const sign = safe > 0 ? '+' : safe < 0 ? '' : '';
   return `${sign}${safe.toFixed(2)}%`;
};

const trendClass = (value: number, reversed = false) => {
   const safe = Number(value || 0);
   const positive = reversed ? safe < 0 : safe >= 0;
   return positive ? 'text-green-500' : 'text-red-500';
};

export default function AdminAnalytics() {
   const { settings } = useSiteSettings();
   const currency = settings.currencySymbol || '$';

   const [data, setData] = useState<AdminAnalyticsOverview | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState('');

   const load = async () => {
      try {
         setIsLoading(true);
         setError('');
         const overview = await fetchAdminAnalyticsOverview(30);
         setData(overview);
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Could not load analytics overview');
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      load();
   }, []);

   const metrics = useMemo(() => {
      const m = data?.metrics;
      if (!m) {
         return [
            { label: 'AVERAGE ORDER VALUE', val: `${currency}0.00`, trend: '+0.00%', reversed: false },
            { label: 'CUSTOMER LTV', val: `${currency}0.00`, trend: '+0.00%', reversed: false },
            { label: 'REPURCHASE RATE', val: '0.00%', trend: '+0.00%', reversed: false },
            { label: 'CART ABANDONMENT', val: '0.00%', trend: '+0.00%', reversed: true },
         ];
      }

      return [
         {
            label: 'AVERAGE ORDER VALUE',
            val: `${currency}${Number(m.averageOrderValue || 0).toFixed(2)}`,
            trend: formatTrend(m.averageOrderValueTrend),
            trendValue: m.averageOrderValueTrend,
            reversed: false,
         },
         {
            label: 'CUSTOMER LTV',
            val: `${currency}${Number(m.customerLtv || 0).toFixed(2)}`,
            trend: formatTrend(m.customerLtvTrend),
            trendValue: m.customerLtvTrend,
            reversed: false,
         },
         {
            label: 'REPURCHASE RATE',
            val: `${Number(m.repurchaseRate || 0).toFixed(2)}%`,
            trend: formatTrend(m.repurchaseRateTrend),
            trendValue: m.repurchaseRateTrend,
            reversed: false,
         },
         {
            label: 'CART ABANDONMENT',
            val: `${Number(m.cartAbandonment || 0).toFixed(2)}%`,
            trend: formatTrend(m.cartAbandonmentTrend),
            trendValue: m.cartAbandonmentTrend,
            reversed: true,
         },
      ];
   }, [data, currency]);

   const regionalRows = useMemo(() => {
      const rows = Array.isArray(data?.regional) ? data.regional : [];
      return rows.length
         ? rows
         : [{ region: 'UNKNOWN / GLOBAL', currentRevenue: 0, previousRevenue: 0, growthPercent: 0 }];
   }, [data]);

   const maxRegionalGrowth = useMemo(() => {
      const max = regionalRows.reduce((acc, row) => Math.max(acc, Number(row.growthPercent || 0)), 0);
      return max > 0 ? max : 1;
   }, [regionalRows]);

   const performanceIndex = clamp(Number(data?.performanceIndex || 0));
   const topProducts = data?.topProducts || {
      mostAddedToCart: [],
      mostWishlisted: [],
      mostOrdered: [],
      bestSelling: [],
   };

   const productBlocks = [
      { title: 'MOST ADDED IN CART', rows: topProducts.mostAddedToCart },
      { title: 'MOST WISHLISTED', rows: topProducts.mostWishlisted },
      { title: 'MOST ORDERED', rows: topProducts.mostOrdered },
      { title: 'BEST SELLING', rows: topProducts.bestSelling },
   ];

   return (
      <div className="flex flex-col gap-12">
         <header className="flex flex-col gap-2">
            <span className="font-headline text-[10px] md:text-sm uppercase tracking-[0.4em] text-[#b90c1b] font-black">PERFORMANCE ANALYTICS</span>
            <h2 className="font-brand text-5xl md:text-7xl uppercase leading-none tracking-tighter">Kinetic Insight / Q4</h2>
         </header>

         {error && (
            <div className="border border-[#b90c1b]/30 bg-[#b90c1b]/10 px-4 py-3 flex items-center justify-between gap-4">
               <p className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b]">{error}</p>
               <button onClick={load} className="font-headline text-[10px] uppercase tracking-widest underline underline-offset-4">Retry</button>
            </div>
         )}

         {isLoading && (
            <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-8 flex items-center gap-3">
               <span className="material-symbols-outlined animate-spin text-[#b90c1b]">progress_activity</span>
               <span className="font-headline text-[10px] uppercase tracking-widest opacity-60">Loading analytics metrics...</span>
            </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((m, i) => (
               <div key={i} className="bg-[#1c1b1b] border border-[#ffffff]/10 p-10 flex flex-col items-center text-center group hover:bg-[#b90c1b] transition-all">
                  <span className="font-headline text-[10px] uppercase tracking-[0.2em] font-black opacity-40 group-hover:text-white group-hover:opacity-100">{m.label}</span>
                  <span className="font-brand text-5xl mt-6 group-hover:text-white transition-all">{m.val}</span>
                  <span className={`font-headline text-[10px] mt-4 uppercase tracking-widest ${trendClass(Number((m as { trendValue?: number }).trendValue || 0), Boolean((m as { reversed?: boolean }).reversed))} group-hover:text-white`}>
                     {m.trend} TRENDING
                  </span>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-12">
               <h3 className="font-brand text-4xl uppercase tracking-widest border-b border-[#ffffff]/10 pb-8 mb-10">Regional Performance</h3>
               <div className="flex flex-col gap-8 opacity-60">
                  {regionalRows.map((r, i) => {
                     const growth = Number(r.growthPercent || 0);
                     const barWidth = Math.max(4, Math.round((Math.max(0, growth) / maxRegionalGrowth) * 100));
                     return (
                        <div key={`${r.region}-${i}`} className="flex flex-col gap-2">
                           <div className="flex justify-between font-headline text-[10px] uppercase tracking-widest">
                              <span>{r.region}</span>
                              <span>{formatTrend(growth)} GROWTH</span>
                           </div>
                           <div className="h-1 w-full bg-[#ffffff]/5">
                              <div className="h-full transition-all duration-1000" style={{ width: `${barWidth}%`, backgroundColor: i === 0 ? '#b90c1b' : '#ffffff' }}></div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>

            <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-12 flex flex-col justify-center items-center text-center">
               <div className="relative w-64 h-64 flex items-center justify-center">
                  <div className="absolute inset-0 border-[16px] border-[#ffffff]/5 rounded-full"></div>
                  <div
                     className="absolute inset-0 rounded-full"
                     style={{
                        background: `conic-gradient(#b90c1b ${performanceIndex * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                        mask: 'radial-gradient(circle at center, transparent 62%, black 63%)',
                        WebkitMask: 'radial-gradient(circle at center, transparent 62%, black 63%)',
                     }}
                  ></div>
                  <div className="flex flex-col items-center">
                     <span className="font-brand text-6xl">{performanceIndex.toFixed(0)}%</span>
                     <span className="font-headline text-[10px] uppercase tracking-widest opacity-40">Target Met</span>
                  </div>
               </div>
               <p className="mt-12 font-headline text-[10px] uppercase tracking-widest opacity-40 px-12 leading-relaxed">
                  {data?.notes || 'Global performance analytics unavailable. Awaiting live telemetry sync.'}
               </p>
            </div>
         </div>

         <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-8 md:p-10">
            <h3 className="font-brand text-4xl uppercase tracking-widest border-b border-[#ffffff]/10 pb-6 mb-8">Product Intelligence</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
               {productBlocks.map((block) => (
                  <section key={block.title} className="border border-[#ffffff]/10 bg-[#ffffff]/5 p-5">
                     <h4 className="font-headline text-[10px] uppercase tracking-[0.25em] opacity-70 mb-4">{block.title}</h4>
                     {block.rows.length ? (
                        <div className="space-y-3">
                           {block.rows.map((item, idx) => (
                              <div key={`${block.title}-${item.productId}-${idx}`} className="flex items-center gap-3 border-b border-[#ffffff]/5 pb-3 last:border-none last:pb-0">
                                 <div className="w-10 h-12 bg-[#ffffff]/10 overflow-hidden flex-shrink-0">
                                    {item.productImage ? (
                                       <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                    ) : (
                                       <div className="w-full h-full flex items-center justify-center font-headline text-[9px] opacity-50">N/A</div>
                                    )}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="font-headline text-[10px] uppercase tracking-widest truncate">{item.productName}</p>
                                    <p className="font-headline text-[9px] uppercase tracking-[0.2em] opacity-40">ID {item.productId}</p>
                                 </div>
                                 <span className="font-brand text-2xl whitespace-nowrap">
                                    {block.title === 'BEST SELLING' ? `${currency}${item.metric.toFixed(2)}` : `${item.metric.toFixed(0)}`}
                                 </span>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <p className="font-headline text-[10px] uppercase tracking-widest opacity-40">No data available</p>
                     )}
                  </section>
               ))}
            </div>
         </div>
      </div>
   );
}
