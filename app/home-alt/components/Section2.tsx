export default function Section2() {
  return (
    <>
      <header className="bg-[#fcf8f8] dark:bg-[#1c1b1b] fixed top-0 w-full z-50 transition-colors duration-200">
        <nav className="flex justify-between items-center px-8 py-4 max-w-full mx-auto">
          <div className="flex items-center gap-8">
            <a
              className="text-3xl font-bold tracking-tighter uppercase font-['Bebas_Neue'] text-[#1c1b1b] dark:text-[#fcf8f8]"
              href="/"
            >
              STREETRIOT
            </a>
            <div className="hidden md:flex gap-6">
              <a
                className="font-['Space_Grotesk'] uppercase tracking-[0.05em] text-[#b90c1b] border-b-2 border-[#b90c1b] pb-1 hover:text-[#b90c1b] transition-colors duration-200 active:scale-95"
                href="/"
              >
                Shop
              </a>
              <a
                className="font-['Space_Grotesk'] uppercase tracking-[0.05em] text-[#1c1b1b] dark:text-[#fcf8f8] hover:text-[#b90c1b] transition-colors duration-200 active:scale-95"
                href="/"
              >
                Editorial
              </a>
              <a
                className="font-['Space_Grotesk'] uppercase tracking-[0.05em] text-[#1c1b1b] dark:text-[#fcf8f8] hover:text-[#b90c1b] transition-colors duration-200 active:scale-95"
                href="/"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="material-symbols-outlined text-2xl cursor-pointer text-[#1c1b1b] dark:text-[#fcf8f8] hover:text-[#b90c1b] transition-colors duration-200 active:scale-95">
              shopping_cart
            </span>
            <span className="material-symbols-outlined text-2xl cursor-pointer text-[#1c1b1b] dark:text-[#fcf8f8] hover:text-[#b90c1b] transition-colors duration-200 active:scale-95">
              account_circle
            </span>
          </div>
        </nav>
      </header>
    </>
  );
}
