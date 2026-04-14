export default function Comp2() {
  return (
    <>
      <header className="flex justify-between items-center w-full px-8 h-16 sticky top-0 z-50 bg-[#fcf8f8] dark:bg-[#1c1b1b] border-b-0 tonal-shift bg-[#f6f3f2] dark:bg-[#252424] flat no shadows">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black text-[#1c1b1b] dark:text-[#fcf8f8] tracking-[0.05em] font-['Space_Grotesk']">
            StreetRiot ADMIN
          </span>
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1c1b1b] opacity-40 material-symbols-outlined text-sm">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-xs tracking-widest font-['Space_Grotesk'] w-64 pl-10"
              placeholder="SEARCH SYSTEM..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative text-[#1c1b1b] dark:text-[#fcf8f8] opacity-70 hover:bg-[#ebe7e7] dark:hover:bg-[#333131] transition-colors duration-200 p-2 active:opacity-80 active:scale-95">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <button className="text-[#1c1b1b] dark:text-[#fcf8f8] opacity-70 hover:bg-[#ebe7e7] dark:hover:bg-[#333131] transition-colors duration-200 p-2 active:opacity-80 active:scale-95">
            <span className="material-symbols-outlined">mail</span>
          </button>
          <div className="h-8 w-[1px] bg-outline-variant/30"></div>
          <button className="text-[#b90c1b] font-bold border-b-2 border-[#b90c1b] py-1 font-['Space_Grotesk'] tracking-wider text-xs active:opacity-80 active:scale-95">
            Profile
          </button>
        </div>
      </header>
    </>
  );
}
