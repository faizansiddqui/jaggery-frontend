"use client";
import React from "react";

const REVIEWS = [
  {
    id: 1,
    name: "Elena R.",
    date: "2 weeks ago",
    content: `"The flavor is remarkably deep. It has notes of toasted caramel and smoke that you just don't find in grocery store jaggery."`,
    rating: 5,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYiTl5fU5U-YTxyvl-7M6PbB3nYBC4Hj92cmcLXZ2Wwy06szQkOjacTl7GvTcnwqEOqDemjmtXgrLXjc5TF8jrXs3b_93h4w2XKcsVkasDkJ2SbhcRUpCAwxzrXNV9akHsVHM80a2GPeKK2LetN9U5F80yj4mBEELkDsvu2QY3w1JWcHod6L13Msk8EkkUojEJG5_1GKs7rYwNCzipLM_5p80GxT76PQmER4ouhYLpRZ9T8gSSZ_cgIljIE8l91MfmWOIrRAcFPTY"
  },
  {
    id: 2,
    name: "Marcus T.",
    date: "1 month ago",
    content: `"Perfect for my sourdough! It adds a beautiful moisture and color to the crust. I'm never going back to refined sugars."`,
    rating: 4.5,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcQ2zocFgWgRmzt2TdKDTfoaQuO_DPCbO882v0m7aI6MDr9LAJfbljsAc22Q0hN27wO3jqM5bDao_VaVSxaxkAXjUldc18YS2L-MDOBXHwvBVEs_syLDPCIS-1sQjRG_opDXcndb8zdjU3ethKLwloKhjR4ndK36M-wgBWagKY8UpNa2B2wnJWfWii0pJNUCyB36nxSL9IK9umvKRU9hw7f_bfl9bVfF2CE6jR2pGxlumq6paioj4wz3jeOZ3rH6ea-0V5-SO_fwM"
  },
  {
    id: 3,
    name: "Sara K.",
    date: "2 days ago",
    content: `"The texture is so soft and crumbly. My kids love it as a natural treat. Definitely worth the price for the quality."`,
    rating: 5,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvZCJEacI-PDfOatFTZKbiE-u0-A7uRxnm1y5nb63RIj1bAGPqQzJV7tNp84Du7SQYKLT_fTbHdTqjzky25EQfXZGAyzbNlc-fHtFVhlMjrluIp4umZI-bFs9mFMl1mU9L_Bpn-RVjJWxeYakqTyl2LlZpd5ZEAfDuTNGnXgc_bl_hBgT-hXnte00a-OWGoooDDC7-nW1aQVr0T4BtdHwGK35UVDtbWLOQIbm__vU-2rS9HdONjhZI4f3pE_Q1nAkw8X_ztYk6Aq0"
  }
];

const SIMILAR_ITEMS = [
  {
    id: 1,
    name: "Spiced Ginger Blend",
    desc: "For traditional jaggery crushing",
    price: "$34.00",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtN9ieEFth8CKUt4Xub5ffTB7k3Yl17lEi0sEu-6xUCcaBVqO_EMaCADTyLECNMQwZqUua-hZTQ5XOReWdeuqpLGsq8hxqZvNRUxtv47Afb0uOgRhfO5h_1Vazk9LE-QIDQl6atr3jTjeifO_Vu3w0p4hxQGMErthhG4FU6s5pE4ry6P_6rLBTCvYBEa_zyZQ3Y5IKK5xS1IARkHSlnMLNSOGbqlfv_ehimcdXT6AjhgdL7m7z4wUj13ZTzH8EzrfI7LuI5GpM7H0"
  },
  {
    id: 2,
    name: "Raw Heritage Blocks",
    desc: "Rich, full-bodied morning brew",
    price: "$18.00",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAYtMJyNpYUS3-g6K-IJG61nX5g4nID5BqBV-oYFcMKHmS_-VOytj2I6G_-PfYsRDj1Qad3k9Rk3QWQ1_aGLgnXRXNFBDOrr3yu2v80pLK-ee51h1a2GS98NU1SUBgahXVKvL7sOQbGOVBOA_lCdDkKXKuB_M9R1KS3r303UlUaXedNy1dZZw0KiSSUM8qB-aqGE8iDWoNhbbKeM5Brg3xN_ChQee09kKNBlpQN6UmPwTN_BdsxHIItujuaQMDtUF9AjwBk5R1WLU"
  },
  {
    id: 3,
    name: "Fine Grain Powder",
    desc: "Airtight storage for freshness",
    price: "$42.00",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOUmbAF_IHyUxb85qSPcCMlxSf59TPXPFL49arY5MFSNiAKpkm5Fzy3SIno9sGIvS6NOQkb3zBShTrVoibm_K0O_Hy_WXd4hpGQ8rh5HPxLePDjOxyBiq0aUYWdfgFLJsA5uYtzHm_elR3UucmaQ_sFmHjVpAYGnqp-onYczSMW2JKb5xZDuzPqEZflKZSbjApd4eqHGHiftnIcoGTLd9c500kNZkwMKaso9NrSO6bHHzMlae2UVGnn5_OfrqNYshKF71jvefxQqU"
  }
];

export default function ReviewsAndSimilar() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: i + 1 <= rating ? "'FILL' 1" : "'FILL' 0" }}>
        {i + 0.5 === rating ? 'star_half' : 'star'}
      </span>
    ));
  };

  return (
    <div>
      {/* Customer Reviews */}
      <section className="mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-4">
            <h3 className="font-headline text-4xl font-bold text-primary">Customer Stories</h3>
            <div className="flex items-center gap-4">
              <div className="flex text-secondary">{renderStars(5)}</div>
              <span className="font-bold text-on-surface">4.9 / 5.0</span>
              <span className="text-on-surface-variant text-sm font-label">(124 Reviews)</span>
            </div>
          </div>
          <button className="px-8 py-3 bg-secondary text-on-secondary rounded-full font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-md">
            Write a Review
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {REVIEWS.map((review) => (
            <div key={review.id} className="bg-surface-container-low p-8 rounded-3xl space-y-6 border border-outline-variant/10 shadow-sm hover:shadow-md transition-all w-[400px] md:w-[700px] snap-start flex-shrink-0">
              <div className="flex justify-between items-start">
                <div className="flex text-secondary text-sm">{renderStars(review.rating)}</div>
              </div>
              <p className="font-headline italic text-lg leading-snug">
                {review.content}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest overflow-hidden shadow-inner">
                  <img alt={review.name} className="w-full h-full object-cover" src={review.img} />
                </div>
                <div>
                  <div className="font-bold text-sm">{review.name}</div>
                  <div className="text-[10px] text-on-surface-variant uppercase tracking-tighter mt-0.5">{review.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Bought Together / Cross-Sell */}
      <section className="mt-24 pt-24 border-t border-outline-variant/30">
        <h3 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-12">Similar Collections</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {SIMILAR_ITEMS.map((item) => (
            <div key={item.id} className="group">
              <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container mb-6 shadow-sm">
                <img alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={item.img} />
              </div>
              <div className="flex justify-between items-start flex-col lg:flex-row gap-4">
                <div>
                  <h4 className="font-headline text-xl font-bold text-primary group-hover:text-secondary transition-colors">{item.name}</h4>
                  {/* <p className="text-sm text-on-surface-variant mt-1 font-body">{item.desc}</p> */}
                </div>
                <span className="font-headline text-lg font-bold text-secondary shrink-0">{item.price}</span>
              </div>
              <button className="mt-6 w-full py-2.5 border-[1.5px] border-primary text-primary rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all active:scale-95">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
