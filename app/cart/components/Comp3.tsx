export default function Comp3() {
  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-safe bg-[#fcf8f8] dark:bg-[#1c1b1b] h-16 shadow-[0_-12px_40px_rgba(28,27,27,0.06)]">
        <a
          className="flex flex-col items-center justify-center text-[#1c1b1b] dark:text-[#fcf8f8]"
          href="/"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="font-['Space_Grotesk'] font-bold text-[10px] uppercase tracking-widest">
            HOME
          </span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-[#1c1b1b] dark:text-[#fcf8f8]"
          href="/"
        >
          <span className="material-symbols-outlined">search</span>
          <span className="font-['Space_Grotesk'] font-bold text-[10px] uppercase tracking-widest">
            SEARCH
          </span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-[#b90c1b]"
          href="/"
        >
          <span className="material-symbols-outlined">shopping_bag</span>
          <span className="font-['Space_Grotesk'] font-bold text-[10px] uppercase tracking-widest">
            CART
          </span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-[#1c1b1b] dark:text-[#fcf8f8]"
          href="/"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="font-['Space_Grotesk'] font-bold text-[10px] uppercase tracking-widest">
            PROFILE
          </span>
        </a>
      </nav>
    </>
  );
}
