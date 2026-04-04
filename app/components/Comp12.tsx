export default function Comp12() {
  return (
    <>
      <section className="py-32 px-8 bg-surface border-b border-outline-variant/20">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-brand text-7xl text-on-surface uppercase mb-6 leading-none">
              JOIN THE
              <br />
              INNER CIRCLE
            </h2>
            <p className="font-body text-lg text-zinc-500 uppercase tracking-widest max-w-md">
              Subscribe for early access to limited drops, members-only events,
              and kinetic field reports.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                className="w-full border-b-2 border-on-surface py-6 px-0 text-2xl font-headline font-black focus:border-primary focus:ring-0 placeholder:text-zinc-300 bg-transparent uppercase"
                placeholder="EMAIL ADDRESS"
                type="email"
              />
              <button className="absolute right-0 bottom-6 font-brand text-3xl text-primary hover:translate-x-2 transition-transform">
                SUBSCRIBE →
              </button>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                className="w-5 h-5 border-2 border-on-surface rounded-none checked:bg-primary focus:ring-0"
                type="checkbox"
              />
              <span className="text-xs font-headline font-bold text-zinc-400 uppercase tracking-widest">
                I accept the privacy policy and terms of service
              </span>
            </label>
          </div>
        </div>
      </section>
    </>
  );
}
