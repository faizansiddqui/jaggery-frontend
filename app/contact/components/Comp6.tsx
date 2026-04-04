export default function Comp6() {
  return (
    <>
      <footer className="w-full border-t border-[#1c1b1b]/10 bg-[#f6f3f2] flex flex-col md:flex-row justify-between items-center px-12 py-10 gap-6">
        <div className="font-brand text-xl text-[#1c1b1b]">
          {process.env.NEXT_PUBLIC_SITE_NAME || 'StreetRiot'}
        </div>
        <div className="flex flex-wrap justify-center gap-8 font-headline text-xs uppercase tracking-widest text-[#1c1b1b]">
          <a className="opacity-60 hover:opacity-100 hover:text-[#b90c1b] transition-all" href="/">Terms</a>
          <a className="opacity-60 hover:opacity-100 hover:text-[#b90c1b] transition-all" href="/">Privacy</a>
          <a className="opacity-60 hover:opacity-100 hover:text-[#b90c1b] transition-all" href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || '/'}>Instagram</a>
          <a className="opacity-60 hover:opacity-100 hover:text-[#b90c1b] transition-all" href="/">Careers</a>
        </div>
        <p className="font-headline text-[10px] uppercase tracking-widest opacity-40">
          ©{new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_NAME || 'StreetRiot'} Editorial. All rights reserved.
        </p>
      </footer>
    </>
  );
}
