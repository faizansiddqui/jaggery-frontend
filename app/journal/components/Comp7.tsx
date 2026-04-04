export default function Comp7() {
  return (
    <>
      <footer className="w-full border-t border-[#ebe7e7] dark:border-[#333] bg-[#f6f3f2] dark:bg-[#1c1b1b] flex flex-col md:flex-row justify-between items-center px-12 py-10 gap-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <span className="font-['Bebas_Neue'] text-xl text-[#1c1b1b] dark:text-[#fcf8f8]">
            STREETRIOT
          </span>
          <span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest opacity-70">
            ©2024 STREETRIOT KINETIC EDITORIAL. ALL RIGHTS RESERVED.
          </span>
        </div>
        <div className="flex gap-8 font-['Space_Grotesk'] text-xs uppercase tracking-widest">
          <a
            className="text-[#1c1b1b] dark:text-[#fcf8f8] opacity-70 hover:opacity-100 hover:text-[#b90c1b] transition-all"
            href="/"
          >
            Terms
          </a>
          <a
            className="text-[#1c1b1b] dark:text-[#fcf8f8] opacity-70 hover:opacity-100 hover:text-[#b90c1b] transition-all"
            href="/"
          >
            Privacy
          </a>
          <a
            className="text-[#1c1b1b] dark:text-[#fcf8f8] opacity-70 hover:opacity-100 hover:text-[#b90c1b] transition-all"
            href="/"
          >
            Instagram
          </a>
          <a
            className="text-[#1c1b1b] dark:text-[#fcf8f8] opacity-70 hover:opacity-100 hover:text-[#b90c1b] transition-all"
            href="/"
          >
            Careers
          </a>
        </div>
      </footer>
    </>
  );
}
