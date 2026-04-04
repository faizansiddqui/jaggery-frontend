"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingCart, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      id="navbar" 
      className={`bg-[#1c1b1b] text-white sticky top-0 z-[100] px-6 lg:px-12 flex justify-between items-center border-b border-white/5 transition-all duration-500 ${scrolled ? 'h-16 bg-opacity-95 backdrop-blur-md' : 'h-20'}`}
    >
      {/* LOGO */}
      <Link href="/" className="font-['Bebas_Neue'] text-3xl font-black tracking-widest text-white group">
        STREET<span className="text-primary group-hover:text-white transition-all duration-300 transform group-hover:scale-110 inline-block">RIOT</span>
      </Link>

      {/* NAV LINKS */}
      <div className="hidden lg:flex items-center gap-10 font-['Space_Grotesk'] uppercase tracking-[0.2em] text-[12px] font-bold">
        <Link href="/shop" className="hover:text-primary transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">New Arrivals</Link>
        <Link href="/shop" className="hover:text-primary transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">Jackets</Link>
        <Link href="/shop" className="hover:text-primary transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">Hoodies</Link>
        <Link href="/shop" className="hover:text-primary transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">Track Pants</Link>
        <Link href="/shop" className="text-primary hover:text-white transition-colors">Sale</Link>
      </div>

      {/* NAV ICONS */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-5">
          <Link href="/search" className="hover:text-primary transition-all hover:scale-110 flex items-center group">
            <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </Link>
          <Link href="/user/profile" className="hover:text-primary transition-all hover:scale-110 flex items-center group">
            <User className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
          <Link href="/user/wishlist" className="hover:text-primary transition-all hover:scale-110 flex items-center group">
            <Heart className="w-5 h-5 group-hover:scale-125 transition-transform" />
          </Link>
          <Link href="/cart" className="hover:text-primary transition-all hover:scale-110 flex items-center relative group">
            <ShoppingCart className="w-5 h-5 group-hover:rotate-[-5deg] transition-transform" />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">2</span>
          </Link>
        </div>

        {/* MOBILE HAMBURGER */}
        <button 
          className="lg:hidden flex flex-col gap-1.5 focus:outline-none" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[64px] bg-[#1c1b1b]/95 backdrop-blur-xl z-[99] p-10 flex flex-col gap-8 font-['Space_Grotesk'] uppercase tracking-[0.2em] text-xl font-black animate-in fade-in slide-in-from-top-4">
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>New Arrivals</Link>
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Jackets</Link>
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Hoodies</Link>
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Track Pants</Link>
          <Link href="/user/profile" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link>
          <Link href="/user/orders" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
          <Link href="/shop" className="text-primary" onClick={() => setIsMobileMenuOpen(false)}>Sale</Link>
        </div>
      )}
    </nav>
  );
}
