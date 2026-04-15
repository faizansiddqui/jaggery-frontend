"use client";
import React, { useEffect, useRef, useState } from "react";
import { fetchPublicTestimonials, subscribeNewsletter } from "@/app/lib/apiClient";

type TestimonialItem = { quote: string; name: string; role: string; id?: string };

const FALLBACK_TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      "Switching to Amila Gold was a revelation. The depth of flavor is something you simply cannot find in commercially refined sugar. It feels like a luxury in my morning tea.",
    name: "Elena Vance",
    role: "Wellness Coach",
  },
  {
    quote:
      "The texture is incredible. As a chef, I value the authenticity of the product. Amila Gold's consistency and ethical sourcing make it a permanent fixture in my kitchen.",
    name: "Marcus Thorne",
    role: "Executive Pastry Chef",
  },
  {
    quote:
      "I grew up with fresh jaggery from my grandfather's farm. Amila Gold is the only brand that has successfully captured that nostalgia and purity for the modern world.",
    name: "Siddharth Rao",
    role: "Heritage Archivist",
  },
];

// The Slow Craft Section
function SlowCraftSection() {
  const steps = [
    {
      num: "01",
      title: "Sustainable Harvest",
      desc: "We source exclusively from heirloom cane fields that use bio-dynamic farming practices.",
    },
    {
      num: "02",
      title: "Gentle Reduction",
      desc: "Juices are reduced in traditional copper vats to preserve enzyme integrity and deep flavor notes.",
    },
    {
      num: "03",
      title: "Sun-Setting",
      desc: "Natural cooling and setting processes ensure the unique crystalline texture of Amila Gold.",
    },
  ];

  return (
    <section className="py-15 lg:py-20 bg-primary text-white overflow-hidden">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Image Grid */}
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-64 rounded-xl overflow-hidden">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeFZU1V0Q0g6matd53b4eGuvPJpsi51ntmAL8GqGhXx7gX1ONMZElOZIc9_CWVNe8lcV0YomSyncG5C5n85sQ22LoNmOwuMtT3MXF6uHWHr7T9Tek6v2xjFHa6ye6-GdV0oeeHGWEi1e2EEaNSP_yu3oVRdR0Gf_hHQlLkfZDaBYwM_dGyMn2FeWlDB9v0uPdZiV9cE66_p1RnDMQhy79E3TE3qnUtNOrDTW2-F7e7WkPcDfrBy-EJLQ1SXYvdQ59X8GDcHvySnSg"
                    alt="Artisan pressing sugarcane"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-48 rounded-xl overflow-hidden">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-QCR-oUojk-vTpDynSAcSpNPVjQWJLDmmBqb7ILfJCSW_Moh6IXJB2W3k1XKBQ3q6JuSU8-saSR4Iep1LvmBDLB9fXwT_0pUKTJBhXjPKBbTqHI5K_Mn-27uhJzA4ACJbZmn9yyTRZZGXYoy539ejX35Annocovp-1rJEaoXhlwxQXleFv5fX7kxvo4zhoX19Sn6rSKeAOtfL-3J7COxVSrqZuFZHmLZbmE2-eHCi7cESeeJjaspD1Koi1VJLj_wd4N8Xkpe3xyo"
                    alt="Copper vats boiling cane juice"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="pt-12 space-y-4">
                <div className="h-48 rounded-xl overflow-hidden">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBregqSUMJ0lt-VYUYK2XGTS4MnzTwsTQU5hYFZaV7CbZEyXwMjZH_AyH3LcnOD7DVipoNKr0g-TLdQ2OeRUFjjmdrmJKH6E2RzyVmIKndt4ad6bflv1MMX3nwCwhEUsMJDbM5_r2mVr_0TOrvDazmcD_BP8WhjX5dQ-vT0BnoioWC9BdfxxpkF09vYLwE9iys7QCvoSVVfLOriHCkiYSeD5RjAd8afFMfbYQs7zZhEu8EelS0kTSsw66ML8-io8Kp5kuqoQDGpz5c"
                    alt="Jaggery crystals drying"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-64 rounded-xl overflow-hidden">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-2z1dIigqEBYNJuzA_d5P4XiqmlBm3djIsa_mIZxua1FX5wTpi_-_qbCaM85WuFX_NHUr56w868SFwcrRuinbc8xFDx7vB70lXBFpimL4GcJ3Hr2O-GvfuaoDbXzQLU4CrjDAtartUEP19NKHCbYgguWYHs9Y30jspsFgnwvgPah3TisIMry62W8JoUZhTILGObXhlsgDMUQ-sc43-dogRjNw8fiItJnfyUIDrHEo-qJSp9IJbWcRX8vUQNfC28mO9gM9fslOEvo"
                    alt="Modern kitchen with jaggery"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Text Content */}
          <div className="order-1 lg:order-2">
            <span className="font-label text-on-primary-container uppercase tracking-widest text-xs">
              Alchemy of the Soil
            </span>
            <h2 className="font-headline text-5xl md:text-6xl mt-4 mb-8">The Slow Craft</h2>
            <div className="space-y-12">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-6">
                  <span className="font-headline text-4xl text-secondary opacity-50">{step.num}</span>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                    <p className="text-on-primary-container leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(FALLBACK_TESTIMONIALS);

  useEffect(() => {
    fetchPublicTestimonials()
      .then((rows) => {
        if (!rows.length) return;
        setTestimonials(
          rows.map((row) => ({
            id: row.id,
            quote: row.quote,
            name: row.name,
            role: row.role || "",
          }))
        );
      })
      .catch(() => {
        /* keep fallback */
      });
  }, []);

  const testimonialsRef = useRef<HTMLDivElement>(null);

  const handleSlide = (direction: "prev" | "next") => {
    const container = testimonialsRef.current;
    if (!container) return;

    const firstCard = container.querySelector<HTMLDivElement>(".testimonial-card");
    const cardWidth = firstCard?.offsetWidth ?? container.clientWidth;
    const scrollDistance = cardWidth + 48;

    container.scrollBy({
      left: direction === "next" ? scrollDistance : -scrollDistance,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-15 lg:py-20 bg-surface">
      <div className="container mx-auto px-8">
        <h2 className="font-headline text-5xl text-primary max-w-lg leading-tight">
          Shared Stories from the Modern Agrarian Table
        </h2>
        <div
          ref={testimonialsRef}
          className="flex gap-12 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-8 px-8"
        >
          {testimonials.map((t, index) => (
            <div
              key={t.id || `${t.name}-${index}`}
              className="testimonial-card min-w-[90vw] md:min-w-[45vw] lg:min-w-[32vw] snap-start p-10 bg-surface-container-low rounded-xl relative"
            >
              <span className="material-symbols-outlined text-secondary absolute top-6 right-6 text-4xl opacity-20">
                format_quote
              </span>
              <p className="text-on-surface text-xl font-headline italic mb-8 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center font-headline text-lg font-bold text-primary shrink-0"
                  aria-hidden
                >
                  {t.name.trim().charAt(0).toLocaleUpperCase() || "?"}
                </div>
                <div>
                  <h5 className="font-bold text-sm">{t.name}</h5>
                  <span className="text-xs text-on-surface-variant uppercase tracking-widest">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Newsletter CTA Section
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setStatusType("error");
      setStatusMessage("Please enter your email.");
      return;
    }
    try {
      setIsSubmitting(true);
      setStatusMessage("");
      setStatusType("");
      await subscribeNewsletter(normalizedEmail, "homepage");
      setStatusType("success");
      setStatusMessage("Subscribed successfully.");
      setEmail("");
    } catch (subscribeError) {
      setStatusType("error");
      setStatusMessage(subscribeError instanceof Error ? subscribeError.message : "Could not subscribe right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-10 lg:py-15">
      <div className="container mx-auto px-2 lg:px-8">
        <div className="bg-secondary-container rounded-3xl px-5 py-8 md:p-24 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-headline text-5xl md:text-6xl text-on-secondary-container mb-8">
              Join the Harvest Circle
            </h2>
            <p className="text-on-secondary-container/80 text-xl max-w-2xl mx-auto mb-12">
              Receive seasonal updates on our harvest schedules, exclusive early-batch releases, and stories from the soil.
            </p>
            <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto" onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-surface-container-lowest border-none rounded-full px-8 py-5 focus:ring-2 focus:ring-primary text-primary outline-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-on-primary px-10 py-5 rounded-full font-label uppercase tracking-widest text-sm hover:opacity-90 transition-all disabled:opacity-60"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            {statusMessage ? (
              <p className={`mt-4 text-xs uppercase tracking-widest font-bold ${statusType === "error" ? "text-error" : "text-primary"}`}>
                {statusMessage}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export { SlowCraftSection, TestimonialsSection, NewsletterSection };
