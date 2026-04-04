'use client';

import Link from 'next/link';
import Comp7 from '@/app/components/Comp7';

const orders = [
  { id: 'k-99214', ref: 'ORD-KNTC-92841', name: 'TECH-SHELL V3 & ACCESSORIES', date: 'OCT 24, 2024', status: 'IN TRANSIT', statusIcon: 'local_shipping', statusColor: 'text-[#b90c1b]', total: '$485.00', hasCTA: true },
  { id: 'k-88210', ref: 'ORD-KNTC-88210', name: 'RACING TRACK SUIT NOIR', date: 'SEP 12, 2024', status: 'DELIVERED', statusIcon: 'check_circle', statusColor: 'text-green-600', total: '$220.00', hasCTA: false },
  { id: 'k-85002', ref: 'ORD-KNTC-85002', name: 'EDITORIAL DROP 004 ACCESSORIES', date: 'AUG 05, 2024', status: 'PROCESSING', statusIcon: 'inventory_2', statusColor: 'text-amber-500', total: '$145.00', hasCTA: false },
];

export default function OrderHistoryComp() {
  return (
    <main className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
      <div className="pt-8 pb-20 px-4 md:px-8 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-8 border-b-4 border-[#1c1b1b] pb-10">
          <div>
            {/* <span className="font-headline text-[10px] uppercase tracking-[0.4em] text-[#b90c1b] font-black">Account History</span> */}
            <h1 className="font-brand text-6xl md:text-8xl uppercase tracking-tighter mt-2">Order<br />History</h1>
            <p className="mt-4 font-headline text-sm uppercase tracking-wider opacity-60 max-w-md">Tracking your kinetic gear drops and editorial shipments.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/user/orders/${order.id}`}
              className="group bg-[#fcf8f8] border border-[#1c1b1b]/10 border-l-4 border-l-transparent hover:border-l-[#b90c1b] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:bg-[#f6f3f2] hover:shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <span className="font-headline text-[9px] font-bold tracking-wider opacity-40 uppercase">{order.ref}</span>
                <h3 className="font-brand text-2xl md:text-3xl uppercase group-hover:text-[#b90c1b] transition-colors">{order.name}</h3>
                <p className="font-headline text-xs uppercase tracking-wide opacity-40 mt-1">Placed: {order.date}</p>
              </div>
              <div className="flex flex-wrap items-center gap-8 md:gap-12 w-full md:w-auto">
                <div className="flex flex-col gap-1">
                  <span className="font-headline text-[9px] font-black tracking-widest text-[#b90c1b] uppercase">Status</span>
                  <div className={`flex items-center gap-2 ${order.statusColor}`}>
                    <span className="material-symbols-outlined text-base">{order.statusIcon}</span>
                    <span className="font-headline text-sm font-bold uppercase tracking-widest">{order.status}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-headline text-[9px] font-black tracking-widest opacity-40 uppercase">Total</span>
                  <span className="font-brand text-2xl">{order.total}</span>
                </div>
                <div className="flex items-center gap-2 font-brand text-xl text-[#b90c1b] group-hover:gap-4 transition-all">
                  VIEW
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Early access promo */}
        <div className="mt-16 bg-[#1c1b1b] p-12 md:p-16 text-[#fcf8f8] flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-headline text-[10px] font-black tracking-[0.3em] uppercase text-[#b90c1b]">Exclusive Access</span>
            <h2 className="font-brand text-5xl md:text-6xl uppercase mt-3">Early Access<br />to Drop 005</h2>
            <p className="font-headline text-sm uppercase tracking-widest opacity-50 mt-4 max-w-sm">Loyal customers get 24-hour early access to our winter technical collection.</p>
          </div>
          <button className="flex-shrink-0 cursor-pointer bg-[#fcf8f8] text-[#1c1b1b] font-brand text-xl px-10 py-4 hover:bg-[#b90c1b] hover:text-white transition-all active:scale-95">Join Waitlist</button>
        </div>
      </div>
      <Comp7 />
    </main>
  );
}
