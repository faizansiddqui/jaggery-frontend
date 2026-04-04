export default function Comp4() {
  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-safe bg-[#fcf8f8] dark:bg-[#1c1b1b] tonal-shift bg-[#f6f3f2] dark:bg-[#252424] shadow-[0_-12px_40px_rgba(28,27,27,0.06)] h-16">
        <button className="flex flex-col items-center justify-center text-[#1c1b1b] dark:text-[#fcf8f8] font-['Space_Grotesk'] font-bold text-[10px] uppercase tracking-widest hover:bg-[#f6f3f2] dark:hover:bg-[#252424] active:translate-y-[-2px] transition-transform">
          <span className="material-symbols-outlined">home</span>
          <span>HOME</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#b90c1b] font-['Space_Grotesk'] font-bold text-[10px] uppercase tracking-widest hover:bg-[#f6f3f2] dark:hover:bg-[#252424] active:translate-y-[-2px] transition-transform">
          <span className="material-symbols-outlined">search</span>
          <span>SEARCH</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#1c1b1b] dark:text-[#fcf8f8] font-['Space_Grotesk'] font-bold text-[10px] uppercase tracking-widest hover:bg-[#f6f3f2] dark:hover:bg-[#252424] active:translate-y-[-2px] transition-transform">
          <span className="material-symbols-outlined">shopping_bag</span>
          <span>CART</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#1c1b1b] dark:text-[#fcf8f8] font-['Space_Grotesk'] font-bold text-[10px] uppercase tracking-widest hover:bg-[#f6f3f2] dark:hover:bg-[#252424] active:translate-y-[-2px] transition-transform">
          <span className="material-symbols-outlined">person</span>
          <span>PROFILE</span>
        </button>
      </nav>
    </>
  );
}
