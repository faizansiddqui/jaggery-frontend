export default function Comp4() {
  return (
    <>
      <section className="max-w-[1440px] mx-auto p-12 space-y-16">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 lg:col-span-5 space-y-8">
            <div className="relative group">
              <div className="absolute -left-4 top-0 h-full w-1 bg-primary"></div>
              <h2 className="font-display text-4xl tracking-wider mb-6">
                MEDIA ASSETS
              </h2>
              <div className="aspect-[4/5] bg-surface-container-low flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 hover:border-primary transition-colors cursor-pointer group p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-primary mb-4">
                  upload_file
                </span>
                <p className="font-headline text-xl font-bold uppercase tracking-tight">
                  Drag and drop high-res assets
                </p>
                <p className="text-sm opacity-60 mt-2 font-label">
                  PNG, JPG, TIFF (Max 25MB)
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="aspect-square bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined opacity-30">
                  image
                </span>
              </div>
              <div className="aspect-square bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined opacity-30">
                  image
                </span>
              </div>
              <div className="aspect-square bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined opacity-30">
                  add
                </span>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 space-y-16">
            <div className="space-y-10">
              <h2 className="font-display text-4xl tracking-wider">
                PRODUCT CORE INFO
              </h2>
              <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                <div className="col-span-2">
                  <label className="block font-label text-[10px] font-bold tracking-widest uppercase mb-2">
                    Product Name
                  </label>
                  <input
                    className="w-full bg-transparent ghost-border py-4 font-headline text-2xl font-bold focus-red placeholder:opacity-20 uppercase"
                    placeholder="E.G. OVERSIZED KINETIC PARKA"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-label text-[10px] font-bold tracking-widest uppercase mb-2">
                    SKU Identifier
                  </label>
                  <input
                    className="w-full bg-transparent ghost-border py-4 font-body text-lg focus-red placeholder:opacity-20 uppercase"
                    placeholder="SR-2024-KP"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-label text-[10px] font-bold tracking-widest uppercase mb-2">
                    Base Price (USD)
                  </label>
                  <input
                    className="w-full bg-transparent ghost-border py-4 font-body text-lg focus-red placeholder:opacity-20"
                    placeholder="245.00"
                    type="text"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-label text-[10px] font-bold tracking-widest uppercase mb-2">
                    Category
                  </label>
                  <select className="w-full bg-transparent ghost-border py-4 font-body text-lg focus-red appearance-none cursor-pointer uppercase">
                    <option>OUTERWEAR</option>
                    <option>FOOTWEAR</option>
                    <option>ACCESSORIES</option>
                    <option>LIMITED DROP</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-4xl tracking-wider">
                PRODUCT NARRATIVE
              </h2>
              <div className="bg-surface-container-lowest p-8 min-h-[300px] border border-outline-variant/10">
                <div className="flex gap-4 border-b border-outline-variant/10 pb-4 mb-6">
                  <button className="material-symbols-outlined hover:text-primary">
                    format_bold
                  </button>
                  <button className="material-symbols-outlined hover:text-primary">
                    format_italic
                  </button>
                  <button className="material-symbols-outlined hover:text-primary">
                    list
                  </button>
                  <button className="material-symbols-outlined hover:text-primary">
                    link
                  </button>
                </div>
                <textarea
                  className="w-full h-48 bg-transparent border-none focus:ring-0 font-body leading-relaxed text-lg resize-none"
                  placeholder="Craft a compelling story for this piece..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 border-t border-outline-variant/10">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-4">
              <h2 className="font-display text-4xl tracking-wider">
                INVENTORY SYNC
              </h2>
              <p className="text-sm opacity-60 font-label">
                Real-time stock allocation across global hubs.
              </p>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
              <span className="font-label text-xs uppercase tracking-widest">
                Global Sync Active
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-low p-8 border-l-4 border-primary">
              <h3 className="font-headline font-bold text-xl mb-6 uppercase">
                North America / NYC
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                  <span className="text-xs font-bold font-label uppercase">
                    Size Small
                  </span>
                  <input
                    className="w-16 bg-transparent text-right border-none focus:ring-0 font-body font-bold"
                    type="number"
                    value="120"
                  />
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                  <span className="text-xs font-bold font-label uppercase">
                    Size Medium
                  </span>
                  <input
                    className="w-16 bg-transparent text-right border-none focus:ring-0 font-body font-bold"
                    type="number"
                    value="85"
                  />
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                  <span className="text-xs font-bold font-label uppercase">
                    Size Large
                  </span>
                  <input
                    className="w-16 bg-transparent text-right border-none focus:ring-0 font-body font-bold"
                    type="number"
                    value="45"
                  />
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-8">
              <h3 className="font-headline font-bold text-xl mb-6 uppercase">
                Europe / Berlin
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                  <span className="text-xs font-bold font-label uppercase">
                    Size Small
                  </span>
                  <input
                    className="w-16 bg-transparent text-right border-none focus:ring-0 font-body font-bold"
                    type="number"
                    value="200"
                  />
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                  <span className="text-xs font-bold font-label uppercase">
                    Size Medium
                  </span>
                  <input
                    className="w-16 bg-transparent text-right border-none focus:ring-0 font-body font-bold"
                    type="number"
                    value="150"
                  />
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                  <span className="text-xs font-bold font-label uppercase">
                    Size Large
                  </span>
                  <input
                    className="w-16 bg-transparent text-right border-none focus:ring-0 font-body font-bold"
                    type="number"
                    value="110"
                  />
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-8">
              <h3 className="font-headline font-bold text-xl mb-6 uppercase">
                Asia / Tokyo
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                  <span className="text-xs font-bold font-label uppercase">
                    Size Small
                  </span>
                  <input
                    className="w-16 bg-transparent text-right border-none focus:ring-0 font-body font-bold"
                    type="number"
                    value="450"
                  />
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                  <span className="text-xs font-bold font-label uppercase">
                    Size Medium
                  </span>
                  <input
                    className="w-16 bg-transparent text-right border-none focus:ring-0 font-body font-bold"
                    type="number"
                    value="300"
                  />
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                  <span className="text-xs font-bold font-label uppercase">
                    Size Large
                  </span>
                  <input
                    className="w-16 bg-transparent text-right border-none focus:ring-0 font-body font-bold"
                    type="number"
                    value="220"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden py-12">
          <div className="flex whitespace-nowrap gap-12 font-display text-8xl text-on-surface/5 select-none">
            <span>NEW SEASON</span>
            <span>•</span>
            <span>STREETRIOT AUTHENTIC</span>
            <span>•</span>
            <span>PRECISION CUT</span>
            <span>•</span>
            <span>NEW SEASON</span>
          </div>
        </div>
      </section>
    </>
  );
}
