export default function Comp1() {
  return (
    <>
      <nav className="fixed top-0 w-full z-50 h-20 bg-[#fcf8f8] dark:bg-[#1c1b1b] flex justify-between items-center px-6 md:px-12 w-full">
        <div className="flex items-center gap-8">
          <span className="text-3xl font-black tracking-tighter text-[#1c1b1b] dark:text-[#fcf8f8]">
            STREETRIOT
          </span>
          <div className="hidden md:flex gap-6 font-['Space_Grotesk'] uppercase tracking-[0.05em]">
            <a
              className="text-[#1c1b1b] dark:text-[#fcf8f8] hover:text-[#b90c1b] transition-colors duration-200"
              href="/"
            >
              SHOP
            </a>
            <a
              className="text-[#1c1b1b] dark:text-[#fcf8f8] hover:text-[#b90c1b] transition-colors duration-200"
              href="/"
            >
              EDITORIAL
            </a>
            <a
              className="text-[#1c1b1b] dark:text-[#fcf8f8] hover:text-[#b90c1b] transition-colors duration-200"
              href="/"
            >
              DROPS
            </a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-surface-container px-3 py-1.5 border-b border-on-surface">
            <span className="material-symbols-outlined text-xl">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-xs font-headline uppercase tracking-widest w-40"
              placeholder="SEARCH"
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-[#b90c1b] border-b-2 border-[#b90c1b] pb-1 flex items-center justify-center">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </button>
            <button className="text-[#1c1b1b] dark:text-[#fcf8f8] hover:text-[#b90c1b] transition-colors duration-200 flex items-center justify-center">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
