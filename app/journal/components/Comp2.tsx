export default function Comp2() {
  return (
    <>
      <main className="pt-24 pb-20">
        <header className="px-4 md:px-8 mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#906f6c]/20 pb-4 md:pb-6">
            <div>
              <h1 className="font-brand text-5xl md:text-7xl lg:text-9xl leading-[0.8] uppercase tracking-tighter">
                The Riot Journal
              </h1>
              <p className="font-headline uppercase tracking-widest text-[10px] md:text-xs mt-4 opacity-70">
                CULTURE • SPEED • KINETICS
              </p>
            </div>
            <div className="mt-6 md:mt-0 max-w-xs md:max-w-md">
              <p className="text-sm font-body leading-relaxed opacity-80 lg:text-base">
                Documenting the intersection of high-performance racing and
                global street culture. Exclusive drops, technical insights, and
                the people moving the needle.
              </p>
            </div>
          </div>
        </header>

        <section className="overflow-hidden py-3 md:py-4 bg-[#1c1b1b] text-[#fcf8f8] mb-12">
          <div className="flex whitespace-nowrap gap-12 items-center">
            <div className="flex gap-12 animate-[marquee_20s_linear_infinite] font-brand text-2xl md:text-4xl uppercase tracking-widest">
              <span>New Drop: Carbon Series</span>
              <span className="text-[#b90c1b]">/</span>
              <span>Track Ready</span>
              <span className="text-[#b90c1b]">/</span>
              <span>Street Riot Editorial 2024</span>
              <span className="text-[#b90c1b]">/</span>
              <span>Zero Seconds Flat</span>
              <span className="text-[#b90c1b]">/</span>
              <span>Kinetic Motion</span>
            </div>
          </div>
        </section>

        <article className="px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-0 mb-20 group cursor-pointer">
          <div className="md:col-span-8 relative overflow-hidden bg-[#f6f3f2] aspect-[4/3] md:aspect-[21/9]">
            <img
              alt="Street racing silhouette"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              data-alt="dramatic cinematic shot of a modified street racing car at night under neon city lights with long exposure light trails"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGxzpEjDZF4QDJZTvKWiHY81S0dqGM5qkKSWTgW_l0C8Y2ORpTr9jrJ_334mg6iiH57QNt1R5TZwu2ISihjQ2ak1mHD7GqvV8Larn8nyYV7qlJeIpAza8OkCYGiwFyACSaLEr2zibcHSHPRKkjbiv4AHTLcsb8FYBj-AnF7AqVQbhGVg7_pY6-iJS0r7zTqEv0w1dbXYRGG5f10lBRqxrVJGEbPW0C-0k16wEjjV39n2FUPUMP-ckzScHIRZfq3VPHGjQulw5L3VhS"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8">
              <span className="bg-[#b90c1b] text-[#ffffff] px-2 md:px-3 py-1 font-headline text-[8px] md:text-[10px] uppercase tracking-widest mb-3 md:mb-4 inline-block">
                Featured Story
              </span>
              <h2 className="text-[#ffffff] font-brand text-3xl md:text-5xl lg:text-6xl uppercase leading-none tracking-tight max-w-2xl">
                The Asphalt Anatomy: Engineering for the Underground
              </h2>
            </div>
          </div>
          <div className="md:col-span-4 bg-[#f6f3f2] p-6 md:p-8 flex flex-col justify-between">
            <div>
              <span className="font-headline text-xs uppercase tracking-widest opacity-60 mb-2 block">
                01 / Culture
              </span>
              <p className="font-body text-lg leading-snug">
                Exploring how professional GT3 aerodynamics are influencing the
                next wave of modular street gear. A deep dive into functional
                brutality.
              </p>
            </div>
            <div className="pt-8 border-t border-outline-variant/20 flex justify-between items-end">
              <div>
                <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">
                  Author
                </p>
                <p className="font-brand text-xl uppercase">Marcus Vane</p>
              </div>
              <div className="w-12 h-12 bg-on-surface flex items-center justify-center text-surface group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>
          </div>
        </article>

        <section className="px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="flex flex-col group cursor-pointer">
              <div className="aspect-square bg-[#f6f3f2] mb-4 md:mb-6 overflow-hidden">
                <img
                  alt="Urban fashion detail"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  data-alt="close-up of high-tech streetwear fabric texture with reflective stitching and industrial hardware in cool blue lighting"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy-yvqO2CxeE5IxtxeDOakZsQJRBTXQVgF6U1lLtIOhQ245ndt9wgGTZMRRjhyHd5ZUUuZQlvl7uCbZKo-pbIEJziSqtKqQMcNMp_4Ct4WiXxd35thfXXOp53BJrDglvS16b5p4JDRLrF1G1D8Tn7088r8tT-pFxjGfMkY16hvMbV3WcUldy99tufcMyy0YA7CS8yxf-VKqdehp9nf4tdfb_yZ68_NwkdKGZfzyg4ZaqhghAiuTQ7MNDqw9HYsdSlu5A9fVFt_G0jh"
                />
              </div>
              <span className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b] mb-2">
                Inside the Lab
              </span>
              <h3 className="font-brand text-2xl md:text-3xl uppercase leading-[0.9] mb-3 md:mb-4">
                Carbon Fibers and Liquid Silks: The S2 Drop
              </h3>
              <p className="text-xs md:text-sm font-body opacity-70 mb-4 md:mb-6">
                Tracing the material origins of our most ambitious collection
                yet. From aerospace scraps to high-fashion silhouettes.
              </p>
              <div className="mt-auto flex items-center gap-2 font-headline text-[9px] md:text-[10px] uppercase tracking-widest group-hover:text-[#b90c1b] transition-colors">
                <span>Read Full Entry</span>
                <span className="material-symbols-outlined text-[10px] md:text-xs">
                  north_east
                </span>
              </div>
            </div>

            <div className="flex flex-col group cursor-pointer">
              <div className="aspect-square bg-[#f6f3f2] mb-4 md:mb-6 overflow-hidden">
                <img
                  alt="Supercar interior"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  data-alt="modern supercar cockpit view focusing on carbon fiber steering wheel and digital dashboard at dusk with sharp shadows"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZYfjtlxMBvF425kexPKMnkQj0AY4WIYnhNgv41Ww5DwDCWbqc4uKOe4QqBmx5KNdcVVBW0y0YA3_8ecTXZclgYO4stAOZk9JBDgEyrwqbKf083k9YyHjJQqVn5bilMPXUD8Vb8IOtv6Ne-OP9FwlI2cnHa7K5m9qY1-3UqsA0y8PVbzyXhZVsG_78Xqz57mmJu7g8x6-Et7B15DSfvurIeGMW4clwkVEZjqcMLuUtXbFb-62fByS--gowiv4-folKZSyr8eAQqnYn"
                />
              </div>
              <span className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b] mb-2">
                Racing Inspiration
              </span>
              <h3 className="font-brand text-2xl md:text-3xl uppercase leading-[0.9] mb-3 md:mb-4">
                Tokyo Drift: The Neon Legacy 20 Years Later
              </h3>
              <p className="text-xs md:text-sm font-body opacity-70 mb-4 md:mb-6">
                How a subculture of midnight runners redefined the global visual
                language of speed.
              </p>
              <div className="mt-auto flex items-center gap-2 font-headline text-[9px] md:text-[10px] uppercase tracking-widest group-hover:text-[#b90c1b] transition-colors">
                <span>Read Full Entry</span>
                <span className="material-symbols-outlined text-[10px] md:text-xs">
                  north_east
                </span>
              </div>
            </div>

            <div className="flex flex-col group cursor-pointer">
              <div className="aspect-square bg-[#f6f3f2] mb-4 md:mb-6 overflow-hidden">
                <img
                  alt="Bitcoin neon light"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  data-alt="gritty urban alleyway with glowing red neon signs reflecting on wet pavement with dark cinematic atmosphere"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe-ZYtxq7JV0VInIO-Tr_OFiZxu1o8l91QkYIag-oT2Gu_0tBC2tqf5kLJZUZbDlIioloPjeuWSozAPLRACwZqp7CZuB3hqNhUjbAG9C9bHJGeuapkinjfaZ4JJrmi8u8bTDRXEMwkw0EilUWoGYkWtVaKOBU3AyuceUEaztkEdIhQc4k2-27PzwbPWV8pI2Z8s7EOsP1zbkQJpg4CGCtpixq1JkgawvgrbskH6j8ZQzORt98wpTI61GYitGXoKtjVPJwcI7CU9gIx"
                />
              </div>
              <span className="font-headline text-[10px] uppercase tracking-widest text-[#b90c1b] mb-2">
                Street Lore
              </span>
              <h3 className="font-brand text-2xl md:text-3xl uppercase leading-[0.9] mb-3 md:mb-4">
                The Ghost of Shinjuku: Midnight Club Tales
              </h3>
              <p className="text-xs md:text-sm font-body opacity-70 mb-4 md:mb-6">
                Interviewing the anonymous founders of the most exclusive street
                racing collective in Japan.
              </p>
              <div className="mt-auto flex items-center gap-2 font-headline text-[9px] md:text-[10px] uppercase tracking-widest group-hover:text-[#b90c1b] transition-colors">
                <span>Read Full Entry</span>
                <span className="material-symbols-outlined text-[10px] md:text-xs">
                  north_east
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 md:mt-24 px-4 md:px-8">
          <div className="bg-[#b90c1b] text-[#ffffff] p-8 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="font-brand text-4xl md:text-6xl lg:text-7xl uppercase leading-none mb-4">
                The Riot Wire
              </h2>
              <p className="font-headline text-base md:text-lg uppercase tracking-tight opacity-90">
                Direct updates from the circuit. No noise, just speed.
              </p>
            </div>
            <div className="w-full lg:w-auto">
              <div className="flex border-b-2 border-[#ffffff] pb-2 gap-4 w-full lg:min-w-[400px]">
                <input
                  className="bg-transparent border-none focus:ring-0 placeholder:text-[#ffffff]/50 text-[#ffffff] font-headline uppercase w-full outline-none"
                  placeholder="EMAIL ADDRESS"
                  type="email"
                />
                <button className="font-brand text-xl md:text-2xl uppercase hover:translate-x-2 transition-transform">
                  JOIN
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
