export default function Comp2() {
  return (
    <>
      <header className="flex justify-between items-center w-full px-8 h-16 sticky top-0 z-50 bg-[#fcf8f8] dark:bg-[#1c1b1b] border-b-0">
        <div className="flex items-center gap-8 flex-1">
          <span className="text-2xl font-black text-[#1c1b1b] dark:text-[#fcf8f8] tracking-[0.05em] font-['Space_Grotesk']">
            StreetRiot ADMIN
          </span>
          <div className="relative flex-1 max-w-md ml-4">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface opacity-40">
              search
            </span>
            <input
              className="w-full bg-[#f6f3f2] dark:bg-[#252424] border-none focus:ring-1 focus:ring-[#b90c1b] h-10 pl-10 pr-4 text-xs font-['Space_Grotesk'] tracking-widest"
              placeholder="SEARCH PRODUCTS, SKU, COLLECTIONS..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-on-surface opacity-70 hover:bg-[#ebe7e7] dark:hover:bg-[#333131] transition-colors duration-200 active:opacity-80 active:scale-95">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#b90c1b] rounded-full"></span>
            </button>
            <button className="p-2 text-on-surface opacity-70 hover:bg-[#ebe7e7] dark:hover:bg-[#333131] transition-colors duration-200 active:opacity-80 active:scale-95">
              <span className="material-symbols-outlined">mail</span>
            </button>
          </div>
          <div className="h-6 w-[1px] bg-outline-variant opacity-20"></div>
          <button className="font-['Space_Grotesk'] text-sm tracking-wider font-bold text-[#b90c1b] dark:text-[#dd2e30] hover:bg-[#ebe7e7] dark:hover:bg-[#333131] px-3 py-1 transition-colors duration-200 active:opacity-80 active:scale-95">
            Profile
          </button>
        </div>
      </header>
    </>
  );
}
