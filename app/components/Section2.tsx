export default function Section2() {
  return (
    <>
      <header className="bg-[#fcf8f8] dark:bg-zinc-900 sticky top-0 z-50 transition-colors duration-200">
        <nav className="flex justify-between items-center w-full px-8 py-4 max-w-[1920px] mx-auto">
          <div className="flex-1 flex items-center gap-8">
            <a
              className="font-['Bebas_Neue'] text-3xl font-black tracking-widest text-[#1c1b1b] dark:text-white"
              href="/"
            >
              KINETIC
            </a>
            <div className="hidden md:flex gap-6">
              <a
                className="font-['Space_Grotesk'] uppercase tracking-[0.05em] text-[1rem] font-bold text-[#b90c1b] border-b-2 border-[#b90c1b] pb-1 transition-colors duration-200"
                href="/shop/new-arrivals"
              >
                NEW ARRIVALS
              </a>
              <a
                className="font-['Space_Grotesk'] uppercase tracking-[0.05em] text-[1rem] font-bold text-[#1c1b1b] dark:text-zinc-400 pb-1 hover:text-[#b90c1b] transition-colors duration-200"
                href="/shop/jackets"
              >
                JACKETS
              </a>
              <a
                className="font-['Space_Grotesk'] uppercase tracking-[0.05em] text-[1rem] font-bold text-[#1c1b1b] dark:text-zinc-400 pb-1 hover:text-[#b90c1b] transition-colors duration-200"
                href="/shop/hoodies"
              >
                HOODIES
              </a>
              <a
                className="font-['Space_Grotesk'] uppercase tracking-[0.05em] text-[1rem] font-bold text-[#1c1b1b] dark:text-zinc-400 pb-1 hover:text-[#b90c1b] transition-colors duration-200"
                href="/shop/track-pants"
              >
                TRACK PANTS
              </a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="material-symbols-outlined text-2xl cursor-pointer hover:text-primary transition-colors">
              favorite
            </span>
            <span className="material-symbols-outlined text-2xl cursor-pointer hover:text-primary transition-colors">
              shopping_cart
            </span>
            <span className="material-symbols-outlined text-2xl cursor-pointer hover:text-primary transition-colors">
              person
            </span>
          </div>
        </nav>
      </header>
    </>
  );
}
