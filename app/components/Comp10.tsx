"use client";

import { useMemo } from "react";
import { useSiteSettings } from "@/app/context/SiteSettingsContext";

export default function Comp10() {
  const { settings } = useSiteSettings();

  const instagramHandle = useMemo(
    () => String(settings.instagramHandle || "kinetic_riot").replace(/^@+/, "").toUpperCase(),
    [settings.instagramHandle]
  );

  const instagramPosts = useMemo(
    () =>
      (settings.instagramGallery || [])
        .filter((item) => item.isActive !== false)
        .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)),
    [settings.instagramGallery]
  );

  return (
    <>
      <section className="py-8 md:py-12 bg-surface-container-low border-y border-outline-variant/20">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 mb-6 md:mb-8 flex justify-between items-center">
          <h4 className="font-brand text-2xl md:text-4xl text-on-surface uppercase leading-none">
            INSTAGRAM @{instagramHandle}
          </h4>
        </div>
        <div className="flex gap-4 px-4 overflow-x-auto no-scrollbar pb-4">
          {instagramPosts.map((post, index) => (
            <div key={post.id || `${post.imageUrl}-${index}`} className="flex-shrink-0 w-64 aspect-square bg-white border border-outline-variant/10">
              <img
                className="w-full h-full object-cover"
                data-alt={`Instagram post by @${String(post.username || instagramHandle).replace(/^@+/, '')}`}
                src={post.imageUrl}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
