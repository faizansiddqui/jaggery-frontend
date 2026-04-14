"use client";
import React from "react";
import Link from "next/link";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";
import { getWholesaleWhatsAppUrl } from "@/app/lib/whatsapp";

const WHOLESALE_WHATSAPP_URL = getWholesaleWhatsAppUrl();

type FooterLinkItem = { label: string; href: string; external?: boolean };

const footerLinks: Record<string, FooterLinkItem[]> = {
  "Links": [
    { label: "Our Products", href: "/shop" },
    { label: "My Orders", href: "/user/orders" },
    { label: "My Wishlist", href: "/user/wishlist" },
  ],
  "Support": [
    { label: "Shipping", href: "/shipping" },
    { label: "Contact", href: "/contact" },
    { label: "Wholesale", href: WHOLESALE_WHATSAPP_URL, external: true },
  ],
  "Legal": [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ],
};

export default function Footer() {
  const { settings } = useSiteSettings();
  const brandName = settings.footerTitle || settings.siteName || "Amila Gold";
  return (
    <footer className="bg-green-900 text-stone-50 rounded-t-3xl mt-12">
      {/* Main Footer Content */}
      <div className="flex flex-col md:flex-row justify-between items-start px-8 py-10 lg:px-12 lg:py-16 w-full gap-12">
        {/* Brand Column */}
        <div className="mb-4 md:mb-0 max-w-xs">
          <span className="font-headline text-xl text-stone-100 italic mb-4 block">{brandName}</span>
          <p className="font-body text-sm tracking-wide text-stone-300/70 leading-relaxed mb-6">
            {settings.footerDescription || "Providing the purest unrefined gold for the modern, conscious soul."}
          </p>
          <div className="flex gap-4">
            <a href={settings.facebookUrl || "#"} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-stone-300/70 hover:text-yellow-400 transition-colors">
              <span className="material-symbols-outlined">thumb_up</span>
            </a>
            <a href={settings.instagramUrl || "#"} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-stone-300/70 hover:text-yellow-400 transition-colors">
              <span className="material-symbols-outlined">photo_camera</span>
            </a>
            <a href={settings.youtubeUrl || "#"} target="_blank" rel="noreferrer" aria-label="YouTube" className="text-stone-300/70 hover:text-yellow-400 transition-colors">
              <span className="material-symbols-outlined">smart_display</span>
            </a>
          </div>
          <div className="mt-5 space-y-1">
            <p className="font-body text-xs tracking-wide text-stone-300/70">{settings.companyEmail || ''}</p>
            <p className="font-body text-xs tracking-wide text-stone-300/70">{settings.companyPhone || ''}</p>
            <p className="font-body text-xs tracking-wide text-stone-300/70">{settings.companyAddress || ''}</p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-3">
              <span className="font-body text-sm tracking-widest uppercase font-bold text-yellow-400">
                {category}
              </span>
              {links.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-stone-300/70 hover:text-stone-50 hover:translate-x-1 transition-all duration-200 text-sm uppercase tracking-wide"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="font-body text-stone-300/70 hover:text-stone-50 hover:translate-x-1 transition-all duration-200 text-sm uppercase tracking-wide"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-8 py-10 lg:px-12 lg:py-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-body text-xs tracking-widest uppercase opacity-50">
          © 2026 {brandName}. The Modern Agrarian.
        </span>
        <div className="flex gap-8 items-center text-xs tracking-[0.2em] uppercase opacity-50">
          <span>Handmade in the valley of India</span>
          <span>Ethically Sourced</span>
        </div>
      </div>
    </footer>
  );
}
