export default function Section11() {
  return (
    <>
      <section className="py-24 bg-surface px-8 overflow-hidden">
        <div className="max-w-[1920px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="absolute -top-12 -left-12 font-brand text-[20rem] text-on-surface/5 select-none">
                RIOT
              </div>
              <blockquote className="relative z-10">
                <span className="text-primary text-6xl font-brand">"</span>
                <p className="font-headline text-3xl md:text-5xl font-black uppercase tracking-tight text-on-surface mb-12 leading-tight">
                  StreetRiot isn't just a brand; it's a statement of speed. The
                  fit, the fabric, and the philosophy align perfectly with the
                  modern urban tempo.
                </p>
                <cite className="not-italic block">
                  <span className="font-headline font-bold text-xl uppercase text-primary tracking-widest">
                    — MARCUS CHENG
                  </span>
                  <span className="block font-body text-zinc-500 uppercase tracking-widest mt-1">
                    Creative Director, Apex Visuals
                  </span>
                </cite>
              </blockquote>
            </div>
            <div className="relative grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] bg-surface-container-high overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  data-alt="Portrait of a person with technical streetwear style, wearing glasses and a structural jacket in a high-contrast urban setting"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbL1-ppo-l3SRypPX6RZ5dKS2DDAhQjbPafRBPHw03sq8lWUKzOvyNO8hrzBIZUpW-fVSGe626l1Xxh3rYVgJRx6OHcHy0roou-IIN3Rcy7i1--tDGlbAp8hF3C48ErOn9FQsJvw9KOed7oRfwr0vkir0XPjKyz2DVFIUlsg2wBUgcz9FKV4jiTkuCCyGFJIHDNjcglJsmoRdWa0tvjIQjJbPL7XkCDPo-HzXB9s2JqlvYWfn9eztSUq9wCBMvCdcNKu0MQqopD7lk"
                />
              </div>
              <div className="aspect-[3/4] bg-surface-container-high overflow-hidden mt-12">
                <img
                  className="w-full h-full object-cover"
                  data-alt="A person leaning against a red racing car, wearing a black kinetic editorial hoodie and technical pants"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0bkP9uh6CTDzqfqj_jVEM3cqjA4-c74IHa9LkZ9vJaHxQodl6Ov9mUsg0v9SvRJRZNydWO7V3mdufJlXeMfwPEk-1uKfZLn8PINSIopg51eykyR3ZyqIvQ0Tgf3lpNSXeeGKI48AVu1llaFeXHiYtnfhNkW4OntGTm6rBvnHncFCf36tMqFeDatHO_Db_l05_09vyaOAYaV-2zk37Qbic5YofL2OtV7aLIUJfNEboJXhGfSqjkcDcLTokW0PkijvLoG16M7zVgemW"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
