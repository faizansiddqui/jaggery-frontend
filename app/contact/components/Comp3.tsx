export default function Comp3() {
  return (
    <>
      <div className="max-w-[1440px] mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5 flex flex-col gap-12">
          <section>
            <h1 className="font-brand text-8xl leading-none uppercase mb-8">
              Get in
              <br />
              Touch
            </h1>
            <p className="font-headline text-xl uppercase tracking-widest text-primary font-bold mb-4">
              Precision Brutalism In Action
            </p>
            <div className="velocity-bar mb-12"></div>
          </section>

          <div className="grid grid-cols-1 gap-8">
            <div className="p-8 bg-surface-container-low border-l-8 border-on-surface">
              <h3 className="font-brand text-3xl uppercase mb-2">Support</h3>
              <p className="text-sm uppercase tracking-tighter opacity-70 mb-4">
                Technical issues &amp; Order tracking
              </p>
              <a
                className="font-headline font-bold text-lg hover:text-primary transition-colors"
                href="mailto:support@streetriot.com"
              >
                SUPPORT@STREETRIOT.COM
              </a>
            </div>
            <div className="p-8 bg-surface-container-low border-l-8 border-primary">
              <h3 className="font-brand text-3xl uppercase mb-2">Press</h3>
              <p className="text-sm uppercase tracking-tighter opacity-70 mb-4">
                Media kits &amp; Editorial inquiries
              </p>
              <a
                className="font-headline font-bold text-lg hover:text-primary transition-colors"
                href="mailto:press@streetriot.com"
              >
                PRESS@STREETRIOT.COM
              </a>
            </div>
            <div className="p-8 bg-surface-container-low border-l-8 border-on-surface">
              <h3 className="font-brand text-3xl uppercase mb-2">Wholesale</h3>
              <p className="text-sm uppercase tracking-tighter opacity-70 mb-4">
                Global distribution &amp; Stockists
              </p>
              <a
                className="font-headline font-bold text-lg hover:text-primary transition-colors"
                href="mailto:sales@streetriot.com"
              >
                SALES@STREETRIOT.COM
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-surface-container-lowest p-12 border border-outline-variant/20 shadow-xl shadow-on-surface/5">
            <h2 className="font-brand text-4xl uppercase mb-12 flex items-center gap-4">
              <span
                className="material-symbols-outlined text-primary"
                data-weight="fill"
              >
                send
              </span>
              Transmit Message
            </h2>
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <label className="block font-headline text-[10px] uppercase tracking-widest mb-2">
                    Subject Name
                  </label>
                  <input
                    className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary focus:ring-0 px-0 py-2 outline-none text-on-surface font-headline uppercase placeholder:opacity-30"
                    placeholder="REQUIRED"
                    type="text"
                  />
                </div>
                <div className="relative">
                  <label className="block font-headline text-[10px] uppercase tracking-widest mb-2">
                    Digital ID (Email)
                  </label>
                  <input
                    className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary focus:ring-0 px-0 py-2 outline-none text-on-surface font-headline uppercase placeholder:opacity-30"
                    placeholder="REQUIRED"
                    type="email"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block font-headline text-[10px] uppercase tracking-widest mb-2">
                  Department Segment
                </label>
                <select className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary focus:ring-0 px-0 py-2 outline-none text-on-surface font-headline uppercase appearance-none cursor-pointer">
                  <option>GENERAL INQUIRY</option>
                  <option>ORDER STATUS</option>
                  <option>EDITORIAL PITCH</option>
                  <option>WHOLESALE REQUEST</option>
                </select>
              </div>
              <div className="relative">
                <label className="block font-headline text-[10px] uppercase tracking-widest mb-2">
                  Transmission Data
                </label>
                <textarea
                  className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary focus:ring-0 px-0 py-2 outline-none text-on-surface font-headline uppercase placeholder:opacity-30 resize-none"
                  placeholder="INPUT DETAILS HERE..."
                  rows={4}
                ></textarea>
              </div>
              <button className="w-full py-6 bg-on-surface text-surface font-brand text-2xl uppercase tracking-widest hover:bg-primary transition-colors duration-300 flex justify-center items-center gap-4">
                Initiate Transfer
                <span className="material-symbols-outlined">trending_flat</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
