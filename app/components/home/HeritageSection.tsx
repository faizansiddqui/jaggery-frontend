"use client";

import React from "react";

export default function HeritageSection() {
  return (
    <section className="relative py-6 lg:py-28 overflow-hidden bg-white">
      {/* Subtle Background Decorative Element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-amber-50 rounded-full blur-3xl opacity-60" />
      
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Text Content */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <div className="mb-6 flex items-center gap-4">
              <span className="h-[1px] w-12 bg-amber-600/50"></span>
              <span className="text-amber-700 uppercase tracking-widest text-sm font-semibold">
                Our Legacy
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-slate-900 mb-8 leading-[1.1]">
              The Amila <br /> 
              <span className="text-amber-600 italic">Heritage</span> Story
            </h2>
            
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-light">
              <p>
                For generations, the fertile riverbanks have whispered secrets of the soil. 
                <strong className="font-semibold text-slate-800"> Amila Gold</strong> was born
                from a desire to preserve these whispers—the traditional art of jaggery 
                making that honors both the land and the consumer.
              </p>
              <p>
                Our process is a slow-burn labor of love. We avoid the haste of modern 
                industrialization to ensure every crystal retains the mineral-rich soul 
                of pure sugarcane.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 flex items-center gap-6">
               <div className="flex -space-x-3">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <div className="w-full h-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-800">AM</div>
                   </div>
                 ))}
               </div>
               <p className="text-sm text-slate-500 italic">
                 Trusted by families for over three generations.
               </p>
            </div>
          </div>

          {/* Video Visuals */}
          <div className="order-1 lg:order-2 lg:col-span-7 relative">
            <div className="relative z-10 group">
              
              {/* Main Video Container */}
              <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  // poster="https://lh3.googleusercontent.com/aida-public/AB6AXuCedXPKpcwhGo5HgL4Sx1N4aEMTq1NXMvo5ArjYL_CLDa6oDNUZK5GgUJTk5r3daQ1ZCaQ941Tb1J_oIXFvuCcknZt9g6mvXdPoDHT5pv6Jxgz1hsuXvCUv0J3G61ttOqryb-houioPndSShh7wWHMYT7_WY3J3M6YTeQq7jM2tcct_vgv24PKrg_Lx91cm8yjnx6Q_sy4AaUKMuCuzi4CIamV6be_9k6aPHhnEywWwdfxatClqVl8BkV8R057ZoePgKtR0z76OOqM" // Optional: Loading state image
                >
                  <source 
                    src="jaggery.mp4" // Replace with your actual video link
                    type="video/mp4" 
                  />
                  Your browser does not support the video tag.
                </video>

                {/* Overlay Gradient for Elegance */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>

              {/* Floating Quote Card */}
              <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 z-20 w-3/4 md:w-80 bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-xl border border-white/20">
                <svg className="w-8 h-8 text-amber-500/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M3.983 21L3.983 18C3.983 16.8954 4.87843 16 5.983 16H8.983C9.53528 16 9.983 15.5523 9.983 15V9C9.983 8.44772 9.53528 8 8.983 8H4.983C4.43071 8 3.983 8.44772 3.983 9V11" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <p className="text-slate-800 font-serif text-lg md:text-xl italic leading-snug">
                  “Rooted in the earth, refined for the spirit.”
                </p>
              </div>

              {/* Decorative Frame Element */}
              <div className="absolute -top-6 -right-6 w-32 h-32 border-t-2 border-r-2 border-amber-200 rounded-tr-3xl hidden md:block" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}