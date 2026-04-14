import type { Product } from "@/app/data/products";
import { fetchBackendProducts } from "@/app/lib/backendProducts";

export async function fetchFeaturedProducts(): Promise<Product[]> {
    // Optionally, you can filter or sort featured products here if needed
    return fetchBackendProducts();
}
