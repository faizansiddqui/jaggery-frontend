export default function Comp7() {
  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-[1920px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
          <div className="lg:col-span-7 relative min-h-[400px] md:h-[600px] bg-on-surface overflow-hidden">
            <img
              className="w-full h-full object-cover opacity-80 mix-blend-multiply"
              data-alt="Extreme close up of premium leather textures on a high-top sneaker with red contrasting elements and industrial finishes"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqeLXTwcGZGzItP7px5m8JgReimIIObESC96EX2qxlE2AHleaeFBm0QjNqpXl914-gjaXj6YFO_v1s__Er6vKzQZwo60GNd9ErssKpZAI5nDHMXECfi27_A5Oe_aNHxBSnKRCWuI38CR2JkOvpLTok0Lvus4yeLvYkiWqBqvleeeSbG_fZjg1v8cuf18Gd2gu-SXtenyB2Kmi93VCpjR1x__ARf5QDNDt7C7pk7dfNyFvcjgjlcuhbBJy19NK4DDd5iDnD_vYOaoLu"
            />
            <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end">
              <h2 className="font-brand text-5xl sm:text-7xl md:text-8xl text-surface leading-none mb-4 md:mb-6">
                LIMITLESS
                <br />
                EVOLUTION
              </h2>
              <p className="text-surface font-body max-w-sm md:max-w-md text-sm md:text-lg mb-6 md:mb-8 uppercase tracking-widest leading-tight">
                A numbered collection of 100 units. Precision engineered for the
                urban athlete. No restocks.
              </p>
              <button className="w-fit bg-primary text-surface px-8 md:px-12 py-4 md:py-5 font-headline font-bold uppercase tracking-widest hover:bg-surface hover:text-on-surface transition-all active:scale-95">
                Secure Access
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-surface-container-high p-12 flex-1 flex flex-col justify-between">
              <div>
                <span className="font-headline font-black text-primary tracking-[0.4em] mb-4 block">
                  DROP LOG 093
                </span>
                <h3 className="font-brand text-5xl text-on-surface uppercase mb-6 leading-none">
                  The Apex Predator Capsule
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-headline text-8xl font-black text-on-surface opacity-10">
                  01/05
                </span>
                <span className="material-symbols-outlined text-4xl text-primary">
                  arrow_forward
                </span>
              </div>
            </div>
            <div className="h-64 relative overflow-hidden group">
              <img
                className="w-full h-full object-cover"
                data-alt="Dynamic shot of a model running through a blurred urban cityscape at night, wearing reflective streetwear gear"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrFUFVDIvtvkK7Bv9bQzilu7Rd_qbvTikFYW8P82OPVXWt9tuq58Kv7lOqQeqr90s0_z4gaDOT6w3sUx1Mxt56ofPwcmr3-5bTIdHe1xsWXy3gUV9LyMjToOrKBihmB-wBSmgbi3bC1W7yBWcNQ5jwkJsY69Fn7TbC4Z2Hj8rPCv7EKjezqpKj6WmNRQqsabk46Dj8aLq-YJfIY65Gmmb0ufCiPaoOhqA7ayHyuZg5W2XaRFM4oXlgyg9XTj1gxeMgZLEPbTX3RvQE"
              />
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
