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
      <main className="max-w-[1920px] mx-auto px-8 py-8 flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-28 space-y-10">
            <section>
              <h3 className="bebas text-xl tracking-widest mb-6 border-l-4 border-primary pl-3">
                CATEGORY
              </h3>
              <ul className="space-y-3 space text-sm font-medium">
                <li className="flex justify-between items-center group cursor-pointer hover:text-primary transition-colors">
                  <span>OUTERWEAR</span>
                  <span className="text-[10px] text-on-surface/40 group-hover:text-primary">
                    12
                  </span>
                </li>
                <li className="flex justify-between items-center group cursor-pointer text-primary">
                  <span>TOPS &amp; HOODIES</span>
                  <span className="text-[10px]">08</span>
                </li>
                <li className="flex justify-between items-center group cursor-pointer hover:text-primary transition-colors">
                  <span>BOTTOMS</span>
                  <span className="text-[10px] text-on-surface/40 group-hover:text-primary">
                    06
                  </span>
                </li>
                <li className="flex justify-between items-center group cursor-pointer hover:text-primary transition-colors">
                  <span>ACCESSORIES</span>
                  <span className="text-[10px] text-on-surface/40 group-hover:text-primary">
                    04
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="bebas text-xl tracking-widest mb-6 border-l-4 border-primary pl-3">
                SIZE
              </h3>
              <div className="grid grid-cols-4 gap-2">
                <button className="h-10 border border-on-surface/10 hover:border-primary hover:text-primary text-xs space font-bold transition-all">
                  XS
                </button>
                <button className="h-10 border-2 border-primary bg-primary text-white text-xs space font-bold">
                  S
                </button>
                <button className="h-10 border border-on-surface/10 hover:border-primary hover:text-primary text-xs space font-bold transition-all">
                  M
                </button>
                <button className="h-10 border border-on-surface/10 hover:border-primary hover:text-primary text-xs space font-bold transition-all">
                  L
                </button>
                <button className="h-10 border border-on-surface/10 hover:border-primary hover:text-primary text-xs space font-bold transition-all">
                  XL
                </button>
                <button className="h-10 border border-on-surface/10 opacity-30 text-xs space font-bold cursor-not-allowed">
                  XXL
                </button>
              </div>
            </section>

            <section>
              <h3 className="bebas text-xl tracking-widest mb-6 border-l-4 border-primary pl-3">
                COLOR
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  className="w-8 h-8 bg-zinc-900 border border-on-surface/10 outline outline-offset-2 outline-primary outline-2"
                  title="Black"
                ></button>
                <button
                  className="w-8 h-8 bg-[#b90c1b] border border-on-surface/10"
                  title="Kinetic Red"
                ></button>
                <button
                  className="w-8 h-8 bg-white border border-on-surface/10"
                  title="White"
                ></button>
                <button
                  className="w-8 h-8 bg-zinc-400 border border-on-surface/10"
                  title="Grey"
                ></button>
                <button
                  className="w-8 h-8 bg-zinc-200 border border-on-surface/10"
                  title="Silver"
                ></button>
              </div>
            </section>

            <section>
              <h3 className="bebas text-xl tracking-widest mb-6 border-l-4 border-primary pl-3">
                PRICE
              </h3>
              <div className="space-y-4">
                <input
                  className="w-full accent-primary bg-surface-container-high h-1 appearance-none cursor-pointer"
                  type="range"
                />
                <div className="flex justify-between space text-xs font-bold">
                  <span>{process.env.NEXT_PUBLIC_CURRENCY || '$'}0.00</span>
                  <span className="text-primary">{process.env.NEXT_PUBLIC_CURRENCY || '$'}500.00</span>
                </div>
              </div>
            </section>
            <button className="w-full bg-on-surface text-white py-4 bebas text-lg tracking-widest hover:bg-primary transition-colors">
              CLEAR FILTERS
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-on-surface/5">
            <div className="hidden md:flex gap-4">
              <button className="material-symbols-outlined text-primary">
                grid_view
              </button>
              <button className="material-symbols-outlined text-on-surface/40 hover:text-on-surface">
                view_list
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="space text-[10px] font-bold tracking-widest uppercase text-on-surface/40">
                SORT BY
              </span>
              <select className="bg-transparent border-none focus:ring-0 space text-xs font-bold cursor-pointer appearance-none pr-8">
                <option>LATEST RELEASES</option>
                <option>PRICE: LOW TO HIGH</option>
                <option>PRICE: HIGH TO LOW</option>
                <option>ALPHABETICAL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
            <div className="group relative">
              <Link href={productHref({ id: 1, name: 'KINETIC P-24 SHELL', price: 285, collection: 'OUTERWEAR / RED LINE', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCPPxeva2_roYGpDN5rerNlGmz6zoyzfNrduSt5wuJKChKQlJdaQNuoN650Bnh-v1F17aexaiDdCfX_W0ZRjEaijRW3whfNF0h2Hx3DpaU6yBtTJq6oCZ3XDtmVXvkgM91-RpYY-R_AHUtDM6PvyGgiK7nnMbYjiYo0E734ZjkhnYpM0XuZIwksg46v4EztjbMV8OtIc9SC4TEId6DK3iDB8QIpApL7Q9cgtom_W5A7OIkJXm1-Soke8SI56Cbqj_qhRt56HaFoqDT', category: 'Jackets' })} className="absolute inset-0 z-10" aria-label="Open KINETIC P-24 SHELL" />
              <div className="aspect-[4/5] bg-surface-container-low overflow-hidden relative">
                <img
                  alt="Product"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                  data-alt="Technical black puffer jacket with waterproof zippers and reflective details on a clean white studio background"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCPPxeva2_roYGpDN5rerNlGmz6zoyzfNrduSt5wuJKChKQlJdaQNuoN650Bnh-v1F17aexaiDdCfX_W0ZRjEaijRW3whfNF0h2Hx3DpaU6yBtTJq6oCZ3XDtmVXvkgM91-RpYY-R_AHUtDM6PvyGgiK7nnMbYjiYo0E734ZjkhnYpM0XuZIwksg46v4EztjbMV8OtIc9SC4TEId6DK3iDB8QIpApL7Q9cgtom_W5A7OIkJXm1-Soke8SI56Cbqj_qhRt56HaFoqDT"
                />
                <div className="absolute top-4 left-0 bg-primary text-white space text-[10px] font-bold px-3 py-1 tracking-widest">
                  NEW ERA
                </div>
                <button className="absolute bottom-0 right-0 z-20 w-12 h-12 bg-on-surface text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <h4 className="bebas text-lg tracking-widest">
                  KINETIC P-24 SHELL
                </h4>
                <p className="space text-xs font-bold text-on-surface/40">
                  OUTERWEAR / RED LINE
                </p>
                <p className="space text-sm font-bold mt-2">{process.env.NEXT_PUBLIC_CURRENCY || '$'}285.00</p>
              </div>
            </div>

            <div className="group relative">
              <Link href={productHref({ id: 101, name: 'A-SYSTEM OVER HOOD', price: 145, collection: 'TOPS / CORE SERIES', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi2LBbQZCIFwCDB7YxF2C8Jv9wLphvAPwfwJ20xySq3CW8TiyToikeAp0DRoQp84i1ALiCcgkeKnVRYrGlDH_7i74yzXC4gJ5GC8l6qHF9-TkaFMYyTmoczCz1HVnL5KgIjLqEMR1VHeJx5q8FIZF09TvEvkAfgWZXE1YOI-4G-BkHLr0VYxF2UCHZtu8HjsgOR3DMTIGhDGAZleuEUFfrAzPyvkf0XSIlSnMHpv2Al4-KcyF1NY4XgEJsrEHtyn92cUaghFH0cP5n', category: 'Hoodies' })} className="absolute inset-0 z-10" aria-label="Open A-SYSTEM OVER HOOD" />
              <div className="aspect-[4/5] bg-surface-container-low overflow-hidden relative">
                <img
                  alt="Product"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                  data-alt="Heavyweight oversized gray hoodie with minimal branding and thick ribbed cuffs on a minimalist grey background"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi2LBbQZCIFwCDB7YxF2C8Jv9wLphvAPwfwJ20xySq3CW8TiyToikeAp0DRoQp84i1ALiCcgkeKnVRYrGlDH_7i74yzXC4gJ5GC8l6qHF9-TkaFMYyTmoczCz1HVnL5KgIjLqEMR1VHeJx5q8FIZF09TvEvkAfgWZXE1YOI-4G-BkHLr0VYxF2UCHZtu8HjsgOR3DMTIGhDGAZleuEUFfrAzPyvkf0XSIlSnMHpv2Al4-KcyF1NY4XgEJsrEHtyn92cUaghFH0cP5n"
                />
                <button className="absolute bottom-0 right-0 z-20 w-12 h-12 bg-on-surface text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <h4 className="bebas text-lg tracking-widest">
                  A-SYSTEM OVER HOOD
                </h4>
                <p className="space text-xs font-bold text-on-surface/40">
                  TOPS / CORE SERIES
                </p>
                <p className="space text-sm font-bold mt-2">{process.env.NEXT_PUBLIC_CURRENCY || '$'}145.00</p>
              </div>
            </div>

            <div className="group relative">
              <Link href={productHref({ id: 102, name: 'VERTEX BOX TEE', price: 65, collection: 'TOPS / ESSENTIALS', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQEANNhf_7ehP2gPDxVKUWJdT57pdxzV7CFexZ-E3nDpxsB9eIubUlqyo_B5n51iwjIWNjYHFh6RMRKw6fyYpxKtArD7gvQC22S9o_c-MpLW_f6fBrq3tO92NjACvcADJsEFaxBI2U6NZkrizLmDeqn516pv4RZnI3lrm5-xQwcSix-DjXkV61G9mMjjEOHCIm8FZpaEj3K7W4Gt8zdKTiuxD7Gbv5olobvxbJUe0pQJ3bl4G2Mxgh2DY5C1NBC0bRDdsBWQ-R7Hkr', category: 'Tops' })} className="absolute inset-0 z-10" aria-label="Open VERTEX BOX TEE" />
              <div className="aspect-[4/5] bg-surface-container-low overflow-hidden relative">
                <img
                  alt="Product"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                  data-alt="White premium cotton t-shirt with subtle geometric logo print on the chest, studio lighting"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQEANNhf_7ehP2gPDxVKUWJdT57pdxzV7CFexZ-E3nDpxsB9eIubUlqyo_B5n51iwjIWNjYHFh6RMRKw6fyYpxKtArD7gvQC22S9o_c-MpLW_f6fBrq3tO92NjACvcADJsEFaxBI2U6NZkrizLmDeqn516pv4RZnI3lrm5-xQwcSix-DjXkV61G9mMjjEOHCIm8FZpaEj3K7W4Gt8zdKTiuxD7Gbv5olobvxbJUe0pQJ3bl4G2Mxgh2DY5C1NBC0bRDdsBWQ-R7Hkr"
                />
                <div className="absolute top-4 right-4 text-primary">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 z-20 w-12 h-12 bg-on-surface text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <h4 className="bebas text-lg tracking-widest">
                  VERTEX BOX TEE
                </h4>
                <p className="space text-xs font-bold text-on-surface/40">
                  TOPS / ESSENTIALS
                </p>
                <p className="space text-sm font-bold mt-2">{process.env.NEXT_PUBLIC_CURRENCY || '$'}65.00</p>
              </div>
            </div>

            <div className="group relative">
              <Link href={productHref({ id: 103, name: 'CARGO TRACK V.2', price: 210, collection: 'BOTTOMS / PERFORMANCE', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbdwvPYZTei2NzCVimmyO_-kXjhVFiW753eNMhmjhSDaaftnZQ5304iHLHtkVouJXTUWj6IhAPH8XLMYjwKtjiCEDhWdS_QCgjLSIvsZ-NYPIik4J9CF19Aeq0ULS4GYqw0aQpjY_dJowLii7n2q-5dMNirS7DhUiyyRRxHQszpfAngZRDFB0DQUmzPE2n8-iEXTIGI8BaYexbzS3EhRFcpXs_V_fb1t1oE5jhBS-ImcdlpsopBCjXFmiTUbpczBiFQ6TJ61u_Nzm', category: 'Bottoms' })} className="absolute inset-0 z-10" aria-label="Open CARGO TRACK V.2" />
              <div className="aspect-[4/5] bg-surface-container-low overflow-hidden relative">
                <img
                  alt="Product"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                  data-alt="Dark washed premium denim jeans with tapered fit and industrial stitching details"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbdwvPYZTei2NzCVimmyO_-kXjhVFiW753eNMhmjhSDaaftnZQ5304iHLHtkVouJXTUWj6IhAPH8XLMYjwKtjiCEDhWdS_QCgjLSIvsZ-NYPIik4J9CF19Aeq0ULS4GYqw0aQpjY_dJowLii7n2q-5dMNirS7DhUiyyRRxHQszpfAngZRDFB0DQUmzPE2n8-iEXTIGI8BaYexbzS3EhRFcpXs_V_fb1t1oE5jhBS-ImcdlpsopBCjXFmiTUbpczBiFQ6TJ61uM_Nzm"
                />
                <button className="absolute bottom-0 right-0 z-20 w-12 h-12 bg-on-surface text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <h4 className="bebas text-lg tracking-widest">
                  CARGO TRACK V.2
                </h4>
                <p className="space text-xs font-bold text-on-surface/40">
                  BOTTOMS / PERFORMANCE
                </p>
                <p className="space text-sm font-bold mt-2">{process.env.NEXT_PUBLIC_CURRENCY || '$'}210.00</p>
              </div>
            </div>

            <div className="group relative">
              <Link href={productHref({ id: 104, name: 'THERMAL DRI-FIT TOP', price: 115, collection: 'TOPS / PERFORMANCE', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2jUy7052xxMaiY0MszxARHT1tREYQ9YIsWevueDRYN2VYpYZynvJrimDujsZDVDxn2oowaguJVKtOx1_dfdifJyOLwqOG0GzABETqJPncZIfyYFx93WdQjyooGok6OBj2gozc0u-Ym3OyjTuMEy1FXGpCoxH5DRhJQjWqxjbJZctphw7Uq5yopgSUbi5cY229FcQzy-MyJQpUN1rwasnBxl-xM01Ffoljoa9cKS9ItSriBOiBIz7aI6DbwxQde4Gzv7JyAKFxTdS', category: 'Tops' })} className="absolute inset-0 z-10" aria-label="Open THERMAL DRI-FIT TOP" />
              <div className="aspect-[4/5] bg-surface-container-low overflow-hidden relative">
                <img
                  alt="Product"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                  data-alt="High-performance thermal base layer top in deep black with red accent stitching"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2jUy7052xxMaiY0MszxARHT1tREYQ9YIsWevueDRYN2VYpYZynvJrimDujsZDVDxn2oowaguJVKtOx1_dfdifJyOLwqOG0GzABETqJPncZIfyYFx93WdQjyooGok6OBj2gozc0u-Ym3O0yjTuMEy1FXGpCoxH5DRhJQjWqxjbJZctphw7Uq5yopgSUbi5cY229FcQzy-MyJQpUN1rwasnBxl-xM01Ffoljoa9cKS9ItSriBOiBIz7aI6DbwxQde4Gzv7JyAKFxTdS"
                />
                <button className="absolute bottom-0 right-0 z-20 w-12 h-12 bg-on-surface text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <h4 className="bebas text-lg tracking-widest">
                  THERMAL DRI-FIT TOP
                </h4>
                <p className="space text-xs font-bold text-on-surface/40">
                  TOPS / PERFORMANCE
                </p>
                <p className="space text-sm font-bold mt-2">{process.env.NEXT_PUBLIC_CURRENCY || '$'}115.00</p>
              </div>
            </div>

            <div className="group relative">
              <Link href={productHref({ id: 105, name: 'RACE SPLIT SHORTS', price: 85, collection: 'BOTTOMS / PERFORMANCE', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIfqqcocj94Goh1F8tGhRcQk0oBKFLXm9kpVQwtK8kJ8bz7cY3KUNF8jA_xmFIbwCQkJv-ir9cdq7U0JR21mP-QimqbvHg7ZRrSmwlAUPUNV4HUNIpvTPvfsLQd2GUp_AP3KM1lDjkCMMxd5ynWamkZy1IvoyPUUHTmfTgX0QqKiTVh8wEhPmYuy-115f8f3mHujEGKLJ6d9zMlcNu5JGNnT0TVHO1Tase3G2HLA8sTYBk-TX2-bLjBk7ADSM-V3UJj277QMXzTGh', category: 'Bottoms' })} className="absolute inset-0 z-10" aria-label="Open RACE SPLIT SHORTS" />
              <div className="aspect-[4/5] bg-surface-container-low overflow-hidden relative">
                <img
                  alt="Product"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                  data-alt="Technical running shorts in charcoal grey with split hems and bonded seams"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIfqqcocj94Goh1F8tGhRcQk0oBKFLXm9kpVQwtK8kJ8bz7cY3KUNF8jA_xmFIbwCQkJv-ir9cdq7U0JR21mP-QimqbvHg7ZRrjSmwlAUPUNV4HUNIpvTPvfsLQd2GUp_AP3KM1lDjkCMMxd5ynWamkZy1IvoyPUUHTmfTgX0QqKiTVh8wEhPmYuy-115f8f3mHujEGKLJ6d9zMlcNu5JGNnT0TVHO1Tase3G2HLA8sTYBk-TX2-bLjBk7ADSM-V3UJj277QMXzTGh"
                />
                <div className="absolute top-4 left-0 bg-on-surface text-white space text-[10px] font-bold px-3 py-1 tracking-widest">
                  LIMITED
                </div>
                <button className="absolute bottom-0 right-0 z-20 w-12 h-12 bg-on-surface text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <h4 className="bebas text-lg tracking-widest">
                  RACE SPLIT SHORTS
                </h4>
                <p className="space text-xs font-bold text-on-surface/40">
                  BOTTOMS / PERFORMANCE
                </p>
                <p className="space text-sm font-bold mt-2">{process.env.NEXT_PUBLIC_CURRENCY || '$'}85.00</p>
              </div>
            </div>

            <div className="group relative">
              <Link href={productHref({ id: 106, name: 'STRUCTURE KNIT SWEATER', price: 195, collection: 'TOPS / EDITORIAL', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDROJPJilNE6YZEKQz2_PKpDSusbE7zCo7B1PY9p1Emg080Prl0G0AzQASzQF2mkHRI-5B50Q8Dxw6jWAeTDy4zcJeJVU5u6T7d7MTm1S1ABtK3qRXR2eHZuMP3qVr2VcjPFoN-4pZ2-syIaMj7iQ1rBhKV8Fac2hGELUZpBctbE2j02Lz3aiJsyY1m36malW0b0NuxxGYKCWPhwDN6gC7cLoF-NHUaKlbEGFm-XWLdQJmt32RjyIuuTBkfwJdNTN8p2KJ9vkOGaqyC', category: 'Tops' })} className="absolute inset-0 z-10" aria-label="Open STRUCTURE KNIT SWEATER" />
              <div className="aspect-[4/5] bg-surface-container-low overflow-hidden relative">
                <img
                  alt="Product"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                  data-alt="High-neck black knit sweater with architectural ribbed texture and elongated sleeves"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDROJPJilNE6YZEKQz2_PKpDSusbE7zCo7B1PY9p1Emg080Prl0G0AzQASzQF2mkHRI-5B50Q8Dxw6jWAeTDy4zcJeJVU5u6T7d7MTm1S1ABtK3qRXR2eHZuMP3qVr2VcjPFoN-4pZ2-syIaMj7iQ1rBhKV8Fac2hGELUZpBctbE2j02Lz3aiJsyY1m36malW0b0NuxxGYKCWPhwDN6gC7cLoF-NHUaKlbEGFm-XWLdQJmt32RjyIuuTBkfwJdNTN8p2KJ9vkOGaqyC"
                />
                <button className="absolute bottom-0 right-0 z-20 w-12 h-12 bg-on-surface text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <h4 className="bebas text-lg tracking-widest">
                  STRUCTURE KNIT SWEATER
                </h4>
                <p className="space text-xs font-bold text-on-surface/40">
                  TOPS / EDITORIAL
                </p>
                <p className="space text-sm font-bold mt-2">{process.env.NEXT_PUBLIC_CURRENCY || '$'}195.00</p>
              </div>
            </div>

            <div className="group relative">
              <Link href={productHref({ id: 107, name: 'MODULAR WIND-SHELL', price: 220, collection: 'OUTERWEAR / TECH-LINE', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8URmbxIsYLpDtvSolLdnZk1eWzjAzapmgu93tLCT-jXIqBiY9Ux4iFOLkk6yWklIY0mucVelSWyTVCPTm2ARlnZMPDiAGRkmrfuoXdsLF3DgCCS-59i_56Ibly9ZAE03ncJ9UfRhL1clJ8JxvRw3AlXaDIevjlwFOLVL6ypUX1SGIloGYdVe4yN3QgJtd-CnVC3ikFb99_h6_W-6m1pDOmCshN5pfQDpQwP6rELTX4__E_1HkR2VVxPQXsiukNv_Z8naubNN5Qc8i', category: 'Outerwear' })} className="absolute inset-0 z-10" aria-label="Open MODULAR WIND-SHELL" />
              <div className="aspect-[4/5] bg-surface-container-low overflow-hidden relative">
                <img
                  alt="Product"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                  data-alt="Modern technical windbreaker in off-white with black contrast panels and modular pockets"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8URmbxIsYLpDtvSolLdnZk1eWzjAzapmgu93tLCT-jXIqBiY9Ux4iFOLkk6yWklIY0mucVelSWyTVCPTm2ARlnZMPDiAGRkmrfuoXdsLF3DgCCS-59i_56Ibly9ZAE03ncJ9UfRhL1clJ8JxvRw3AlXaDIevjlwFOLVL6ypUX1SGIloGYdVe4yN3QgJtd-CnVC3ikFb99_h6_W-6m1pDOmCshN5pfQDpQwP6rELTX4__E_1HkR2VVxPQXsiukNv_Z8naubNN5Qc8i"
                />
                <button className="absolute bottom-0 right-0 z-20 w-12 h-12 bg-on-surface text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <h4 className="bebas text-lg tracking-widest">
                  MODULAR WIND-SHELL
                </h4>
                <p className="space text-xs font-bold text-on-surface/40">
                  OUTERWEAR / TECH-LINE
                </p>
                <p className="space text-sm font-bold mt-2">{process.env.NEXT_PUBLIC_CURRENCY || '$'}220.00</p>
              </div>
            </div>
          </div>

          <div className="mt-20 flex justify-center items-center gap-8 border-t-2 border-on-surface/5 pt-12">
            <button
              className="flex items-center gap-2 space text-xs font-bold hover:text-primary transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-sm">west</span>{" "}
              PREV
            </button>
            <div className="flex gap-6 space text-xs font-bold">
              <span className="text-primary border-b border-primary cursor-pointer">
                01
              </span>
              <span className="text-on-surface/40 hover:text-on-surface cursor-pointer transition-colors">
                02
              </span>
              <span className="text-on-surface/40 hover:text-on-surface cursor-pointer transition-colors">
                03
              </span>
              <span className="text-on-surface/40 hover:text-on-surface cursor-pointer transition-colors">
                04
              </span>
            </div>
            <button className="flex items-center gap-2 space text-xs font-bold hover:text-primary transition-colors">
              NEXT{" "}
              <span className="material-symbols-outlined text-sm">east</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
