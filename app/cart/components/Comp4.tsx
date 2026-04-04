export default function Comp4() {
  return (
    <>
      <footer className="bg-on-surface text-surface py-20 px-6 md:px-12 mt-20 hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-md">
            <span className="font-display text-5xl tracking-tighter block mb-6">
              STREETRIOT
            </span>
            <p className="font-headline text-sm tracking-wide leading-relaxed opacity-60">
              Architecting the future of street culture through precision
              brutalism and technical engineering.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="font-headline font-bold text-xs uppercase tracking-[0.2em] mb-6">
                Explore
              </h4>
              <ul className="space-y-3 font-headline text-xs uppercase tracking-widest opacity-60">
                <li>
                  <a className="hover:text-primary transition-colors" href="/">
                    Collections
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="/">
                    Editorial
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="/">
                    Archives
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-bold text-xs uppercase tracking-[0.2em] mb-6">
                Support
              </h4>
              <ul className="space-y-3 font-headline text-xs uppercase tracking-widest opacity-60">
                <li>
                  <a className="hover:text-primary transition-colors" href="/">
                    Shipping
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="/">
                    Returns
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="/">
                    Track Order
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-bold text-xs uppercase tracking-[0.2em] mb-6">
                Legal
              </h4>
              <ul className="space-y-3 font-headline text-xs uppercase tracking-widest opacity-60">
                <li>
                  <a className="hover:text-primary transition-colors" href="/">
                    Privacy
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="/">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-surface/10 mt-20 pt-8 flex justify-between items-center text-[10px] font-headline font-bold tracking-[0.3em] opacity-40 uppercase">
          <span>© 2024 STREETRIOT INC.</span>
          <div className="flex gap-6">
            <span>INSTAGRAM</span>
            <span>TWITTER</span>
            <span>TIKTOK</span>
          </div>
        </div>
      </footer>
    </>
  );
}
