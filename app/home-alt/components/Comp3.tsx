export default function Comp3() {
  return (
    <>
      <section className="relative h-[921px] bg-surface-container-low overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            data-alt="Close-up of high-performance red and black athletic footwear against a clinical industrial concrete background with sharp shadows"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCu3ffYMMf_3RdHUA8sc358yCuww8Ym2GhZ68h3h3CX7m72fdBvY6hL0feuASuyAyssKVOW7rNAQUmKAfZWGjWsTmzT2tKlwSqTIZ9im1ifDtHQg7aHRgfRpA99V4eQtSZOr8_ilt1ZwkI-A2RxD7FwfV5Wve4a9zZPbJ5cVhkd2ypqbc6WHOuXzuiNuzsqLNNhRuf1TL6dLeDMc5qLuBdfJeA-GOGAp1gX7HQ63c3ctFZMMt3leFcKErOTZmJ-B6exp5DYBa1Wge5"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent"></div>
        </div>
        <div className="relative z-10 h-full max-w-[1920px] mx-auto px-8 flex flex-col justify-center items-start">
          <span className="bg-primary text-white px-3 py-1 font-headline font-bold text-sm mb-6 tracking-widest">
            SEASON 04 / DROP 01
          </span>
          <h1 className="font-brand text-8xl md:text-[12rem] leading-none text-on-surface mb-8 tracking-tighter">
            RACE THE
            <br />
            STREETS
          </h1>
          <div className="flex gap-4">
            <button className="bg-on-surface text-surface px-12 py-5 font-headline font-bold uppercase tracking-widest hover:bg-primary transition-all active:scale-95">
              Shop Now
            </button>
            <button className="border-2 border-on-surface text-on-surface px-12 py-5 font-headline font-bold uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-all active:scale-95">
              Lookbook
            </button>
          </div>
        </div>
        <div className="absolute bottom-12 right-12 hidden lg:block">
          <p className="font-brand text-4xl text-on-surface/20 vertical-rl transform rotate-180">
            PRECISION BRUTALISM
          </p>
        </div>
      </section>
    </>
  );
}
