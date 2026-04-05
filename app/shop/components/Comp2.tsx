import ShopCatalog from './catalog';

type Comp2Props = {
  collectionSlug?: string;
};

export default function Comp2({ collectionSlug }: Comp2Props) {
  return <ShopCatalog key={collectionSlug || 'all'} collectionSlug={collectionSlug} />;
}
