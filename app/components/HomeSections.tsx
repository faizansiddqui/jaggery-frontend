"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {ChevronLeft, ChevronRight} from "lucide-react"

// Hero Section
function HeroSection() {
  const banners = [
    {
      title: "Natural & Pure",
      subtitle: "The gold standard of ancient agrarian wisdom, harvested with integrity.",
      button: "Explore the Harvest",
      href: "/shop",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDH5bDpKDcij9CPETN2bJX_Khb1gKGBSwc1-xXVnmHzifLxBRCdc7bv2L6mhLmDrAFoqjP7-mlBv5GL0tiQypTXp6pQDvt6tbAAT_Iu7pvcLv5EQpOVDWIN8lSDe1-yoOQdTqSoYmbypXi0g-DnNgzwWfq_i33MltAEk6b-premF__y7OvwhoHwqPttCsL7tmODB7UuB6ohgAnL4cnpWGB6pyCBqYSvCvU0Pp-S5bDW2eBBuE15j3h4qC6d50gFWqqWy1CUpz6CLSQ",
    },
    {
      title: "Handcrafted Heritage Blocks",
      subtitle: "Pure jaggery made from heirloom cane and traditional copper vat reduction.",
      button: "Shop Blocks",
      href: "/shop?category=blocks",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeFZU1V0Q0g6matd53b4eGuvPJpsi51ntmAL8GqGhXx7gX1ONMZElOZIc9_CWVNe8lcV0YomSyncG5C5n85sQ22LoNmOwuMtT3MXF6uHWHr7T9Tek6v2xjFHa6ye6-GdV0oeeHGWEi1e2EEaNSP_yu3oVRdR0Gf_hHQlLkfZDaBYwM_dGyMn2FeWlDB9v0uPdZiV9cE66_p1RnDMQhy79E3TE3qnUtNOrDTW2-F7e7WkPcDfrBy-EJLQ1SXYvdQ59X8GDcHvySnSg",
    },
    {
      title: "Fine Powder for Daily Rituals",
      subtitle: "Delicately milled jaggery for desserts, beverages, and seasonal recipes.",
      button: "Shop Powder",
      href: "/shop?category=powder",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-QCR-oUojk-vTpDynSAcSpNPVjQWJLDmmBqb7ILfJCSW_Moh6IXJB2W3k1XKBQ3q6JuSU8-saSR4Iep1LvmBDLB9fXwT_0pUKTJBhXjPKBbTqHI5K_Mn-27uhJzA4ACJbZmn9yyTRZZGXYoy539ejX35Annocovp-1rJEaoXhlwxQXleFv5fX7kxvo4zhoX19Sn6rSKeAOtfL-3J7COxVSrqZuFZHmLZbmE2-eHCi7cESeeJjaspD1Koi1VJLj_wd4N8Xkpe3xyo",
    },
    {
      title: "Spiced Seasonal Blends",
      subtitle: "Warm ginger and cardamom jaggery for festive cooking and gifting.",
      button: "Shop Spice",
      href: "/shop?category=spice",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBregqSUMJ0lt-VYUYK2XGTS4MnzTwsTQU5hYFZaV7CbZEyXwMjZH_AyH3LcnOD7DVipoNKr0g-TLdQ2OeRUFjjmdrmJKH6E2RzyVmIKndt4ad6bflv1MMX3nwCwhEUsMJDbM5_r2mVr_0TOrvDazmcD_BP8WhjX5dQ-vT0BnoioWC9BdfxxpkF09vYLwE9iys7QCvoSVVfLOriHCkiYSeD5RjAd8afFMfbYQs7zZhEu8EelS0kTSsw66ML8-io8Kp5kuqoQDGpz5c",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = heroRef.current;
    const slides = container?.querySelectorAll<HTMLAnchorElement>(".hero-slide");
    const activeSlide = slides?.[activeIndex];
    if (!container || !activeSlide) return;
    activeSlide.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeIndex]);

  const handleSlide = (direction: "prev" | "next") => {
    setActiveIndex((current) => {
      if (direction === "prev") return current === 0 ? banners.length - 1 : current - 1;
      return current === banners.length - 1 ? 0 : current + 1;
    });
  };

  return (
    <>
      <section className="relative h-[32vh] sm:h-[36vh] md:h-[80vh] pt-16 md:pt-20 overflow-hidden">
        <div ref={heroRef} className="flex h-full w-full overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar">
          {banners.map((slide, index) => (
            <Link
              href={slide.href}
              key={slide.title}
              className={`hero-slide snap-start flex-shrink-0 w-full relative ${activeIndex === index ? "scale-100" : "scale-[0.98] opacity-70"
                } transition-transform duration-500`}
              onClick={() => setActiveIndex(index)}
            >
              <img
                className="w-full h-full object-cover object-center"
                src={slide.img}
                alt={slide.title}
              />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-x-0 top-1/2 mx-auto w-full max-w-4xl px-8 text-white -translate-y-1/2">
                <span className="font-label uppercase tracking-[0.3em] text-[10px] sm:text-sm text-secondary">
                  {slide.subtitle}
                </span>
                <h1 className="font-headline text-3xl sm:text-4xl md:text-7xl leading-tight mt-4 sm:mt-6 max-w-3xl">
                  {slide.title}
                </h1>
                {/* <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href={slide.href}
                    className="inline-flex items-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-full font-label uppercase tracking-widest text-sm hover:opacity-90 transition-all"
                  >
                    {slide.button}
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full font-label uppercase tracking-widest text-sm hover:bg-white/10 transition-all"
                  >
                    Our Story
                  </Link>
                </div> */}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="absolute md:bottom-8 mt-2 left-1/2 flex items-center gap-4 -translate-x-1/2">
        <button
          type="button"
          onClick={() => handleSlide("prev")}
          className="text-primary flex items-center justify-center hover:text-secondary transition-all"
          aria-label="Previous banner"
        >
          <ChevronLeft />
        </button>

        <div className="flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-3 w-3 rounded-full transition-colors ${activeIndex === index ? "bg-primary" : "bg-white border border-primary"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleSlide("next")}
          className="text-primary flex items-center justify-center hover:text-secondary transition-all"
          aria-label="Next banner"
        >
          <ChevronRight />
        </button>
      </div>
    </>
  );
}

// Heritage Story Section
function HeritageSection() {
  return (
    <section className="py-32 bg-surface">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-5">
            <h2 className="font-headline text-5xl text-primary mb-8 leading-tight">
              The Amila Heritage Story
            </h2>
            <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed">
              <p>
                For generations, the fertile riverbanks have whispered secrets of the soil. Amila Gold was born
                from a desire to preserve these whispers—the traditional art of jaggery making that honors both
                the land and the consumer.
              </p>
              <p>
                Our process is a slow-burn labor of love. We avoid the haste of modern industrialization to
                ensure every crystal retains the mineral-rich soul of pure sugarcane.
              </p>
            </div>
            <button className="mt-10 border-b-2 border-secondary text-secondary pb-1 font-label uppercase tracking-widest text-xs font-bold hover:text-primary hover:border-primary transition-all">
              Our Ancestral Roots
            </button>
          </div>
          <div className="md:col-span-7 relative">
            <div className="aspect-[4/5] bg-surface-container-high rounded-xl overflow-hidden shadow-2xl rotate-2">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCedXPKpcwhGo5HgL4Sx1N4aEMTq1NXMvo5ArjYL_CLDa6oDNUZK5GgUJTk5r3daQ1ZCaQ941Tb1J_oIXFvuCcknZt9g6mvXdPoDHT5pv6Jxgz1hsuXvCUv0J3G61ttOqryb-houioPndSShh7wWHMYT7_WY3J3M6YTeQq7jM2tcct_vgv24PKrg_Lx91cm8yjnx6Q_sy4AaUKMuCuzi4CIamV6be_9k6aPHhnEywWwdfxatClqVl8BkV8R057ZoePgKtR0z76OOqM"
                alt="Traditional sugarcane fields"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 w-64 h-48 bg-primary-container p-8 rounded-xl shadow-xl -rotate-3 hidden md:block">
              <p className="text-on-primary-container font-headline italic text-2xl">
                &ldquo;Rooted in the earth, refined for the spirit.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Featured Products Section
function FeaturedProducts() {
  const products = [
    {
      name: "Artisan Golden Blocks",
      desc: "Rich, smoky, and perfectly unrefined for daily nourishment.",
      price: "$34.00",
      badge: "Limited",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCO8vCjaZKir63EKtyw_bWN533UrxyTjxlpu5-hvkJeAO9AUHN0lLkIzRgXO24rOf54dgUSa2V4VlDcaLCqhk5CocaMpWTJEhBYJloLG2iEOgCt7ncR7maYPruiE9K7TTL8_0ei-R0B7HlFGjmNbdQbPWZXtZivKbMsLXC4GL45c2NHndwGpbNueUkYn5ssm4iMvb6lqUZfFNlq6Z9bv10ccd3fPmG3zzTHz2jie29TWLy1M9nTOW7eGAzyPd4NAozA73Z2iVgojTo",
      offset: false,
    },
    {
      name: "Heritage Powdered Gold",
      desc: "Fine-milled convenience without sacrificing ancestral purity.",
      price: "$28.00",
      badge: null,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkARVrGN3B_VU2JYAg2NN_U-DI41OepH6bXXa5-bW99UFaDcWlxtU9Z_I935XHwCYnGndyE-FxJ_9si3wA-7VN_-s8yrc1dRxJmLI2BO7yYCO-uNZn1fdGu0Gl_uM0_XPcVnISb2F6t-IkJC8qpk4AbzdW2iYPskF3Pz0OT0tLRo5Iv5Lzdj_Ei3aYk14qTZg7yLvY1uzwu9pIQI-o8598IM3auPKlobmu6UP-d6qslZ_YnFj6NZBBTcriM0SwOjonZwYLTiEmWzY",
      offset: true,
    },
    {
      name: "Sacred Elixir Syrup",
      desc: "A slow-reduced nectar for the most discerning gourmets.",
      price: "$42.00",
      badge: null,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAo3lwIBuYb5aQQIQ8LBGOUpq44cJbcSCFkK9OPJHJVs-494c2UFyjOW80pxWexjqPeM-IXPiWnD1pePg84y8XzssIcooXJk3dPbUlFX7qknpRcnGYyDP-bgZcmXrSt3GAlr303Zyo1zlm8mrDWH-QrmeFYKhqG-UJCgQtDEea8IYkGm_C_ntgmLlnUnyaDv9KV7DndnJtYfz-nCq_VXrQPRjAENaufyFfBEIYWqj3tA4oUmqKk90SRHmrTmT2AHDV5F4o6Js6-mk",
      offset: false,
    },
  ];

  return (
    <section className="py-15 lg:py-25 bg-surface-container-low">
      <div className="container mx-auto px-8">
        <div className="mb-10 text-center">
          <span className="font-label text-secondary uppercase tracking-[0.3em] text-xs font-black">The Collection</span>
          <h2 className="font-headline text-6xl text-primary mt-4">Purest Offerings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {products.map((p) => (
            <div
              key={p.name}
              className={`group bg-surface rounded-xl p-6 transition-all hover:bg-surface-container-high shadow-sm ${p.offset ? "md:translate-y-12" : ""}`}
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-8 relative">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {p.badge && (
                  <div className="absolute top-4 right-4 bg-primary text-on-primary px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest">
                    {p.badge}
                  </div>
                )}
              </div>
              <h3 className="font-headline text-2xl text-primary mb-2">{p.name}</h3>
              <p className="text-on-surface-variant mb-6 text-sm">{p.desc}</p>
              <div className="flex justify-between items-center">
                <span className="font-label text-xl font-bold text-secondary">{p.price}</span>
                <button className="w-12 h-12 rounded-full border border-secondary flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { HeroSection, HeritageSection, FeaturedProducts };
