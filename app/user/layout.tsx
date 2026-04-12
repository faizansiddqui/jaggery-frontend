"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/user/profile", label: "Personal Info", icon: "person" },
    { href: "/user/shipping", label: "Shipping Addresses", icon: "local_shipping" },
    { href: "/user/orders", label: "Order History", icon: "history" },
    { href: "/user/wishlist", label: "My Wishlist", icon: "loyalty" },
  ];

  return (
    <main className="max-w-screen-2xl mx-auto px-6 md:px-12 py-32 flex flex-col md:flex-row gap-12 lg:gap-16 min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0 space-y-12">
        <div className="sticky top-32">
          <div className="mb-8">
            <h1 className="font-headline text-3xl lg:text-4xl font-bold italic tracking-tight text-primary mb-2">Welcome, Elena</h1>
            <p className="text-on-surface-variant text-xs lg:text-sm font-label uppercase tracking-wider">Member since Nov 2023</p>
          </div>
          <nav className="flex flex-col gap-6">
            {links.map((link) => {
              const active = pathname?.includes(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-4 transition-all pl-5 border-l-4 ${
                    active
                      ? "text-primary font-semibold border-secondary"
                      : "text-on-surface-variant hover:text-primary border-transparent"
                  }`}
                >
                  <span
                    className="material-symbols-outlined scale-90"
                    style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {link.icon}
                  </span>
                  <span className="font-label text-xs lg:text-sm uppercase tracking-[0.15em]">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-8 mt-4">
            <button className="flex items-center gap-3 text-error font-label text-xs uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity pl-5">
              <span className="material-symbols-outlined text-sm">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1">
        {children}
      </section>
    </main>
  );
}
