import type { Product } from '@/app/data/products';

export type SortKey = 'latest' | 'price-asc' | 'price-desc' | 'name-asc' | 'discount-desc';

export type SortOption = {
    value: SortKey;
    label: string;
};

export type CollectionPreset = {
    slug: string;
    title: string;
    subtitle: string;
    defaultSort: SortKey;
    category?: string;
    showOnlyDiscounted?: boolean;
    fallbackTokens?: string[];
    isDynamic: boolean;
};

export type ProductWithDiscount = Product & {
    discountAmount: number;
    discountPercent: number;
};
