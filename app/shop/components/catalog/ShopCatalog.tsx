'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import type { Product } from '@/app/data/products';
import { fetchBackendProducts } from '@/app/lib/backendProducts';
import { fetchProductStockNotifyStatus, registerProductStockNotify } from '@/app/lib/apiClient';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';
import { getUserEmail } from '@/app/lib/session';
import CatalogFilters from './CatalogFilters';
import MobileCatalogControls from './MobileCatalogControls';
import MobileFilterPanel from './MobileFilterPanel';
import ProductGrid from './ProductGrid';
import { applyCollectionPreset, resolveCollectionPreset, sortOptions, sortProducts } from './collectionPresets';
import type { SortKey } from './types';

type ShopCatalogProps = {
    collectionSlug?: string;
};

const normalizeText = (value: string) => value.toLowerCase().trim();

export default function ShopCatalog({ collectionSlug }: ShopCatalogProps) {
    const { settings } = useSiteSettings();
    const currency = settings.currencySymbol || '$';
    const preset = useMemo(() => resolveCollectionPreset(collectionSlug), [collectionSlug]);
    const categoryLocked = Boolean(preset.category && preset.slug !== 'all');
    const defaultCategory = categoryLocked && preset.category ? preset.category : 'ALL';

    const [productList, setProductList] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeCategory, setActiveCategory] = useState(defaultCategory);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedMaxPrice, setSelectedMaxPrice] = useState<number | null>(null);

    const [appliedCategory, setAppliedCategory] = useState(defaultCategory);
    const [appliedSizes, setAppliedSizes] = useState<string[]>([]);
    const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);

    const [sortBy, setSortBy] = useState<SortKey>(preset.defaultSort);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
    const [toast, setToast] = useState('');
    const [notifiedProductIds, setNotifiedProductIds] = useState<number[]>([]);

    const { addItem, isVariantInCart } = useCart();
    const { toggle, isInWishlist } = useWishlist();

    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);
            const backendProducts = await fetchBackendProducts();
            setProductList(backendProducts);
            setIsLoading(false);
        };

        loadProducts();
    }, []);

    useEffect(() => {
        const email = getUserEmail();
        if (!email || productList.length === 0) return;

        const outOfStockIds = productList
            .filter((product) => Number(product.quantity || 0) <= 0)
            .map((product) => product.id);

        if (!outOfStockIds.length) return;

        let active = true;
        Promise.all(
            outOfStockIds.map(async (productId) => {
                try {
                    const status = await fetchProductStockNotifyStatus(productId, email);
                    return status.isNotified ? productId : null;
                } catch {
                    return null;
                }
            }),
        ).then((resolved) => {
            if (!active) return;
            const ids = resolved.filter((value): value is number => typeof value === 'number');
            if (!ids.length) return;
            setNotifiedProductIds((prev) => Array.from(new Set([...prev, ...ids])));
        });

        return () => {
            active = false;
        };
    }, [productList]);

    useEffect(() => {
        if (!isMobileFilterOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isMobileFilterOpen]);

    const collectionProducts = useMemo(() => applyCollectionPreset(productList, preset), [productList, preset]);

    const categories = useMemo(() => {
        if (categoryLocked && preset.category) {
            return [preset.category];
        }

        const unique = new Set(collectionProducts.map((item) => item.category).filter(Boolean));
        return ['ALL', ...Array.from(unique)];
    }, [collectionProducts, categoryLocked, preset.category]);

    const productCountByCategory = useMemo(() => {
        const output: Record<string, number> = {
            ALL: collectionProducts.length,
        };

        categories.forEach((category) => {
            if (category === 'ALL') return;
            output[category] = collectionProducts.filter((item) => normalizeText(item.category) === normalizeText(category)).length;
        });

        return output;
    }, [categories, collectionProducts]);

    const availableSizes = useMemo(() => {
        const unique = new Set(
            collectionProducts
                .flatMap((item) => item.sizes)
                .filter((size) => typeof size === 'string' && size.trim().length > 0),
        );

        return Array.from(unique);
    }, [collectionProducts]);

    const maxPrice = useMemo(() => {
        if (collectionProducts.length === 0) return 0;
        return Math.ceil(Math.max(...collectionProducts.map((item) => item.price)));
    }, [collectionProducts]);

    const selectedPriceValue = selectedMaxPrice ?? maxPrice;
    const appliedPriceValue = appliedMaxPrice ?? maxPrice;

    const showToast = (message: string) => {
        setToast(message);
        window.setTimeout(() => setToast(''), 2200);
    };

    const toggleSize = (size: string) => {
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size],
        );
    };

    const applyFilters = (closePanel = false) => {
        const nextCategory = categoryLocked && preset.category ? preset.category : activeCategory;
        setAppliedCategory(nextCategory);
        setAppliedSizes(selectedSizes);
        setAppliedMaxPrice(selectedMaxPrice);

        if (closePanel) {
            setIsMobileFilterOpen(false);
        }
    };

    const clearFilters = (closePanel = false) => {
        setActiveCategory(defaultCategory);
        setSelectedSizes([]);
        setSelectedMaxPrice(null);

        setAppliedCategory(defaultCategory);
        setAppliedSizes([]);
        setAppliedMaxPrice(null);

        if (closePanel) {
            setIsMobileFilterOpen(false);
        }
    };

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

    const openMobileFilterPanel = () => {
        setIsMobileSortOpen(false);
        setActiveCategory(appliedCategory);
        setSelectedSizes(appliedSizes);
        setSelectedMaxPrice(appliedMaxPrice);
        setIsMobileFilterOpen(true);
    };

    const filteredProducts = useMemo(() => {
        const filtered = collectionProducts.filter((item) => {
            const matchesCategory =
                categoryLocked && preset.category
                    ? normalizeText(item.category) === normalizeText(preset.category)
                    : appliedCategory === 'ALL' || normalizeText(item.category) === normalizeText(appliedCategory);
            const matchesSize = appliedSizes.length === 0 || item.sizes.some((size) => appliedSizes.includes(size));
            const matchesPrice = appliedPriceValue === 0 || item.price <= appliedPriceValue;

            return matchesCategory && matchesSize && matchesPrice;
        });

        return sortProducts(filtered, sortBy);
    }, [collectionProducts, categoryLocked, preset.category, appliedCategory, appliedSizes, appliedPriceValue, sortBy]);

    const handleToggleWishlist = (product: Product, inWishlist: boolean) => {
        toggle({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            collection: product.collection,
        });
        showToast(inWishlist ? 'Removed from wishlist' : 'Saved to wishlist');
    };

    const handleAddToCart = (product: Product) => {
        if (Number(product.quantity || 0) <= 0) {
            showToast('Out of stock. Use Notify.');
            return;
        }

        const color = product.colors?.[0] || 'Default';
        const size = product.sizes[0] || 'M';
        if (isVariantInCart(product.id, size, color)) {
            showToast('Already in cart');
            return;
        }

        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            color,
            size,
            image: product.image,
            collection: product.collection,
        });
        showToast('Added to bag');
    };

    const isNotifyPending = (productId: number) => notifiedProductIds.includes(productId);

    const handleNotify = async (product: Product) => {
        if (isNotifyPending(product.id)) return;
        const email = getUserEmail();
        if (!email) {
            showToast('Login required for stock alerts');
            return;
        }

        try {
            const response = await registerProductStockNotify({
                product_id: product.id,
                product_name: product.name,
                source: 'shop_catalog',
                email,
            });

            if (response.inStock) {
                showToast('Product is already in stock');
                return;
            }

            setNotifiedProductIds((prev) => (prev.includes(product.id) ? prev : [...prev, product.id]));
            showToast('You will be notified on restock');
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Could not set stock alert');
        }
    };

    const sharedFilterProps = {
        categories,
        categoryLocked,
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
        <>
            {toast && (
                <div className="fixed top-20 right-4 z-[120] bg-on-surface text-white px-4 py-3 text-xs tracking-[0.18em] font-bold uppercase shadow-xl animate-in fade-in slide-in-from-top-2">
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

            <main className="max-w-[1920px] mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8 md:gap-12">
                <aside className="hidden md:block w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-28">
                        <CatalogFilters
                            {...sharedFilterProps}
                            clearFilters={() => clearFilters(false)}
                            applyFilters={() => applyFilters(false)}
                        />
                    </div>
                </aside>

                <div className="flex-1 min-w-0">
                    <div className="mb-6 border-b border-on-surface/8 pb-5">
                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Collection</p>
                        <h1 className="bebas text-4xl md:text-6xl tracking-[0.12em] mt-1">{preset.title}</h1>
                        <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.14em] text-on-surface/55 mt-2">
                            {preset.subtitle}
                        </p>
                    </div>

                    <MobileCatalogControls
                        isMobileSortOpen={isMobileSortOpen}
                        setIsMobileSortOpen={setIsMobileSortOpen}
                        openMobileFilterPanel={openMobileFilterPanel}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        sortOptions={sortOptions}
                    />

                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-on-surface/5 gap-4">
                        <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-on-surface/55">
                            {filteredProducts.length} PRODUCTS
                        </p>

                        <div className="hidden md:flex items-center gap-4">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface/40">SORT BY</span>

                            <select
                                value={sortBy}
                                onChange={(event) => setSortBy(event.target.value as SortKey)}
                                className="bg-transparent border border-on-surface/10 focus:ring-0 focus:outline-none px-3 py-2 text-xs font-bold cursor-pointer appearance-none"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <ProductGrid
                        products={filteredProducts}
                        isLoading={isLoading}
                        currency={currency}
                        clearFilters={() => clearFilters(false)}
                        isVariantInCart={isVariantInCart}
                        isInWishlist={isInWishlist}
                        isNotifyPending={isNotifyPending}
                        onToggleWishlist={handleToggleWishlist}
                        onAddToCart={handleAddToCart}
                        onNotify={handleNotify}
                    />
                </div>
            </main>
        </>
    );
}
