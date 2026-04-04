export default function Comp11() {
  return (
    <>
      <section className="py-20 md:py-32 px-4 md:px-8 bg-surface border-b border-outline-variant/20">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
          <div>
            <h2 className="font-brand text-5xl sm:text-7xl text-on-surface uppercase mb-4 md:mb-6 leading-none">
              JOIN THE
              <br />
              INNER CIRCLE
            </h2>
            <p className="font-body text-sm md:text-lg text-zinc-500 uppercase tracking-widest max-w-sm md:max-w-md leading-relaxed">
              Subscribe for early access to limited drops, members-only events,
              and kinetic field reports.
            </p>
          </div>
          <div className="flex flex-col gap-6 w-full">
            <div className="relative group">
              <input
                className="w-full border-b-2 border-on-surface py-4 md:py-6 px-0 text-xl md:text-2xl font-headline font-black focus:border-primary focus:ring-0 placeholder:text-zinc-300 bg-transparent uppercase transition-colors"
                placeholder="EMAIL ADDRESS"
                type="email"
              />
              <button className="absolute right-0 bottom-4 md:bottom-6 font-brand text-2xl md:text-3xl text-primary hover:translate-x-2 transition-transform">
                JOIN →
              </button>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                className="mt-1 w-5 h-5 border-2 border-on-surface rounded-none checked:bg-primary focus:ring-0 accent-primary"
                type="checkbox"
              />
              <span className="text-[10px] md:text-xs font-headline font-bold text-zinc-400 uppercase tracking-widest leading-tight">
                I accept the privacy policy and terms of service
              </span>
            </label>
          </div>
        </div>
      </section>
    </>
  );
}
