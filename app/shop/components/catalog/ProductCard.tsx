import Link from 'next/link';
import Image from 'next/image';
import { createProductHref, type Product } from '@/app/data/products';
import { getDiscountAmount } from './collectionPresets';

type ProductCardProps = {
    product: Product;
    currency: string;
    variantInCart: boolean;
    inWishlist: boolean;
    isNotifyPending: boolean;
    onToggleWishlist: (product: Product, inWishlist: boolean) => void;
    onAddToCart: (product: Product) => void;
    onNotify: (product: Product) => void;
};

export default function ProductCard({
    product,
    currency,
    variantInCart,
    inWishlist,
    isNotifyPending,
    onToggleWishlist,
    onAddToCart,
    onNotify,
}: ProductCardProps) {
    const discountAmount = getDiscountAmount(product);
    const hasDiscount = discountAmount > 0;
    const isOutOfStock = Number(product.quantity || 0) <= 0;

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

                {isOutOfStock && (
                    <div className="absolute left-0 bottom-0 right-0 z-20 bg-[#111]/88 border-t border-white/15 px-3 py-3">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white">Out Of Stock</span>
                            <button
                                onClick={() => onNotify(product)}
                                disabled={isNotifyPending}
                                className="px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] uppercase bg-white text-[#111] hover:bg-primary hover:text-white transition-colors disabled:opacity-60"
                            >
                                {isNotifyPending ? 'Notified' : 'Notify'}
                            </button>
                        </div>
                    </div>
                )}

                {hasDiscount && (
                    <div className="absolute top-4 right-3 bg-on-surface text-white text-[10px] font-bold px-2 py-1 tracking-widest uppercase">
                        -{Math.round((discountAmount / Number(product.originalPrice || product.price)) * 100)}%
                    </div>
                )}

                {variantInCart && !isOutOfStock && (
                    <div className="absolute left-0 bottom-0 right-0 z-20 bg-[#111]/88 border-t border-white/15 px-3 py-2">
                        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white">Already In Cart</span>
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

                    {isOutOfStock ? (
                        <button
                            onClick={() => onNotify(product)}
                            disabled={isNotifyPending}
                            className="h-11 px-3 bg-white text-on-surface flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-[10px] font-bold tracking-[0.14em] uppercase disabled:opacity-60"
                            aria-label={isNotifyPending ? 'Already notified' : 'Notify me when in stock'}
                        >
                            {isNotifyPending ? 'Notified' : 'Notify'}
                        </button>
                    ) : variantInCart ? (
                        <span className="h-11 px-3 bg-white text-on-surface flex items-center justify-center text-[10px] font-bold tracking-[0.14em] uppercase">
                            In Cart
                        </span>
                    ) : (
                        <button
                            onClick={() => onAddToCart(product)}
                            className="w-11 h-11 bg-on-surface text-white flex items-center justify-center hover:bg-primary transition-colors"
                            aria-label="Add to cart"
                        >
                            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                        </button>
                    )}
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
                {isOutOfStock && (
                    <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-primary mt-1">
                        Out Of Stock
                    </p>
                )}
            </div>
        </article>
    );
}
