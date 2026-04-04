import Link from 'next/link';
import { createProductHref } from '@/app/data/products';

const productHref = (product: {
  id: number;
  name: string;
  price: number;
  collection: string;
  image: string;
  category: string;
}) => createProductHref(product);

export default function Comp2() {
  return (
    <>
      <main className="pt-24 pb-20 md:pb-0 px-6 md:px-12 min-h-screen">
        <section className="mb-12">
          <div className="flex flex-col gap-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Global Search Explorer
            </label>
            <div className="relative w-full max-w-4xl border-b-2 border-on-surface focus-within:border-primary transition-colors flex items-center">
              <span className="material-symbols-outlined text-3xl mr-4">
                search
              </span>
              <input
                className="w-full bg-transparent border-none focus:ring-0 text-5xl md:text-7xl font-display uppercase tracking-tight py-4"
                placeholder="Type here..."
                type="text"
                value="Jackets"
              />
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="font-technical text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                Search Results for "Jackets"
              </span>
              <div className="h-px flex-grow bg-outline-variant opacity-20"></div>
              <span className="font-technical text-sm font-bold">
                18 ITEMS FOUND
              </span>
            </div>
          </div>
        </section>
        <div className="flex flex-col md:flex-row gap-12">
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-10">
              <div>
                <h3 className="font-display text-xl tracking-wider mb-4 border-b border-outline-variant pb-2">
                  CATEGORY
                </h3>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-between group cursor-pointer">
                    <span className="font-technical text-sm text-on-surface-variant group-hover:text-primary transition-colors">
                      ALL OUTERWEAR
                    </span>
                    <span className="text-xs font-bold text-outline">(24)</span>
                  </label>
                  <label className="flex items-center justify-between group cursor-pointer">
                    <span className="font-technical text-sm text-primary transition-colors">
                      PUFFER JACKETS
                    </span>
                    <span className="text-xs font-bold text-primary">(8)</span>
                  </label>
                  <label className="flex items-center justify-between group cursor-pointer">
                    <span className="font-technical text-sm text-on-surface-variant group-hover:text-primary transition-colors">
                      BOMBER SERIES
                    </span>
                    <span className="text-xs font-bold text-outline">(12)</span>
                  </label>
                  <label className="flex items-center justify-between group cursor-pointer">
                    <span className="font-technical text-sm text-on-surface-variant group-hover:text-primary transition-colors">
                      TECHNICAL SHELLS
                    </span>
                    <span className="text-xs font-bold text-outline">(4)</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl tracking-wider mb-4 border-b border-outline-variant pb-2">
                  SIZE
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  <button className="border border-outline-variant aspect-square flex items-center justify-center font-technical text-xs hover:border-primary hover:text-primary transition-all">
                    XS
                  </button>
                  <button className="border border-on-surface bg-on-surface text-white aspect-square flex items-center justify-center font-technical text-xs transition-all">
                    S
                  </button>
                  <button className="border border-outline-variant aspect-square flex items-center justify-center font-technical text-xs hover:border-primary hover:text-primary transition-all">
                    M
                  </button>
                  <button className="border border-on-surface bg-on-surface text-white aspect-square flex items-center justify-center font-technical text-xs transition-all">
                    L
                  </button>
                  <button className="border border-outline-variant aspect-square flex items-center justify-center font-technical text-xs hover:border-primary hover:text-primary transition-all">
                    XL
                  </button>
                  <button className="border border-outline-variant aspect-square flex items-center justify-center font-technical text-xs hover:border-primary hover:text-primary transition-all">
                    2XL
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl tracking-wider mb-4 border-b border-outline-variant pb-2">
                  COLOR
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    className="w-8 h-8 bg-on-surface border border-outline-variant ring-offset-2 ring-1 ring-on-surface"
                    title="Black"
                  ></button>
                  <button
                    className="w-8 h-8 bg-primary border border-outline-variant"
                    title="Kinetic Red"
                  ></button>
                  <button
                    className="w-8 h-8 bg-surface-dim border border-outline-variant"
                    title="Steel"
                  ></button>
                  <button
                    className="w-8 h-8 bg-[#2a3c24] border border-outline-variant"
                    title="Tactical Green"
                  ></button>
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl tracking-wider mb-4 border-b border-outline-variant pb-2">
                  PRICE
                </h3>
                <div className="space-y-4">
                  <div className="velocity-bar opacity-20 relative h-1">
                    <div className="absolute left-1/4 right-0 h-full bg-primary"></div>
                    <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-3 h-3 bg-on-surface rounded-full"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-on-surface rounded-full"></div>
                  </div>
                  <div className="flex justify-between font-technical text-[10px] font-bold">
                    <span>$120.00</span>
                    <span>$450.00</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
              <div className="group relative">
                <Link href={productHref({ id: 2, name: 'VOID SHELL v1.4', price: 385, collection: 'OUTERWEAR / TECHNO', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgryweli9dBU2KXApNAoIl3-ws1TLdfVic6aUvfkbF1ugEZOIGJicoBk48NphtF8wFN60EO6jUJLV5mc9-lrighBfb0YzPpkGRdspa5yWkSngMRmeuaAG0U3Efi7y2Kc5CcalyMcjlUVtMIMG6Jy-mqkNhxqpvFnvHht0TvdrMAOnCv6AyF0_K98BuZ899J5ytpzUp8yWttAjY7KDPs4tfGOCIJjAzffwilRmQODj8bpMTfGVUbqkdNaZfZxgiBJ_4gse4eZeJMrcd', category: 'Jackets' })} className="absolute inset-0 z-10" aria-label="Open VOID SHELL v1.4" />
                <div className="relative overflow-hidden bg-surface-container-low aspect-[4/5]">
                  <img
                    alt="Urban tech jacket"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    data-alt="Male model in urban setting wearing a high-tech black modular jacket with reflective details, neon city lights in background"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgryweli9dBU2KXApNAoIl3-ws1TLdfVic6aUvfkbF1ugEZOIGJicoBk48NphtF8wFN60EO6jUJLV5mc9-lrighBfb0YzPpkGRdspa5yWkSngMRmeuaAG0U3Efi7y2Kc5CcalyMcjlUVtMIMG6Jy-mqkNhxqpvFnvHht0TvdrMAOnCv6AyF0_K98BuZ899J5ytpzUp8yWttAjY7KDPs4tfGOCIJjAzffwilRmQODj8bpMTfGVUbqkdNaZfZxgiBJ_4gse4eZeJMrcd"
                  />
                  <div className="absolute top-4 left-0 bg-primary text-white font-display text-sm px-4 py-1 tracking-widest uppercase">
                    New Arrival
                  </div>
                  <button className="absolute bottom-4 right-4 z-20 w-12 h-12 bg-on-surface text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                    <span className="material-symbols-outlined">
                      add_shopping_cart
                    </span>
                  </button>
                </div>
                <div className="mt-6 flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-display text-2xl tracking-tight leading-none group-hover:text-primary transition-colors">
                      VOID SHELL v1.4
                    </h4>
                    <span className="font-technical font-bold text-lg">
                      $385.00
                    </span>
                  </div>
                  <p className="font-technical text-xs text-on-secondary-container uppercase tracking-widest">
                    Techno-Cotton / Modular / 01
                  </p>
                </div>
              </div>

              <div className="group relative">
                <Link href={productHref({ id: 4, name: 'KINETIC PUFFER', price: 290, collection: 'VELOCITY GEAR', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYpfwl45t2QICt9dW_uBqCA-4QxzxSX_2Ar4Y48aWnyxDULL7s9siycpY6Tx-EodQQLJkFq4VeTZKA5raaq4vwJFFiuGcXo6lu13ZOCfMIf-qjOwKcRgRNb8WBdktMgFHegltpSA8CEtmqLhiJIJu78pf3VF7-YeNtlK9xu4Z7mojQvTqfqIGdKXyCxlFtaNnXpGE-0bZ56iMY6qUsZIIz2LbWzVCJ5avfpQxwViocfXDUwDrTA9GJQ_nAMSO67htf6Ui9H1Nek1r3', category: 'Jackets' })} className="absolute inset-0 z-10" aria-label="Open KINETIC PUFFER" />
                <div className="relative overflow-hidden bg-surface-container-low aspect-[4/5]">
                  <img
                    alt="Red oversized puffer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    data-alt="Hyper-saturated red oversized puffer jacket with industrial straps, studio lighting against a minimal grey background"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYpfwl45t2QICt9dW_uBqCA-4QxzxSX_2Ar4Y48aWnyxDULL7s9siycpY6Tx-EodQQLJkFq4VeTZKA5raaq4vwJFFiuGcXo6lu13ZOCfMIf-qjOwKcRgRNb8WBdktMgFHegltpSA8CEtmqLhiJIJu78pf3VF7-YeNtlK9xu4Z7mojQvTqfqIGdKXyCxlFtaNnXpGE-0bZ56iMY6qUsZIIz2LbWzVCJ5avfpQxwViocfXDUwDrTA9GJQ_nAMSO67htf6Ui9H1Nek1r3"
                  />
                  <button className="absolute bottom-4 right-4 z-20 w-12 h-12 bg-on-surface text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                    <span className="material-symbols-outlined">
                      add_shopping_cart
                    </span>
                  </button>
                </div>
                <div className="mt-6 flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-display text-2xl tracking-tight leading-none group-hover:text-primary transition-colors">
                      KINETIC PUFFER
                    </h4>
                    <span className="font-technical font-bold text-lg">
                      $290.00
                    </span>
                  </div>
                  <p className="font-technical text-xs text-on-secondary-container uppercase tracking-widest">
                    Down-Fill / Kinetic-Red / 04
                  </p>
                </div>
              </div>

              <div className="group relative">
                <Link href={productHref({ id: 6, name: 'RAW BOMBER X', price: 210, collection: 'EDITORIAL SERIES', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHn1Dn6oq3CpwegkwP7SqPJlSNXH-cArhQu_vEq6QW_8bPw9OBgWz5ib68DZU3kM9Zg-TRLGxRkDeNgnPKCOs7VDkRyPYn9Fg-2i_GJE3-A5g8zyFUWQaXDLuHozoroOW0kdrqlxLyz8X0fuiJiFiu8x_yqcFypB8dKgyY8sxhpXDBZa_YRggK2f7DXFf0A5flbzuzR_iVWRbPmZ2joP76ta-DdHMOp96qUFk_141_8wVy6r0svZgXd3_R0gyUsPrarkRGVcGnKZBD', category: 'Jackets' })} className="absolute inset-0 z-10" aria-label="Open RAW BOMBER X" />
                <div className="relative overflow-hidden bg-surface-container-low aspect-[4/5]">
                  <img
                    alt="Cropped bomber jacket"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    data-alt="Cropped distressed denim bomber jacket with heavy silver hardware, styled on a mannequin in a gritty industrial warehouse"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHn1Dn6oq3CpwegkwP7SqPJlSNXH-cArhQu_vEq6QW_8bPw9OBgWz5ib68DZU3kM9Zg-TRLGxRkDeNgnPKCOs7VDkRyPYn9Fg-2i_GJE3-A5g8zyFUWQaXDLuHozoroOW0kdrqlxLyz8X0fuiJiFiu8x_yqcFypB8dKgyY8sxhpXDBZa_YRggK2f7DXFf0A5flbzuzR_iVWRbPmZ2joP76ta-DdHMOp96qUFk_141_8wVy6r0svZgXd3_R0gyUsPrarkRGVcGnKZBD"
                  />
                  <button className="absolute bottom-4 right-4 z-20 w-12 h-12 bg-on-surface text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                    <span className="material-symbols-outlined">
                      add_shopping_cart
                    </span>
                  </button>
                </div>
                <div className="mt-6 flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-display text-2xl tracking-tight leading-none group-hover:text-primary transition-colors">
                      RAW BOMBER X
                    </h4>
                    <span className="font-technical font-bold text-lg">
                      $210.00
                    </span>
                  </div>
                  <p className="font-technical text-xs text-on-secondary-container uppercase tracking-widest">
                    Distressed Denim / Silver Hardware
                  </p>
                </div>
              </div>

              <div className="group relative">
                <Link href={productHref({ id: 201, name: 'V-12 Apex Shell', price: 345, collection: 'URBAN TECH / SHELL', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5ihs_H2Q5i9M_QsBvBDkFq8Mkz4-WwzOCXDmNimkPh9AB2_QQX4KzKs6IiOb-VrJVKMc24cFJ297VDOWZCRW9HycKyPwCFtr0VDkJNJUTfrSAEgBt7X_SIo5I2TFemS_vSauGIVuMn1bUBwprWHW8swcx2dSmqupdkoRcfzG-gKWbps6V4JkUl5HCQa1eNYx1jnsda5Stq2UyVD0FhRKqVSFegoCMEJ1BXraOcPO0NihDzS_2SuNgDAvjQqDC57hgvlQPD0cF8FyW', category: 'Outerwear' })} className="absolute inset-0 z-10" aria-label="Open V-12 Apex Shell" />
                <div className="relative overflow-hidden bg-surface-container-low aspect-[4/5]">
                  <img
                    alt="Reflective jacket"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    data-alt="Ghostly reflective silver windbreaker catching flash light, sharp shadows on a dark brick wall backdrop"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgGvZvDsqg4aYpgi1qra8_MYvUafqla2hDMj_repdajGPJSGIPeHl58OVda1guUJsXVgaDJgMhYDZXYdU4CWGj6qVZdDQEqQGsmzmpAEKckon8b0_aPpSUSW_udliA0E_EG3teuwnKeR5gFOMmlXPKNPWo8OTGpN-ITTaL0ACPQ7WwFLx7yLz1MNyz2DAPhP12PERoMpNpIKvo4ut8sxX4PlzKTXn3vV0lc7zPa_BQkEl7B5YoJo4cdFKqIGftbzts8dXw38Fo7Kdb"
                  />
                  <button className="absolute bottom-4 right-4 z-20 w-12 h-12 bg-on-surface text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                    <span className="material-symbols-outlined">
                      add_shopping_cart
                    </span>
                  </button>
                </div>
                <div className="mt-6 flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-display text-2xl tracking-tight leading-none group-hover:text-primary transition-colors">
                      MIRROR SHIELD
                    </h4>
                    <span className="font-technical font-bold text-lg">
                      $420.00
                    </span>
                  </div>
                  <p className="font-technical text-xs text-on-secondary-container uppercase tracking-widest">
                    3M Reflective / Weather-Proof
                  </p>
                </div>
              </div>

              <div className="group relative">
                <Link href={productHref({ id: 202, name: 'KINETIC HEAVYWEIGHT', price: 180, collection: 'NOIR FLEECE / CORE', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUp0llnS7w0VCmZHxn0GGwyMtP3G8DQAHOjvvGxiPqyEQUXfUhec1pld1W_DM2T3mUVmu7qbkXKuqhDcVh5EiB-EvWcZ-Ee44Tyta3D_1JbVRO6RPuMCqXxeBrmFojNLesGeztq1rYLC6LtU6fCHgbW3co9ACu3CmppeeFBb59z9pQUzVB2Dm6raS9nArLz1pXbAAiuSb201lLAcFxKY1FNqeYLY3UfVrouBQ1zLN4ySXyKLafqWtZNdZCWplwhQ4SvC7pjLt1-zl5', category: 'Hoodies' })} className="absolute inset-0 z-10" aria-label="Open KINETIC HEAVYWEIGHT" />
                <div className="relative overflow-hidden bg-surface-container-low aspect-[4/5]">
                  <img
                    alt="Tactical vest"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    data-alt="Multi-pocket tactical utility vest in matte forest green, military styling, rugged texture close-up"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrWrL2XNurgE2fFl9msUqU8ukECj50X2PBy3vE4MMa1SZuHTWhoC5J1E7r5CpV2jkA9BnK5KZMJqVPE3G0zbp_oMrZVejHiQ7LkHCIQBTMt6qxORc7jvQFm1ImzhPpMpdrT1AVuxDEuWSUsujZgxqcOo8ht1UKeNPoxQmvcQ2npY_wWnxYTv8h4XZP0k-czEu6SU7pny3CaGCiY0GBR5lzhIs03ZlAW_8PpnfxD4zzt0vn94XGVbhFmnj1CaZ3vpjaURUXRbeO1Wyd"
                  />
                  <div className="absolute top-4 left-0 bg-on-surface text-white font-display text-sm px-4 py-1 tracking-widest uppercase">
                    Sold Out
                  </div>
                  <button className="absolute bottom-4 right-4 z-20 w-12 h-12 bg-on-surface text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                    <span className="material-symbols-outlined">
                      add_shopping_cart
                    </span>
                  </button>
                </div>
                <div className="mt-6 flex flex-col gap-1 opacity-50">
                  <div className="flex justify-between items-start">
                    <h4 className="font-display text-2xl tracking-tight leading-none">
                      VET-01 UTILITY
                    </h4>
                    <span className="font-technical font-bold text-lg">
                      $180.00
                    </span>
                  </div>
                  <p className="font-technical text-xs text-on-secondary-container uppercase tracking-widest">
                    Tactical Nylon / Multi-Pocket
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="relative overflow-hidden bg-surface-container-low aspect-[4/5]">
                  <img
                    alt="Anorak jacket"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    data-alt="Oversized beige anorak jacket with asymmetric zip and orange accents, high fashion streetwear editorial style"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqELCVpWSy5tyNkcquG6avLxWlyY4KdmlLi1pg5sRUfCVO-bF7-hlAZtsaeaTzXLPfc_HvffSaTrl3Ojwe3eS3LHX0Ju8cpxxlFzQ0hE6vA5lgYjrCSMb2k3wu41elFhweDmNqEBbrK9MpVfUoaXYGDg10CU0clioBBzW_f4fiCnmVrkRp8cIYEEz-pYPkSc77eFUh8mNy25FLzj6yZPzZBre27zCe3lm4CDdZTNWAtElMXtNWHXZRscCRKX4OfFkNgSKHx_FteR7a"
                  />
                  <button className="absolute bottom-4 right-4 w-12 h-12 bg-on-surface text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                    <span className="material-symbols-outlined">
                      add_shopping_cart
                    </span>
                  </button>
                </div>
                <div className="mt-6 flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-display text-2xl tracking-tight leading-none group-hover:text-primary transition-colors">
                      DRIFT ANORAK
                    </h4>
                    <span className="font-technical font-bold text-lg">
                      $310.00
                    </span>
                  </div>
                  <p className="font-technical text-xs text-on-secondary-container uppercase tracking-widest">
                    Lightweight Ripstop / Desert
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-20 flex justify-center">
              <button className="px-12 py-4 bg-on-surface text-white font-display text-xl tracking-widest uppercase hover:bg-primary transition-colors duration-300 active:scale-95">
                LOAD MORE ENTRIES
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
