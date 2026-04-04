'use client';

const stats = [
  { label: 'TOTAL CUSTOMERS', value: '4,842', trend: '+12.5%' },
  { label: 'ACTIVE SESSIONS', value: '1,204', trend: '+5.2%' },
  { label: 'CONVERSION RATE', value: '3.42%', trend: '-1.1%' },
  { label: 'CHURN RATE', value: '0.8%', trend: 'STABLE' },
];

const customers = [
  { name: 'Marcus Vane', email: 'vane@editorial.io', orders: 12, spent: '$2,850.00', status: 'VIP' },
  { name: 'Elara Sterling', email: 'elara.s@track.com', orders: 8, spent: '$1,220.00', status: 'ACTIVE' },
  { name: 'Jaxon Thorn', email: 'thrn@riot.net', orders: 5, spent: '$545.00', status: 'ACTIVE' },
  { name: 'Sophia Chen', email: 'chen.s@editorial.io', orders: 3, spent: '$285.00', status: 'NEW' },
];

export default function CustomersManagement() {
  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <span className="font-headline text-[10px] md:text-sm uppercase tracking-[0.4em] text-[#b90c1b] font-black">USER SEGMENTS</span>
        <h2 className="font-brand text-5xl md:text-7xl uppercase leading-none tracking-tighter">Customer Analytics</h2>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#1c1b1b] border border-[#ffffff]/10 p-8 flex flex-col justify-between group hover:border-[#b90c1b] transition-all">
            <span className="font-headline text-[10px] uppercase tracking-[0.2em] opacity-40">{stat.label}</span>
            <div className="mt-8 flex justify-between items-end">
               <span className="font-brand text-4xl block leading-none">{stat.value}</span>
               <span className={`font-headline text-[8px] uppercase tracking-widest ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Customers List */}
      <div className="bg-[#1c1b1b] border border-[#ffffff]/10 overflow-hidden">
         <div className="grid grid-cols-12 gap-8 p-6 bg-[#ffffff]/5 font-headline text-[10px] uppercase tracking-[0.3em] font-black opacity-40">
            <div className="col-span-1">RANK</div>
            <div className="col-span-5">CUSTOMER_PROFILE</div>
            <div className="col-span-2">TOTAL_ORDERS</div>
            <div className="col-span-2">LIFETIME_VAL</div>
            <div className="col-span-2 text-right">STATUS_VER</div>
         </div>

         <div className="flex flex-col">
            {customers.map((c, i) => (
              <div key={i} className="grid grid-cols-12 gap-8 p-8 border-b border-[#ffffff]/5 last:border-none hover:bg-[#ffffff]/2 transition-colors items-center">
                 <div className="col-span-1 font-headline text-[10px] uppercase opacity-40">0{i+1}</div>
                 <div className="col-span-5 flex items-center gap-6">
                    <div className="w-12 h-12 bg-[#ffffff]/10 flex items-center justify-center font-brand text-xl">
                       {c.name.charAt(0)}
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="font-brand text-2xl uppercase tracking-widest">{c.name}</span>
                       <span className="font-headline text-[9px] uppercase tracking-widest opacity-40">{c.email}</span>
                    </div>
                 </div>
                 <div className="col-span-2 font-brand text-3xl">{c.orders}</div>
                 <div className="col-span-2 font-brand text-3xl text-[#b90c1b]">{c.spent}</div>
                 <div className="col-span-2 flex justify-end">
                    <span className={`px-4 py-1 font-headline text-[8px] uppercase tracking-widest font-black ${c.status === 'VIP' ? 'bg-[#b90c1b] text-white' : 'bg-[#ffffff]/10 opacity-60'}`}>{c.status}</span>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
