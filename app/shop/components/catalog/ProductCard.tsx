import Link from 'next/link';
import Image from 'next/image';
import { createProductHref, type Product } from '@/app/data/products';
import { getDiscountAmount } from './collectionPresets';

type ProductCardProps = {
    product: Product;
    currency: string;
    inWishlist: boolean;
    onToggleWishlist: (product: Product, inWishlist: boolean) => void;
    onAddToCart: (product: Product) => void;
};

export default function ProductCard({
    product,
    currency,
    inWishlist,
    onToggleWishlist,
    onAddToCart,
}: ProductCardProps) {
    const discountAmount = getDiscountAmount(product);
    const hasDiscount = discountAmount > 0;

    return (
        <article className="group relative">
            <Link
                href={createProductHref(product)}
                className="absolute inset-0 z-10"
                aria-label={`Open ${product.name}`}
            />

            <div className="aspect-[4/5] bg-surface-container-low overflow-hidden relative">
                <Image
                    alt={product.name}
                    className="w-full h-full object-cover grayscale md:group-hover:grayscale-0 transition-all duration-500 scale-100 md:group-hover:scale-110"
                    src={product.image}
                    width={900}
                    height={1125}
                    unoptimized
                />

                {product.tag && (
                    <div className="absolute top-4 left-0 bg-primary text-white text-[10px] font-bold px-3 py-1 tracking-widest uppercase">
                        {product.tag}
                    </div>
                )}

                {hasDiscount && (
                    <div className="absolute top-4 right-3 bg-on-surface text-white text-[10px] font-bold px-2 py-1 tracking-widest uppercase">
                        -{Math.round((discountAmount / Number(product.originalPrice || product.price)) * 100)}%
                    </div>
                )}

                <div className="absolute right-3 bottom-3 z-20 hidden md:flex items-center gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button
                        onClick={() => onToggleWishlist(product, inWishlist)}
                        className={`w-11 h-11 flex items-center justify-center transition-colors ${inWishlist
                                ? 'bg-primary text-white'
                                : 'bg-white text-on-surface hover:bg-primary hover:text-white'
                            }`}
                        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <span
                            className="material-symbols-outlined text-[18px]"
                            style={{ fontVariationSettings: inWishlist ? "'FILL' 1" : "'FILL' 0" }}
                        >
                            favorite
                        </span>
                    </button>

                    <button
                        onClick={() => onAddToCart(product)}
                        className="w-11 h-11 bg-on-surface text-white flex items-center justify-center hover:bg-primary transition-colors"
                        aria-label="Add to cart"
                    >
                        <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                    </button>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-1">
                <h4 className="bebas text-lg tracking-widest group-hover:text-primary transition-colors">
                    {product.name}
                </h4>
                <p className="text-xs font-bold text-on-surface/40 uppercase">{product.collection}</p>
                <div className="flex items-end gap-2 mt-2">
                    <p className="text-sm font-bold">
                        {currency}
                        {product.price.toFixed(2)}
                    </p>
                    {hasDiscount && (
                        <p className="text-[11px] font-bold text-on-surface/40 line-through">
                            {currency}
                            {Number(product.originalPrice || product.price).toFixed(2)}
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}
