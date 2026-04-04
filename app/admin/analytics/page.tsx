'use client';

export default function AdminAnalytics() {
  const metrics = [
    { label: 'AVERAGE ORDER VALUE', val: '$342.50', trend: '+8%' },
    { label: 'CUSTOMER LTV', val: '$1,240.00', trend: '+15%' },
    { label: 'REPURCHASE RATE', val: '42%', trend: '+3%' },
    { label: 'CART ABANDONMENT', val: '18%', trend: '-5%' },
  ];

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <span className="font-headline text-[10px] md:text-sm uppercase tracking-[0.4em] text-[#b90c1b] font-black">PERFORMANCE ANALYTICS</span>
        <h2 className="font-brand text-5xl md:text-7xl uppercase leading-none tracking-tighter">Kinetic Insight / Q4</h2>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-[#1c1b1b] border border-[#ffffff]/10 p-10 flex flex-col items-center text-center group hover:bg-[#b90c1b] transition-all">
             <span className="font-headline text-[10px] uppercase tracking-[0.2em] font-black opacity-40 group-hover:text-white group-hover:opacity-100">{m.label}</span>
             <span className="font-brand text-5xl mt-6 group-hover:text-white transition-all">{m.val}</span>
             <span className={`font-headline text-[10px] mt-4 uppercase tracking-widest ${m.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'} group-hover:text-white`}>{m.trend} TRENDING</span>
          </div>
        ))}
      </div>

      {/* Deep Dive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-12">
            <h3 className="font-brand text-4xl uppercase tracking-widest border-b border-[#ffffff]/10 pb-8 mb-10">Regional Performance</h3>
            <div className="flex flex-col gap-8 opacity-60">
               {[
                 { region: 'SEOUL / HQ', val: 85, color: '#b90c1b' },
                 { region: 'LONDON / DISTRICT', val: 64, color: '#ffffff' },
                 { region: 'TOKYO / EDITORIAL', val: 42, color: '#ffffff' },
                 { region: 'PARIS / HUB', val: 38, color: '#ffffff' },
                 { region: 'NYC / STUDIO', val: 24, color: '#ffffff' }
               ].map((r, i) => (
                 <div key={i} className="flex flex-col gap-2">
                    <div className="flex justify-between font-headline text-[10px] uppercase tracking-widest">
                       <span>{r.region}</span>
                       <span>{r.val}% GROWTH</span>
                    </div>
                    <div className="h-1 w-full bg-[#ffffff]/5">
                       <div className="h-full transition-all duration-1000" style={{ width: `${r.val}%`, backgroundColor: r.color }}></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-12 flex flex-col justify-center items-center text-center">
             <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute inset-0 border-[16px] border-[#ffffff]/5 rounded-full"></div>
                <div className="absolute inset-0 border-[16px] border-[#b90c1b] rounded-full" style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0, 100% 100%)' }}></div>
                <div className="flex flex-col items-center">
                   <span className="font-brand text-6xl">75%</span>
                   <span className="font-headline text-[10px] uppercase tracking-widest opacity-40">Target Met</span>
                </div>
             </div>
             <p className="mt-12 font-headline text-[10px] uppercase tracking-widest opacity-40 px-12 leading-relaxed">
                Global performance index currently operating at 75% efficiency. Protocol optimization required for Hub-02 and Hub-04 segments.
             </p>
         </div>
      </div>
    </div>
  );
}