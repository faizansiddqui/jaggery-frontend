"use client";
import React, { useState } from "react";
import Link from "next/link";

const products = [
  {
    id: "golden-cubes",
    name: "Golden Cubes Jaggery",
    rating: 5,
    reviews: 124,
    price: "$18.00",
    originalPrice: "$24.00",
    desc: "Perfectly portioned cubes for tea and coffee. Melt-in-mouth texture with rich molasses notes.",
    badge: "A-Grade\nPurity",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIS8EPKFVs5mUMbb5J8_8xQKqVxNN5GkO2kJTxXwSDcOmj5rqbQ27i8iwHpeqYv9kqemV4VQhSvKlL-GcPm5IZzx_4VEY73psNyIB7r8d6W5YuFR-lOm8wHlPzPB3cnUQEdpSf-1aen6LA2EbVS_gzonsAqEN0ZRJYJdW8PoEFT6PYSKZYygzAr--1_MAm8a7ERp5mvc1pXWO3TS3QU872WBBDyPCSjD7X96piBBCYBi0NDGVh5DQH6pjcgze1yh47fzCbBtvudlM",
    offset: false,
  },
  {
    id: "fine-grain-powder",
    name: "Fine Grain Powder",
    rating: 4,
    reviews: 89,
    price: "$14.50",
    originalPrice: "$19.00",
    desc: "Easy-to-use alternative to refined sugar. Ideal for baking and daily wellness drinks.",
    badge: null,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvrpNnTOU9uI8jDb9vTjIypI6V9vQmQxqlj6IPYFUoWiBbyUgenqtyhYOX25-mObVvfF2LQLMmNcYB1pOraWpuTHeHvfTB98fjkAuIpOC_F7noQ7PkQ-G3MxbKbgYpzM8YsXrw9cOLEPjkayUq3NJ6rbwP9Zq5CpFyouxxdganCxZKjk5Jdvqd5-KQt0A1ov9ZAuEksjRPw5z7NNz-9JGfRkVGGIMI8RoDLl6exvcybOCfgKilLc8bFFO-1tBb0FOuqgwWJtxff2I",
    offset: false,
  },
  {
    id: "raw-heritage-blocks",
    name: "Raw Heritage Blocks",
    rating: 5,
    reviews: 210,
    price: "$22.00",
    originalPrice: "$28.00",
    desc: "The most authentic form. Whole blocks of unrefined sweetness, packed with minerals.",
    badge: null,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeQPDYQbBkmOHhxTLZqkd72_XKrRGwjBqcBiXPFckQbFyzSbyf4Ogk_jsqfxZUabN9OTPjoMmrnVe9DZ3f6x9YAmtD13Yjqrt69M0-L-nMSp0GqHV55BK1BhJmp2deU4FJ5zcepKyYLGIUArjup6ZeXrCle3TfIim7LFeCDClMReuKeuNOCO4CfhsF-JrhIRZt5CLcV43H_9mfYNu_ciMKHGjnOQMGE3YdYCeJKJ3EAZfI9QMCgQBMb4XblVDIcmgTXW5JTub_CDY",
    offset: true,
  },
  {
    id: "spiced-ginger-blend",
    name: "Spiced Ginger Blend",
    rating: 4,
    reviews: 45,
    price: "$21.50",
    originalPrice: "$27.00",
    desc: "Infused with ginger and cardamom for an aromatic winter warmth. A culinary treasure.",
    badge: "Limited",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC32wz4FjU0MNkBWuF5bAW__RvleGx2Vs_xHO_xheEa_xiyB6VX4BpmpLMbeHgdbuj0LjriYL2UUmWIehXL_nyd_xLOEHTZofi3DcV0A1KJ99BjljQWqAYXuhPSAkL8UtgZ-jIemptaF0NiEPk0jTNgLzl7GzRp_cdJVuJCd3r3XvgyMgTg7LvQhJNtZ8S1hYmGdqTXAUPYyY-aEFA",
    offset: true,
  },
];

const filterOptions = ["Artisan Cubes", "Fine Powder", "Traditional Blocks"];
const weightOptions = ["500g", "1kg", "2.5kg", "Bulk 5kg"];
const CATEGORIES = ["Solid Blocks", "Granular Powder", "Infused Spiced"];

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Name: Z to A", value: "name-desc" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-secondary">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: `'FILL' ${s <= rating ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24` }}>
          star
        </span>
      ))}
    </div>
  );
}

