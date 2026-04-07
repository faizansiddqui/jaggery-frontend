"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, User, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";
import { useCart } from "@/app/context/CartContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount, isHydrating } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useSiteSettings();
  const stableCartCount = isHydrating ? 0 : itemCount;
  const cartCountLabel = stableCartCount > 99 ? "99+" : String(stableCartCount);

  const mobileMenuLinks = [
    { href: "/shop/new-arrivals", label: "New Arrivals" },
    { href: "/shop/jackets", label: "Jackets" },
    { href: "/shop/hoodies", label: "Hoodies" },
    { href: "/shop/track-pants", label: "Track Pants" },
    { href: "/user/profile", label: "My Profile" },
    { href: "/user/orders", label: "My Orders" },
    { href: "/shop/sale", label: "Sale" },
  ];

  const desktopNavLinkClass = "py-1 hover:text-[#b90c1b] transition-colors";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      id="navbar"
      className={`bg-[#fcf8f8] text-[#1c1b1b] sticky top-0 z-[100] px-6 lg:px-12 flex justify-between items-center border-b border-[#1c1b1b]/10 transition-all duration-500 ${scrolled ? 'h-16 bg-opacity-95 backdrop-blur-md' : 'h-20'}`}
    >
      {/* LOGO */}
      <Link href="/" className="group flex items-center gap-3 text-[#1c1b1b] hover:text-red-700">
        <span className="font-brand text-3xl font-black tracking-widest">
          {settings.navbarTitle || settings.siteName || 'STREETRIOT'}
        </span>
      </Link>

      {/* NAV LINKS */}
      <div className="hidden lg:flex items-center gap-10 font-headline uppercase tracking-[0.2em] text-[12px] font-bold">
        <Link href="/shop/new-arrivals" className={desktopNavLinkClass}>New Arrivals</Link>
        <Link href="/shop/jackets" className={desktopNavLinkClass}>Jackets</Link>
        <Link href="/shop/hoodies" className={desktopNavLinkClass}>Hoodies</Link>
        <Link href="/shop/track-pants" className={desktopNavLinkClass}>Track Pants</Link>
        <Link href="/shop/sale" className={desktopNavLinkClass}>Sale</Link>
      </div>

      {/* NAV ICONS */}
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-5">
          <Link href="/search" className="hover:text-[#b90c1b] transition-all hover:scale-110 flex items-center group">
            <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </Link>
          <Link href="/user/profile" className="hover:text-[#b90c1b] transition-all hover:scale-110 flex items-center group">
            <User className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
          <Link href="/user/wishlist" className="hover:text-[#b90c1b] transition-all hover:scale-110 flex items-center group">
            <Heart className="w-5 h-5 group-hover:scale-125 transition-transform" />
          </Link>
          <Link href="/cart" className="hover:text-[#b90c1b] transition-all hover:scale-110 flex items-center relative group">
            <ShoppingCart className="w-5 h-5 group-hover:rotate-[-5deg] transition-transform" />
            <span className="absolute -top-2 -right-2 bg-[#b90c1b] text-white text-[9px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-bold animate-pulse leading-none">
              {cartCountLabel}
            </span>
          </Link>
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className={`lg:hidden relative flex flex-col gap-1.5 bg-white focus:outline-none transition-transform duration-300 ${isMobileMenuOpen ? "z-[130]" : "z-[110]"}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6 text-[#1c1b1b]" /> : <Menu className="w-6 h-6 text-[#1c1b1b]" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden fixed inset-0 z-[120] transition-opacity duration-400 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        <button
          aria-label="Close mobile menu"
          className="absolute inset-0 bg-white"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={`absolute left-0 right-0 ${scrolled ? "top-16" : "top-20"} bg-white/95 backdrop-blur-xl border-b border-[#1c1b1b]/10 p-8 flex flex-col gap-7 font-headline uppercase tracking-[0.2em] text-xl font-black transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
            }`}
        >
          {mobileMenuLinks.map((entry, index) => (
            <Link
              key={entry.href}
              href={entry.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`transition-all duration-500 hover:text-[#b90c1b] ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                }`}
              style={{ transitionDelay: `${index * 35}ms` }}
            >
              {entry.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
