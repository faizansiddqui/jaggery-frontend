'use client';

export default function AdminDashboard() {
  const stats = [
    { label: 'GROSS PERFORMANCE', value: '$128,420.00', change: '+12.5%', color: '#b90c1b' },
    { label: 'ACTIVE SHIPMENTS', value: '842', change: '+5.2%', color: '#ffffff' },
    { label: 'NEW EDITORIALS', value: '1,204', change: '-2.1%', color: '#ffffff' },
    { label: 'SYSTEM UPTIME', value: '99.98%', change: 'STABLE', color: '#b90c1b' },
  ];

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <span className="font-headline text-[10px] md:text-sm uppercase tracking-[0.4em] text-[#b90c1b] font-black">SYSTEM OVERVIEW</span>
        <h2 className="font-brand text-5xl md:text-7xl lg:text-8xl uppercase leading-none tracking-tighter">Precision Performance Tracking / Q4 PHASE</h2>
      </header>

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
               <span className={`font-headline text-[9px] uppercase tracking-widest mt-2 block ${stat.change.startsWith('+') ? 'text-green-500' : stat.change === 'STABLE' ? 'text-blue-500' : 'text-red-500'}`}>{stat.change} FROM PREVIOUS SEGMENT</span>
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
              {[1,2,3,4,5,6,7,8,9].map(i => <div key={i} className="h-[1px] w-full bg-[#ffffff]"></div>)}
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
                 {[
                   { t: '12:04', m: 'Order ORD-KNTC-92841 Verified', c: '#b90c1b' },
                   { t: '11:42', m: 'New Segment Uploaded: DROP-005', c: '#ffffff' },
                   { t: '09:15', m: 'Payment Gateway Protocol Secure', c: '#ffffff' },
                   { t: '08:00', m: 'Editorial Audit Complete', c: '#ffffff' }
                 ].map((act, i) => (
                   <div key={i} className="flex gap-4 items-start border-b border-[#ffffff]/5 pb-4 last:border-none">
                      <span className="opacity-40 whitespace-nowrap">{act.t}</span>
                      <span className="border-l-2 border-[#b90c1b] pl-4">{act.m}</span>
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
