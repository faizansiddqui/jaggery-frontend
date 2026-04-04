'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Comp7 from '@/app/components/Comp7';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { formatProductNameForPath, products as localProducts } from '@/app/data/products';
import { fetchBackendProducts } from '@/app/lib/backendProducts';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('default');
  const [toast, setToast] = useState('');
  const [productList, setProductList] = useState(localProducts);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const { toggle, isInWishlist } = useWishlist();
  const currency = process.env.NEXT_PUBLIC_CURRENCY || '$';

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

  const categories = useMemo(() => {
    const unique = new Set(productList.map((item) => item.category).filter(Boolean));
    return ['ALL', ...Array.from(unique)];
  }, [productList]);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    let filtered = productList.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.collection.toLowerCase().includes(normalizedQuery);
      const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
      const matchesSizes = selectedSizes.length === 0 || item.sizes.some((size) => selectedSizes.includes(size));

      return matchesQuery && matchesCategory && matchesSizes;
    });

    if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [query, activeCategory, selectedSizes, sortBy, productList]);

  return (
    <div className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
      {toast && (
        <div className="fixed top-24 right-2 -translate-x-1/2 z-[100] bg-[#1c1b1b] text-[#fcf8f8] px-8 py-4 font-headline text-xs uppercase tracking-widest shadow-xl animate-in fade-in slide-in-from-top-4">
          {toast}
        </div>
      )}

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
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="font-headline text-xs uppercase tracking-widest bg-transparent border border-[#1c1b1b]/20 px-3 py-2 focus:outline-none focus:border-[#b90c1b] cursor-pointer">
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Filters */}
          <aside className="w-full md:w-56 flex-shrink-0">
            <div className="sticky top-28 flex flex-col gap-10">
              <div>
                <h3 className="font-brand text-xl tracking-wider mb-4 border-b border-[#1c1b1b]/10 pb-2">CATEGORY</h3>
                <div className="flex flex-col gap-2">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                      className={`font-headline text-sm text-left py-2 transition-colors ${activeCategory === cat ? 'text-[#b90c1b] font-bold' : 'opacity-50 hover:opacity-100'}`}>
                      {cat} ({cat === 'ALL' ? productList.length : productList.filter(p => p.category === cat).length})
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-brand text-xl tracking-wider mb-4 border-b border-[#1c1b1b]/10 pb-2">SIZE</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', '2XL'].map(size => (
                    <button key={size} onClick={() => toggleSize(size)}
                      className={`border aspect-square flex items-center justify-center font-headline text-xs transition-all ${selectedSizes.includes(size) ? 'bg-[#1c1b1b] text-white border-[#1c1b1b]' : 'border-[#1c1b1b]/20 hover:border-[#b90c1b] hover:text-[#b90c1b]'}`}>
                      {size}
                    </button>
                  ))}
                </div>
                {selectedSizes.length > 0 && (
                  <button onClick={() => setSelectedSizes([])} className="mt-3 font-headline text-[10px] uppercase tracking-widest text-[#b90c1b] underline underline-offset-4">
                    Clear Sizes
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-grow">
            {isLoading ? (
              <div className="py-20 text-center">
                <p className="font-brand text-4xl uppercase mt-6 opacity-40">Loading products...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="py-20 text-center">
                <span className="material-symbols-outlined text-6xl opacity-20">search_off</span>
                <p className="font-brand text-4xl uppercase mt-6 opacity-40">No results found</p>
                <button onClick={() => { setQuery(''); setActiveCategory('ALL'); setSelectedSizes([]); }}
                  className="mt-6 font-headline text-sm uppercase tracking-widest underline underline-offset-4 text-[#b90c1b]">Clear all filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                {results.map(item => (
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
                        <button onClick={() => { addItem({ id: item.id, name: item.name, price: item.price, color: item.colors?.[0] || 'Default', size: 'M', image: item.image, collection: item.collection }); showToast('Added to bag'); }}
                          className="w-10 h-10 bg-[#1c1b1b] text-white flex items-center justify-center hover:bg-[#b90c1b] transition-colors">
                          <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
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
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Comp7 />
    </div>
  );
}