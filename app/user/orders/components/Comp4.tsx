export default function Comp4() {
  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-safe bg-[#fcf8f8] h-16 tonal-shift bg-[#f6f3f2] shadow-[0_-12px_40px_rgba(28,27,27,0.06)]">
        <a
          className="flex flex-col items-center justify-center text-[#1c1b1b] font-['Space_Grotesk'] font-bold text-[10px] uppercase tracking-widest hover:bg-[#f6f3f2] active:translate-y-[-2px] transition-transform"
          href="/"
        >
          <span className="material-symbols-outlined" data-icon="home">
            home
          </span>
          <span>HOME</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-[#1c1b1b] font-['Space_Grotesk'] font-bold text-[10px] uppercase tracking-widest hover:bg-[#f6f3f2] active:translate-y-[-2px] transition-transform"
          href="/"
        >
          <span className="material-symbols-outlined" data-icon="search">
            search
          </span>
          <span>SEARCH</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-[#1c1b1b] font-['Space_Grotesk'] font-bold text-[10px] uppercase tracking-widest hover:bg-[#f6f3f2] active:translate-y-[-2px] transition-transform"
          href="/"
        >
          <span className="material-symbols-outlined" data-icon="shopping_bag">
            shopping_bag
          </span>
          <span>CART</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-[#b90c1b] font-['Space_Grotesk'] font-bold text-[10px] uppercase tracking-widest hover:bg-[#f6f3f2] active:translate-y-[-2px] transition-transform"
          href="/"
        >
          <span className="material-symbols-outlined" data-icon="person">
            person
          </span>
          <span>PROFILE</span>
        </a>
      </nav>
    </>
  );
}
