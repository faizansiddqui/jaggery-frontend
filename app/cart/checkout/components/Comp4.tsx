export default function Comp4() {
  return (
    <>
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-safe bg-[#fcf8f8] h-16 md:hidden shadow-[0_-12px_40px_rgba(28,27,27,0.06)]">
        <div className="flex flex-col items-center justify-center text-[#1c1b1b] font-['Space_Grotesk'] font-bold text-[10px] uppercase tracking-widest">
          <span className="material-symbols-outlined">home</span>
          <span>HOME</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#1c1b1b] font-['Space_Grotesk'] font-bold text-[10px] uppercase tracking-widest">
          <span className="material-symbols-outlined">search</span>
          <span>SEARCH</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#b90c1b] font-['Space_Grotesk'] font-bold text-[10px] uppercase tracking-widest">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            shopping_bag
          </span>
          <span>CART</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#1c1b1b] font-['Space_Grotesk'] font-bold text-[10px] uppercase tracking-widest">
          <span className="material-symbols-outlined">person</span>
          <span>PROFILE</span>
        </div>
      </nav>
    </>
  );
}
