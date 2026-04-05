'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Comp7 from '@/app/components/Comp7';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';
import { formatProductNameForPath, products as localProducts } from '@/app/data/products';
import { fetchBackendProducts } from '@/app/lib/backendProducts';
import CatalogFilters from '@/app/shop/components/catalog/CatalogFilters';
import MobileCatalogControls from '@/app/shop/components/catalog/MobileCatalogControls';
import MobileFilterPanel from '@/app/shop/components/catalog/MobileFilterPanel';
import { sortOptions, sortProducts } from '@/app/shop/components/catalog/collectionPresets';
import type { SortKey } from '@/app/shop/components/catalog/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number | null>(null);
  const [appliedCategory, setAppliedCategory] = useState('ALL');
  const [appliedSizes, setAppliedSizes] = useState<string[]>([]);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>('latest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [productList, setProductList] = useState(localProducts);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem, isVariantInCart } = useCart();
  const { toggle, isInWishlist } = useWishlist();
  const { settings } = useSiteSettings();
  const currency = settings.currencySymbol || '$';

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2200); };

  const toggleSize = (size: string) => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const backendProducts = await fetchBackendProducts();
      if (backendProducts.length > 0) {
        setProductList(backendProducts);
      }
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (!isMobileFilterOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileFilterOpen]);

  const categories = useMemo(() => {
    const unique = new Set(productList.map((item) => item.category).filter(Boolean));
    return ['ALL', ...Array.from(unique)];
  }, [productList]);

  const productCountByCategory = useMemo(() => {
    const output: Record<string, number> = {
      ALL: productList.length,
    };

    categories.forEach((category) => {
      if (category === 'ALL') return;
      output[category] = productList.filter((item) => item.category === category).length;
    });

    return output;
  }, [categories, productList]);

  const availableSizes = useMemo(() => {
    const unique = new Set(
      productList
        .flatMap((item) => item.sizes)
        .filter((size) => typeof size === 'string' && size.trim().length > 0),
    );
    return Array.from(unique);
  }, [productList]);

  const maxPrice = useMemo(() => {
    if (productList.length === 0) return 0;
    return Math.ceil(Math.max(...productList.map((item) => item.price)));
  }, [productList]);

  const selectedPriceValue = selectedMaxPrice ?? maxPrice;
  const appliedPriceValue = appliedMaxPrice ?? maxPrice;

  const hasPendingFilterChanges = useMemo(() => {
    const sizeChanged =
      selectedSizes.length !== appliedSizes.length ||
      selectedSizes.some((size) => !appliedSizes.includes(size));

    return (
      activeCategory !== appliedCategory ||
      selectedPriceValue !== appliedPriceValue ||
      sizeChanged
    );
  }, [activeCategory, appliedCategory, selectedSizes, appliedSizes, selectedPriceValue, appliedPriceValue]);

  const applyFilters = (closePanel = false) => {
    setAppliedCategory(activeCategory);
    setAppliedSizes(selectedSizes);
    setAppliedMaxPrice(selectedMaxPrice);

    if (closePanel) {
      setIsMobileFilterOpen(false);
    }
  };

  const clearFilters = (closePanel = false) => {
    setActiveCategory('ALL');
    setSelectedSizes([]);
    setSelectedMaxPrice(null);

    setAppliedCategory('ALL');
    setAppliedSizes([]);
    setAppliedMaxPrice(null);

    if (closePanel) {
      setIsMobileFilterOpen(false);
    }
  };

  const openMobileFilterPanel = () => {
    setIsMobileSortOpen(false);
    setActiveCategory(appliedCategory);
    setSelectedSizes(appliedSizes);
    setSelectedMaxPrice(appliedMaxPrice);
    setIsMobileFilterOpen(true);
  };

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = productList.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.collection.toLowerCase().includes(normalizedQuery);
      const matchesCategory = appliedCategory === 'ALL' || item.category === appliedCategory;
      const matchesSizes = appliedSizes.length === 0 || item.sizes.some((size) => appliedSizes.includes(size));
      const matchesPrice = appliedPriceValue === 0 || item.price <= appliedPriceValue;

      return matchesQuery && matchesCategory && matchesSizes && matchesPrice;
    });

    return sortProducts(filtered, sortBy);
  }, [query, appliedCategory, appliedSizes, appliedPriceValue, sortBy, productList]);

  const sharedFilterProps = {
    categories,
    categoryLocked: false,
    productCountByCategory,
    activeCategory,
    setActiveCategory,
    availableSizes,
    selectedSizes,
    toggleSize,
    maxPrice,
    selectedMaxPrice: selectedPriceValue,
    setSelectedMaxPrice: (value: number) => setSelectedMaxPrice(value),
    currency,
    hasPendingFilterChanges,
  };

  return (
    <div className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
      {toast && (
        <div className="fixed top-24 right-2 -translate-x-1/2 z-[100] bg-[#1c1b1b] text-[#fcf8f8] px-8 py-4 font-headline text-xs uppercase tracking-widest shadow-xl animate-in fade-in slide-in-from-top-4">
          {toast}
        </div>
      )}

      <MobileFilterPanel
        isOpen={isMobileFilterOpen}
        closePanel={() => setIsMobileFilterOpen(false)}
        filters={{
          ...sharedFilterProps,
          clearFilters: () => clearFilters(true),
          applyFilters: () => applyFilters(true),
        }}
      />

      <main className="pt-8 pb-5 px-6 md:px-12">
        {/* Search Header */}
        <section className="mb-10">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b90c1b] block mb-3">Global Search Explorer</label>
          <div className="relative w-full max-w-4xl border-b-2 border-[#1c1b1b] focus-within:border-[#b90c1b] transition-colors flex items-center gap-4">
            <span className="material-symbols-outlined text-3xl opacity-30">search</span>
            <input
              className="w-full bg-transparent border-none focus:ring-0 text-4xl md:text-6xl font-brand uppercase tracking-tight py-4 outline-none placeholder:opacity-20"
              placeholder="Search gear..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              type="text"
            />
            {query && (
              <button onClick={() => setQuery('')} className="material-symbols-outlined text-2xl opacity-40 hover:opacity-100 hover:text-[#b90c1b] transition-colors">close</button>
            )}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <span className="font-headline text-sm font-bold uppercase tracking-widest opacity-50">{results.length} items found</span>
            <div className="h-px flex-grow bg-[#1c1b1b]/10"></div>
            <div className="hidden md:flex items-center gap-4">
              <span className="font-headline text-[10px] font-bold uppercase tracking-[0.16em] opacity-45">Sort by</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortKey)}
                className="font-headline text-xs uppercase tracking-widest bg-transparent border border-[#1c1b1b]/20 px-3 py-2 focus:outline-none focus:border-[#b90c1b] cursor-pointer appearance-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Filters */}
          <aside className="hidden md:block w-full md:w-64 flex-shrink-0">
            <div className="sticky top-28 flex flex-col gap-10">
              <CatalogFilters
                {...sharedFilterProps}
                clearFilters={() => clearFilters(false)}
                applyFilters={() => applyFilters(false)}
              />
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-grow">
            <MobileCatalogControls
              isMobileSortOpen={isMobileSortOpen}
              setIsMobileSortOpen={setIsMobileSortOpen}
              openMobileFilterPanel={openMobileFilterPanel}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOptions={sortOptions}
            />

            {isLoading ? (
              <div className="py-20 text-center">
                <p className="font-brand text-4xl uppercase mt-6 opacity-40">Loading products...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="py-20 text-center">
                <span className="material-symbols-outlined text-6xl opacity-20">search_off</span>
                <p className="font-brand text-4xl uppercase mt-6 opacity-40">No results found</p>
                <button onClick={() => { setQuery(''); clearFilters(false); }}
                  className="mt-6 font-headline text-sm uppercase tracking-widest underline underline-offset-4 text-[#b90c1b]">Clear all filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                {results.map(item => {
                  const color = item.colors?.[0] || 'Default';
                  const size = item.sizes?.[0] || 'M';
                  const variantInCart = isVariantInCart(item.id, size, color);

                  return (
                  <div key={item.id} className="group relative">
                    <div className="relative overflow-hidden bg-[#f6f3f2] aspect-[4/5]">
                      <Link href={`/product/${item.id}/${formatProductNameForPath(item.name)}`}>
                        <Image alt={item.name} src={item.image} width={1000} height={1250} unoptimized className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer" />
                      </Link>
                      {item.tag && (
                        <div className="absolute top-4 left-0 bg-[#b90c1b] text-white font-headline text-[10px] px-4 py-1 tracking-widest uppercase">{item.tag}</div>
                      )}
                      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                        <button onClick={() => { toggle({ id: item.id, name: item.name, price: item.price, image: item.image, collection: item.collection }); showToast(isInWishlist(item.id) ? 'Removed from Wishlist' : 'Saved to Wishlist'); }}
                          className={`w-10 h-10 flex items-center justify-center transition-colors ${isInWishlist(item.id) ? 'bg-[#b90c1b] text-white' : 'bg-white text-[#1c1b1b] hover:bg-[#b90c1b] hover:text-white'}`}>
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: isInWishlist(item.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                        </button>
                        <button
                          onClick={() => {
                            if (variantInCart) {
                              showToast('Already in cart');
                              return;
                            }
                            addItem({ id: item.id, name: item.name, price: item.price, color, size, image: item.image, collection: item.collection });
                            showToast('Added to bag');
                          }}
                          className={`w-10 h-10 flex items-center justify-center transition-colors ${variantInCart ? 'bg-[#b90c1b] text-white' : 'bg-[#1c1b1b] text-white hover:bg-[#b90c1b]'}`}
                          aria-label={variantInCart ? 'Already in cart' : 'Add to cart'}
                        >
                          <span className="material-symbols-outlined text-sm">{variantInCart ? 'check_circle' : 'add_shopping_cart'}</span>
                        </button>
                      </div>
                    </div>
                    <Link href={`/product/${item.id}/${formatProductNameForPath(item.name)}`} className="block mt-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-brand text-2xl tracking-tight leading-none group-hover:text-[#b90c1b] transition-colors">{item.name}</h4>
                        <span className="font-headline font-bold text-lg">{currency}{item.price}</span>
                      </div>
                      <p className="font-headline text-xs opacity-40 uppercase tracking-widest mt-1">{item.collection}</p>
                    </Link>
                  </div>
                );})}
              </div>
            )}
          </div>
        </div>
      </main>
      <Comp7 />
    </div>
  );
}