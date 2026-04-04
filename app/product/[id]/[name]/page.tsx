import { notFound, redirect } from 'next/navigation';
import Comp1 from './components/Comp1';
import { formatProductNameForPath } from '@/app/data/products';
import { fetchBackendProductById } from '@/app/lib/backendProducts';

type ProductPageProps = {
    params: Promise<{ id: string; name: string }>;
};

export default async function ProductDetailRoute({ params }: ProductPageProps) {
    const { id, name } = await params;
    const routeId = String(id || '').trim();
    const backendProduct = await fetchBackendProductById(routeId);
    const product = backendProduct;

    if (!product) {
        notFound();
    }

    const canonicalName = product ? formatProductNameForPath(product.name) : name;
    const canonicalId = product?.publicId || (product ? String(product.id) : routeId);

    if (product && name !== canonicalName) {
        redirect(`/product/${canonicalId}/${canonicalName}`);
    }

    return (
        <div data-scroll-section>
            <Comp1 product={product} />
        </div>
    );
}