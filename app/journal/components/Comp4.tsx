export default function Comp4() {
  return (
    <>
      <article className="px-8 grid grid-cols-1 md:grid-cols-12 gap-0 mb-20 group cursor-pointer">
        <div className="md:col-span-8 relative overflow-hidden bg-surface-container-low aspect-[16/9] md:aspect-[21/9]">
          <img
            alt="Street racing silhouette"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            data-alt="dramatic cinematic shot of a modified street racing car at night under neon city lights with long exposure light trails"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGxzpEjDZF4QDJZTvKWiHY81S0dqGM5qkKSWTgW_l0C8Y2ORpTr9jrJ_334mg6iiH57QNt1R5TZwu2ISihjQ2ak1mHD7GqvV8Larn8nyYV7qlJeIpAza8OkCYGiwFyACSaLEr2zibcHSHPRKkjbiv4AHTLcsb8FYBj-AnF7AqVQbhGVg7_pY6-iJS0r7zTqEv0w1dbXYRGG5f10lBRqxrVJGEbPW0C-0k16wEjjV39n2FUPUMP-ckzScHIRZfq3VPHGjQulw5L3VhS"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-8 left-8">
            <span className="bg-primary text-on-primary px-3 py-1 font-headline text-[10px] uppercase tracking-widest mb-4 inline-block">
              Featured Story
            </span>
            <h2 className="text-surface font-brand text-4xl md:text-6xl uppercase leading-none tracking-tight max-w-2xl">
              The Asphalt Anatomy: Engineering for the Underground
            </h2>
          </div>
        </div>
        <div className="md:col-span-4 bg-surface-container-low p-8 flex flex-col justify-between">
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
    </>
  );
}
