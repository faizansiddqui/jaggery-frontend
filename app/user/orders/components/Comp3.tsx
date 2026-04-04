export default function Comp3() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <section className="lg:col-span-8">
          <h2 className="font-impact text-3xl uppercase tracking-widest mb-8 border-l-4 border-primary pl-4">
            YOUR ARCHIVE
          </h2>
          <div className="flex flex-col gap-8">
            <div className="bg-surface-container-lowest p-0 flex flex-col md:flex-row gap-6 relative group">
              <div className="w-full md:w-48 aspect-square bg-surface-container-low overflow-hidden">
                <img
                  alt="Streetwear product"
                  className="w-full h-full object-cover"
                  data-alt="high-end minimalist black cotton hoodie with sharp architectural silhouette shot in a clinical white studio setting with hard shadows"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsIivCI4M-cJAfRG6kXJVwTDzg0gFwl7-DfpQlM-UUyw-MVKDFHYbDowc2IU1FOqavKB5beHrj6vXCNmf8RoVqWaFGU12oDKyP0CQMgWxuxSZAatdDp0uGRolpNiWCDtEputhf3Kalu1v8r1nYkguEnjo1J9DHqyCJfeGaTywF6xxjhOdKhY26-joBIz2REJftAH5EnNbZjRibJX1LLAHs6zaV6mMIiFKfeFXERFvz0dOoOaSheMjQD04FLJGKRSeJHPXh4cZOgRZV"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-2 px-4 md:px-0">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-headline font-bold text-2xl uppercase leading-tight">
                      VOID OVERSIZED HOODIE
                    </h3>
                    <span className="font-technical font-bold text-xl">
                      $185.00
                    </span>
                  </div>
                  <p className="text-secondary font-technical uppercase text-sm mt-1">
                    BLACK / SIZE L
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-technical text-xs tracking-widest text-secondary">
                    QTY: 01
                  </span>
                  <button className="text-xs font-bold uppercase tracking-tighter border-b border-on-surface hover:text-primary hover:border-primary transition-colors">
                    WRITE REVIEW
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-0 flex flex-col md:flex-row gap-6 relative group">
              <div className="w-full md:w-48 aspect-square bg-surface-container-low overflow-hidden">
                <img
                  alt="Streetwear sneakers"
                  className="w-full h-full object-cover"
                  data-alt="pair of aggressive industrial style designer sneakers with thick textured soles and technical mesh details in matte grey and kinetic red"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqYV3WHVv23pz1QAnXdjgumFBo5Mz9Hyqz_ERwq1-o9HGNBwWX90yJCZsjnGzAF32P91QdxDEyS2pKQgkySSwjw1igWwdEXWPEJRZTakMMlmuAsBOnfZ-2yvDw7mTM4aTaLinMcfDABpful5hSblX_uGenvxg8bqMZHkw6RVgeolAhRlcMNG2COMB_wQySqgaOi7fyNteuxP6k64JDiZcVn9e4Pd5MZvREtNc_OE2wdNuSOwpsNoA2doytOZ8e3T80v_MWsBNK6KL3"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-2 px-4 md:px-0">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-headline font-bold text-2xl uppercase leading-tight">
                      KINETIC RUNNER V.2
                    </h3>
                    <span className="font-technical font-bold text-xl">
                      $320.00
                    </span>
                  </div>
                  <p className="text-secondary font-technical uppercase text-sm mt-1">
                    INDUSTRIAL GREY / SIZE 44
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-technical text-xs tracking-widest text-secondary">
                    QTY: 01
                  </span>
                  <button className="text-xs font-bold uppercase tracking-tighter border-b border-on-surface hover:text-primary hover:border-primary transition-colors">
                    WRITE REVIEW
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-container-low p-8">
              <h4 className="font-impact text-xl uppercase tracking-widest mb-4">
                SHIPPING DESTINATION
              </h4>
              <div className="font-technical text-on-surface leading-relaxed uppercase text-sm space-y-1">
                <p className="font-bold">MARCUS VANDAL</p>
                <p>1244 NEO-TOKYO DISTRICT</p>
                <p>FLOOR 84, SECTOR 7</p>
                <p>TOKYO, 100-0001, JP</p>
                <p className="mt-4">+81 90-XXXX-XXXX</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-8">
              <h4 className="font-impact text-xl uppercase tracking-widest mb-4">
                PAYMENT PROTOCOL
              </h4>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-8 bg-on-surface flex items-center justify-center text-white text-[10px] font-bold">
                  VISA
                </div>
                <p className="font-technical uppercase text-sm tracking-widest">
                  VISA ENDING IN 8842
                </p>
              </div>
              <p className="font-technical uppercase text-xs text-secondary mb-1">
                BILLING ADDRESS
              </p>
              <p className="font-technical uppercase text-xs">
                SAME AS SHIPPING
              </p>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-4">
          <div className="sticky top-28">
            <div className="bg-on-surface text-white p-8">
              <h2 className="font-impact text-3xl uppercase tracking-widest mb-8 border-l-4 border-primary pl-4">
                FINANCIALS
              </h2>
              <div className="space-y-4 font-technical uppercase tracking-widest text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-container">SUBTOTAL</span>
                  <span>$505.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-container">
                    SHIPPING (EXPRESS)
                  </span>
                  <span>$25.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-container">TAX (EST.)</span>
                  <span>$42.00</span>
                </div>
                <div className="velocity-bar my-6 opacity-30"></div>
                <div className="flex justify-between text-2xl font-bold font-headline">
                  <span>TOTAL</span>
                  <span className="text-primary">$572.00</span>
                </div>
              </div>
              <div className="mt-10 space-y-4">
                <button className="w-full bg-primary text-white py-4 font-impact text-xl tracking-widest uppercase hover:bg-white hover:text-on-surface transition-colors active:scale-95">
                  DOWNLOAD INVOICE
                </button>
                <button className="w-full bg-transparent border border-outline-variant/30 text-white py-4 font-impact text-xl tracking-widest uppercase hover:bg-white/10 transition-colors active:scale-95">
                  NEED ASSISTANCE?
                </button>
              </div>
            </div>
            <div className="mt-8 p-8 border border-on-surface/10">
              <h4 className="font-impact text-lg uppercase tracking-widest mb-4">
                RETURN POLICY
              </h4>
              <p className="text-xs font-technical uppercase leading-loose text-secondary">
                ALL SEASONAL RELEASES MUST BE RETURNED WITHIN 14 DAYS OF
                RECEIPT. ORIGINAL TAGS AND ARCHIVAL PACKAGING MUST REMAIN
                INTACT. NO EXCEPTIONS.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
