'use client';

import { useState } from 'react';
import Comp1 from '@/app/journal/components/Comp1';
import Comp7 from '@/app/components/Comp7';

const faqData = [
  {
    category: "SHIPPING & DELIVERY",
    questions: [
      { q: "How long does standard shipping take?", a: "Standard domestic shipping takes 3-5 business days. International shipping varies by location but typically ranges from 7-14 business days." },
      { q: "Can I track my order in real-time?", a: "Yes. Once your order is processed, you will receive a tracking number via email linked to our live logistics portal." },
      { q: "Do you offer express shipping?", a: "We offer Next-Day Kinetic Delivery for select urban zones. Select this at checkout to expedite your shipment." }
    ]
  },
  {
    category: "RETURNS & REFUNDS",
    questions: [
      { q: "What is your return policy?", a: "We offer a 30-day return window for all unworn items in original packaging. Returns are processed as site credit or original payment method." },
      { q: "How do I initiate a return?", a: "Log into your account, go to 'Order History', and select 'Initiate Return' for the specific item." }
    ]
  },
  {
    category: "ORDERS & PAYMENTS",
    questions: [
      { q: "What payment methods do you accept?", a: "We accept all major credit cards, Apple Pay, Google Pay, and select cryptocurrencies via our secure gateway." },
      { q: "Can I change my order after it's placed?", a: "Due to our high-velocity processing, orders can only be modified within 30 minutes of placement." }
    ]
  }
];

export default function FAQsRoute() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const toggle = (id: string) => setOpenIndex(openIndex === id ? null : id);

  return (
    <main className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
      <Comp1 />

      <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto" data-scroll-section>
        <header className="mb-16 md:mb-24 border-b border-[#1c1b1b]/10 pb-8">
          <span className="font-headline text-[10px] uppercase tracking-[0.4em] text-[#b90c1b] font-black">Knowledge Base</span>
          <h1 className="font-brand text-6xl md:text-8xl lg:text-9xl uppercase leading-[0.8] tracking-tighter mt-4 mb-6">
            Help <br className="hidden md:block" /> Center
          </h1>
          <p className="font-headline text-sm md:text-base uppercase tracking-widest opacity-60 max-w-2xl">
            Precision help for the high-velocity lifestyle. Find your answers below or reach out to our technical support team.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Nav */}
          <aside className="lg:col-span-4 hidden lg:block sticky top-32 h-fit">
            <nav className="flex flex-col gap-1 font-headline text-xs uppercase tracking-[0.2em]">
              {faqData.map((section) => (
                <a
                  key={section.category}
                  href={`#${section.category.toLowerCase().replace(/ /g, '-')}`}
                  className="hover:text-[#b90c1b] transition-colors py-4 px-4 border-b border-[#1c1b1b]/5 hover:border-[#b90c1b]/20 hover:bg-[#f6f3f2]"
                >
                  {section.category}
                </a>
              ))}
            </nav>
          </aside>

          {/* FAQ Sections */}
          <div className="lg:col-span-8 flex flex-col gap-20">
            {faqData.map((section) => (
              <section
                key={section.category}
                id={section.category.toLowerCase().replace(/ /g, '-')}
                className="scroll-mt-32"
              >
                <h2 className="font-brand text-3xl md:text-4xl uppercase mb-8 text-[#b90c1b]">
                  {section.category}
                </h2>
                <div className="flex flex-col">
                  {section.questions.map((item, idx) => {
                    const id = `${section.category}-${idx}`;
                    const isOpen = openIndex === id;
                    return (
                      <div
                        key={idx}
                        className="border-b border-[#1c1b1b]/10 py-6 md:py-8 group cursor-pointer hover:bg-[#f6f3f2] px-4 -mx-4 transition-colors"
                        onClick={() => toggle(id)}
                      >
                        <div className="flex justify-between items-center gap-4">
                          <h3 className="font-brand text-xl md:text-2xl uppercase leading-tight group-hover:text-[#b90c1b] transition-colors">
                            {item.q}
                          </h3>
                          <span className={`material-symbols-outlined text-[#b90c1b] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                            expand_more
                          </span>
                        </div>
                        {isOpen && (
                          <div className="mt-6 md:mt-4 font-body text-sm md:text-base leading-relaxed opacity-70 animate-in fade-in slide-in-from-top-2">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Support CTA */}
        <section className="mt-32 bg-[#f6f3f2] text-[#1c1b1b] p-8 md:p-16 lg:p-24 text-center border-l-8 border-[#b90c1b]">
          <h2 className="font-brand text-4xl md:text-6xl uppercase leading-none mb-6">
            Still Have Questions?
          </h2>
          <p className="font-headline text-sm md:text-base uppercase tracking-widest opacity-60 mb-10">
            Our support team is active 24/7. Reach out for technical assistance.
          </p>
          <button className="bg-[#b90c1b] text-white px-10 py-4 font-brand text-xl md:text-2xl uppercase hover:scale-105 transition-transform active:scale-95">
            Contact Support
          </button>
        </section>
      </div>

      <Comp7 />
    </main>
  );
}