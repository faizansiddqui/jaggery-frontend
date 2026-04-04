export default function Comp1() {
  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#fcf8f8] dark:bg-[#1c1b1b] flex justify-between items-center px-8 py-4 max-w-full mx-auto">
        <div className="flex items-center gap-8">
          <span className="text-3xl font-bold tracking-tighter uppercase font-['Bebas_Neue'] text-[#1c1b1b] dark:text-[#fcf8f8]">
            StreetRiot
          </span>
          <div className="hidden md:flex gap-6 font-['Space_Grotesk'] uppercase tracking-[0.05em] text-xs">
            <a
              className="text-[#1c1b1b] dark:text-[#fcf8f8] hover:text-[#b90c1b] transition-colors duration-200"
              href="#"
            >
              Shop
            </a>
            <a
              className="text-[#b90c1b] border-b-2 border-[#b90c1b] pb-1"
              href="#"
            >
              Editorial
            </a>
            <a
              className="text-[#1c1b1b] dark:text-[#fcf8f8] hover:text-[#b90c1b] transition-colors duration-200"
              href="#"
            >
              Contact
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-[#1c1b1b] dark:text-[#fcf8f8] hover:text-[#b90c1b] transition-all">
            shopping_cart
          </button>
          <button className="material-symbols-outlined text-[#1c1b1b] dark:text-[#fcf8f8] hover:text-[#b90c1b] transition-all">
            account_circle
          </button>
        </div>
      </nav>
    </>
  );
}
