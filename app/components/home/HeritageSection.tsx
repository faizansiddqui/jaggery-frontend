"use client";

import React from "react";
import Image from "next/image";

export default function HeritageSection() {
  return (
    <section className="py-10 lg:py-20 bg-surface">
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
          </div>
          <div className="md:col-span-7 relative">
            <div className="aspect-[4/5] bg-surface-container-high rounded-xl overflow-hidden shadow-2xl rotate-2">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCedXPKpcwhGo5HgL4Sx1N4aEMTq1NXMvo5ArjYL_CLDa6oDNUZK5GgUJTk5r3daQ1ZCaQ941Tb1J_oIXFvuCcknZt9g6mvXdPoDHT5pv6Jxgz1hsuXvCUv0J3G61ttOqryb-houioPndSShh7wWHMYT7_WY3J3M6YTeQq7jM2tcct_vgv24PKrg_Lx91cm8yjnx6Q_sy4AaUKMuCuzi4CIamV6be_9k6aPHhnEywWwdfxatClqVl8BkV8R057ZoePgKtR0z76OOqM"
                alt="Traditional sugarcane fields"
                fill
                unoptimized
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover"
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

