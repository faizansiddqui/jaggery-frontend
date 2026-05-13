'use client';

import { useEffect, useMemo, useState } from 'react';
import ProductHeader from './ProductHeader';
import WellnessPath from './WellnessPath';
import NutritionFacts from './NutritionFacts';
import ReviewsAndSimilar from './ReviewsAndSimilar';
import PromiseBanner from './PromiseBanner';
import { fetchBackendProductById, fetchBackendProducts } from '@/app/lib/backendProducts';
import { formatProductNameForPath, type Product } from '@/app/data/products';
import ProductNotFound from './ProductNotFound';

import { ProductPageSkeleton } from '@/app/components/Skeletons';

export default function ProductPageClient({ id, name }: { id: string; name?: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const requestedId = useMemo(() => String(id || '').trim(), [id]);
  const requestedSlug = useMemo(() => formatProductNameForPath(name || ''), [name]);

  useEffect(() => {
    let active = true;

    const resolveProduct = async () => {
      try {
        setIsLoading(true);
        let resolved: Product | null = await fetchBackendProductById(requestedId);

        if (!resolved) {
          const allProducts = await fetchBackendProducts();
          const requestedNumericId = Number(requestedId);
          resolved =
            allProducts.find((p) => p.publicId === requestedId) ||
            allProducts.find((p) => Number.isFinite(requestedNumericId) && p.id === requestedNumericId) ||
            allProducts.find((p) => p.slug === requestedSlug) ||
            null;
        }

        if (active) {
          setProduct(resolved);
        }
      } catch (error) {
        if (active) setProduct(null);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    resolveProduct();

    return () => {
      active = false;
    };
  }, [requestedId, requestedSlug]);

  if (isLoading) return <ProductPageSkeleton />;
  if (!product) return <ProductNotFound />;


  return (
    <div className="pt-24 pb-12 px-2 sm:px-2 lg:px-12 max-w-screen-2xl mx-auto selection:bg-secondary-container selection:text-on-secondary-container">
      <ProductHeader product={product} />
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-0">
        <NutritionFacts product={product} />
        <WellnessPath />
        <ReviewsAndSimilar product={product} />
        <PromiseBanner />
      </div>
    </div>
  );
}

