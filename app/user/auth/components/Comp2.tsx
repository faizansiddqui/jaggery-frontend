export default function Comp2() {
  return (
    <>
      <section className="hidden md:flex md:w-1/2 bg-surface-container-low relative overflow-hidden flex-col justify-end p-12">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover grayscale contrast-125 opacity-90"
            data-alt="High-fashion streetwear model standing against an industrial concrete wall with harsh cinematic lighting and dramatic shadows"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCzw5J1kEMC7mZ3mhaVJZkzxwwc9X5jOu2YITpTO3PuhcvBJkOYM0ZjIGgcX8jTlXUFam-ZfZcUoHlt6E0JH7Oic49RKLk5n2sD9PacXtVbztyYLxD1DynJV_fjRw6vMccydISVejM-H0tADVTC9CL0iBMhOrtT5gbqvGIJOD5KXoLiz7ADf0KGBDuHV6CoikaZkK05IQjZLjjCVUAuknbymFofDRteX0VsDnpOF-5TX0LZGJco7jZj53cX2Ubwag7k5Jtl2FGZfFd"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 text-surface">
          <div className="mb-8 flex items-baseline gap-4">
            <span className="font-['Space_Grotesk'] text-5xl font-bold text-primary">
              01
            </span>
            <h3 className="font-['Bebas_Neue'] text-4xl uppercase tracking-wider">
              Volume One: The Concrete Velocity
            </h3>
          </div>

          <div className="w-full overflow-hidden whitespace-nowrap border-y border-surface/20 py-4 mb-8">
            <div className="inline-block animate-marquee">
              <span className="font-['Bebas_Neue'] text-7xl uppercase tracking-tighter opacity-80 px-4">
                Speed is Currency // Riot is Constant // Kinetic Editorial //
                2024 //
              </span>
              <span className="font-['Bebas_Neue'] text-7xl uppercase tracking-tighter opacity-80 px-4">
                Speed is Currency // Riot is Constant // Kinetic Editorial //
                2024 //
              </span>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div className="max-w-xs">
              <p className="font-['Space_Grotesk'] text-xs uppercase tracking-widest leading-relaxed">
                A curated fusion of technical precision and brutalist
                aesthetics. Access your dashboard to view the latest drop
                analytics and editorial features.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="w-12 h-1 bg-primary"></div>
              <div className="w-12 h-1 bg-surface/30"></div>
              <div className="w-12 h-1 bg-surface/30"></div>
            </div>
          </div>
        </div>

        <div className="absolute top-12 right-0 bg-primary text-surface px-6 py-2 rotate-90 origin-right">
          <span className="font-['Space_Grotesk'] text-[10px] font-bold uppercase tracking-[0.4em]">
            STREETRIOT // CORE
          </span>
        </div>
      </section>
    </>
  );
}
