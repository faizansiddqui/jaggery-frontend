"use client";
import React from "react";
import Link from "next/link";

const WISHLIST_ITEMS = [
  {
    id: "golden-cubes",
    name: "Golden Cubes",
    badge: "Limited Reserve",
    price: "$34.00",
    category: "Signature Harvest",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBY7bWNz9SaWwwXyLh_tUXdIM-d4oumYt8CvWZ3TrmIg6p5i3gIpPu2nAaTpWGGEK147FCEmydNREEvXz4Jm-Y38nb_QqwKat8yqG43bmnhoixVp2aB76b8qZGOwGymst8jkopZ5x9tbDMqPdnUR50k9jkFRl0lM867LozP-ZiszwgCvi9kpTwcZv_FvGkTNZX-gfCxMeDhCVoUPAgWY_HDAK7lrYc3bqZBkTrI3qh5BpdHqejjGnlsTGnCwwSX5GSUen4R9V2apbQ",
  },
  {
    id: "fine-grain-powder",
    name: "Fine Grain Powder",
    badge: null,
    price: "$28.00",
    category: "Culinary Grade",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRGJBT_rbsCbk9QP-tsczsj9eIfthSLaVrjEYg0xRrIuOyFPrnv5b6ZI47Jiro6873XAJKwAqDTYfW60FuGFrfSYoMi7g1i-Fc1KVtuV53ptyc06qQ9oshMbfJYJPMP9Yv-W4OWUwlJeg_EyBMH95dIGzNYiEFgwkg1q85ml20WNzdvQhJqPIITFI5mGZ6HeP8U22XQs819exBKjUrwFzd3k5w32VnGlP4xSiGl2EBfr7TLuDuRW-pRrgi74Rgj05EnR5GVFb2v8w",
  },
  {
    id: "liquid-gold-syrup",
    name: "Liquid Gold Syrup",
    badge: null,
    price: "$42.00",
    category: "Hand-Pressed",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-3si5Uwbn2uveRzj5TqBWCEpesaYSsXTLUKiQG-HS8ZJrHmGJsOT65_wM8es_0DtTE5j-Inv_7pWoz3qHyczxb3TZpxVGBL9Sml2yfPx38TeQ0fOj1icYAN7defVlUTp6y2-iYUoLKGXKvOWwKnNXpTMQWhnBXcB-S1OtSnGOEuZuix2g3KBpBs0noBp-YnYXJyMKF3FXmQKRUTqUTgsy2yz9qd6i7bWJ4fIbEZP7ADBHlTTSpgz9JmNAOm-CpOIg7wtUM0M7HeQ",
  },
];

export default function WishlistPage() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl md:text-5xl font-headline tracking-tighter text-primary mb-4 italic">The Curated Harvest</h1>
        <p className="text-on-surface-variant max-w-xl font-body leading-relaxed text-sm lg:text-base">
          A personal selection of our finest agrarian treasures. These favorites represent the pinnacle of artisanal purity and golden heritage.
        </p>
      </header>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
        {WISHLIST_ITEMS.map((item) => (
          <div key={item.id} className="group">
            <div className="relative overflow-hidden rounded-xl aspect-[4/5] bg-surface-container-high mb-4">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={item.img}
                alt={item.name}
              />
              <button className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md p-2 rounded-full text-secondary transition-all hover:bg-surface hover:text-primary active:scale-90 shadow-sm z-10">
                <span className="material-symbols-outlined text-[20px] icon-filled">favorite</span>
              </button>
              
              {item.badge ? (
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="bg-primary text-on-primary px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold">
                    {item.badge}
                  </span>
                </div>
              ) : (
                <div className="absolute bottom-4 right-4 z-10">
                  <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-headline text-[9px] text-center p-1 leading-tight shadow-md">
                    Heritage Badge
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-headline text-2xl font-bold text-primary mb-1">{item.name}</h3>
                <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">{item.category}</p>
              </div>
              <p className="font-headline text-xl font-bold text-secondary">{item.price}</p>
            </div>
            
            <button className="w-full py-3.5 rounded-full bg-primary text-on-primary font-label text-xs tracking-widest font-bold uppercase flex items-center justify-center gap-2 transition-all hover:bg-primary-container active:scale-95 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Empty State / Suggestions */}
      <div className="mt-20 p-8 lg:p-12 rounded-3xl bg-primary-container text-on-primary relative overflow-hidden">
        {/* Pattern Background Overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1">
            <h2 className="text-3xl lg:text-4xl font-headline italic mb-4 font-bold">The Artisan's Selection</h2>
            <p className="text-primary-fixed-dim/90 max-w-md mb-8 leading-relaxed font-body text-sm">
              Discover products that pair perfectly with your favorites. Curated monthly by our head agronomist.
            </p>
            <Link href="/shop" className="inline-block px-8 py-3.5 border border-secondary rounded-full text-secondary font-label text-xs font-bold tracking-widest uppercase hover:bg-secondary hover:text-white transition-all shadow-sm bg-surface/5 backdrop-blur-sm">
              Explore Collections
            </Link>
          </div>
          <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-secondary/30 shrink-0 shadow-2xl">
            <img 
              className="w-full h-full object-cover mix-blend-overlay opacity-80" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuChldJanv9HUYcc86nCudTMxqBrQhJ6PxLFngBXQkpX5CQlN0WVPvbzlPtGsDahtWYLuHf1vT2c-cg-ILTeN_-UQ9Ah99_Ks3SpediiIK5JGW3VMunWU5eTUXGEaB1olH7s8u0T-2jU6p-QS4fI7qlveCji_kpzNswayAF-O4FH8a_FB__UVTeP6SZ7swIKY6gsFpUHuKaqzLhymmQ14t2Qu2IUVKbnJ-lFDhrmaxIGOZKN60L8NHHa1fHsPMbVSPRNQszo-rV5R7o"
              alt="Organic soil and gold dust"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
