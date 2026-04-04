export default function Comp2() {
  return (
    <>
      <main className="pt-24 pb-24 md:pt-32 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-primary font-headline font-bold tracking-[0.2em] text-xs uppercase">
              Your Selection
            </span>
            <h1 className="font-display text-7xl md:text-8xl leading-none uppercase tracking-tighter text-on-surface">
              Shopping Bag
            </h1>
          </div>
          <div className="flex items-center gap-2 text-on-secondary-container">
            <span className="font-headline font-bold text-sm">
              3 ITEMS SELECTED
            </span>
            <div className="h-[2px] w-12 bg-primary"></div>
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex flex-col md:flex-row gap-6 p-1 bg-surface-container-lowest transition-all hover:bg-surface-container-low">
              <div className="w-full md:w-48 aspect-[4/5] overflow-hidden bg-surface-container-low">
                <img
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  data-alt="Modern streetwear black oversized hoodie featuring a bold red logo on front, studio lighting against a clinical white background"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdp5EfbixMIVDEUInK3Jb0TAACfCzrDlZhd7MOtWmS8jfLkpeSQXDrolTIFduRuMI_IqpjiIcczRKRVtbDm6bSz1xbv87NV-dpE7cT5rNXHu2zQLX8OMVcPq26NzctLFBJaIrRiw3Fu9jxWS__kpyHnXjgGIvDuXt_r-Sq4_V1EsRy--moDRIgLoE86mmt0yr2bOUtmfA-mgqlGjbDl3OVGtwFgQpET0DKR9UsH7S9pkxBpAiSXy28Vk7hS0oGo2zn7mFMmIZREhf8"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-3xl uppercase leading-none tracking-tight">
                      KINETIC OVERSIZED HOODIE
                    </h3>
                    <p className="text-on-secondary-container text-xs font-headline mt-1 tracking-widest uppercase">
                      COLLECTION: NOIR SERIES 01
                    </p>
                  </div>
                  <span className="font-display text-2xl">$125.00</span>
                </div>
                <div className="mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <span className="block text-[10px] font-bold text-on-secondary-container uppercase mb-1 tracking-widest">
                      Size
                    </span>
                    <div className="px-3 py-2 border border-outline-variant/30 text-xs font-bold font-headline">
                      XLARGE
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-on-secondary-container uppercase mb-1 tracking-widest">
                      Quantity
                    </span>
                    <div className="flex items-center border border-outline-variant/30">
                      <button className="px-3 py-2 hover:bg-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">
                          remove
                        </span>
                      </button>
                      <span className="flex-1 text-center text-xs font-bold font-headline">
                        01
                      </span>
                      <button className="px-3 py-2 hover:bg-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">
                          add
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1 flex md:justify-end">
                    <button className="flex items-center gap-2 text-xs font-bold text-on-secondary-container hover:text-primary transition-colors group">
                      <span className="material-symbols-outlined text-sm">
                        delete
                      </span>
                      <span className="tracking-widest uppercase">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[1px] w-full bg-surface-container-high"></div>

            <div className="flex flex-col md:flex-row gap-6 p-1 bg-surface-container-lowest transition-all hover:bg-surface-container-low">
              <div className="w-full md:w-48 aspect-[4/5] overflow-hidden bg-surface-container-low">
                <img
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  data-alt="High-top technical sneakers in matte black and crimson red accents, dramatic lighting, studio background"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaTMaOXsvGnrbjJw7bBMDYyWMq-3cqyKxfniPtx4jPASu7xEegBpFDygCRuapLfc6ZCz0IDbTSdfgvwqIxpAm4EBYunZWSSjpV2OSvlfyFABCiCdmPOMlqWbxP09V8m17eR6oesiWVns3G0Px74ht5cUe9Qw9BQHGf_dXDoF_Hc7_vrzeGDlbbu_hhxCLwAaekwKhp0oI-p6hqAfsQNtyqXWToGuY9d0WZQICoki3H4CQdWC6odpgqtNRqREWnyMYIzT14__gflxNB"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-3xl uppercase leading-none tracking-tight">
                      PRECISION TECH RUNNER
                    </h3>
                    <p className="text-on-secondary-container text-xs font-headline mt-1 tracking-widest uppercase">
                      COLLECTION: VELOCITY GEAR
                    </p>
                  </div>
                  <span className="font-display text-2xl">$210.00</span>
                </div>
                <div className="mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <span className="block text-[10px] font-bold text-on-secondary-container uppercase mb-1 tracking-widest">
                      Size
                    </span>
                    <div className="px-3 py-2 border border-outline-variant/30 text-xs font-bold font-headline">
                      44 EU
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-on-secondary-container uppercase mb-1 tracking-widest">
                      Quantity
                    </span>
                    <div className="flex items-center border border-outline-variant/30">
                      <button className="px-3 py-2 hover:bg-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">
                          remove
                        </span>
                      </button>
                      <span className="flex-1 text-center text-xs font-bold font-headline">
                        01
                      </span>
                      <button className="px-3 py-2 hover:bg-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">
                          add
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1 flex md:justify-end">
                    <button className="flex items-center gap-2 text-xs font-bold text-on-secondary-container hover:text-primary transition-colors group">
                      <span className="material-symbols-outlined text-sm">
                        delete
                      </span>
                      <span className="tracking-widest uppercase">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[1px] w-full bg-surface-container-high"></div>

            <div className="flex flex-col md:flex-row gap-6 p-1 bg-surface-container-lowest transition-all hover:bg-surface-container-low">
              <div className="w-full md:w-48 aspect-[4/5] overflow-hidden bg-surface-container-low">
                <img
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  data-alt="Minimalist street style beanie in dark charcoal grey with a small kinetic red woven label, flat lay photography"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkVhZFG7Fxhh2NSyhCBpztCZBlMdUOCLUoXmew9eYy-ZetQkazckEGYSDM3hI4QW-UCW2VU6cNvFfT7VKMrvaw7F0Uq1JZU0JQwNCGqHDze2rWTuXaHaulgjywyHlf4uwYzWuC56Jov38iWwSw8ENfj7112dvuhk3wOJ68O93s5kib9FxuNxQJw22PLdpb2noGv_Ooo3ah6JR2pde3GYwHGJoQKnUdJoCUhc0R3wrK5ku8qoqjxeFtdiQDxrLpjThgo9JAsNp_xCRj"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-3xl uppercase leading-none tracking-tight">
                      RAW TEXTURE BEANIE
                    </h3>
                    <p className="text-on-secondary-container text-xs font-headline mt-1 tracking-widest uppercase">
                      COLLECTION: ESSENTIALS
                    </p>
                  </div>
                  <span className="font-display text-2xl">$45.00</span>
                </div>
                <div className="mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <span className="block text-[10px] font-bold text-on-secondary-container uppercase mb-1 tracking-widest">
                      Size
                    </span>
                    <div className="px-3 py-2 border border-outline-variant/30 text-xs font-bold font-headline">
                      ONE SIZE
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-on-secondary-container uppercase mb-1 tracking-widest">
                      Quantity
                    </span>
                    <div className="flex items-center border border-outline-variant/30">
                      <button className="px-3 py-2 hover:bg-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">
                          remove
                        </span>
                      </button>
                      <span className="flex-1 text-center text-xs font-bold font-headline">
                        01
                      </span>
                      <button className="px-3 py-2 hover:bg-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">
                          add
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1 flex md:justify-end">
                    <button className="flex items-center gap-2 text-xs font-bold text-on-secondary-container hover:text-primary transition-colors group">
                      <span className="material-symbols-outlined text-sm">
                        delete
                      </span>
                      <span className="tracking-widest uppercase">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden py-12 select-none pointer-events-none opacity-10">
              <div className="flex whitespace-nowrap gap-12 font-display text-8xl uppercase tracking-tighter">
                <span>STREETRIOT KINETIC</span>
                <span>STREETRIOT KINETIC</span>
                <span>STREETRIOT KINETIC</span>
                <span>STREETRIOT KINETIC</span>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-surface-container-low p-8 sticky top-32">
              <h2 className="font-display text-4xl uppercase tracking-tight mb-8">
                Order Summary
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold font-headline text-on-secondary-container uppercase tracking-widest">
                    Subtotal
                  </span>
                  <span className="font-headline font-bold">$380.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold font-headline text-on-secondary-container uppercase tracking-widest">
                    Estimated Shipping
                  </span>
                  <span className="font-headline font-bold text-primary">
                    FREE
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold font-headline text-on-secondary-container uppercase tracking-widest">
                    Tax
                  </span>
                  <span className="font-headline font-bold">$32.50</span>
                </div>
                <div className="pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                  <span className="font-display text-2xl uppercase tracking-tight">
                    TOTAL
                  </span>
                  <span className="font-display text-3xl">$412.50</span>
                </div>
              </div>
              <div className="space-y-4">
                <button className="w-full py-5 bg-on-surface text-white font-headline font-black text-sm uppercase tracking-[0.2em] hover:bg-primary transition-colors duration-300">
                  PROCEED TO CHECKOUT
                </button>
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-outline-variant/20"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-surface-container-low px-4 text-on-secondary-container font-headline font-bold uppercase tracking-widest">
                      OR
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button className="py-3 border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container-high transition-colors">
                    <img
                      alt="PayPal"
                      className="h-4"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRBbr59pLnEsrbLYPlqXmqHoj2kW6bB5Ngt4SQw2xCUV-BZunPQbTXi10Yww0dZEL4b5mLcO5SMiUf87BawfIakpS68yBuqK5orRrcPRNxvMEiDguXOPzP4IAQk3S5UIft4ME8CCz1Wun4thlKNhGIUvMSP4nVDvwXAO7E0PAFNR4Mgoikdxqj-pfFWaLb_kv-_h8D_Iyhecreoqm3XUOF4bKwJEYcbEhMddJZ0PJ-PRsSsDB3MgK1XzhOaQw6R0D7vsO0Jplln-P3"
                    />
                  </button>
                  <button className="py-3 border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container-high transition-colors">
                    <img
                      alt="Apple Pay"
                      className="h-4"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJPZxnSiOYddFL-4TtXo0IJXqIQFhw4dgnBpZszwvNGzPsDG_ztNEnYAwFL-8pdjBk-4SAjHksmXpy5f44YgkD_nZrRmM5Fh3FqyK61ySchzj5OCfLqz-O53rdTcJ7-ADR00m9bewdCaBRDHhrdSZ5viswYSHMaqMG6e80E6oZRSqim4J5uFC88c8olpi6ruanxDuNOtmEpJTTtkxeXjMl61oqcIwVhZbD_wUEMVTvaqixAfpB5QNbrzqY4qnXWxD0GCqw47bztQOd"
                    />
                  </button>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-outline-variant/20">
                <div className="flex gap-4 items-center mb-4">
                  <span className="material-symbols-outlined text-primary">
                    verified_user
                  </span>
                  <div>
                    <p className="text-[10px] font-bold font-headline uppercase tracking-widest">
                      Secure Payments
                    </p>
                    <p className="text-[9px] text-on-secondary-container leading-tight">
                      All transactions are encrypted and processed securely by
                      our global partners.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="material-symbols-outlined text-primary">
                    local_shipping
                  </span>
                  <div>
                    <p className="text-[10px] font-bold font-headline uppercase tracking-widest">
                      Express Global Delivery
                    </p>
                    <p className="text-[9px] text-on-secondary-container leading-tight">
                      Fast shipping with real-time tracking for every streetriot
                      order.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
