'use client';

import Comp1 from '@/app/journal/components/Comp1';
import Comp7 from '@/app/components/Comp7';

const tables = [
  {
    title: "JACKETS & OUTERWEAR",
    cut: "Precision Cut: Athletic",
    cols: ['Size', 'Chest', 'Waist', 'Hip'],
    rows: [
      { size: 'XS', chest: '34-36"', waist: '28-30"', hip: '34-36"' },
      { size: 'S',  chest: '36-38"', waist: '30-32"', hip: '36-38"' },
      { size: 'M',  chest: '38-40"', waist: '32-34"', hip: '38-40"' },
      { size: 'L',  chest: '40-42"', waist: '34-36"', hip: '40-42"' },
      { size: 'XL', chest: '42-44"', waist: '36-38"', hip: '42-44"' },
    ]
  },
  {
    title: "HOODIES & SWEATS",
    cut: "Precision Cut: Oversized",
    cols: ['Size', 'Chest', 'Waist', 'Hip'],
    rows: [
      { size: 'XS', chest: '36-38"', waist: '30-32"', hip: '36-38"' },
      { size: 'S',  chest: '38-40"', waist: '32-34"', hip: '38-40"' },
      { size: 'M',  chest: '40-42"', waist: '34-36"', hip: '40-42"' },
      { size: 'L',  chest: '42-44"', waist: '36-38"', hip: '42-44"' },
      { size: 'XL', chest: '44-46"', waist: '38-40"', hip: '44-46"' },
    ]
  },
  {
    title: "TRACK PANTS",
    cut: "Precision Cut: Tapered",
    cols: ['Size', 'Waist', 'Hip', 'Inseam'],
    rows: [
      { size: 'XS', waist: '28-30"', hip: '34-36"', inseam: '30"' },
      { size: 'S',  waist: '30-32"', hip: '36-38"', inseam: '31"' },
      { size: 'M',  waist: '32-34"', hip: '38-40"', inseam: '32"' },
      { size: 'L',  waist: '34-36"', hip: '40-42"', inseam: '33"' },
      { size: 'XL', waist: '36-38"', hip: '42-44"', inseam: '34"' },
    ]
  }
];

export default function SizeGuide() {
  return (
    <main className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
      <Comp1 />

      <div className="pt-8 pb-5 px-4 md:px-8 max-w-[1440px] mx-auto" data-scroll-section>
        <header className="mb-20">
          <span className="font-headline text-[10px] md:text-sm uppercase tracking-[0.4em] text-[#b90c1b] font-black">Technical Specifications</span>
          <h1 className="font-brand text-6xl md:text-8xl lg:text-[10rem] uppercase leading-[0.85] tracking-tighter mt-4">
            SIZE<br />GUIDE
          </h1>
          <p className="font-headline text-xs md:text-sm uppercase tracking-widest mt-8 opacity-60 max-w-xl leading-relaxed">
            Precision fit for high-velocity movement. Find your kinetic profile using our standardized measurement matrix.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
          {/* How To Measure */}
          <div className="lg:col-span-4 flex flex-col gap-12">
            <h2 className="font-brand text-4xl uppercase tracking-widest border-b-4 border-[#1c1b1b] pb-6">How To Measure</h2>
            {[
              { title: "Chest", desc: "Measure around the fullest part of your chest, keeping the measuring tape horizontal." },
              { title: "Waist", desc: "Measure around the narrowest part of your torso, keeping the tape horizontal." },
              { title: "Hip", desc: "Measure around the fullest part of your hips, keeping the tape horizontal." },
              { title: "Inseam", desc: "Measure from your crotch seam to the bottom of your inside leg." }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-3 border-l-4 border-[#b90c1b]/20 pl-6 hover:border-[#b90c1b] transition-colors">
                <h3 className="font-headline text-lg font-black uppercase tracking-widest text-[#b90c1b]">{item.title}</h3>
                <p className="font-headline text-xs uppercase tracking-widest leading-relaxed opacity-60">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Size Tables */}
          <div className="lg:col-span-8 flex flex-col gap-20">
            {tables.map((table, idx) => (
              <div key={idx} className="flex flex-col gap-8">
                <div className="flex justify-between items-end border-b border-[#1c1b1b]/10 pb-4">
                  <h3 className="font-brand text-3xl uppercase tracking-widest">{table.title}</h3>
                  <span className="font-headline text-[10px] uppercase tracking-[0.3em] opacity-40">{table.cut}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-headline text-[10px] md:text-xs uppercase tracking-[0.2em]">
                    <thead>
                      <tr className="bg-[#f6f3f2]">
                        {table.cols.map((col) => (
                          <th key={col} className="py-4 px-3 font-black opacity-50">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="font-brand text-xl md:text-2xl">
                      {table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className={`border-b border-[#1c1b1b]/5 hover:bg-[#b90c1b]/5 transition-colors ${rIdx % 2 === 0 ? '' : 'bg-[#f6f3f2]/50'}`}>
                          <td className="py-5 px-3 text-[#b90c1b]">{row.size}</td>
                          {'chest' in row && <td className="py-5 px-3">{row.chest}</td>}
                          <td className="py-5 px-3">{row.waist}</td>
                          <td className="py-5 px-3">{row.hip}</td>
                          {'inseam' in row && <td className="py-5 px-3">{row.inseam}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#f6f3f2] text-[#1c1b1b] p-12 md:p-20 flex flex-col items-center text-center gap-8 border-l-8 border-[#b90c1b]">
          <h2 className="font-brand text-5xl md:text-7xl uppercase leading-none tracking-tighter">Still Not Sure?</h2>
          <p className="font-headline text-xs md:text-sm uppercase tracking-[0.2em] opacity-60 max-w-2xl leading-relaxed">
            Our concierge service is available to help you find the perfect fit based on your height, weight, and preferred style of wear.
          </p>
          <button className="bg-[#b90c1b] text-white px-12 py-6 font-brand text-2xl uppercase hover:scale-105 transition-transform active:scale-95">
            Contact Concierge
          </button>
        </section>
      </div>

      <Comp7 />
    </main>
  );
}