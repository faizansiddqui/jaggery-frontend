"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/shop", label: "Shop", icon: "storefront" },
  { href: "/search", label: "Our Story", icon: "auto_stories" },
  { href: "/search", label: "Wholesale", icon: "local_shipping" },
];

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { itemCount, isHydrating } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const stableCartCount = isHydrating ? 0 : itemCount;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  return (
    <>
      {/* ── Top Bar ── */}
      <nav
        id="navbar"
        className={`fixed top-0 w-full z-999 transition-all duration-300 ${scrolled ? "glass-nav shadow-sm text-green-900 hover:text-secondary" : "bg-transparent text-green-900 hover:text-secondary"
          }`}
      >
        <div className="flex justify-between items-center px-6 lg:px-10 py-4">
          {/* Left: Hamburger */}
          <button
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col justify-center gap-[5px] cursor-pointer w-9 h-9 group"
          >
            <span className={`block h-[2px] bg-green-900 rounded-full transition-all duration-300 ${scrolled ? "" : "bg-green-900 text-green-900 hover:text-secondary"}`} style={{ width: "24px" }} />
            <span className={`block h-[2px] bg-green-900 rounded-full transition-all duration-300 ${scrolled ? "" : "bg-green-900 text-green-900 hover:text-secondary"}`} style={{ width: "18px" }} />
            <span className={`block h-[2px] bg-green-900 rounded-full transition-all duration-300 ${scrolled ? "" : "bg-green-900 text-green-900 hover:text-secondary"}`} style={{ width: "24px" }} />
          </button>

          {/* Center: Logo + Brand */}
          <Link
            href="/"
            className={`flex items-center gap-2 transition-colors ${scrolled ? "text-green-900" : "text-green-900"}`}
          >
            {/* Logo Image */}
            <Image src="/logo.png" alt="Amila Gold Logo" width={32} height={32} />
            <span className="font-headline text-2xl font-black italic tracking-tight hover:text-secondary">Amila Gold</span>
          </Link>

          {/* Right: Search + Cart */}
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className={`transition-colors ${scrolled ? "text-green-900 hover:text-secondary" : "text-green-900 hover:text-secondary"}`}
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </Link>
            <Link
              href="/user/profile"
              className={`transition-colors ${scrolled ? "text-green-900 hover:text-secondary" : "text-green-900 hover:text-secondary"}`}
            >
              <span className="material-symbols-outlined text-[22px]">person</span>
            </Link>
            <Link
              href="/cart"
              className={`relative transition-colors ${scrolled ? "text-green-900 hover:text-secondary" : "text-green-900 hover:text-secondary"}`}
            >
              <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
              {stableCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-[9px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-bold leading-none">
                  {stableCartCount > 99 ? "99+" : stableCartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Sidebar Overlay ── */}
      <div
        className={`fixed inset-0 z-[200] transition-all duration-400 ${sidebarOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setSidebarOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-400 ${sidebarOpen ? "opacity-100" : "opacity-0"
            }`}
        />

        {/* Sidebar Panel */}
        <aside
          className={`absolute left-0 top-0 h-full w-80 bg-surface-container-low flex flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-outline-variant/20">
            <Link
            href="/"
            className={`flex items-center gap-2 transition-colors ${scrolled ? "text-green-900" : "text-green-900"}`}
          >
            {/* Logo Image */}
            <Image src="/logo.png" alt="Amila Gold Logo" width={32} height={32} />
            <span className="font-headline text-2xl font-black italic tracking-tight hover:text-secondary">Amila Gold</span>
          </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer hover:bg-surface-container transition-colors text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 flex flex-col px-6 py-8 gap-1 overflow-y-auto">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-on-surface hover:bg-surface-container hover:text-primary transition-all duration-200 group ${sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                style={{ transitionDelay: sidebarOpen ? `${i * 55 + 100}ms` : "0ms" }}
              >
                <span className="material-symbols-outlined text-[20px] text-secondary group-hover:text-primary transition-colors">
                  {link.icon}
                </span>
                <span className="font-headline text-lg font-bold tracking-tight">{link.label}</span>
              </Link>
            ))}

            <div className="my-4 border-t border-outline-variant/20" />

            {/* Profile Link */}
            <Link
              href="/user/profile"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-on-surface hover:bg-surface-container hover:text-primary transition-all duration-200 group ${sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
              style={{ transitionDelay: sidebarOpen ? `${NAV_LINKS.length * 55 + 100}ms` : "0ms" }}
            >
              <span className="material-symbols-outlined text-[20px] text-secondary group-hover:text-primary transition-colors">person</span>
              <span className="font-headline text-lg font-bold tracking-tight">My Profile</span>
            </Link>

            <Link
              href="/cart"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-on-surface hover:bg-surface-container hover:text-primary transition-all duration-200 group ${sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
              style={{ transitionDelay: sidebarOpen ? `${(NAV_LINKS.length + 1) * 55 + 100}ms` : "0ms" }}
            >
              <span className="material-symbols-outlined text-[20px] text-secondary group-hover:text-primary transition-colors">shopping_cart</span>
              <span className="font-headline text-lg font-bold tracking-tight">
                Cart {stableCartCount > 0 && <span className="ml-1 bg-secondary text-white text-[10px] px-1.5 py-0.5 rounded-full">{stableCartCount}</span>}
              </span>
            </Link>
          </nav>

          {/* Sidebar Footer */}
          <div className="px-8 py-6 border-t border-outline-variant/20 bg-primary/5">
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant opacity-70 leading-relaxed">
              Pure • Unrefined • Ethical <br />© 2024 Amila Gold
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
