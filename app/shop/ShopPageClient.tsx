"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";
import ProductGridSkeleton from "@/app/components/ProductGridSkeleton";
import { fetchBackendProducts } from "@/app/lib/backendProducts";
import { createProductHref, type Product as BackendProduct } from "@/app/data/products";
import {
  type ListingProduct,
  minMaxListingPrice,
  productMatchesWeightFilters,
  resolveListingVariant,
  collectWeightOptions,
  compareListingPriceAsc,
  compareListingPriceDesc,
} from "@/app/lib/shopListing";

type Product = ListingProduct;

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Name: Z to A", value: "name-desc" },
];

export default function ShopPageClient() {
  const { addItem, isVariantInCart } = useCart();
  const { settings } = useSiteSettings();
  const currencySymbol = settings.currencySymbol || "₹";
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [checkedCategories, setCheckedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("featured");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 9;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBackendProducts();
        const normalized: Product[] = (data as BackendProduct[]).map((p) => ({
          id: p.id,
          publicId: p.publicId,
          name: p.name,
          slug: p.slug || p.name.toLowerCase().replace(/\s+/g, '-'),
          price: Number(p.price || 0),
          originalPrice: p.originalPrice,
          image: p.image || '',
          category: p.category || 'shop',
          collection: p.collection || 'SHOP',
          description: p.description || '',
          quantity: Number(p.quantity || 0),
          variants: Array.isArray(p.variants) ? p.variants : [],
        }));
        setProducts(normalized);
        if (normalized.length > 0) {
          let minP = Infinity;
          let maxP = -Infinity;
          for (const p of normalized) {
            const { min, max } = minMaxListingPrice(p);
            minP = Math.min(minP, min);
            maxP = Math.max(maxP, max);
          }
          if (Number.isFinite(maxP)) setMaxPrice(Math.ceil(maxP));
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Extract unique categories from products
  const CATEGORIES = useMemo(() => {
    return [...new Set(products.map(p => p.category).filter(Boolean))];
  }, [products]);

  // Calculate dynamic price range from products
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    let minP = Infinity;
    let maxP = -Infinity;
    for (const p of products) {
      const { min, max } = minMaxListingPrice(p);
      minP = Math.min(minP, min);
      maxP = Math.max(maxP, max);
    }
    if (!Number.isFinite(minP)) return { min: 0, max: 1000 };
    return { min: Math.floor(minP), max: Math.ceil(maxP) };
  }, [products]);

  const [maxPrice, setMaxPrice] = useState<number>(1000);

  const AVAILABLE_WEIGHTS = useMemo(() => collectWeightOptions(products), [products]);

  const handleAddToCart = (product: Product) => {
    const rv = resolveListingVariant(product, selectedWeights);
    if (rv.stock <= 0) return;
    addItem({
      id: product.id,
      name: product.name,
      price: rv.price,
      color: "",
      size: rv.label,
      image: rv.image,
      collection: product.collection || "SHOP COLLECTION",
    });
  };

  const toggleWeight = (w: string) => {
    setSelectedWeights((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]
    );
  };

  const clearAllFilters = () => {
    setCheckedCategories([]);
    setMaxPrice(priceRange.max);
    setSelectedWeights([]);
  };
  const toggleCat = (c: string) =>
    setCheckedCategories((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const filteredProducts = useMemo(() => {
    let results = products;

    if (checkedCategories.length > 0) {
      results = results.filter((p) => checkedCategories.includes(p.category));
    }

    results = results.filter((p) => minMaxListingPrice(p).min <= maxPrice);

    if (selectedWeights.length > 0) {
      results = results.filter((p) => productMatchesWeightFilters(p, selectedWeights));
    }

    return results;
  }, [products, checkedCategories, maxPrice, selectedWeights]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [checkedCategories, maxPrice, selectedWeights, sortOption]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortOption) {
      case "price-asc":
        return list.sort((a, b) => compareListingPriceAsc(a, b, selectedWeights));
      case "price-desc":
        return list.sort((a, b) => compareListingPriceDesc(a, b, selectedWeights));
      case "name-asc":
        return list.sort((a, b) => {
          const c = a.name.localeCompare(b.name, "en");
          return c !== 0 ? c : a.id - b.id;
        });
      case "name-desc":
        return list.sort((a, b) => {
          const c = b.name.localeCompare(a.name, "en");
          return c !== 0 ? c : a.id - b.id;
        });
      default:
        return list;
    }
  }, [filteredProducts, sortOption, selectedWeights]);

  return (
    <main className="pt-24 pb-12 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="font-headline text-5xl lg:text-7xl text-primary tracking-tight leading-none mb-6">
              The Golden Harvest
            </h1>
            {/* <p className="text-on-surface-variant text-lg max-w-lg">
              From the sun-drenched fields of the heartland to your table. Experience the unrefined purity of
              heritage jaggery, crafted using century-old techniques.
            </p> */}
          </div>
          {/* <div className="flex items-center gap-4 text-sm font-label uppercase tracking-widest text-secondary">
            <span>Curated Selection</span>
            <div className="h-px w-12 bg-secondary/30" />
            <span>Est. 1924</span>
          </div> */}
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
          <div className="p-6 h-full overflow-y-auto" data-lenis-prevent="true">
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
                      <input type="checkbox" className="hidden" checked={checkedCategories.includes(cat)} onChange={() => toggleCat(cat)} />
                      <span className="font-body text-on-surface group-hover:text-secondary transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">Price Range</h4>
                <div className="space-y-4">
                  <input
                    type="range"
                    className="w-full accent-secondary"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-sm font-body text-on-surface-variant">
                    <span>{currencySymbol}{priceRange.min}</span>
                    <span>{currencySymbol}{maxPrice}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">Weight</h4>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_WEIGHTS.map((w) => (
                    <button
                      key={w}
                      onClick={() => toggleWeight(w)}
                      className={`px-4 py-2 text-sm border-b text-left transition-all ${selectedWeights.includes(w)
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
                        <input type="checkbox" className="hidden" checked={checkedCategories.includes(cat)} onChange={() => toggleCat(cat)} />
                        <span className="font-body text-on-surface group-hover:text-secondary transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">Price Range</h4>
                  <div className="space-y-4">
                    <input
                      type="range"
                      className="w-full accent-secondary"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                    <div className="flex justify-between text-sm font-body text-on-surface-variant">
                      <span>{currencySymbol}{priceRange.min}</span>
                      <span>{currencySymbol}{maxPrice}</span>
                    </div>
                  </div>
                </div>

                <section>
                  <h3 className="font-headline text-xl text-primary mb-6">Weight Variation</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_WEIGHTS.map((w) => (
                      <button
                        key={w}
                        onClick={() => toggleWeight(w)}
                        className={`px-4 py-2 text-sm border-b text-left transition-all ${selectedWeights.includes(w)
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
                className={`px-4 py-2 rounded-full text-sm font-body whitespace-nowrap transition-all ${sortOption === option.value
                  ? "bg-secondary text-on-secondary"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={9} />
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <span className="material-symbols-outlined text-8xl text-on-surface-variant/30 mb-4">inventory_2</span>
              <h3 className="font-headline text-3xl text-primary mb-2">No products found</h3>
              <p className="text-on-surface-variant text-lg text-center max-w-md">
                No products match your current filters. Try adjusting your search criteria.
              </p>
              {(checkedCategories.length > 0 || maxPrice < priceRange.max || selectedWeights.length > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-3 rounded-full bg-secondary text-on-secondary font-label text-sm uppercase tracking-widest hover:bg-secondary/90 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16">
                {sortedProducts.slice(
                  (currentPage - 1) * PRODUCTS_PER_PAGE,
                  currentPage * PRODUCTS_PER_PAGE
                ).map((p) => (
                  <Link href={createProductHref(p)} key={p.id}>
                    <article className="group relative">
                      {(() => {
                        const rv = resolveListingVariant(p, selectedWeights);
                        const inCart = isVariantInCart(p.id, rv.label, "");
                        const outOfStock = rv.stock <= 0;
                        return (
                          <>
                      <div className="relative mb-6 overflow-hidden rounded-xl bg-surface-container-high aspect-[4/5]">
                        {rv.image ? (
                          <Image
                            src={rv.image}
                            alt={p.name}
                            fill
                            unoptimized
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : null}
                      </div>
                      <div className="flex flex-col lg:flex-row justify-between items-start mb-2">
                        <div>
                          <h3 className="font-headline text-xl lg:text-2xl text-primary mb-1">{p.name}</h3>
                        </div>
                      </div>
                        <div className="flex items-center gap-2">
                          <span className="font-headline text-xl lg:text-2xl text-secondary">{currencySymbol}{rv.price}</span>
                          {rv.originalPrice ? (
                            <span className="font-body text-sm text-on-surface-variant line-through">{currencySymbol}{rv.originalPrice}</span>
                          ) : null}
                        </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(p);
                        }}
                        disabled={inCart || outOfStock}
                        className={`w-full py-3 rounded-full font-label text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${inCart || outOfStock ? "bg-primary text-white border-[1.5px] border-primary disabled:opacity-75" : "border-[1.5px] border-secondary text-secondary hover:bg-secondary/10"}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {outOfStock ? "block" : inCart ? "done" : "add_shopping_cart"}
                        </span>
                        {outOfStock ? "Out of Stock" : inCart ? "Added to Cart" : "Add to Cart"}
                      </button>
                          </>
                        );
                      })()}
                    </article>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:border-secondary hover:text-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => setCurrentPage(n)}
                        className={`w-12 h-12 rounded-full font-bold transition-colors ${currentPage === n ? "bg-primary text-on-primary" : "border border-transparent text-on-surface hover:bg-surface-container-high"
                          }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:border-secondary hover:text-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
