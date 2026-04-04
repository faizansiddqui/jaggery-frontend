export default function Comp3() {
  return (
    <>
      <footer className="mt-24 border-t border-outline-variant py-12 overflow-hidden">
        <div className="whitespace-nowrap flex gap-12 animate-marquee py-6">
          <span className="font-display text-8xl text-outline-variant opacity-20 tracking-tighter uppercase">
            STREETRIOT PRECISION WEAR
          </span>
          <span className="font-display text-8xl text-outline-variant opacity-20 tracking-tighter uppercase">
            STREETRIOT PRECISION WEAR
          </span>
          <span className="font-display text-8xl text-outline-variant opacity-20 tracking-tighter uppercase">
            STREETRIOT PRECISION WEAR
          </span>
        </div>
        <div className="px-6 md:px-12 flex flex-col md:flex-row justify-between gap-8 mt-12">
          <div className="max-w-md">
            <h2 className="text-3xl font-black font-['Space_Grotesk'] tracking-tighter mb-4">
              STREETRIOT
            </h2>
            <p className="font-technical text-sm text-on-surface-variant leading-relaxed">
              Designed for the high-velocity urban landscape. Precision
              brutality in every stitch. We don't just dress the street; we
              define the riot.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 font-technical text-xs uppercase tracking-widest font-bold">
            <div className="flex flex-col gap-3">
              <a className="hover:text-primary" href="/">
                Journal
              </a>
              <a className="hover:text-primary" href="/">
                Stockists
              </a>
              <a className="hover:text-primary" href="/">
                Contact
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <a className="hover:text-primary" href="/">
                Shipping
              </a>
              <a className="hover:text-primary" href="/">
                Returns
              </a>
              <a className="hover:text-primary" href="/">
                Size Guide
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <a className="hover:text-primary" href="/">
                Instagram
              </a>
              <a className="hover:text-primary" href="/">
                Twitter
              </a>
              <a className="hover:text-primary" href="/">
                TikTok
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
