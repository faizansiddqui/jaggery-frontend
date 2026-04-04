export default function Comp1() {
  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#fcf8f8] flex justify-between items-center px-4 md:px-8 py-3 md:py-4 max-w-full mx-auto backdrop-blur-md bg-opacity-90 border-b border-[#1c1b1b]/10">
        <div className="flex items-center gap-4 md:gap-8">
          <span className="text-2xl md:text-3xl font-bold tracking-tighter uppercase font-brand text-[#1c1b1b]">
            {process.env.NEXT_PUBLIC_SITE_NAME || 'StreetRiot'}
          </span>
          <div className="hidden md:flex gap-6 font-headline uppercase tracking-[0.05em] text-xs">
            <a className="text-[#1c1b1b] hover:text-[#b90c1b] transition-colors duration-200" href="/shop">Shop</a>
            <a className="text-[#b90c1b] border-b-2 border-[#b90c1b] pb-1" href="/journal">Editorial</a>
            <a className="text-[#1c1b1b] hover:text-[#b90c1b] transition-colors duration-200" href="/contact">Contact</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="/cart" className="material-symbols-outlined text-[#1c1b1b] hover:text-[#b90c1b] transition-all">shopping_cart</a>
          <a href="/user/profile" className="material-symbols-outlined text-[#1c1b1b] hover:text-[#b90c1b] transition-all">account_circle</a>
        </div>
      </nav>
    </>
  );
}
