"use client";
import React from "react";

export default function ProductHeader() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
      {/* Product Images */}
      <div className="lg:col-span-7 relative">
        <div className="rounded-xl overflow-hidden aspect-[4/5] bg-surface-container-low shadow-sm">
          <img
            alt="Pure Desi Jaggery Blocks"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtFeds84QWGXbk6MG-VJlIdrvYHWs2N_OKv2RmDlH8KQZ_ZhEv-zS39SWbYALmGI379qPzw0ME60-H6iMld8y2qlBxJo4l5VsInz6S5GKQjLqwxbQbIuxHLmcbJEZJq6nAgLG6jhSsa5GJA7qOkxrIUiJz8doSiUwhFUFllzDdgFjJacjn4acCcBJN8mKw2VnOpmS6_y2Li_BaRxpHPTl71LwMsew-mLw8AThwqVuydhV-AhjHIKLgEOkXn0Inx6rkWtWNsQLkT9E"
          />
        </div>
        <div className="absolute -top-6 -right-6 w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-secondary text-on-secondary flex flex-col items-center justify-center text-center p-4 shadow-xl rotate-12">
          <span className="font-headline italic text-xs lg:text-sm">Genuine</span>
          <span className="font-bold text-base lg:text-lg uppercase tracking-widest leading-none my-1">100%</span>
          <span className="font-headline italic text-xs lg:text-sm">Natural</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        <div className="space-y-4">
          <nav className="flex gap-2 text-on-surface-variant font-label text-sm uppercase tracking-widest">
            <span>Shop</span>
            <span>/</span>
            <span className="text-secondary font-bold">Pure Desi Jaggery</span>
          </nav>
          <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary leading-none">Pure Desi Jaggery</h1>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-headline text-secondary">$15.99</span>
            <span className="text-on-surface-variant text-sm font-label">/ 1kg Package</span>
          </div>
        </div>

        <div className="space-y-6 text-on-surface leading-relaxed font-body">
          <p className="text-lg">
            Experience the unadulterated sweetness of the earth. Our Amila Gold Jaggery is crafted from the first press of sun-ripened sugarcane, concentrated using heritage techniques passed down through generations.
          </p>
          
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Select Weight</span>
            <div className="flex gap-3 flex-wrap">
              <button className="px-6 py-3 rounded-full border-2 border-outline-variant text-sm font-bold hover:border-primary transition-all">500g</button>
              <button className="px-6 py-3 rounded-full border-2 border-primary bg-primary/5 text-sm font-bold text-primary transition-all">1kg</button>
              <button className="px-6 py-3 rounded-full border-2 border-outline-variant text-sm font-bold hover:border-primary transition-all">2kg</button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-xl text-center">
              <span className="material-symbols-outlined text-primary mb-2 text-2xl">block</span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-tighter text-on-surface-variant">No Chemicals</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-xl text-center">
              <span className="material-symbols-outlined text-primary mb-2 text-2xl">pan_tool</span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Handmade</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-xl text-center">
              <span className="material-symbols-outlined text-primary mb-2 text-2xl">history_edu</span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Traditional</span>
            </div>
          </div>
        </div>

        <div className="pt-6 space-y-6 border-t border-outline-variant/20">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center justify-between w-full sm:w-auto bg-surface-container-highest rounded-full px-4 py-2">
              <button className="p-1 hover:text-primary transition-colors focus:outline-none">
                <span className="material-symbols-outlined text-lg">remove</span>
              </button>
              <span className="px-6 font-bold text-lg font-headline">1</span>
              <button className="p-1 hover:text-primary transition-colors focus:outline-none">
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
            <button className="flex-1 w-full bg-primary text-on-primary py-4 rounded-full font-bold uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 flex justify-center items-center gap-3 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined icon-filled">shopping_basket</span>
              Add to Cart
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest justify-center sm:justify-start">
            <span className="material-symbols-outlined text-secondary icon-filled">verified</span>
            Natural & Pure Guaranteed
          </div>
        </div>
      </div>
    </div>
  );
}
