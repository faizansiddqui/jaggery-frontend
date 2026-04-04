export default function Comp2() {
  return (
    <>
      <main className="ml-64 pt-24 pb-32 px-12 min-h-screen">
        <div className="flex items-end justify-between mb-12">
          <div>
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-40 mb-4 font-headline">
              <span>Catalog</span>
              <span className="material-symbols-outlined text-[12px]">
                chevron_right
              </span>
              <span>Footwear</span>
              <span className="material-symbols-outlined text-[12px]">
                chevron_right
              </span>
              <span className="text-on-surface opacity-100">
                Velocity Runner X
              </span>
            </nav>
            <h2 className="text-6xl font-black bebas tracking-tight uppercase leading-none">
              Edit Product
            </h2>
            <div className="mt-4 flex items-center gap-4">
              <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest">
                Active
              </span>
              <span className="text-xs opacity-50 font-mono">
                ID: SR-VLR-2024-X
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-4xl font-headline font-bold text-primary">
              $210.00
            </span>
            <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold mt-1">
              Base MSRP
            </span>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-12">
            <section className="bg-surface-container-lowest p-10 shadow-[0_12px_40px_rgba(28,27,27,0.03)] border-l-4 border-primary">
              <h3 className="bebas text-2xl tracking-wide mb-8 border-b border-outline-variant/20 pb-2">
                Core Specifications
              </h3>
              <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-[0.1em] opacity-60">
                    Product Name
                  </label>
                  <input
                    className="w-full border-0 border-b border-outline-variant/40 bg-transparent py-2 focus:ring-0 focus:border-primary transition-all text-xl font-headline font-bold"
                    type="text"
                    value="Velocity Runner X"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-[0.1em] opacity-60">
                    SKU Reference
                  </label>
                  <input
                    className="w-full border-0 border-b border-outline-variant/40 bg-transparent py-2 focus:ring-0 focus:border-primary transition-all font-mono"
                    type="text"
                    value="VLT-RNR-BLK-01"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-[0.1em] opacity-60">
                    Category
                  </label>
                  <select className="w-full border-0 border-b border-outline-variant/40 bg-transparent py-2 focus:ring-0 focus:border-primary appearance-none uppercase font-bold text-sm tracking-widest">
                    <option>Footwear</option>
                    <option>Outerwear</option>
                    <option>Accessories</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-[0.1em] opacity-60">
                    Price ($)
                  </label>
                  <input
                    className="w-full border-0 border-b border-outline-variant/40 bg-transparent py-2 focus:ring-0 focus:border-primary transition-all font-headline font-bold"
                    type="number"
                    value="210"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-[0.1em] opacity-60">
                    Product Description
                  </label>
                  <textarea
                    className="w-full border-0 border-b border-outline-variant/40 bg-transparent py-4 focus:ring-0 focus:border-primary transition-all resize-none font-body leading-relaxed"
                    rows="4"
                  >
                    Engineered for the high-intensity urban sprint. The Velocity
                    Runner X features a reinforced carbon-fiber cage and our
                    signature reactive foam sole. Designed with a 'Noir'
                    aesthetic for seamless transition from the track to the
                    street.
                  </textarea>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="bebas text-2xl tracking-wide">Media Assets</h3>
                <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-on-surface/20 hover:bg-on-surface hover:text-white transition-all">
                  Upload New View
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="group relative aspect-square bg-surface-container-low overflow-hidden cursor-pointer">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    data-alt="professional side profile shot of a sleek black athletic sneaker with red accents on a clean white background"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuANiJycfCc2RNtLhJVE1-w5tQysozoImjfayR24W-DALhzMiYoAtkcvWgYJVw9bd4m4hRMcnjUx1r-gXY_ZWmT8L28wm0tOS89xOzxbeWwPTMVf0a2zNNjSHqa8D5Lhn50TuoFLc8fSi6vNhpQtqe5mQnCaV-GAiufzewd8YOTRKHftudvOmD9YmFT_YGfBtQxbS257I7-sfR7gJV2hVCXiJL0tpmhIL6UvdNAi8bmwNJQtvEq6alJ5NcN_o-tzzhOTC0U0NXZ026iR"
                  />
                  <div className="absolute inset-0 bg-primary/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white mb-2">
                      edit
                    </span>
                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">
                      Update Hero
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-white px-2 py-1 text-[8px] font-black uppercase tracking-widest">
                    Main Hero
                  </div>
                </div>
                <div className="group relative aspect-square bg-surface-container-low overflow-hidden cursor-pointer">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    data-alt="detailed close-up shot of a high-tech sneaker sole with aggressive tread pattern and carbon fiber details"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBll2PWxFr_h9lVbpqHp0WCvcMMOaVNLwVN_ZqlyEjSciIppMczeFZSnxaSaFRZGo_MtUGWRKCkbdvx3aRv5CIkIlL39PmwMw-F7RJYimaXAEu21A7jsSw7F8GHzdf88EozvH1TxLJwMIdMvDI4WWOfxkERsDwbZuG-K31fpwpql04Iq91CaxeRZhKy4LmGZbZXNc6lOIqQTxnwlmWeXKQWKKXFQup4PQ_guvlwnqOMKk8KDhT7ukdpTjjEbWxpqXT8hBrx2au9aKTk"
                  />
                  <div className="absolute inset-0 bg-primary/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white mb-2">
                      delete
                    </span>
                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">
                      Remove Side
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-white px-2 py-1 text-[8px] font-black uppercase tracking-widest">
                    Sole Detail
                  </div>
                </div>
                <div className="group relative aspect-square border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined opacity-30 text-4xl mb-2">
                    add_photo_alternate
                  </span>
                  <span className="text-[10px] opacity-40 font-bold uppercase tracking-widest">
                    Add View
                  </span>
                </div>
              </div>
            </section>

            <section className="bg-surface-container-low p-10">
              <h3 className="bebas text-2xl tracking-wide mb-8">
                Inventory Management
              </h3>
              <div className="grid grid-cols-3 gap-8">
                <div className="p-6 bg-white border-l-4 border-primary">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">
                      Current Stock
                    </span>
                    <span className="material-symbols-outlined text-primary scale-75">
                      inventory
                    </span>
                  </div>
                  <span className="text-4xl font-headline font-bold">242</span>
                  <p className="text-[10px] opacity-40 mt-2">
                    Units across 4 warehouses
                  </p>
                </div>
                <div className="p-6 bg-white border-l-4 border-on-surface">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">
                      Low Alert
                    </span>
                    <span className="material-symbols-outlined opacity-30 scale-75">
                      notifications_active
                    </span>
                  </div>
                  <input
                    className="text-4xl font-headline font-bold w-full border-none p-0 focus:ring-0"
                    type="number"
                    value="15"
                  />
                  <p className="text-[10px] opacity-40 mt-2">
                    Notify when below threshold
                  </p>
                </div>
                <div className="p-6 bg-white border-l-4 border-on-surface">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">
                      Reserved
                    </span>
                    <span className="material-symbols-outlined opacity-30 scale-75">
                      bookmark
                    </span>
                  </div>
                  <span className="text-4xl font-headline font-bold">12</span>
                  <p className="text-[10px] opacity-40 mt-2">
                    Pending customer checkouts
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="col-span-4 space-y-8">
            <div className="bg-on-surface text-white p-8">
              <h4 className="bebas text-xl tracking-widest mb-6">
                Publishing Status
              </h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest opacity-60">
                    Current Visibility
                  </span>
                  <span className="px-2 py-0.5 bg-green-500 text-[8px] font-black uppercase">
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest opacity-60">
                    Last Updated
                  </span>
                  <span className="text-[10px] font-mono">12 OCT 2024</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex gap-4">
                  <button className="flex-1 bg-white text-on-surface py-3 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-primary hover:text-white">
                    Preview Live
                  </button>
                  <button className="px-3 border border-white/20 hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined scale-75">
                      more_vert
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-high p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">
                  analytics
                </span>
                <h4 className="bebas text-xl tracking-widest">SEO Metadata</h4>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">
                    Meta Title
                  </label>
                  <input
                    className="w-full bg-white border-0 py-2 px-3 text-xs focus:ring-1 focus:ring-primary"
                    type="text"
                    value="Velocity Runner X | Urban Footwear | StreetRiot"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">
                    Slug
                  </label>
                  <div className="flex items-center bg-white border-0 py-2 px-3">
                    <span className="text-[10px] opacity-30 mr-1">
                      /products/
                    </span>
                    <input
                      className="w-full bg-transparent border-none p-0 text-xs focus:ring-0"
                      type="text"
                      value="velocity-runner-x"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">
                    Meta Description
                  </label>
                  <textarea
                    className="w-full bg-white border-0 py-2 px-3 text-xs focus:ring-1 focus:ring-primary resize-none"
                    rows="3"
                  >
                    Shop the new StreetRiot Velocity Runner X. The ultimate
                    urban high-performance sneaker with carbon-fiber tech.
                  </textarea>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-8">
              <h4 className="bebas text-xl tracking-widest mb-6">
                Associations
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white group cursor-pointer hover:border-primary border border-transparent transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined opacity-30 text-sm">
                      folder
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      AW24 Collection
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    close
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white group cursor-pointer hover:border-primary border border-transparent transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined opacity-30 text-sm">
                      folder
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Noir Series
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    close
                  </span>
                </div>
                <button className="w-full mt-4 py-3 border border-dashed border-outline-variant text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
                  Add To Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
