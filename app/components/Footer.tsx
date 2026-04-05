import React from "react";
import Link from "next/link";
import { CreditCard, Wallet, Landmark, Heart, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";

export default function Footer() {
  const { settings } = useSiteSettings();
  const footerDescription =
    settings.footerDescription ||
    "Forging the future of urban streetwear. Precision engineered, culturally driven, and globally distributed.";

  return (
    <footer className="bg-[#fcf8f8] text-[#1c1b1b] border-t border-[#1c1b1b]/10 py-24 px-8 lg:px-24">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">

        {/* BRAND COLUMN */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="font-brand text-4xl font-black tracking-widest text-[#1c1b1b]">
            {settings.footerTitle || settings.siteName || 'STREETRIOT'}
          </Link>
          <p className="text-[#1c1b1b]/60 font-headline text-sm leading-relaxed max-w-xs uppercase tracking-widest">
            {footerDescription}
          </p>
          <div className="flex gap-4 mt-4">
            <Link href={settings.instagramUrl || "#"} target="_blank" className="w-11 h-11 border border-[#1c1b1b]/10 flex items-center justify-center hover:bg-[#b90c1b] transition-all hover:border-[#b90c1b] group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform fill-current group-hover:text-white" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>
            <Link href={settings.twitterUrl || "#"} target="_blank" className="w-11 h-11 border border-[#1c1b1b]/10 flex items-center justify-center hover:bg-[#b90c1b] transition-all hover:border-[#b90c1b] group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform fill-current group-hover:text-white" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </Link>
            <Link href={settings.facebookUrl || "#"} target="_blank" className="w-11 h-11 border border-[#1c1b1b]/10 flex items-center justify-center hover:bg-[#b90c1b] transition-all hover:border-[#b90c1b] group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform fill-current group-hover:text-white" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* SHOP COLUMN */}
        <div className="flex flex-col gap-6">
          <h4 className="font-brand text-xl tracking-[0.2em] uppercase">Curated Shop</h4>
          <ul className="flex flex-col gap-4 font-headline text-sm text-[#1c1b1b]/60 uppercase tracking-widest">
            <li><Link href="/shop" className="hover:text-[#b90c1b] transition-colors">ALL COLLECTIONS</Link></li>
            <li><Link href="/shop/technical-gear" className="hover:text-[#b90c1b] transition-colors">TECHNICAL GEAR</Link></li>
            <li><Link href="/shop/editorial-drops" className="hover:text-[#b90c1b] transition-colors">EDITORIAL DROPS</Link></li>
            <li><Link href="/shop/accessories" className="hover:text-[#b90c1b] transition-colors">ACCESSORIES</Link></li>
            <li><Link href="/shop/limited-archives" className="hover:text-[#b90c1b] transition-colors">LIMITED ARCHIVES</Link></li>
          </ul>
        </div>

        {/* ACCOUNT & HELP COLUMN */}
        <div className="flex flex-col gap-6">
          <h4 className="font-brand text-xl tracking-[0.2em] uppercase">User Portal</h4>
          <ul className="flex flex-col gap-4 font-headline text-sm text-[#1c1b1b]/60 uppercase tracking-widest">
            <li><Link href="/user/profile" className="hover:text-[#b90c1b] transition-colors">MY PROFILE</Link></li>
            <li><Link href="/user/orders" className="hover:text-[#b90c1b] transition-colors">ORDER TRACKING</Link></li>
            <li><Link href="/user/wishlist" className="hover:text-[#b90c1b] transition-colors">WISHLIST ARCHIVE</Link></li>
            <li><Link href="/journal/faq" className="hover:text-[#b90c1b] transition-colors">GLOBAL FAQ</Link></li>
            <li><Link href="/journal/size-guide" className="hover:text-[#b90c1b] transition-colors">SIZE GUIDE</Link></li>
          </ul>
        </div>

        {/* COMPANY COLUMN */}
        <div className="flex flex-col gap-6">
          <h4 className="font-brand text-xl tracking-[0.2em] uppercase">The Network</h4>
          <ul className="flex flex-col gap-4 font-headline text-sm text-[#1c1b1b]/60 uppercase tracking-widest">
            <li><Link href="/journal" className="hover:text-[#b90c1b] transition-colors">THE JOURNAL</Link></li>
            <li><Link href="/contact" className="hover:text-[#b90c1b] transition-colors">CONTACT</Link></li>
          </ul>
        </div>
      </div>

      {/* SERVICE CARDS */}
      <div className="max-w-[1920px] mx-auto mt-24 mb-16 grid grid-cols-1 md:grid-cols-3 gap-10 border-y border-[#1c1b1b]/10 py-12">
        <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-[#f6f3f2] flex items-center justify-center group-hover:bg-[#b90c1b] transition-colors">
            <Truck className="w-6 h-6 text-[#b90c1b] group-hover:text-white" />
          </div>
          <div>
            <h5 className="font-headline font-bold text-sm tracking-widest uppercase">GLOBAL SHIPPING</h5>
            <p className="text-[10px] text-[#1c1b1b]/40 tracking-tighter mt-1 uppercase">D2C SPEED WORLDWIDE</p>
          </div>
        </div>
        <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-[#f6f3f2] flex items-center justify-center group-hover:bg-[#b90c1b] transition-colors">
            <RefreshCw className="w-6 h-6 text-[#b90c1b] group-hover:text-white" />
          </div>
          <div>
            <h5 className="font-headline font-bold text-sm tracking-widest uppercase">EASY RETURNS</h5>
            <p className="text-[10px] text-[#1c1b1b]/40 tracking-tighter mt-1 uppercase">NO HAGGLE PROTOCOL</p>
          </div>
        </div>
        <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-[#f6f3f2] flex items-center justify-center group-hover:bg-[#b90c1b] transition-colors">
            <ShieldCheck className="w-6 h-6 text-[#b90c1b] group-hover:text-white" />
          </div>
          <div>
            <h5 className="font-headline font-bold text-sm tracking-widest uppercase">SECURE PORTAL</h5>
            <p className="text-[10px] text-[#1c1b1b]/40 tracking-tighter mt-1 uppercase">ENCRYPTION VERIFIED</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto pt-12 flex flex-col md:flex-row justify-between items-center gap-8 font-headline text-[10px] tracking-[0.3em] text-[#1c1b1b]/40 uppercase">
        <div className="flex gap-8">
          <span>© {new Date().getFullYear()} {(settings.siteName || 'STREETRIOT').toUpperCase()} INDUSTRIES</span>
          <Link href="/privacy-policy" className="hover:text-[#b90c1b] transition-colors">PRIVACY POLICY</Link>
          <Link href="/terms-of-service" className="hover:text-[#b90c1b] transition-colors">TERMS OF SERVICE</Link>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#b90c1b] animate-pulse" />
          <span>HANDCRAFTED FOR THE GLOBAL UNDERGROUND</span>
        </div>
        <div className="flex gap-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <CreditCard className="w-5 h-5" />
          <Landmark className="w-5 h-5" />
          <Wallet className="w-5 h-5" />
        </div>
      </div>
    </footer>
  );
}
