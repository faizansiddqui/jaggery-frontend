export default function Comp1() {
  return (
    <>
      <main className="ml-64 min-h-screen flex flex-col">
        <header className="flex justify-between items-center w-full px-8 h-16 sticky top-0 z-30 bg-[#fcf8f8] dark:bg-[#1c1b1b] border-b-0">
          <div className="flex items-center gap-8 flex-1">
            <span className="text-2xl font-black text-[#1c1b1b] dark:text-[#fcf8f8] tracking-[0.05em] font-['Space_Grotesk'] uppercase">
              StreetRiot ADMIN
            </span>
            <div className="relative flex-1 max-w-md ml-4">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface opacity-40">
                search
              </span>
              <input
                className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary h-10 pl-10 pr-4 text-xs font-['Space_Grotesk'] tracking-widest uppercase"
                placeholder="SEARCH PRODUCTS, SKU, COLLECTIONS..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-on-surface opacity-70 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              <button className="p-2 text-on-surface opacity-70 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined">mail</span>
              </button>
            </div>
            <div className="h-6 w-[1px] bg-outline-variant opacity-20"></div>
            <button className="font-['Space_Grotesk'] uppercase text-sm tracking-widest font-bold text-primary hover:opacity-80">
              Profile
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-[1400px]">
          <section className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-on-surface pb-6">
            <div className="space-y-1">
              <h2 className="display-lg text-6xl font-black bebas uppercase tracking-tighter leading-none">
                Inventory Control
              </h2>
              <p className="text-sm tracking-[0.3em] uppercase font-['Space_Grotesk'] font-medium text-secondary">
                Global Product Manifest v2.4
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-surface-container-high text-on-surface px-8 py-4 bebas text-xl tracking-wider hover:bg-on-surface hover:text-surface transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined">file_download</span>
                Export CSV
              </button>
              <button className="bg-on-surface text-surface px-8 py-4 bebas text-xl tracking-wider hover:bg-primary transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined">add</span>
                Add New Product
              </button>
            </div>
          </section>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-4 bg-surface-container-low p-6 flex flex-col justify-between">
              <span className="text-xs uppercase tracking-widest font-bold opacity-60">
                Total Active Stock
              </span>
              <div className="flex items-baseline gap-4 mt-4">
                <span className="text-5xl font-black font-['Space_Grotesk']">
                  14,208
                </span>
                <span className="text-primary font-bold text-sm">
                  +12% THIS WEEK
                </span>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-6 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] uppercase font-bold tracking-widest mb-1 opacity-50">
                  Filter by Category
                </label>
                <select className="w-full bg-surface-container-low border-none focus:ring-0 text-sm font-bold uppercase tracking-widest h-10 px-4">
                  <option>All Categories</option>
                  <option>Outerwear</option>
                  <option>Graphic Tees</option>
                  <option>Footwear</option>
                  <option>Accessories</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] uppercase font-bold tracking-widest mb-1 opacity-50">
                  Status
                </label>
                <select className="w-full bg-surface-container-low border-none focus:ring-0 text-sm font-bold uppercase tracking-widest h-10 px-4">
                  <option>All Statuses</option>
                  <option>Published</option>
                  <option>Draft</option>
                  <option>Archived</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] uppercase font-bold tracking-widest mb-1 opacity-50">
                  Availability
                </label>
                <select className="w-full bg-surface-container-low border-none focus:ring-0 text-sm font-bold uppercase tracking-widest h-10 px-4">
                  <option>In Stock Only</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
              <button className="bg-on-surface text-surface h-10 px-6 bebas text-lg tracking-widest self-end hover:bg-primary transition-colors">
                Apply
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-on-surface text-white px-6 py-3">
            <div className="flex items-center gap-4">
              <input
                className="w-4 h-4 bg-transparent border-white/40 text-primary focus:ring-0"
                type="checkbox"
              />
              <span className="text-xs font-bold uppercase tracking-widest">
                3 Products Selected
              </span>
            </div>
            <div className="flex items-center gap-6">
              <button className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit Bulk
              </button>
              <button className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  visibility_off
                </span>
                Unpublish
              </button>
              <button className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  delete
                </span>
                Delete
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container text-[10px] uppercase font-black tracking-[0.2em] border-b border-on-surface/10">
                  <th className="px-6 py-4 w-12">
                    <input
                      className="w-4 h-4 border-on-surface/20 text-primary focus:ring-0"
                      type="checkbox"
                    />
                  </th>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name &amp; SKU</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Stock</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-surface/5">
                <tr className="group hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-5">
                    <input
                      checked=""
                      className="w-4 h-4 border-on-surface/20 text-primary focus:ring-0"
                      type="checkbox"
                    />
                  </td>
                  <td className="px-6 py-5">
                    <img
                      className="w-16 h-16 object-cover bg-surface-container grayscale group-hover:grayscale-0 transition-all"
                      data-alt="Close-up of a high-end black waterproof techwear jacket with tactical zippers and reflective details against a clinical grey background"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBj4gCKNdVWBdxWp1VWMuxQrtEPuy26kYuruWiFKCOW7K3cRy0Nt5xAAbDgmHbE-yPYyK31eEdwtAzIje5q63S67z-J4ngGAZWdbi8d2nJrlVrYltBCOU1y4U88SsA3nag1psrIibFc0TRSv0YyxUchbIwPtB7IkXUNA3dRStipxOlfSO5Z1ktCkyUo9uIWcHOobErVaKo-RA5GsxGYLgb7KtpBrFyitbz1vRcE1x8UFX5u-XtyQh0lP8l42vZXSjyj8-n_aXmf5oz2"
                    />
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-black uppercase tracking-tight text-lg">
                      AX-12 Urban Shell
                    </div>
                    <div className="text-[10px] text-secondary font-medium tracking-widest">
                      SKU: SRT-JKT-092
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold uppercase bg-surface-container-high px-2 py-1 tracking-widest">
                      Outerwear
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-['Space_Grotesk'] font-bold">
                    242{" "}
                    <span className="text-[10px] text-primary block">
                      IN STOCK
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-['Space_Grotesk'] font-black text-lg">
                    $289.00
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      Published
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-primary hover:text-white transition-colors">
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </button>
                  </td>
                </tr>

                <tr className="group hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-5">
                    <input
                      className="w-4 h-4 border-on-surface/20 text-primary focus:ring-0"
                      type="checkbox"
                    />
                  </td>
                  <td className="px-6 py-5">
                    <img
                      className="w-16 h-16 object-cover bg-surface-container grayscale group-hover:grayscale-0 transition-all"
                      data-alt="Oversized white luxury heavyweight cotton t-shirt featuring aggressive bold red typography on the chest, studio lighting"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUfYwxQASZpIsHapQHkpIU5SO_rkeQkzl37l6Ve5VK7flhPgs3ieD_Zp0uDltxN_yOc1OQIgjWSgJNWGMQQZQFFE1HDn_hGgTy-Oum55WEGX6QcEORDBmpKaG0FynpT6U_-EDUDV4DeDZgMXuHfYO4IpTGxLIJb4eI6zWGnuQaYUGbIAGJBNNsAK20zrRdW5PJ8IWuTZtyq-zoJnFuXzqVhtUT5gmEVclimWcBEOdCkrhsLttOHNyVJ2J4vvstCqgdoM96MKyabm5T"
                    />
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-black uppercase tracking-tight text-lg">
                      Core Logotype Tee
                    </div>
                    <div className="text-[10px] text-secondary font-medium tracking-widest">
                      SKU: SRT-TEE-441
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold uppercase bg-surface-container-high px-2 py-1 tracking-widest">
                      Graphic Tees
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-['Space_Grotesk'] font-bold">
                    12{" "}
                    <span className="text-[10px] text-error block">
                      LOW STOCK
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-['Space_Grotesk'] font-black text-lg">
                    $65.00
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      Published
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-primary hover:text-white transition-colors">
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </button>
                  </td>
                </tr>

                <tr className="group hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-5">
                    <input
                      checked=""
                      className="w-4 h-4 border-on-surface/20 text-primary focus:ring-0"
                      type="checkbox"
                    />
                  </td>
                  <td className="px-6 py-5">
                    <img
                      className="w-16 h-16 object-cover bg-surface-container grayscale group-hover:grayscale-0 transition-all"
                      data-alt="High-top futuristic sneakers in neon and monochrome colors, high-contrast streetwear aesthetic, architectural sole design"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWaTdV_4ZB4cN0HcSj_AsEdLDgzHUKyeSMqApaA6xbq4zm0Yb05M8voAZTKs6GqNhQsxjsWdECBUcvUNcoFTRiOBHCNji5jf14_rFXzXbRZDVbsIisAeqkRbXTeZ7gjxNGvKSPaWDtq4t2gV4L6NJP9nO1MjvZiBGPBdQ_oXhCXfz0BP9nyTWzFDcsUTnnN9fiYut8IAjJjtE9FJ4nGHK0DS1DXU1-qoEM9jsMVdhz2huD0oDzUkE3XCtQOIN8_QXQ2_97Sar8LzjE"
                    />
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-black uppercase tracking-tight text-lg">
                      Velocity Runner X
                    </div>
                    <div className="text-[10px] text-secondary font-medium tracking-widest">
                      SKU: SRT-FOT-112
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold uppercase bg-surface-container-high px-2 py-1 tracking-widest">
                      Footwear
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-['Space_Grotesk'] font-bold">
                    0{" "}
                    <span className="text-[10px] opacity-40 block">
                      OUT OF STOCK
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-['Space_Grotesk'] font-black text-lg">
                    $210.00
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary opacity-50">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      Draft
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-primary hover:text-white transition-colors">
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </button>
                  </td>
                </tr>

                <tr className="group hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-5">
                    <input
                      checked=""
                      className="w-4 h-4 border-on-surface/20 text-primary focus:ring-0"
                      type="checkbox"
                    />
                  </td>
                  <td className="px-6 py-5">
                    <img
                      className="w-16 h-16 object-cover bg-surface-container grayscale group-hover:grayscale-0 transition-all"
                      data-alt="Rugged utility belt in tactical nylon with heavy-duty cobra buckles and multiple modular attachment points, flat lay"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNFBKKX7bkXYFc8XqH5nhkY-2RUG3xpBjIUaweLJaCJ8J_YiNhuLJEJGI-9eX7BVMeTIdY0uESDWTR_iXHbwVLfjcL6jdYSmJwCOsiMasPJ_PqO13K5DcRxr8LkqZSBrNRB1NMpIoRi_r5_LBFBTIPn4m1w7shHRD9z52ZLuDSrpn8_5SNjlPC9YpGzQoSq-ffbwGoAntcxLPjX-uKG5E9tCsLLS-U_wiFZhUYJgjtbI-dh4uSLag2ul1_UwxmLuJQsWykxkUSSOiX"
                    />
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-black uppercase tracking-tight text-lg">
                      Modular Utility Belt
                    </div>
                    <div className="text-[10px] text-secondary font-medium tracking-widest">
                      SKU: SRT-ACC-005
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold uppercase bg-surface-container-high px-2 py-1 tracking-widest">
                      Accessories
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-['Space_Grotesk'] font-bold">
                    1,105{" "}
                    <span className="text-[10px] text-primary block">
                      IN STOCK
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-['Space_Grotesk'] font-black text-lg">
                    $45.00
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      Published
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-primary hover:text-white transition-colors">
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <footer className="flex justify-between items-center py-10">
            <div className="text-[10px] uppercase font-black tracking-widest opacity-40">
              Showing 1-25 of 1,208 entries
            </div>
            <div className="flex gap-1">
              <button className="w-10 h-10 border border-on-surface/10 flex items-center justify-center text-on-surface hover:bg-on-surface hover:text-surface transition-colors font-bold">
                01
              </button>
              <button className="w-10 h-10 border-on-surface/10 flex items-center justify-center text-on-surface bg-on-surface text-surface font-bold">
                02
              </button>
              <button className="w-10 h-10 border border-on-surface/10 flex items-center justify-center text-on-surface hover:bg-on-surface hover:text-surface transition-colors font-bold">
                03
              </button>
              <button className="w-10 h-10 border border-on-surface/10 flex items-center justify-center text-on-surface hover:bg-on-surface hover:text-surface transition-colors font-bold">
                04
              </button>
              <span className="px-2 self-end pb-2 font-bold opacity-30">
                ...
              </span>
              <button className="w-10 h-10 border border-on-surface/10 flex items-center justify-center text-on-surface hover:bg-on-surface hover:text-surface transition-colors font-bold">
                48
              </button>
              <button className="w-10 h-10 border border-on-surface/10 flex items-center justify-center text-on-surface hover:bg-on-surface hover:text-surface transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </footer>
        </div>

        <div className="fixed bottom-0 right-0 w-full h-1 bg-primary z-50"></div>
      </main>
    </>
  );
}
