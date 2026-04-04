export default function Comp4() {
  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 bg-[#f6f3f2] shadow-[0_-4px_20px_rgba(28,27,27,0.08)] h-16 border-t border-[#1c1b1b]/10">
        <a href="/" className="flex flex-col items-center justify-center text-[#1c1b1b] font-headline font-bold text-[10px] uppercase tracking-widest hover:text-[#b90c1b] active:translate-y-[-2px] transition-all gap-1">
          <span className="material-symbols-outlined text-xl">home</span>
          <span>HOME</span>
        </a>
        <a href="/search" className="flex flex-col items-center justify-center text-[#b90c1b] font-headline font-bold text-[10px] uppercase tracking-widest active:translate-y-[-2px] transition-all gap-1">
          <span className="material-symbols-outlined text-xl">search</span>
          <span>SEARCH</span>
        </a>
        <a href="/cart" className="flex flex-col items-center justify-center text-[#1c1b1b] font-headline font-bold text-[10px] uppercase tracking-widest hover:text-[#b90c1b] active:translate-y-[-2px] transition-all gap-1">
          <span className="material-symbols-outlined text-xl">shopping_bag</span>
          <span>CART</span>
        </a>
        <a href="/user/profile" className="flex flex-col items-center justify-center text-[#1c1b1b] font-headline font-bold text-[10px] uppercase tracking-widest hover:text-[#b90c1b] active:translate-y-[-2px] transition-all gap-1">
          <span className="material-symbols-outlined text-xl">person</span>
          <span>PROFILE</span>
        </a>
      </nav>
    </>
  );
}
