import GridSkeleton from '@/app/components/GridSkeleton';
import type { Product } from '@/app/data/products';
import ProductCard from './ProductCard';

type ProductGridProps = {
    products: Product[];
    isLoading: boolean;
    currency: string;
    clearFilters: () => void;
    isInWishlist: (id: number) => boolean;
    onToggleWishlist: (product: Product, inWishlist: boolean) => void;
    onAddToCart: (product: Product) => void;
};

export default function ProductGrid({
    products,
    isLoading,
    currency,
    clearFilters,
    isInWishlist,
    onToggleWishlist,
    onAddToCart,
}: ProductGridProps) {
    if (isLoading) {
        return <GridSkeleton count={8} cardClassName="p-0 border-0" />;
    }

    if (products.length === 0) {
        return (
            <div className="py-20 text-center border border-on-surface/10 bg-surface-container-low">
                <span className="material-symbols-outlined text-5xl text-on-surface/25">search_off</span>
                <p className="bebas text-3xl mt-4 tracking-[0.15em]">NO PRODUCTS FOUND</p>
                <button
                    onClick={clearFilters}
                    className="mt-6 text-xs font-bold tracking-[0.18em] uppercase text-primary underline underline-offset-4"
                >
                    Clear all filters
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
            {products.map((product) => (
                <ProductCard
                    key={product.publicId || product.id}
                    product={product}
                    currency={currency}
                    inWishlist={isInWishlist(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
}
