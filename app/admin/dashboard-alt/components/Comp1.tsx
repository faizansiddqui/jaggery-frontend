export default function Comp1() {
  return (
    <>
      <aside className="fixed left-0 top-0 h-full flex flex-col pt-8 z-40 bg-[#1c1b1b] dark:bg-[#000000] docked left-0 w-64 rounded-0">
        <div className="px-8 mb-8">
          <h1 className="text-xl font-bold text-white mb-2 tracking-widest font-['Space_Grotesk'] uppercase">
            STREETRIOT
          </h1>
          <p className="text-[10px] text-white opacity-40 tracking-[0.3em] font-['Space_Grotesk'] uppercase">
            Management Portal
          </p>
        </div>
        <nav className="flex-1">
          <a
            className="bg-[#b90c1b] text-white font-bold px-6 py-4 flex items-center gap-4 transition-all duration-150 translate-x-1 font-['Space_Grotesk'] uppercase text-sm tracking-widest"
            href="/"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </a>
          <a
            className="text-[#ebe7e7] px-6 py-4 flex items-center gap-4 opacity-60 hover:bg-[#b90c1b] hover:opacity-100 transition-all duration-150 font-['Space_Grotesk'] uppercase text-sm tracking-widest"
            href="/"
          >
            <span className="material-symbols-outlined">inventory_2</span>
            <span>Products</span>
          </a>
          <a
            className="text-[#ebe7e7] px-6 py-4 flex items-center gap-4 opacity-60 hover:bg-[#b90c1b] hover:opacity-100 transition-all duration-150 font-['Space_Grotesk'] uppercase text-sm tracking-widest"
            href="/"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            <span>Orders</span>
          </a>
          <a
            className="text-[#ebe7e7] px-6 py-4 flex items-center gap-4 opacity-60 hover:bg-[#b90c1b] hover:opacity-100 transition-all duration-150 font-['Space_Grotesk'] uppercase text-sm tracking-widest"
            href="/"
          >
            <span className="material-symbols-outlined">group</span>
            <span>Customers</span>
          </a>
          <a
            className="text-[#ebe7e7] px-6 py-4 flex items-center gap-4 opacity-60 hover:bg-[#b90c1b] hover:opacity-100 transition-all duration-150 font-['Space_Grotesk'] uppercase text-sm tracking-widest"
            href="/"
          >
            <span className="material-symbols-outlined">analytics</span>
            <span>Analytics</span>
          </a>
          <a
            className="text-[#ebe7e7] px-6 py-4 flex items-center gap-4 opacity-60 hover:bg-[#b90c1b] hover:opacity-100 transition-all duration-150 font-['Space_Grotesk'] uppercase text-sm tracking-widest"
            href="/"
          >
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </a>
        </nav>
        <div className="p-6 border-t border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#b90c1b] flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <p className="text-xs text-white font-bold tracking-tight">
              Admin User
            </p>
            <p className="text-[10px] text-white/50">Super Admin</p>
          </div>
        </div>
      </aside>
    </>
  );
}
