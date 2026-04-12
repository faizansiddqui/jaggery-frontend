import React from "react";
import Link from "next/link";

const footerLinks = {
  "The Journey": [
    { label: "The Harvest", href: "/" },
    { label: "Purity Standards", href: "/" },
    { label: "Our Story", href: "/" },
  ],
  "Support": [
    { label: "Shipping", href: "/" },
    { label: "Contact", href: "/" },
    { label: "Wholesale", href: "/" },
  ],
  "Legal": [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-green-900 text-stone-50 rounded-t-3xl mt-12">
      {/* Main Footer Content */}
      <div className="flex flex-col md:flex-row justify-between items-start px-12 py-16 w-full gap-12">
        {/* Brand Column */}
        <div className="mb-4 md:mb-0 max-w-xs">
          <span className="font-headline text-xl text-stone-100 italic mb-4 block">Amila Gold</span>
          <p className="font-body text-sm tracking-wide uppercase text-stone-300/70 leading-relaxed mb-6">
            Providing the purest unrefined gold for the modern, conscious soul.
          </p>
          <div className="flex gap-4">
            <a href="#" aria-label="Social" className="text-stone-300/70 hover:text-yellow-400 transition-colors">
              <span className="material-symbols-outlined">language</span>
            </a>
            <a href="#" aria-label="Instagram" className="text-stone-300/70 hover:text-yellow-400 transition-colors">
              <span className="material-symbols-outlined">camera</span>
            </a>
            <a href="#" aria-label="Community" className="text-stone-300/70 hover:text-yellow-400 transition-colors">
              <span className="material-symbols-outlined">hub</span>
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-3">
              <span className="font-body text-sm tracking-widest uppercase font-bold text-yellow-400">
                {category}
              </span>
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-body text-stone-300/70 hover:text-stone-50 hover:translate-x-1 transition-all duration-200 text-sm uppercase tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-12 py-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-body text-xs tracking-widest uppercase opacity-50">
          © 2024 Amila Gold. The Modern Agrarian.
        </span>
        <div className="flex gap-8 items-center text-xs tracking-[0.2em] uppercase opacity-50">
          <span>Handmade in the valley</span>
          <span>Ethically Sourced</span>
        </div>
      </div>
    </footer>
  );
}
