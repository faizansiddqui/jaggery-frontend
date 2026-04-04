export default function Comp14() {
  return (
    <>
      <footer className="w-full bg-[#f6f3f2] dark:bg-[#1c1b1b] border-t border-[#ebe7e7] dark:border-[#333]">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-10 gap-6 max-w-[1920px] mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <a
              className="font-['Bebas_Neue'] text-xl text-[#1c1b1b] dark:text-[#fcf8f8]"
              href="/"
            >
              STREETRIOT
            </a>
            <p className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#1c1b1b] dark:text-[#fcf8f8] opacity-70">
              ©2024 STREETRIOT KINETIC EDITORIAL. ALL RIGHTS RESERVED.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a
              className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#1c1b1b] dark:text-[#fcf8f8] opacity-70 hover:opacity-100 hover:text-[#b90c1b] transition-all ease-in-out"
              href="/"
            >
              Terms
            </a>
            <a
              className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#1c1b1b] dark:text-[#fcf8f8] opacity-70 hover:opacity-100 hover:text-[#b90c1b] transition-all ease-in-out"
              href="/"
            >
              Privacy
            </a>
            <a
              className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#1c1b1b] dark:text-[#fcf8f8] opacity-70 hover:opacity-100 hover:text-[#b90c1b] transition-all ease-in-out"
              href="/"
            >
              Instagram
            </a>
            <a
              className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#1c1b1b] dark:text-[#fcf8f8] opacity-70 hover:opacity-100 hover:text-[#b90c1b] transition-all ease-in-out"
              href="/"
            >
              Careers
            </a>
          </div>
          <div className="flex gap-6">
            <span className="material-symbols-outlined text-[#1c1b1b] dark:text-[#fcf8f8] opacity-70 hover:opacity-100 hover:text-[#b90c1b] transition-all cursor-pointer">
              share
            </span>
            <span className="material-symbols-outlined text-[#1c1b1b] dark:text-[#fcf8f8] opacity-70 hover:opacity-100 hover:text-[#b90c1b] transition-all cursor-pointer">
              language
            </span>
            <span className="material-symbols-outlined text-[#1c1b1b] dark:text-[#fcf8f8] opacity-70 hover:opacity-100 hover:text-[#b90c1b] transition-all cursor-pointer">
              podcasts
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
