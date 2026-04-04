export default function Comp5() {
  return (
    <>
      <section className="px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col group cursor-pointer">
            <div className="aspect-square bg-surface-container-low mb-6 overflow-hidden">
              <img
                alt="Urban fashion detail"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                data-alt="close-up of high-tech streetwear fabric texture with reflective stitching and industrial hardware in cool blue lighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy-yvqO2CxeE5IxtxeDOakZsQJRBTXQVgF6U1lLtIOhQ245ndt9wgGTZMRRjhyHd5ZUUuZQlvl7uCbZKo-pbIEJziSqtKqQMcNMp_4Ct4WiXxd35thfXXOp53BJrDglvS16b5p4JDRLrF1G1D8Tn7088r8tT-pFxjGfMkY16hvMbV3WcUldy99tufcMyy0YA7CS8yxf-VKqdehp9nf4tdfb_yZ68_NwkdKGZfzyg4ZaqhghAiuTQ7MNDqw9HYsdSlu5A9fVFt_G0jh"
              />
            </div>
            <span className="font-headline text-[10px] uppercase tracking-widest text-primary mb-2">
              Inside the Lab
            </span>
            <h3 className="font-brand text-3xl uppercase leading-[0.9] mb-4">
              Carbon Fibers and Liquid Silks: The S2 Drop
            </h3>
            <p className="text-sm font-body opacity-70 mb-6">
              Tracing the material origins of our most ambitious collection yet.
              From aerospace scraps to high-fashion silhouettes.
            </p>
            <div className="mt-auto flex items-center gap-2 font-headline text-[10px] uppercase tracking-widest group-hover:text-primary transition-colors">
              <span>Read Full Entry</span>
              <span className="material-symbols-outlined text-xs">
                north_east
              </span>
            </div>
          </div>

          <div className="flex flex-col group cursor-pointer">
            <div className="aspect-square bg-surface-container-low mb-6 overflow-hidden">
              <img
                alt="Supercar interior"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                data-alt="modern supercar cockpit view focusing on carbon fiber steering wheel and digital dashboard at dusk with sharp shadows"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZYfjtlxMBvF425kexPKMnkQj0AY4WIYnhNgv41Ww5DwDCWbqc4uKOe4QqBmx5KNdcVVBW0y0YA3_8ecTXZclgYO4stAOZk9JBDgEyrwqbKf083k9YyHjJQqVn5bilMPXUD8Vb8IOtv6Ne-OP9FwlI2cnHa7K5m9qY1-3UqsA0y8PVbzyXhZVsG_78Xqz57mmJu7g8x6-Et7B15DSfvurIeGMW4clwkVEZjqcMLuUtXbFb-62fByS--gowiv4-folKZSyr8eAQqnYn"
              />
            </div>
            <span className="font-headline text-[10px] uppercase tracking-widest text-primary mb-2">
              Racing Inspiration
            </span>
            <h3 className="font-brand text-3xl uppercase leading-[0.9] mb-4">
              Tokyo Drift: The Neon Legacy 20 Years Later
            </h3>
            <p className="text-sm font-body opacity-70 mb-6">
              How a subculture of midnight runners redefined the global visual
              language of speed.
            </p>
            <div className="mt-auto flex items-center gap-2 font-headline text-[10px] uppercase tracking-widest group-hover:text-primary transition-colors">
              <span>Read Full Entry</span>
              <span className="material-symbols-outlined text-xs">
                north_east
              </span>
            </div>
          </div>

          <div className="flex flex-col group cursor-pointer">
            <div className="aspect-square bg-surface-container-low mb-6 overflow-hidden">
              <img
                alt="Bitcoin neon light"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                data-alt="gritty urban alleyway with glowing red neon signs reflecting on wet pavement with dark cinematic atmosphere"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe-ZYtxq7JV0VInIO-Tr_OFiZxu1o8l91QkYIag-oT2Gu_0tBC2tqf5kLJZUZbDlIioloPjeuWSozAPLRACwZqp7CZuB3hqNhUjbAG9C9bHJGeuapkinjfaZ4JJrmi8u8bTDRXEMwkw0EilUWoGYkWtVaKOBU3AyuceUEaztkEdIhQc4k2-27PzwbPWV8pI2Z8s7EOsP1zbkQJpg4CGCtpixq1JkgawvgrbskH6j8ZQzORt98wpTI61GYitGXoKtjVPJwcI7CU9gIx"
              />
            </div>
            <span className="font-headline text-[10px] uppercase tracking-widest text-primary mb-2">
              Street Lore
            </span>
            <h3 className="font-brand text-3xl uppercase leading-[0.9] mb-4">
              The Ghost of Shinjuku: Midnight Club Tales
            </h3>
            <p className="text-sm font-body opacity-70 mb-6">
              Interviewing the anonymous founders of the most exclusive street
              racing collective in Japan.
            </p>
            <div className="mt-auto flex items-center gap-2 font-headline text-[10px] uppercase tracking-widest group-hover:text-primary transition-colors">
              <span>Read Full Entry</span>
              <span className="material-symbols-outlined text-xs">
                north_east
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
