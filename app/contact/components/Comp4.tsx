export default function Comp4() {
  return (
    <>
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
              Locate authorized StreetRiot kinetic editorial centers across the
              metropolitan landscape.
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
    </>
  );
}
