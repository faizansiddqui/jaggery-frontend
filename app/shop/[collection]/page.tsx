import Comp1 from '../components/Comp1';
import Comp2 from '../components/Comp2';
import Comp3 from '../components/Comp3';

type ShopCollectionRouteProps = {
    params: Promise<{ collection: string }>;
};

export default async function ShopCollectionRoute({ params }: ShopCollectionRouteProps) {
    const { collection } = await params;

    return (
        <div data-scroll-section>
            <Comp1 />
            <Comp2 collectionSlug={collection} />
            <Comp3 />
        </div>
    );
}
