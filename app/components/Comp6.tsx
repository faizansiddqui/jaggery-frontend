import Link from 'next/link';
import Image from 'next/image';
import { createProductHref } from '@/app/data/products';
import { fetchBackendProducts } from '@/app/lib/backendProducts';
import { fetchPublicSiteSettings } from '@/app/lib/apiClient';

export default async function Comp6() {
  const [products, siteSettings] = await Promise.all([
    fetchBackendProducts(),
    fetchPublicSiteSettings().catch(() => null),
  ]);
  const currency = siteSettings?.currencySymbol || '$';
  const arrivals = products.slice(0, 4);

  return (
    <>
      <section className="py-16 md:py-24 bg-surface-container-low px-4 md:px-8">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6 md:gap-8">
            <div>
              <span className="text-primary font-headline font-black text-lg md:text-xl tracking-[0.3em]">
                NEW ARRIVALS
              </span>
              <h2 className="font-brand text-4xl sm:text-6xl md:text-7xl text-on-surface mt-2 uppercase leading-tight">
                THE LATEST GEAR
              </h2>
            </div>
            <Link href="/shop/new-arrivals" className="border-b-2 border-on-surface font-headline font-bold text-xs md:text-sm tracking-widest pb-1 hover:text-primary hover:border-primary transition-all">
              VIEW ALL PRODUCTS
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {arrivals.map((product, index) => (
              <Link key={product.id} href={createProductHref(product)} className="group block">
                <div className="relative bg-surface-container-lowest aspect-[3/4] mb-6 overflow-hidden">
                  <Image
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${index === 0 ? 'grayscale group-hover:grayscale-0' : ''}`}
                    src={product.image}
                    alt={product.name}
                    width={900}
                    height={1200}
                    unoptimized
                  />
                  {product.tag && (
                    <div className={`absolute top-4 right-4 px-3 py-1 font-headline font-bold text-xs uppercase ${product.tag.toLowerCase().includes('sold') ? 'bg-primary text-white' : 'bg-on-surface text-surface'}`}>
                      {product.tag}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-headline font-bold text-lg uppercase tracking-tight">
                      {product.name}
                    </h4>
                    <p className="text-on-surface/60 text-sm uppercase">
                      {product.collection}
                    </p>
                  </div>
                  <span className="font-headline font-black text-lg">{currency}{product.price.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
