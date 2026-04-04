export default function Comp6() {
  return (
    <>
      <footer className="w-full border-t border-[#ebe7e7] dark:border-[#333] bg-[#f6f3f2] dark:bg-[#1c1b1b] flex flex-col md:flex-row justify-between items-center px-12 py-10 gap-6">
        <div className="font-['Bebas_Neue'] text-xl text-[#1c1b1b] dark:text-[#fcf8f8]">
          StreetRiot
        </div>
        <div className="flex flex-wrap justify-center gap-8 font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#1c1b1b] dark:text-[#fcf8f8]">
          <a
            className="opacity-70 hover:opacity-100 hover:text-[#b90c1b] transition-all"
            href="/"
          >
            Terms
          </a>
          <a
            className="opacity-70 hover:opacity-100 hover:text-[#b90c1b] transition-all"
            href="/"
          >
            Privacy
          </a>
          <a
            className="opacity-70 hover:opacity-100 hover:text-[#b90c1b] transition-all"
            href="/"
          >
            Instagram
          </a>
          <a
            className="opacity-70 hover:opacity-100 hover:text-[#b90c1b] transition-all"
            href="/"
          >
            Careers
          </a>
        </div>
        <p className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest opacity-50">
          ©2024 STREETRIOT KINETIC EDITORIAL. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </>
  );
}