export default function ShopPageClient() {
  const [activeWeight, setActiveWeight] = useState("1kg");
  const [checkedFilters, setCheckedFilters] = useState(["Artisan Cubes"]);
  const [checkedCategories, setCheckedCategories] = useState(["Solid Blocks"]);
  const [sortOption, setSortOption] = useState("featured");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);


  const toggleFilter = (f: string) =>
    setCheckedFilters((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);

  const toggleCat = (c: string) =>
    setCheckedCategories((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const getSortedProducts = () => {
    const sorted = [...products];
    switch (sortOption) {
      case "price-asc":
        return sorted.sort((a, b) => parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", "")));
      case "price-desc":
        return sorted.sort((a, b) => parseFloat(b.price.replace("$", "")) - parseFloat(a.price.replace("$", "")));
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  };
  return (
    <main className="pt-24 pb-12 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="font-headline text-5xl lg:text-7xl text-primary tracking-tight leading-none mb-6">
              The Golden Harvest
            </h1>
            <p className="text-on-surface-variant text-lg max-w-lg">
              From the sun-drenched fields of the heartland to your table. Experience the unrefined purity of
              heritage jaggery, crafted using century-old techniques.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm font-label uppercase tracking-widest text-secondary">
            <span>Curated Selection</span>
            <div className="h-px w-12 bg-secondary/30" />
            <span>Est. 1924</span>
          </div>
        </div>
      </header>

      {/* Mobile Filter/Sort Buttons */}
      <div className="lg:hidden mb-6 flex items-center justify-around gap-3">
        <button
          onClick={() => setShowSortDropdown(!showSortDropdown)}
          className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-[0.5rem] text-sm font-label uppercase tracking-wider text-on-surface border border-outline-variant"
        >
          <span className="material-symbols-outlined text-base">swap_vert</span>
          Sort
        </button>
        <button
          onClick={() => setShowMobileFilter(true)}
          className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-[0.5rem] text-sm font-label uppercase tracking-wider text-on-surface border border-outline-variant"
        >
          <span className="material-symbols-outlined text-base">tune</span>
          Filter
        </button>
      </div>

      {/* Sort Dropdown */}
      {showSortDropdown && (
        <div className="mb-6 relative">
          <div className="bg-surface-container-low rounded-xl border border-outline-variant shadow-lg overflow-x-auto">
            <div className="flex gap-2 p-3 min-w-max">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortOption(option.value);
                    setShowSortDropdown(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-body whitespace-nowrap transition-all ${sortOption === option.value
                    ? "bg-secondary text-on-secondary"
                    : "bg-surface text-on-surface hover:bg-surface-container-high"
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filter Panel */}
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${showMobileFilter ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setShowMobileFilter(false)}
        />

        {/* Slide Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-80 max-w-full bg-surface-container-low shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${showMobileFilter ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline text-2xl font-bold text-primary">Filters</h3>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">Category</h4>
                <div className="space-y-3">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                      <div className="w-5 h-5 rounded border border-outline-variant group-hover:border-secondary flex items-center justify-center transition-colors">
                        {checkedCategories.includes(cat) && <div className="w-2.5 h-2.5 bg-secondary rounded-sm" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={checkedCategories.includes(cat)} onChange={() => toggleCat(cat)} readOnly />
                      <span className="font-body text-on-surface group-hover:text-secondary transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">Price Range</h4>
                <div className="space-y-4">
                  <input type="range" className="w-full accent-secondary" min={5} max={45} defaultValue={45} />
                  <div className="flex justify-between text-sm font-body text-on-surface-variant">
                    <span>$5.00</span>
                    <span>$45.00</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">Weight</h4>
                <div className="grid grid-cols-2 gap-2">
                  {weightOptions.map((w) => (
                    <button
                      key={w}
                      onClick={() => setActiveWeight(w)}
                      className={`px-4 py-2 text-sm border-b text-left transition-all ${activeWeight === w
                        ? "border-secondary text-secondary font-bold bg-surface-container-low"
                        : "border-outline-variant/20 hover:border-secondary"
                        }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowMobileFilter(false)}
                className="w-full py-3 rounded-full bg-secondary text-on-secondary font-label text-sm uppercase tracking-widest hover:bg-secondary/90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters - Hidden on Mobile */}
        <aside className="hidden lg:block w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-32 space-y-10">
            <section>
              <h3 className="font-headline text-xl font-bold text-primary mb-6">Refine Results</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">Category</h4>
                  <div className="space-y-3">
                    {CATEGORIES.map((cat) => (
                      <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-5 h-5 rounded border border-outline-variant group-hover:border-secondary flex items-center justify-center transition-colors">
                          {checkedCategories.includes(cat) && <div className="w-2.5 h-2.5 bg-secondary rounded-sm" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={checkedCategories.includes(cat)} onChange={() => toggleCat(cat)} readOnly />
                        <span className="font-body text-on-surface group-hover:text-secondary transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">Price Range</h4>
                  <div className="space-y-4">
                    <input type="range" className="w-full accent-secondary" min={5} max={45} defaultValue={45} />
                    <div className="flex justify-between text-sm font-body text-on-surface-variant">
                      <span>$5.00</span>
                      <span>$45.00</span>
                    </div>
                  </div>
                </div>

                <section>
                  <h3 className="font-headline text-xl text-primary mb-6">Weight Variation</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {weightOptions.map((w) => (
                      <button
                        key={w}
                        onClick={() => setActiveWeight(w)}
                        className={`px-4 py-2 text-sm border-b text-left transition-all ${activeWeight === w
                          ? "border-secondary text-secondary font-bold bg-surface-container-low"
                          : "border-outline-variant/20 hover:border-secondary"
                          }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </section>

            {/* Heritage Badge */}
            <div className="bg-secondary-container/30 p-6 rounded-3xl relative overflow-hidden">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-secondary text-3xl mb-2 icon-filled block">eco</span>
                <h5 className="font-headline text-lg font-bold text-primary">The Agrarian Promise</h5>
                <p className="text-sm font-body text-on-surface-variant mt-2">
                  Every block is hand-pressed using traditional techniques passed down through seven generations.
                </p>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-10">
                <span className="material-symbols-outlined text-8xl">potted_plant</span>
              </div>
            </div>
          </div>
        </aside>



        {/* Product Grid */}
        <div className="lg:col-span-9">
          {/* Desktop Sort Bar */}
          <div className="hidden lg:flex items-center gap-4 mb-8 overflow-x-auto pb-2">
            <span className="text-sm font-label uppercase tracking-widest text-on-surface-variant whitespace-nowrap">Sort by:</span>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortOption(option.value)}
                className={`px-4 py-2 rounded-full text-sm fontorizonta-body whitespace-nowrap transition-all ${sortOption === option.value
                  ? "bg-secondary text-on-secondary"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-x-8 gap-y-16">
            {getSortedProducts().map((p) => (
              <Link href={`/product/${p.id}/${p.name.toLowerCase().replace(/\s+/g, '-')}`} key={p.id}>
                <article className={`group relative ${p.offset ? "md:mt-12" : ""}`}>
                  <div className="relative mb-6 overflow-hidden rounded-xl bg-surface-container-high aspect-[4/5]">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {p.badge && (
                      <div className="heritage-badge w-10 h-10 lg:w-20 lg:h-20 absolute top-2 right-2 lg:top-4 lg:right-4">
                        <span className="font-headline text-[6px] lg:text-[10px] uppercase leading-tight font-bold text-secondary whitespace-pre-line text-center">
                          {p.badge}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col lg:flex-row justify-between items-start mb-2">
                    <div>
                      <h3 className="font-headline text-xl lg:text-2xl text-primary mb-1">{p.name}</h3>
                      {/* <div className="flex items-center gap-1">
                      <StarRating rating={p.rating} />
                      <span className="text-[10px] font-label text-on-surface-variant ml-1">({p.reviews})</span>
                    </div> */}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline text-xl lg:text-2xl text-secondary">{p.price}</span>
                      {p.originalPrice && (
                        <span className="font-body text-sm text-on-surface-variant line-through">{p.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  {/* <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">{p.desc}</p> */}
                  <div
                    onClick={(e) => e.preventDefault()}
                    className="block flex items-center justify-center w-full py-3 rounded-full border-[1.5px] border-secondary text-secondary font-label text-sm uppercase tracking-widest hover:bg-secondary/10 transition-colors text-center"
                  >
                    Add to
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
