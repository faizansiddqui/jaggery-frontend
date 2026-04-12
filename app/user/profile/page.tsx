"use client";
import React from "react";

export default function ProfilePage() {
  return (
    <div className="space-y-16">
      {/* Personal Information Section */}
      <section className="bg-surface-container-low rounded-xl p-8 md:p-12 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="font-headline text-3xl font-bold text-primary italic leading-tight">Account Details</h2>
              <p className="text-on-surface-variant text-sm mt-2">Manage your core identity and contact information.</p>
            </div>
            <button className="bg-primary text-on-primary px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary-container transition-all">
              Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Full Name</label>
              <div className="border-b border-outline-variant/40 focus-within:border-primary pb-2 transition-colors">
                <input
                  className="w-full bg-transparent border-none p-0 font-headline italic text-xl text-primary focus:ring-0 outline-none"
                  type="text"
                  defaultValue="Elena Vance"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Email Address</label>
              <div className="border-b border-outline-variant/40 focus-within:border-primary pb-2 transition-colors">
                <input
                  className="w-full bg-transparent border-none p-0 font-headline italic text-xl text-primary focus:ring-0 outline-none"
                  type="email"
                  defaultValue="elena.vance@agrarian.com"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Mobile Phone</label>
              <div className="border-b border-outline-variant/40 focus-within:border-primary pb-2 transition-colors">
                <input
                  className="w-full bg-transparent border-none p-0 font-headline italic text-xl text-primary focus:ring-0 outline-none"
                  type="tel"
                  defaultValue="+1 (555) 234-8890"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Preferred Language</label>
              <div className="border-b border-outline-variant/40 focus-within:border-primary pb-2 transition-colors">
                <select className="w-full bg-transparent border-none p-0 font-headline italic text-xl text-primary focus:ring-0 outline-none appearance-none cursor-pointer">
                  <option>English (UK)</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Addresses Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-headline text-3xl font-bold text-primary italic">Saved Addresses</h2>
          <button className="flex items-center gap-2 border-[1.5px] border-secondary text-secondary px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-secondary-container/10 transition-all">
            <span className="material-symbols-outlined text-[16px]">add</span> Add New
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Address 1 */}
          <div className="bg-surface-container-highest rounded-xl p-8 border border-transparent hover:border-secondary/30 transition-all cursor-pointer relative group">
            <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button aria-label="Edit" className="text-primary hover:text-secondary"><span className="material-symbols-outlined text-[20px]">edit_note</span></button>
              <button aria-label="Delete" className="text-error hover:text-secondary"><span className="material-symbols-outlined text-[20px]">delete_outline</span></button>
            </div>
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-secondary icon-filled">home</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-secondary font-bold bg-secondary-container px-2 py-0.5 rounded">Primary</span>
                <h3 className="font-headline text-xl font-bold text-primary mt-2">The Country Estate</h3>
              </div>
            </div>
            <div className="space-y-1 font-body text-sm text-on-surface-variant leading-relaxed">
              <p>Elena Vance</p>
              <p>42 Heritage Way, Willowbrook</p>
              <p>Kent, CT 06757</p>
              <p>United States</p>
            </div>
          </div>

          {/* Address 2 */}
          <div className="bg-surface rounded-xl p-8 border border-outline-variant/30 hover:border-secondary/30 transition-all cursor-pointer relative group flex flex-col justify-between">
            <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button aria-label="Edit" className="text-primary hover:text-secondary"><span className="material-symbols-outlined text-[20px]">edit_note</span></button>
              <button aria-label="Delete" className="text-error hover:text-secondary"><span className="material-symbols-outlined text-[20px]">delete_outline</span></button>
            </div>
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-surface-variant p-2 rounded-lg">
                <span className="material-symbols-outlined text-on-surface-variant">apartment</span>
              </div>
              <div>
                <h3 className="font-headline text-xl font-bold text-primary mt-2">City Flat</h3>
              </div>
            </div>
            <div className="space-y-1 font-body text-sm text-on-surface-variant leading-relaxed">
              <p>Elena Vance</p>
              <p>Flat 12B, The Gilded Tower</p>
              <p>Manhattan, NY 10012</p>
              <p>United States</p>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Callout */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-primary text-on-primary rounded-xl overflow-hidden relative">
        <div className="md:col-span-1 h-64 md:h-full relative overflow-hidden bg-primary-container">
          <img
            alt="Artisan Texture"
            className="w-full h-full object-cover brightness-75 mix-blend-overlay"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNN_2lgdoWZlKZNGi_kTDHbXlBIwAWSLXAseJD1dygBnS_yJzyK7Cj6e-_Ic5TM6RrzZXXtMylfIbDLum3oO5bFxhhZx-gZ48zTrY1UyJ3VhJI0I7CoDvBFf0w6uemywyXbuCE86JLs5ZJqvg6buu07di-YIXg8-n34HxETSDXFvwXjDoo8RdVYQVKIX1rJIBsm_MF3Or3cVUig_3Zx1szzVU0MLvekz6tG_tlJue8TH5QblVo7_gUDCXaoDjBBEOLm6nVyc0iSxA"
          />
        </div>
        <div className="md:col-span-2 p-10 relative">
          <div className="absolute top-4 right-12 w-20 h-20 md:w-24 md:h-24 rounded-full bg-secondary flex items-center justify-center text-center p-4 border-4 border-primary z-20 shadow-lg rotate-12">
            <span className="font-headline italic text-xs md:text-sm font-bold leading-tight text-white uppercase">100% Traceable</span>
          </div>
          <h3 className="font-headline text-3xl italic mb-4 max-w-sm">Your Gold Standard Protection</h3>
          <p className="font-body text-on-primary/80 text-sm leading-relaxed max-w-md mb-8">
            At Amila Gold, we prioritize the purity of your data as much as the purity of our harvest. Your personal details are stored using state-of-the-art encryption protocols.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-secondary-container">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-on-primary">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-container">
              <span className="material-symbols-outlined text-[20px]">history_edu</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-on-primary">Privacy Guaranteed</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
