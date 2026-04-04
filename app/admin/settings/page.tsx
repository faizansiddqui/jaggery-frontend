'use client';

export default function AdminSettings() {
  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <span className="font-headline text-[10px] md:text-sm uppercase tracking-[0.4em] text-[#b90c1b] font-black">SYSTEM PARAMETERS</span>
        <h2 className="font-brand text-5xl md:text-7xl uppercase leading-none tracking-tighter">Portal Settings</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* General Settings */}
         <div className="lg:col-span-8 flex flex-col gap-12">
            <section className="flex flex-col gap-8 bg-[#1c1b1b] border border-[#ffffff]/10 p-10">
               <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-[#ffffff]/10 pb-6">Global Branding</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                     <label className="font-headline text-[9px] uppercase tracking-widest opacity-40">Store Identity Name</label>
                     <input type="text" defaultValue="STREETRIOT" className="bg-transparent border-b-2 border-[#ffffff]/10 py-3 font-brand text-2xl uppercase focus:border-[#b90c1b] outline-none" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <label className="font-headline text-[9px] uppercase tracking-widest opacity-40">System Primary Color</label>
                     <div className="flex items-center gap-4 py-3 border-b-2 border-[#ffffff]/10">
                        <div className="w-6 h-6 bg-[#b90c1b]"></div>
                        <span className="font-brand text-2xl uppercase">#B90C1B</span>
                     </div>
                  </div>
               </div>
            </section>

            <section className="flex flex-col gap-8 bg-[#1c1b1b] border border-[#ffffff]/10 p-10">
               <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-[#ffffff]/10 pb-6">Fulfillment API</h3>
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                     <label className="font-headline text-[9px] uppercase tracking-widest opacity-40">Carrier Protocol Key</label>
                     <input type="password" value="********************************" readOnly className="bg-transparent border-b-2 border-[#ffffff]/10 py-3 font-mono text-xl opacity-40 outline-none" />
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                     <span className="font-headline text-[9px] uppercase tracking-widest opacity-60">Connected to Global Logistics Mainframe</span>
                  </div>
               </div>
            </section>
         </div>

         {/* Sidebar / Quick Settings */}
         <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-[#b90c1b] p-10 flex flex-col gap-6">
               <h3 className="font-brand text-3xl uppercase tracking-widest text-white border-b border-white/20 pb-6">System Health</h3>
               <div className="flex flex-col gap-4">
                  {[
                    { label: 'SERVER LATENCY', val: '24ms', color: 'white' },
                    { label: 'DB PROTOCOL', val: 'SECURE', color: 'white' },
                    { label: 'IMAGE_CDN', val: 'OPTIMIZED', color: 'white' }
                  ].map((s, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4">
                       <span className="font-headline text-[9px] uppercase tracking-widest font-black text-white/60">{s.label}</span>
                       <span className="font-brand text-xl text-white">{s.val}</span>
                    </div>
                  ))}
               </div>
               <button className="bg-white text-[#b90c1b] py-6 font-brand text-xl uppercase hover:bg-black hover:text-white transition-all mt-4">
                  Run Global Audit
               </button>
            </div>

            <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-10 flex flex-col gap-6">
               <h3 className="font-brand text-3xl uppercase tracking-widest border-b border-[#ffffff]/10 pb-6">User Permissions</h3>
               <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4 opacity-40">
                     <span className="material-symbols-outlined text-sm">security</span>
                     <span className="font-headline text-[9px] uppercase tracking-widest">Two-Factor Authentication</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="flex justify-end">
         <button className="bg-[#ffffff] text-[#1c1b1b] px-12 py-6 font-brand text-2xl uppercase hover:bg-[#b90c1b] hover:text-[#ffffff] transition-all">
            Commit Changes
         </button>
      </div>
    </div>
  );
}