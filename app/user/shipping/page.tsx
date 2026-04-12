"use client";
import React from "react";

export default function ShippingAddressesPage() {
  return (
    <div className="flex-grow min-h-screen max-w-5xl mx-auto pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="max-w-xl">
          <nav className="flex items-center gap-2 mb-4 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-secondary uppercase">
            <span>Account</span>
            <span className="material-symbols-outlined text-[10px] sm:text-xs">chevron_right</span>
            <span className="text-outline">Addresses</span>
          </nav>
          <h1 className="font-headline text-5xl md:text-6xl text-primary font-medium tracking-tight">Shipping Addresses</h1>
          <p className="mt-4 text-on-surface-variant max-w-md font-medium leading-relaxed font-body">
            Manage your delivery locations for a seamless checkout experience across your heritage subscription.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-secondary text-secondary rounded-full font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-secondary/5 transition-all">
          <span className="material-symbols-outlined text-lg">add</span>
          Add New Address
        </button>
      </div>

      {/* Bento Grid Layout for Addresses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Primary Address Card */}
        <div className="group relative bg-surface-container-low rounded-[2rem] p-8 transition-all hover:bg-surface-container-high overflow-hidden border border-outline-variant/10 shadow-sm">
          {/* Heritage Badge Overlay for Primary */}
          <div className="absolute -top-4 -right-4 bg-secondary w-24 h-24 rounded-full flex items-center justify-center text-on-secondary font-headline italic text-xs rotate-12 shadow-xl shadow-secondary/20 z-10">
            <span className="text-center pt-4 pr-4">Primary<br />Selection</span>
          </div>
          
          <div className="flex flex-col h-full relative z-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-inner">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
              </div>
              <h2 className="font-headline text-2xl text-primary font-bold">Home</h2>
            </div>
            
            <div className="space-y-1 mb-8 text-on-surface font-medium font-body">
              <p className="text-lg">Julian Thorne</p>
              <p className="text-on-surface-variant">482 Heritage Oaks Lane</p>
              <p className="text-on-surface-variant">Oakville, CA 94562</p>
              <p className="text-on-surface-variant">United States</p>
            </div>
            
            <div className="flex items-center gap-2 mb-8 text-sm text-primary font-bold">
              <span className="material-symbols-outlined text-lg">phone</span>
              +1 (707) 555-0192
            </div>
            
            <div className="mt-auto flex items-center gap-6 pt-6 border-t border-outline-variant/30">
              <button className="text-sm font-bold tracking-widest uppercase text-primary hover:text-secondary transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit
              </button>
              <button className="text-sm font-bold tracking-widest uppercase text-outline hover:text-error transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">delete</span>
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Address Card */}
        <div className="group bg-surface-container-low rounded-[2rem] p-8 transition-all hover:bg-surface-container-high border border-outline-variant/10 shadow-sm">
          <div className="flex flex-col h-full relative z-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary shadow-inner">
                <span className="material-symbols-outlined text-xl">business</span>
              </div>
              <h2 className="font-headline text-2xl text-primary font-bold">Office</h2>
            </div>
            
            <div className="space-y-1 mb-8 text-on-surface font-medium font-body">
              <p className="text-lg">Thorne & Associates</p>
              <p className="text-on-surface-variant">1200 Sansome Street, Suite 400</p>
              <p className="text-on-surface-variant">San Francisco, CA 94111</p>
              <p className="text-on-surface-variant">United States</p>
            </div>
            
            <div className="flex items-center gap-2 mb-8 text-sm text-primary font-bold">
              <span className="material-symbols-outlined text-lg">phone</span>
              +1 (415) 555-0238
            </div>
            
            <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-6 border-t border-outline-variant/30">
              <button className="text-sm font-bold tracking-widest uppercase text-primary hover:text-secondary transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit
              </button>
              <button className="text-sm font-bold tracking-widest uppercase text-outline hover:text-error transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">delete</span>
                Remove
              </button>
              <button className="ml-auto text-[10px] font-black tracking-widest uppercase bg-surface-container-highest px-3 py-1.5 rounded-full text-outline-variant hover:text-primary transition-colors">
                Set as Primary
              </button>
            </div>
          </div>
        </div>

        {/* Empty State / Add Card */}
        <div className="group border-2 border-dashed border-outline-variant rounded-[2rem] p-8 flex flex-col items-center justify-center text-center gap-4 hover:bg-surface-container-low/50 transition-all cursor-pointer min-h-[280px]">
          <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-outline-variant group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg">
            <span className="material-symbols-outlined text-3xl">add_location_alt</span>
          </div>
          <div>
            <h3 className="font-headline text-xl text-primary font-bold">Add Another Destination</h3>
            <p className="text-on-surface-variant text-sm max-w-[200px] mt-1 font-body mx-auto">
              A seasonal home or a gift for someone special.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="mt-20 opacity-30 pointer-events-none">
        <div className="flex justify-between items-center border-t border-outline-variant/20 pt-8">
          <div className="font-headline italic text-primary">Est. 2021</div>
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-secondary"></div>
            <div className="w-2 h-2 rounded-full bg-secondary opacity-50"></div>
            <div className="w-2 h-2 rounded-full bg-secondary opacity-20"></div>
          </div>
          <div className="font-headline italic text-primary uppercase tracking-widest text-xs">Authentic Origin</div>
        </div>
      </div>
    </div>
  );
}
