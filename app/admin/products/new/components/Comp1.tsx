export default function Comp1() {
  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-64 flex flex-col p-6 z-40 bg-[#fcf8f8] dark:bg-[#1c1b1b]">
        <div className="text-xl font-black text-[#1c1b1b] dark:text-[#fcf8f8] mb-12 font-['Space_Grotesk'] uppercase tracking-[0.05em]">
          STREETRIOT
          <span className="block text-[10px] tracking-[0.3em] font-normal opacity-60">
            ADMIN PORTAL
          </span>
        </div>
        <nav className="flex-1 space-y-1">
          <a
            className="text-[#1c1b1b] dark:text-[#fcf8f8] px-4 py-3 flex items-center gap-4 hover:bg-[#ebe7e7] dark:hover:bg-[#2c2b2b] transition-transform duration-200 font-['Space_Grotesk'] uppercase tracking-[0.05em] font-bold"
            href="/"
          >
            <span className="material-symbols-outlined">dashboard</span>{" "}
            Dashboard
          </a>
          <a
            className="text-[#fcf8f8] bg-[#1c1b1b] dark:bg-[#b90c1b] dark:text-white px-4 py-3 flex items-center gap-4 transition-transform duration-200 translate-x-1 font-['Space_Grotesk'] uppercase tracking-[0.05em] font-bold"
            href="/"
          >
            <span className="material-symbols-outlined">shopping_bag</span>{" "}
            Products
          </a>
          <a
            className="text-[#1c1b1b] dark:text-[#fcf8f8] px-4 py-3 flex items-center gap-4 hover:bg-[#ebe7e7] dark:hover:bg-[#2c2b2b] transition-transform duration-200 font-['Space_Grotesk'] uppercase tracking-[0.05em] font-bold"
            href="/"
          >
            <span className="material-symbols-outlined">receipt_long</span>{" "}
            Orders
          </a>
          <a
            className="text-[#1c1b1b] dark:text-[#fcf8f8] px-4 py-3 flex items-center gap-4 hover:bg-[#ebe7e7] dark:hover:bg-[#2c2b2b] transition-transform duration-200 font-['Space_Grotesk'] uppercase tracking-[0.05em] font-bold"
            href="/"
          >
            <span className="material-symbols-outlined">group</span> Customers
          </a>
          <a
            className="text-[#1c1b1b] dark:text-[#fcf8f8] px-4 py-3 flex items-center gap-4 hover:bg-[#ebe7e7] dark:hover:bg-[#2c2b2b] transition-transform duration-200 font-['Space_Grotesk'] uppercase tracking-[0.05em] font-bold"
            href="/"
          >
            <span className="material-symbols-outlined">leaderboard</span>{" "}
            Analytics
          </a>
          <a
            className="text-[#1c1b1b] dark:text-[#fcf8f8] px-4 py-3 flex items-center gap-4 hover:bg-[#ebe7e7] dark:hover:bg-[#2c2b2b] transition-transform duration-200 font-['Space_Grotesk'] uppercase tracking-[0.05em] font-bold"
            href="/"
          >
            <span className="material-symbols-outlined">settings</span> Settings
          </a>
        </nav>
        <div className="mt-auto pt-6">
          <a
            className="text-[#1c1b1b] dark:text-[#fcf8f8] px-4 py-3 flex items-center gap-4 hover:bg-[#ebe7e7] dark:hover:bg-[#2c2b2b] font-['Space_Grotesk'] uppercase tracking-[0.05em] font-bold"
            href="/"
          >
            <span className="material-symbols-outlined">logout</span> Logout
          </a>
        </div>
      </aside>
    </>
  );
}
