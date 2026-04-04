export default function Comp13() {
  return (
    <>
      <footer className="bg-[#1c1b1b] dark:bg-black w-full px-8 py-12">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-4">
            <a
              className="text-white font-['Bebas_Neue'] text-3xl tracking-widest"
              href="#"
            >
              KINETIC
            </a>
            <p className="font-['Space_Grotesk'] uppercase tracking-[0.05em] text-xs text-white opacity-60">
              © 2024 THE KINETIC EDITORIAL. ALL RIGHTS RESERVED.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <a
              className="font-['Space_Grotesk'] uppercase tracking-[0.05em] text-xs text-zinc-500 hover:text-[#b90c1b] transition-colors"
              href="#"
            >
              PRIVACY POLICY
            </a>
            <a
              className="font-['Space_Grotesk'] uppercase tracking-[0.05em] text-xs text-zinc-500 hover:text-[#b90c1b] transition-colors"
              href="#"
            >
              TERMS OF SERVICE
            </a>
            <a
              className="font-['Space_Grotesk'] uppercase tracking-[0.05em] text-xs text-zinc-500 hover:text-[#b90c1b] transition-colors"
              href="#"
            >
              SHIPPING &amp; RETURNS
            </a>
            <a
              className="font-['Space_Grotesk'] uppercase tracking-[0.05em] text-xs text-zinc-500 hover:text-[#b90c1b] transition-colors"
              href="#"
            >
              CONTACT US
            </a>
          </div>
          <div className="flex gap-6">
            <span className="material-symbols-outlined text-white hover:text-primary transition-colors cursor-pointer">
              share
            </span>
            <span className="material-symbols-outlined text-white hover:text-primary transition-colors cursor-pointer">
              language
            </span>
            <span className="material-symbols-outlined text-white hover:text-primary transition-colors cursor-pointer">
              podcasts
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
