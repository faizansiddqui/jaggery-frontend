export default function Comp2() {
  return (
    <>
      <main className="pt-24 min-h-screen">
        <div className="overflow-hidden bg-on-surface py-4 whitespace-nowrap">
          <div className="inline-block animate-marquee">
            <span className="font-brand text-6xl text-surface px-4 uppercase">
              Direct Line — Kinetic Editorial — Global Stockists — Precision
              Brutalism —{" "}
            </span>
            <span className="font-brand text-6xl text-surface px-4 uppercase">
              Direct Line — Kinetic Editorial — Global Stockists — Precision
              Brutalism —{" "}
            </span>
          </div>
        </div>
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
                <h3 className="font-brand text-3xl uppercase mb-2">
                  Wholesale
                </h3>
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
                    rows="4"
                  ></textarea>
                </div>
                <button className="w-full py-6 bg-on-surface text-surface font-brand text-2xl uppercase tracking-widest hover:bg-primary transition-colors duration-300 flex justify-center items-center gap-4">
                  Initiate Transfer
                  <span className="material-symbols-outlined">
                    trending_flat
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>

        <section className="bg-surface-container-low py-24">
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <h2 className="font-brand text-7xl uppercase leading-none">
                  Global
                  <br />
                  Stockists
                </h2>
                <div className="velocity-bar w-24 mt-6"></div>
              </div>
              <div className="font-headline text-sm uppercase tracking-widest max-w-md text-right">
                Locate authorized StreetRiot kinetic editorial centers across
                the metropolitan landscape.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="md:col-span-2 lg:col-span-2 aspect-square relative overflow-hidden group">
                <img
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 transition-transform duration-700"
                  data-alt="monochrome top-down architectural map of a futuristic urban grid with high contrast black and white styling"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhhgi-uTZZ6abHD-FQrOxLFcgRXta0jxC40cwKbIDWhW2rcFo7NC-MPo96jPM5grI1xvkGGZH_kH1BE3-F57SBnIXNiOcpPOJWs2Xv5YM7vL2i5nAupAbe-RFsP-KVJHLhZ-YLWQFc_3ZLTqosGYj56Xnn8xfkj4oauCkVXudcUbO9GuNufu3P8RaFr4AwKKe4YI2BlACEFxOtrb9GcFsvgG-2J3bh4wyjWT3ZDwTmkE-QhqLVmqDqJfmncga_AVemDKN8MCwoChcl"
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                <div className="absolute bottom-0 left-0 p-8 bg-on-surface text-surface">
                  <h4 className="font-brand text-4xl uppercase">
                    Tokyo Flagship
                  </h4>
                  <p className="font-headline text-xs tracking-widest mt-2">
                    SHIBUYA CROSSING / DISTRICT 01
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-8 flex flex-col justify-between border-b-4 border-on-surface">
                <span className="font-headline font-bold text-xs uppercase tracking-widest text-primary">
                  EUROPE / GER
                </span>
                <div>
                  <h4 className="font-brand text-3xl uppercase mt-4">
                    Berlin Lab
                  </h4>
                  <p className="text-sm opacity-60 uppercase mt-2">
                    Torstraße 144, 10119 Mitte
                  </p>
                </div>
                <div className="mt-8">
                  <span className="material-symbols-outlined text-4xl">
                    location_on
                  </span>
                </div>
              </div>

              <div className="bg-on-surface text-surface p-8 flex flex-col justify-between border-b-4 border-primary">
                <span className="font-headline font-bold text-xs uppercase tracking-widest opacity-60">
                  USA / NY
                </span>
                <div>
                  <h4 className="font-brand text-3xl uppercase mt-4 text-surface">
                    NYC Archive
                  </h4>
                  <p className="text-sm opacity-60 uppercase mt-2">
                    32 Mercer St, New York, NY 10013
                  </p>
                </div>
                <div className="mt-8">
                  <span className="material-symbols-outlined text-4xl text-primary">
                    location_on
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-8 flex flex-col justify-between border-b-4 border-on-surface">
                <span className="font-headline font-bold text-xs uppercase tracking-widest text-primary">
                  UK / LDN
                </span>
                <div>
                  <h4 className="font-brand text-3xl uppercase mt-4">
                    London Riot
                  </h4>
                  <p className="text-sm opacity-60 uppercase mt-2">
                    15 Brewer St, Soho, W1F 0RJ
                  </p>
                </div>
                <div className="mt-8">
                  <span className="material-symbols-outlined text-4xl">
                    location_on
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-8 flex flex-col justify-between border-b-4 border-on-surface">
                <span className="font-headline font-bold text-xs uppercase tracking-widest text-primary">
                  FRA / PAR
                </span>
                <div>
                  <h4 className="font-brand text-3xl uppercase mt-4">
                    Paris Noir
                  </h4>
                  <p className="text-sm opacity-60 uppercase mt-2">
                    213 Rue Saint-Honoré, 75001
                  </p>
                </div>
                <div className="mt-8">
                  <span className="material-symbols-outlined text-4xl">
                    location_on
                  </span>
                </div>
              </div>

              <div className="lg:col-span-2 aspect-[2/1] relative overflow-hidden group">
                <img
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  data-alt="dramatic wide shot of a neon-lit modern industrial storefront at night with sharp angles and concrete textures"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFAhMDJNN0vaaw4MYvzRpXK3ikNSBJzWjAlAOgPI7au26rqqFcVI-n1r9QUqKoNaZarU0FbG_kbVa16jzlnrUDZSaeQWW774w5JwAJNRPamhhjHDr4RTQ7MJaEZY5qs4ISpts0xSTwVMv09YabpoLS_rzr5yRYNqe8zDVEtIhdJEXcd9dndzZlpmwE6ysvf76axuhcM7vVNl_9_6zoNTg5FIhy9imQaqbcd8mkXYmJEJP6liA8NV6iTJo0vxTBoJuPdY8F7L92EcJD"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface to-transparent opacity-60"></div>
                <div className="absolute bottom-8 left-8">
                  <h4 className="font-brand text-5xl text-surface uppercase">
                    Seoul Kinetic
                  </h4>
                  <p className="font-headline text-surface/80 text-xs tracking-widest mt-2">
                    GANGNAM-GU, SEOUL / HQ-2
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-on-surface py-24 px-8 text-center">
          <h2 className="font-brand text-surface text-5xl md:text-8xl uppercase mb-8">
            Join the Riot
          </h2>
          <p className="text-surface font-headline text-xs tracking-[0.2em] uppercase opacity-60 mb-12">
            Weekly editorial drops and exclusive stockist access.
          </p>
          <div className="max-w-2xl mx-auto flex flex-col md:flex-row border border-surface/20">
            <input
              className="flex-grow bg-transparent text-surface p-6 font-headline uppercase focus:ring-0 border-none outline-none placeholder:text-surface/30"
              placeholder="EMAIL ADDRESS"
              type="email"
            />
            <button className="bg-primary text-surface font-brand text-2xl px-12 py-6 uppercase hover:bg-surface hover:text-on-surface transition-colors">
              Subscribe
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
