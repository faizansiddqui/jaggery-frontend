'use client';

const orders = [
  { id: 'ORD-KNTC-92841', customer: 'MARCUS VANE', date: 'OCT 24, 2024', total: '$485.00', status: 'In Transit', type: 'EDITORIAL' },
  { id: 'ORD-KNTC-88210', customer: 'ELARA STERLING', date: 'SEP 12, 2024', total: '$220.00', status: 'Delivered', type: 'STANDARD' },
  { id: 'ORD-KNTC-85002', customer: 'JAXON THORN', date: 'AUG 05, 2024', total: '$145.00', status: 'Processing', type: 'EDITORIAL' },
  { id: 'ORD-KNTC-82914', customer: 'SOPHIA CHEN', date: 'JUL 18, 2024', total: '$95.00', status: 'Verified', type: 'EDITORIAL' },
];

export default function OrdersManagement() {
  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="flex flex-col gap-2">
           <span className="font-headline text-[10px] md:text-sm uppercase tracking-[0.4em] text-[#b90c1b] font-black">LOGISTICS HUB</span>
           <h2 className="font-brand text-5xl md:text-7xl uppercase leading-none tracking-tighter">Editorial Fulfillment</h2>
        </div>
        <div className="flex bg-[#1c1b1b] border border-[#ffffff]/10 p-2 gap-2">
           <button className="bg-[#ffffff] text-[#1c1b1b] px-6 py-3 font-headline text-[10px] uppercase font-black tracking-widest transition-all">All Orders</button>
           <button className="px-6 py-3 font-headline text-[10px] uppercase font-black tracking-widest opacity-40 hover:opacity-100 transition-all">Active</button>
           <button className="px-6 py-3 font-headline text-[10px] uppercase font-black tracking-widest opacity-40 hover:opacity-100 transition-all">Resolved</button>
        </div>
      </header>

      {/* Orders List */}
      <div className="flex flex-col gap-4">
         {orders.map((o) => (
           <div key={o.id} className="bg-[#1c1b1b] border border-[#ffffff]/10 p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-[#b90c1b] transition-all relative overflow-hidden">
              <div className="flex flex-col gap-1 z-10">
                 <span className="font-headline text-[9px] uppercase tracking-widest opacity-40">{o.id} / {o.type}</span>
                 <h3 className="font-brand text-3xl uppercase tracking-widest">{o.customer}</h3>
                 <p className="font-headline text-[10px] uppercase tracking-widest opacity-40 mt-1">PLACED ON: {o.date}</p>
              </div>

              <div className="flex items-center gap-12 z-10 w-full md:w-auto justify-between md:justify-end">
                 <div className="flex flex-col">
                    <span className="font-headline text-[10px] font-black tracking-[0.2em] text-[#b90c1b] uppercase">Status</span>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="material-symbols-outlined text-[12px]">{o.status === 'In Transit' ? 'local_shipping' : o.status === 'Delivered' ? 'check_circle' : 'inventory_2'}</span>
                       <span className="font-headline text-xs font-bold uppercase tracking-widest">{o.status}</span>
                    </div>
                 </div>
                 <div className="flex flex-col">
                    <span className="font-headline text-[10px] font-black tracking-[0.2em] opacity-40 uppercase">Total</span>
                    <span className="font-brand text-3xl mt-1">{o.total}</span>
                 </div>
                 <button className="bg-white text-black px-8 py-3 font-brand text-xl uppercase hover:bg-[#b90c1b] hover:text-white transition-all">
                    Detail
                 </button>
              </div>

              {/* Decorative background number */}
              <span className="absolute -right-4 -bottom-10 font-brand text-[200px] opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                 {o.id.split('-').pop()}
              </span>
           </div>
         ))}
      </div>

      {/* Pagination / Footer Info */}
      <div className="mt-12 flex justify-center items-center gap-8 border-t border-[#ffffff]/10 pt-10 font-headline text-[10px] font-bold uppercase tracking-widest opacity-40">
         <button className="hover:text-white transition-colors">Prev Segment</button>
         <div className="flex gap-4">
            <span className="text-[#b90c1b]">01</span>
            <span>02</span>
            <span>03</span>
         </div>
         <button className="hover:text-white transition-colors">Next Segment</button>
      </div>
    </div>
  );
}