import type { Product } from '@/app/data/products';
import { formatProductNameForPath } from '@/app/data/products';

const FALLBACK_IMAGE =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBCPPxeva2_roYGpDN5rerNlGmz6zoyzfNrduSt5wuJKChKQlJdaQNuoN650Bnh-v1F17aexaiDdCfX_W0ZRjEaijRW3whfNF0h2Hx3DpaU6yBtTJq6oCZ3XDtmVXvkgM91-RpYY-R_AHUtDM6PvyGgiK7nnMbYjiYo0E734ZjkhnYpM0XuZIwksg46v4EztjbMV8OtIc9SC4TEId6DK3iDB8QIpApL7Q9cgtom_W5A7OIkJXm1-Soke8SI56Cbqj_qhRt56HaFoqDT';

function getBaseUrl() {
    const configured = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
    if (configured) return configured.replace(/\/$/, '');
    return 'http://localhost:8080';
}

type GenericRecord = Record<string, unknown>;

function asRecord(value: unknown): GenericRecord {
    return value && typeof value === 'object' ? (value as GenericRecord) : {};
}

function mapCategoryName(raw: GenericRecord) {
    const categoryObject = asRecord(raw.catagory_id);
    const legacyCategory = asRecord(raw.Catagory);

    if (typeof categoryObject.name === 'string') {
        return categoryObject.name;
    }
    if (typeof legacyCategory.name === 'string') return legacyCategory.name;
    return 'Shop';
}

function mapDetails(raw: GenericRecord) {
    const highlights = Array.isArray(raw.key_highlights) ? raw.key_highlights : [];
    const specs = Array.isArray(raw.specifications) ? raw.specifications : [];

    if (highlights.length > 0) {
        return highlights
            .map((entry) => {
                const item = asRecord(entry);
                const key = typeof item.key === 'string' ? item.key : '';
                const value = typeof item.value === 'string' ? item.value : '';
                if (key && value) return `${key}: ${value}`;
                return value || key || '';
            })
            .filter(Boolean);
    }

    if (specs.length > 0) {
        return specs
            .map((entry) => {
                const item = asRecord(entry);
                const key = typeof item.key === 'string' ? item.key : '';
                const value = typeof item.value === 'string' ? item.value : '';
                if (key && value) return `${key}: ${value}`;
                return value || key || '';
            })
            .filter(Boolean);
    }

    return ['Curated product details'];
}

function stripHtml(value: unknown) {
    const raw = String(value || '');
    return raw
        .replace(/<br\s*\/?\s*>/gi, ' ')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export function normalizeBackendProduct(input: unknown): Product {
    const raw = asRecord(input);
    const id = Number(raw.product_id ?? raw.id ?? 0);
    const publicId = typeof raw.product_code === 'string' ? raw.product_code : undefined;
    const name = String(raw.name || raw.title || `Product ${id || ''}` || 'Product').trim();
    const category = mapCategoryName(raw);
    const imageList = Array.isArray(raw.product_image) ? raw.product_image.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : [];
    const image = typeof imageList[0] === 'string' ? imageList[0] : typeof raw.image === 'string' ? raw.image : FALLBACK_IMAGE;
    const originalPriceNumber = Number(raw.price ?? 0);
    const priceNumber = Number(raw.selling_price ?? raw.price ?? 0);
    const normalizedDescription = stripHtml(raw.description) || 'No description available.';

    return {
        id,
        publicId,
        name,
        slug: formatProductNameForPath(name),
        price: Number.isFinite(priceNumber) ? priceNumber : 0,
        originalPrice: Number.isFinite(originalPriceNumber) ? originalPriceNumber : undefined,
        collection: String(category || 'SHOP').toUpperCase(),
        category,
        tag: raw.quantity === 0 ? 'Sold Out' : undefined,
        colors: Array.isArray(raw.colors) ? raw.colors.map(String) : undefined,
        sizes: Array.isArray(raw.sizes) && raw.sizes.length > 0 ? raw.sizes.map(String) : ['S', 'M', 'L'],
        image,
        images: imageList.length > 0 ? imageList : [image],
        description: normalizedDescription,
        details: mapDetails(raw),
    };
}

export async function fetchBackendProducts(query?: string): Promise<Product[]> {
    try {
        const baseUrl = getBaseUrl();
        const endpoint = query && query.trim().length > 0
            ? `${baseUrl}/user/search?search=${encodeURIComponent(query.trim())}&limit=100`
            : `${baseUrl}/user/show-product?limit=100`;

        const response = await fetch(endpoint, {
            method: 'GET',
            cache: 'no-store',
        });

        if (!response.ok) return [];

        const data = (await response.json()) as GenericRecord;
        const list = Array.isArray(data.products)
            ? data.products
            : Array.isArray(data.data)
                ? data.data
                : [];

        return list.map(normalizeBackendProduct).filter((item: Product) => Number.isFinite(item.id) && item.id > 0);
    } catch {
        return [];
    }
}

export async function fetchBackendProductById(id: string | number): Promise<Product | null> {
    const idValue = String(id || '').trim();
    if (!idValue) return null;

    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/user/get-product-byid/${encodeURIComponent(idValue)}`, {
            method: 'GET',
            cache: 'no-store',
        });

        if (!response.ok) return null;

        const data = (await response.json()) as GenericRecord;
        const rawProduct = Array.isArray(data.data) ? data.data[0] : null;
        if (!rawProduct) return null;

        return normalizeBackendProduct(rawProduct);
    } catch {
        return null;
    }
}
