import type { Product } from '@/app/data/products';
import type { CollectionPreset, ProductWithDiscount, SortKey, SortOption } from './types';

const PRESET_MAP: Record<string, Omit<CollectionPreset, 'slug' | 'isDynamic'>> = {
    'new-arrivals': {
        title: 'NEW ARRIVALS',
        subtitle: 'LATEST DROPS AND FRESH RELEASES',
        defaultSort: 'latest',
    },
    jackets: {
        title: 'JACKETS',
        subtitle: 'OUTERWEAR BUILT FOR STREET AND SPEED',
        defaultSort: 'latest',
        category: 'Jackets',
        fallbackTokens: ['jacket'],
    },
    hoodies: {
        title: 'HOODIES',
        subtitle: 'HEAVYWEIGHT FLEECE AND DAILY ESSENTIALS',
        defaultSort: 'latest',
        category: 'Hoodies',
        fallbackTokens: ['hoodie'],
    },
    'track-pants': {
        title: 'TRACK PANTS',
        subtitle: 'UTILITY BOTTOMS, TAPERED FITS, CLEAN LINES',
        defaultSort: 'latest',
        category: 'Track Pants',
        fallbackTokens: ['track', 'pants'],
    },
    sale: {
        title: 'SALE',
        subtitle: 'MOST DISCOUNTED PIECES RIGHT NOW',
        defaultSort: 'discount-desc',
        showOnlyDiscounted: true,
    },
};

export const sortOptions: SortOption[] = [
    { value: 'latest', label: 'LATEST RELEASES' },
    { value: 'discount-desc', label: 'BEST DISCOUNT' },
    { value: 'price-asc', label: 'PRICE: LOW TO HIGH' },
    { value: 'price-desc', label: 'PRICE: HIGH TO LOW' },
    { value: 'name-asc', label: 'ALPHABETICAL' },
];

const ALIAS_MAP: Record<string, string> = {
    'new-arrival': 'new-arrivals',
    latest: 'new-arrivals',
    tracks: 'track-pants',
    trackpants: 'track-pants',
};

const normalizeText = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const titleFromSlug = (slug: string) =>
    slug
        .split('-')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
        .toUpperCase();

export const getDiscountAmount = (product: Product) => {
    const original = Number(product.originalPrice ?? product.price);
    const current = Number(product.price);
    if (!Number.isFinite(original) || !Number.isFinite(current)) return 0;
    if (original <= current) return 0;
    return original - current;
};

const withDiscount = (product: Product): ProductWithDiscount => {
    const discountAmount = getDiscountAmount(product);
    const original = Number(product.originalPrice ?? product.price);
    const discountPercent = original > 0 ? Math.round((discountAmount / original) * 100) : 0;

    return {
        ...product,
        discountAmount,
        discountPercent,
    };
};

const matchesCategory = (product: Product, category: string) => {
    const target = normalizeText(category);
    const candidate = normalizeText(product.category || '');
    return candidate === target;
};

const matchesToken = (product: Product, tokens: string[]) => {
    const categoryText = normalizeText(product.category || '');
    const collectionText = normalizeText(product.collection || '');
    return tokens.some((token) => categoryText.includes(token) || collectionText.includes(token));
};

export const resolveCollectionPreset = (collectionSlug?: string): CollectionPreset => {
    const raw = String(collectionSlug || 'all').toLowerCase().trim();
    const normalizedSlug = ALIAS_MAP[raw] || raw;
    const known = PRESET_MAP[normalizedSlug];

    if (known) {
        return {
            slug: normalizedSlug,
            isDynamic: false,
            ...known,
        };
    }

    if (!normalizedSlug || normalizedSlug === 'all' || normalizedSlug === 'shop') {
        return {
            slug: 'all',
            title: 'ALL PRODUCTS',
            subtitle: 'BROWSE THE FULL STREETRIOT CATALOG',
            defaultSort: 'latest',
            isDynamic: false,
        };
    }

    const fallbackTokens = normalizedSlug
        .split('-')
        .map((part) => part.toLowerCase())
        .filter(Boolean);

    return {
        slug: normalizedSlug,
        title: titleFromSlug(normalizedSlug),
        subtitle: 'CURATED COLLECTION VIEW',
        defaultSort: 'latest',
        category: titleFromSlug(normalizedSlug)
            .split(' ')
            .map((part, index) => (index === 0 ? part.charAt(0) + part.slice(1).toLowerCase() : part.toLowerCase()))
            .join(' '),
        fallbackTokens,
        isDynamic: true,
    };
};

export const applyCollectionPreset = (products: Product[], preset: CollectionPreset) => {
    let scoped = [...products];

    if (preset.category) {
        scoped = scoped.filter((product) => matchesCategory(product, preset.category || ''));
    }

    if (scoped.length === 0 && preset.fallbackTokens && preset.fallbackTokens.length > 0) {
        const normalizedTokens = preset.fallbackTokens.map((token) => normalizeText(token)).filter(Boolean);
        scoped = products.filter((product) => matchesToken(product, normalizedTokens));
    }

    if (preset.showOnlyDiscounted) {
        const discounted = scoped.filter((product) => getDiscountAmount(product) > 0);
        if (discounted.length > 0) {
            scoped = discounted;
        }
    }

    return scoped;
};

export const sortProducts = (products: Product[], sortBy: SortKey) => {
    const mapped = products.map(withDiscount);

    if (sortBy === 'latest') {
        return mapped.sort((a, b) => b.id - a.id);
    }
    if (sortBy === 'price-asc') {
        return mapped.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
        return mapped.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'name-asc') {
        return mapped.sort((a, b) => a.name.localeCompare(b.name));
    }

    return mapped.sort((a, b) => {
        if (b.discountAmount !== a.discountAmount) {
            return b.discountAmount - a.discountAmount;
        }
        return b.id - a.id;
    });
};
