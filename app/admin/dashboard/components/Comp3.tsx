export default function Comp3() {
  return (
    <>
      <div className="p-8 space-y-8">
        <div className="w-full h-1 bg-primary"></div>

        <section className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="space-y-1">
            <h2 className="text-6xl bebas tracking-tighter leading-none text-on-surface">
              SYSTEM OVERVIEW
            </h2>
            <p className="text-primary font-bold tracking-[0.3em] text-xs">
              Precision Performance Tracking / Q4 PHASE
            </p>
          </div>
          <div className="flex gap-4">
            <button className="bg-on-surface text-white px-8 py-4 font-bold text-xs tracking-widest hover:bg-primary transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">
                download
              </span>
              Export Report
            </button>
            <button className="border border-outline-variant/30 px-8 py-4 font-bold text-xs tracking-widest hover:bg-surface-container-high transition-colors">
              Date Range
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-1">
          <div className="bg-surface-container-lowest p-8 space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[10px] tracking-[0.2em] font-bold opacity-40">
                Total Revenue
              </span>
              <span className="text-primary text-[10px] font-bold">
                +12.5%
              </span>
            </div>
            <div className="bebas text-5xl leading-none">$142,850.00</div>
            <div className="h-1 bg-primary w-1/3"></div>
          </div>

          <div className="bg-surface-container-low p-8 space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[10px] tracking-[0.2em] font-bold opacity-40">
                Total Orders
              </span>
              <span className="text-primary text-[10px] font-bold">
                +4.2%
              </span>
            </div>
            <div className="bebas text-5xl leading-none">1,284</div>
            <div className="h-1 bg-on-surface w-1/3"></div>
          </div>

          <div className="bg-surface-container-high p-8 space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[10px] tracking-[0.2em] font-bold opacity-40">
                New Customers
              </span>
              <span className="text-primary text-[10px] font-bold">
                +8.1%
              </span>
            </div>
            <div className="bebas text-5xl leading-none">412</div>
            <div className="h-1 bg-on-surface w-1/3"></div>
          </div>

          <div className="bg-on-surface p-8 space-y-4 text-white">
            <div className="flex justify-between items-start">
              <span className="text-[10px] tracking-[0.2em] font-bold opacity-40">
                Conv. Rate
              </span>
              <span className="text-primary text-[10px] font-bold">
                +2.3%
              </span>
            </div>
            <div className="bebas text-5xl leading-none">3.42%</div>
            <div className="h-1 bg-primary w-full"></div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-surface-container-low p-8 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black tracking-tight">
                Sales Performance
              </h3>
              <div className="flex gap-4">
                <span className="text-[10px] font-bold flex items-center gap-1">
                  <span className="w-2 h-2 bg-primary"></span> Revenue
                </span>
                <span className="text-[10px] font-bold flex items-center gap-1">
                  <span className="w-2 h-2 bg-on-surface/30"></span> Last Year
                </span>
              </div>
            </div>

            <div className="h-[300px] flex items-end gap-2 px-2 relative">
              <div className="absolute inset-0 flex flex-col justify-between opacity-10 py-2">
                <div className="w-full border-t border-on-surface"></div>
                <div className="w-full border-t border-on-surface"></div>
                <div className="w-full border-t border-on-surface"></div>
                <div className="w-full border-t border-on-surface"></div>
              </div>

              <div className="flex-1 bg-on-surface/10 h-1/2 relative group hover:bg-primary transition-colors cursor-crosshair">
                <div className="absolute bottom-0 w-full bg-primary h-2/3 opacity-80 group-hover:opacity-100"></div>
              </div>
              <div className="flex-1 bg-on-surface/10 h-2/3 relative group hover:bg-primary transition-colors cursor-crosshair">
                <div className="absolute bottom-0 w-full bg-primary h-3/4 opacity-80 group-hover:opacity-100"></div>
              </div>
              <div className="flex-1 bg-on-surface/10 h-3/4 relative group hover:bg-primary transition-colors cursor-crosshair">
                <div className="absolute bottom-0 w-full bg-primary h-4/5 opacity-80 group-hover:opacity-100"></div>
              </div>
              <div className="flex-1 bg-on-surface/10 h-1/2 relative group hover:bg-primary transition-colors cursor-crosshair">
                <div className="absolute bottom-0 w-full bg-primary h-1/2 opacity-80 group-hover:opacity-100"></div>
              </div>
              <div className="flex-1 bg-on-surface/10 h-4/5 relative group hover:bg-primary transition-colors cursor-crosshair">
                <div className="absolute bottom-0 w-full bg-primary h-5/6 opacity-80 group-hover:opacity-100"></div>
              </div>
              <div className="flex-1 bg-on-surface/10 h-2/3 relative group hover:bg-primary transition-colors cursor-crosshair">
                <div className="absolute bottom-0 w-full bg-primary h-3/5 opacity-80 group-hover:opacity-100"></div>
              </div>
              <div className="flex-1 bg-on-surface/10 h-full relative group hover:bg-primary transition-colors cursor-crosshair">
                <div className="absolute bottom-0 w-full bg-primary h-3/4 opacity-80 group-hover:opacity-100"></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-black tracking-tight">
              System Actions
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button className="group bg-surface-container-lowest p-6 flex justify-between items-center hover:bg-on-surface hover:text-white transition-all">
                <span className="text-xs font-bold tracking-widest">
                  Add New Product
                </span>
                <span className="material-symbols-outlined text-primary group-hover:text-white translate-x-0 group-hover:translate-x-2 transition-transform">
                  add_circle
                </span>
              </button>
              <button className="group bg-surface-container-lowest p-6 flex justify-between items-center hover:bg-on-surface hover:text-white transition-all">
                <span className="text-xs font-bold tracking-widest">
                  Manage Inventory
                </span>
                <span className="material-symbols-outlined text-primary group-hover:text-white translate-x-0 group-hover:translate-x-2 transition-transform">
                  inventory_2
                </span>
              </button>
              <button className="group bg-surface-container-lowest p-6 flex justify-between items-center hover:bg-on-surface hover:text-white transition-all">
                <span className="text-xs font-bold tracking-widest">
                  Launch Campaign
                </span>
                <span className="material-symbols-outlined text-primary group-hover:text-white translate-x-0 group-hover:translate-x-2 transition-transform">
                  rocket_launch
                </span>
              </button>
              <button className="group bg-surface-container-lowest p-6 flex justify-between items-center hover:bg-on-surface hover:text-white transition-all">
                <span className="text-xs font-bold tracking-widest">
                  Support Tickets
                </span>
                <span className="material-symbols-outlined text-primary group-hover:text-white translate-x-0 group-hover:translate-x-2 transition-transform">
                  contact_support
                </span>
              </button>
            </div>

            <div className="bg-primary overflow-hidden py-4 mt-8 flex whitespace-nowrap">
              <div className="bebas text-white text-2xl px-4 flex gap-8">
                <span>STREETRIOT PERFORMANCE SYSTEM V.2.0</span>
                <span className="opacity-30">|</span>
                <span>LIVE SYNC ACTIVE</span>
                <span className="opacity-30">|</span>
                <span>DATA AGGREGATION 99.9%</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest">
          <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
            <h3 className="text-xl font-black tracking-tight">
              Recent Activity
            </h3>
            <a
              className="text-[10px] font-bold text-primary tracking-widest hover:underline"
              href="/"
            >
              View All Records
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left bg-surface-container-low">
                  <th className="p-4 text-[10px] font-black tracking-widest opacity-40">
                    Order ID
                  </th>
                  <th className="p-4 text-[10px] font-black tracking-widest opacity-40">
                    Customer
                  </th>
                  <th className="p-4 text-[10px] font-black tracking-widest opacity-40">
                    Status
                  </th>
                  <th className="p-4 text-[10px] font-black tracking-widest opacity-40">
                    Items
                  </th>
                  <th className="p-4 text-[10px] font-black tracking-widest opacity-40 text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors group">
                  <td className="p-6 text-xs font-mono font-bold">#SR-92841</td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-surface-container-high overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          data-alt="close-up portrait of a stylish man with modern streetwear accessories and soft studio lighting"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSlYCCQ7xK39lf_Bg279Wp-P2a9mSjqc8ZV8DYTyKH1xNiyI8iJYgTHsxWpgn58-C6YuHKIcbml5eLgHVKJYMEATFHq2cQtz8Z0__PvXfPqme3wB8Skz31AwR4FN67AzWlELrwaJ-49MpLwDD3qOOjGgj4fiZp2_QBvxjiIjnXWEDRckV20SeKlr4RmZeeDpk3kZaHMUDx_OsJG9hB4ebFRmtIn7GPph9fTA0xcvSJbgqxNQdaeYR9ReVsAtC9Mf5Y72UzHt-PDPpp"
                        />
                      </div>
                      <span className="text-xs font-bold">
                        Marcus Thorne
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-[10px] font-bold tracking-tighter">
                      Processing
                    </span>
                  </td>
                  <td className="p-6 text-xs opacity-60">"RIOT" Hoodie x2</td>
                  <td className="p-6 text-xs font-bold text-right">$240.00</td>
                </tr>
                <tr className="border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors group">
                  <td className="p-6 text-xs font-mono font-bold">#SR-92842</td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-surface-container-high overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          data-alt="headshot of a confident woman with sharp facial features against a minimalist industrial background"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2rDH15MF4lxp4GJzENEM3mhy1sA3MU3NmBUduCjTKSPwAw3kuXqm48tLVec0r-jB5y7XdqNSgfRD--Y8y9kyISxHmnAmQ_WOdzuO8kzQQtlHliUFUR9KzrrbYYEaZUKjkqATG8r65Xb4sxZUj2Y-T-2ZyMumpfxTxjYFquRMEbYA-ERyHYlg_NTQDK6nGwc6KbM7crVwyVTpWQ27vzNAZgcY_dLx0XufqlBDo6Rtn8xSrD7rF9yXvWelDlF2LMHMQkV04H7FtoVgE"
                        />
                      </div>
                      <span className="text-xs font-bold">
                        Elena Vance
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold tracking-tighter">
                      Pending
                    </span>
                  </td>
                  <td className="p-6 text-xs opacity-60">Velocity Cap x1</td>
                  <td className="p-6 text-xs font-bold text-right">$45.00</td>
                </tr>
                <tr className="border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors group">
                  <td className="p-6 text-xs font-mono font-bold">#SR-92843</td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-surface-container-high overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          data-alt="portrait of a young person in urban clothing with vibrant blue light reflecting on their face"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ17YWSCCx6UodS1yTutnIB-PnVSzl9_kOcs1hFXorddvvIOpcXVrsIdiBFFxZ0D-N3koz8UYaiOAA2D4mP-K7OWECbzMdl0ubGVZ3d9L_ngRwQ5z6cOEGWprfwJvKwbhD0UJ1SEWfqk4oYAEBcEQ4NcQJsOEKE7TqRLnltoKiavLdYWzFdKX63IsQHl7PWcq-heBkvCUyU2P-FlWUjz263Q0if75CkP2AxEcMAyjhQTNMbfWtKZi3IcgB8QUonzLQgqQ2nZEYIDAZ"
                        />
                      </div>
                      <span className="text-xs font-bold">
                        Jaxson Reed
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-2 py-1 bg-primary text-white text-[10px] font-bold tracking-tighter">
                      Shipped
                    </span>
                  </td>
                  <td className="p-6 text-xs opacity-60">Cargo Pant 01 x1</td>
                  <td className="p-6 text-xs font-bold text-right">$185.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
