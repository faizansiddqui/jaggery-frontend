export default function Comp1() {
  return (
    <>
      <main className="min-h-screen">
        <div className="w-full h-1 bg-surface-container-high">
          <div className="h-full bg-primary w-1/3"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h1 className="font-brand text-7xl md:text-8xl leading-none tracking-tight text-on-surface">
                ORDER
                <br />
                HISTORY
              </h1>
              <p className="mt-6 font-headline text-lg uppercase tracking-wider text-on-surface/60 max-w-md">
                TRACK YOUR PERFORMANCE GEAR SHIPMENTS AND REVIEW PAST KINETIC
                EDITORIAL DROPS.
              </p>
            </div>
            <div className="flex flex-col gap-2 items-start md:items-end">
              <span className="font-headline font-bold text-xs tracking-widest text-primary">
                ACCOUNT STATUS: ELITE
              </span>
              <div className="h-[2px] w-24 bg-primary"></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="group bg-surface-container-lowest border-l-4 border-primary p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 transition-all hover:bg-surface-container-low">
              <div className="flex flex-col gap-1">
                <span className="font-headline text-xs font-bold tracking-tighter text-on-surface/40 uppercase">
                  ORD-KNTC-92841
                </span>
                <h3 className="font-brand text-3xl tracking-wide uppercase">
                  TECH-SHELL V3 &amp; ACCESSORIES
                </h3>
                <p className="font-headline text-sm tracking-wide text-on-surface/60">
                  PLACED ON: OCT 24, 2024
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-6 md:gap-12 w-full md:w-auto justify-between md:justify-end">
                <div className="flex flex-col">
                  <span className="font-headline text-[10px] font-black tracking-widest text-primary uppercase">
                    STATUS
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="material-symbols-outlined text-primary text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      local_shipping
                    </span>
                    <span className="font-headline text-sm font-bold uppercase tracking-widest">
                      IN TRANSIT
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline text-[10px] font-black tracking-widest text-on-surface/40 uppercase">
                    TOTAL
                  </span>
                  <span className="font-brand text-2xl mt-1">$485.00</span>
                </div>
                <button className="bg-on-surface text-white font-brand text-xl px-8 py-3 hover:bg-primary transition-colors flex items-center gap-2 group/btn">
                  VIEW DETAILS
                  <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>

            <div className="group bg-surface-container-lowest border-l-4 border-on-surface/10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 transition-all hover:bg-surface-container-low">
              <div className="flex flex-col gap-1">
                <span className="font-headline text-xs font-bold tracking-tighter text-on-surface/40 uppercase">
                  ORD-KNTC-88210
                </span>
                <h3 className="font-brand text-3xl tracking-wide uppercase">
                  RACING TRACK SUIT NOIR
                </h3>
                <p className="font-headline text-sm tracking-wide text-on-surface/60">
                  PLACED ON: SEP 12, 2024
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-6 md:gap-12 w-full md:w-auto justify-between md:justify-end">
                <div className="flex flex-col">
                  <span className="font-headline text-[10px] font-black tracking-widest text-on-surface/40 uppercase">
                    STATUS
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-on-surface text-sm">
                      check_circle
                    </span>
                    <span className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface/40">
                      DELIVERED
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline text-[10px] font-black tracking-widest text-on-surface/40 uppercase">
                    TOTAL
                  </span>
                  <span className="font-brand text-2xl mt-1">$220.00</span>
                </div>
                <button className="border border-on-surface/20 text-on-surface font-brand text-xl px-8 py-3 hover:bg-on-surface hover:text-white transition-colors">
                  VIEW DETAILS
                </button>
              </div>
            </div>

            <div className="group bg-surface-container-lowest border-l-4 border-on-surface/10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 transition-all hover:bg-surface-container-low">
              <div className="flex flex-col gap-1">
                <span className="font-headline text-xs font-bold tracking-tighter text-on-surface/40 uppercase">
                  ORD-KNTC-85002
                </span>
                <h3 className="font-brand text-3xl tracking-wide uppercase">
                  EDITORIAL DROP 004 ACCESSORIES
                </h3>
                <p className="font-headline text-sm tracking-wide text-on-surface/60">
                  PLACED ON: AUG 05, 2024
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-6 md:gap-12 w-full md:w-auto justify-between md:justify-end">
                <div className="flex flex-col">
                  <span className="font-headline text-[10px] font-black tracking-widest text-on-surface/40 uppercase">
                    STATUS
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-on-surface text-sm">
                      inventory_2
                    </span>
                    <span className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface/40">
                      PROCESSING
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline text-[10px] font-black tracking-widest text-on-surface/40 uppercase">
                    TOTAL
                  </span>
                  <span className="font-brand text-2xl mt-1">$145.00</span>
                </div>
                <button className="border border-on-surface/20 text-on-surface font-brand text-xl px-8 py-3 hover:bg-on-surface hover:text-white transition-colors">
                  VIEW DETAILS
                </button>
              </div>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-1">
              <div className="md:col-span-2 relative bg-on-surface p-12 min-h-[400px] flex flex-col justify-between overflow-hidden">
                <div className="relative z-10">
                  <span className="bg-primary text-white text-[10px] font-black tracking-[0.3em] px-3 py-1 uppercase">
                    Exclusive Access
                  </span>
                  <h2 className="mt-6 font-brand text-6xl text-white leading-none uppercase">
                    EARLY ACCESS
                    <br />
                    TO DROP 005
                  </h2>
                  <p className="mt-4 font-headline text-white/60 text-sm max-w-xs uppercase tracking-widest">
                    LOYAL CUSTOMERS GET 24-HOUR EARLY ACCESS TO OUR WINTER
                    TECHNICAL COLLECTION.
                  </p>
                </div>
                <div className="relative z-10 mt-8">
                  <button className="bg-white text-on-surface font-brand text-xl px-10 py-4 hover:bg-primary hover:text-white transition-all">
                    JOIN WAITLIST
                  </button>
                </div>

                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent"></div>
                  <div
                    className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&amp;fit=crop&amp;q=80&amp;w=2070')] bg-cover bg-center grayscale contrast-150"
                    data-alt="abstract close-up of high-performance carbon fiber texture with industrial reflections and sharp lighting"
                  ></div>
                </div>
              </div>
              <div className="bg-primary-container p-12 flex flex-col justify-center items-center text-center">
                <span className="material-symbols-outlined text-6xl text-white mb-6">
                  support_agent
                </span>
                <h3 className="font-brand text-4xl text-white uppercase mb-2">
                  NEED HELP?
                </h3>
                <p className="font-headline text-white/80 text-sm uppercase tracking-widest mb-8">
                  Our support team is active 24/7 for editorial orders.
                </p>
                <a
                  className="font-headline font-bold text-white underline underline-offset-8 tracking-widest text-xs uppercase hover:text-on-surface transition-colors"
                  href="#"
                >
                  CONTACT SUPPORT
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
