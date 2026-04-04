export default function Comp2() {
  return (
    <>
      <main className="pt-20 pb-32 min-h-screen">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
          <section className="w-full md:w-3/5 p-6 md:p-16 bg-surface">
            <div className="max-w-xl mx-auto md:ml-0">
              <header className="mb-12">
                <div className="w-12 h-1 bg-primary mb-6"></div>
                <h1 className="font-impact text-6xl tracking-[0.05em] uppercase leading-none mb-2">
                  Checkout
                </h1>
                <p className="font-technical text-on-secondary-container tracking-wider uppercase text-sm">
                  Step 02 / Shipping Information
                </p>
              </header>
              <form className="space-y-10">
                <div className="space-y-8">
                  <div className="relative group">
                    <label className="block font-technical text-[10px] font-bold uppercase tracking-widest text-on-surface mb-2">
                      Full Name
                    </label>
                    <input
                      className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant focus:ring-0 focus:border-primary placeholder:text-surface-container-high transition-all duration-300 py-3 uppercase font-headline"
                      placeholder="ENTER YOUR NAME"
                      type="text"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative group">
                      <label className="block font-technical text-[10px] font-bold uppercase tracking-widest text-on-surface mb-2">
                        Email Address
                      </label>
                      <input
                        className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant focus:ring-0 focus:border-primary placeholder:text-surface-container-high transition-all duration-300 py-3 uppercase font-headline"
                        placeholder="EMAIL@STREETRIOT.COM"
                        type="email"
                      />
                    </div>
                    <div className="relative group">
                      <label className="block font-technical text-[10px] font-bold uppercase tracking-widest text-on-surface mb-2">
                        Phone
                      </label>
                      <input
                        className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant focus:ring-0 focus:border-primary placeholder:text-surface-container-high transition-all duration-300 py-3 uppercase font-headline"
                        placeholder="+00 000 000 0000"
                        type="tel"
                      />
                    </div>
                  </div>
                  <div className="relative group">
                    <label className="block font-technical text-[10px] font-bold uppercase tracking-widest text-on-surface mb-2">
                      Shipping Address
                    </label>
                    <input
                      className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant focus:ring-0 focus:border-primary placeholder:text-surface-container-high transition-all duration-300 py-3 uppercase font-headline"
                      placeholder="STREET NAME, BUILDING, APARTMENT"
                      type="text"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="relative group">
                      <label className="block font-technical text-[10px] font-bold uppercase tracking-widest text-on-surface mb-2">
                        City
                      </label>
                      <input
                        className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant focus:ring-0 focus:border-primary placeholder:text-surface-container-high transition-all duration-300 py-3 uppercase font-headline"
                        placeholder="CITY"
                        type="text"
                      />
                    </div>
                    <div className="relative group">
                      <label className="block font-technical text-[10px] font-bold uppercase tracking-widest text-on-surface mb-2">
                        Pincode
                      </label>
                      <input
                        className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant focus:ring-0 focus:border-primary placeholder:text-surface-container-high transition-all duration-300 py-3 uppercase font-headline"
                        placeholder="000 000"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-8">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      className="w-5 h-5 border-2 border-on-surface rounded-none checked:bg-primary checked:border-primary focus:ring-0 transition-colors"
                      type="checkbox"
                    />
                    <span className="font-technical text-[10px] font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
                      Save information for faster checkout
                    </span>
                  </label>
                </div>
              </form>
            </div>
          </section>

          <section className="w-full md:w-2/5 bg-surface-container-low p-6 md:p-16 border-l border-outline-variant/10">
            <div className="sticky top-32">
              <h2 className="font-impact text-4xl tracking-wider uppercase mb-12">
                Your Order
              </h2>

              <div className="space-y-8 mb-12 max-h-[409px] overflow-y-auto pr-4 custom-scrollbar">
                <div className="flex gap-6 group">
                  <div className="w-24 h-32 bg-surface-container-lowest shrink-0 overflow-hidden">
                    <img
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      data-alt="Close up of high-end oversized black streetwear hoodie with premium heavy cotton texture and minimal branding on plain background"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzcelEOOgzKiys2XZdVvrEE_D_Y3A8ZmzX_h_0MAqhBqnrVsPvCadLhzQZWKAJWkNtHeilXRsCDrDw3cw9LJ917ZR-RSbH4MVGeDCs4dFsVZDGKFMb887BOBDdyaoJ5L-Zxat4Lak0leHPZa2LplcpB3JtvOncjTa2hDEaRoNBEelgWtg2m4u7Aki8OVeURLMD3OEA7K1o0YNc-SnFnkWzIXmjy2-iKmfke6xAcyD5k4eFd-aHuN3viZhieKEFRbUyFfR2dCo3FCyK"
                    />
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-headline font-bold uppercase tracking-tight text-lg leading-none mb-1">
                        Gravity Oversized Hoodie
                      </h3>
                      <p className="font-technical text-[10px] tracking-widest text-secondary uppercase">
                        Size: XL / Color: Onyx
                      </p>
                    </div>
                    <div className="font-headline font-black text-xl">
                      $185.00
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="w-24 h-32 bg-surface-container-lowest shrink-0 overflow-hidden">
                    <img
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      data-alt="High contrast shot of technical cargo pants with multiple utility pockets and tactical straps against a clinical white studio background"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfwMLp2F8fDu6nnZEVt6atNTxvCURSDjdkxZ3r-wSiZZAuyxgvxn8ARtM9s3df8-V5XiG4qoldxgSsy_wFuQA2FwCmAt8HnoMsp1rkeIbTfUtTYZS1MF-TdVV20hKMxlB8r49wTedLT3iSt3F-kVp2Qee_-e1D3bOiS8J2lSbU9HkZZLHtLIh0koo2tw9nPkbJ5gvNUGQ-yDjviOX68hmNlEUyySllVw5UhUbn0HNNednY-DIWT2yAnoUSlyt3R6BtFpeT1hIL8bna"
                    />
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-headline font-bold uppercase tracking-tight text-lg leading-none mb-1">
                        Apex Cargo Pants
                      </h3>
                      <p className="font-technical text-[10px] tracking-widest text-secondary uppercase">
                        Size: 34 / Color: Slate
                      </p>
                    </div>
                    <div className="font-headline font-black text-xl">
                      $210.00
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-outline-variant/20 mb-12">
                <div className="flex justify-between items-center">
                  <span className="font-technical text-[10px] font-bold uppercase tracking-widest text-secondary">
                    Subtotal
                  </span>
                  <span className="font-headline font-bold">$395.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-technical text-[10px] font-bold uppercase tracking-widest text-secondary">
                    Shipping
                  </span>
                  <span className="font-technical text-[10px] font-bold uppercase tracking-widest text-primary">
                    Calculated at next step
                  </span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="font-technical text-[10px] font-bold uppercase tracking-widest text-primary">
                    Discount (RIOT20)
                  </span>
                  <span className="font-headline font-bold text-primary">
                    -$40.00
                  </span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t-2 border-on-surface">
                  <span className="font-impact text-2xl uppercase tracking-widest">
                    Total
                  </span>
                  <span className="font-headline font-black text-3xl">
                    $355.00
                  </span>
                </div>
              </div>

              <button className="w-full bg-on-surface text-surface py-6 px-8 font-impact text-2xl uppercase tracking-widest hover:bg-primary transition-colors duration-300 active:scale-[0.98] flex items-center justify-between group">
                <span>Complete Purchase</span>
                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
                  arrow_forward
                </span>
              </button>
              <p className="mt-6 text-center font-technical text-[9px] uppercase tracking-[0.2em] text-secondary">
                Secured by StreetRiot Encrypted Payment Systems
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
