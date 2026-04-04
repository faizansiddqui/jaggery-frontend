export default function Section8() {
  return (
    <>
      <section className="py-24 bg-surface-container-low px-8">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div>
              <span className="text-primary font-headline font-black text-xl tracking-[0.3em]">
                NEW ARRIVALS
              </span>
              <h2 className="font-brand text-7xl text-on-surface mt-2 uppercase">
                THE LATEST GEAR
              </h2>
            </div>
            <button className="border-b-2 border-on-surface font-headline font-bold text-sm tracking-widest pb-1 hover:text-primary hover:border-primary transition-all">
              VIEW ALL PRODUCTS
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group">
              <div className="relative bg-surface-container-lowest aspect-[3/4] mb-6 overflow-hidden">
                <img
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  data-alt="Minimalist black high-fashion t-shirt draped over a industrial rack against a grey wall"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX8DfFrhnkTSTmdp5bTFle_U4Dlzk-M8YCS2r7JZR7pHMtLnS7Y9P7UsROgAkzMTTEC472NqG8jKKwluQ8QX3wblrfMrmQNCboBb3JNriPMUl-fPlmTlAzIX9T60ZSo0aHJ08x1N9UPaIQrxS0cp0xTI0vv0OX8CI4qG25cgbyWagzvpHq0sFjUVJx1ceCjTeRMcfz6XL1PgjRKXaoUrc7ynAMlXl41AODGqCgmQtHYe0pZune3Zt90rcnjrqEygIChjRQcstz1-ii"
                />
                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 font-headline font-bold text-xs uppercase">
                  Sold Out
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-headline font-bold text-lg uppercase tracking-tight">
                    KINETIC BOX TEE
                  </h4>
                  <p className="text-on-surface/60 text-sm uppercase">
                    Heavyweight Cotton
                  </p>
                </div>
                <span className="font-headline font-black text-lg">$65.00</span>
              </div>
            </div>

            <div className="group">
              <div className="relative bg-surface-container-lowest aspect-[3/4] mb-6 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  data-alt="Technical windbreaker jacket in deep red with black waterproof zippers and reflective details"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbuRSg8AieJjV2TOjxpP4xzqWxbQ03bAi0yyFm_AFiPnfRKPGIJy6nKwscjs63nQ0f98W-Jy39h3P7ZD24yZHlBInNLvmcYGT7xCFkHXqYUzLnSmJx3H5Nu-YIFaWN_KCb5MhyOejdz9oa-QgJQGlSIIGIiVEMKlXTa1q40P7zsNP6tvh9nciqTzsmMbvh5f4nz9205E2xBL6SSMhB_wV0SY4pAzjedDqjh-fiWiy5sG6Xh456FRsSImeUn0jhEfyW-lk7ox9XJn-4"
                />
                <div className="absolute top-4 right-4 bg-on-surface text-surface px-3 py-1 font-headline font-bold text-xs uppercase">
                  New
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-headline font-bold text-lg uppercase tracking-tight">
                    VELOCITY WINDBREAKER
                  </h4>
                  <p className="text-on-surface/60 text-sm uppercase">
                    Water Resistant
                  </p>
                </div>
                <span className="font-headline font-black text-lg">
                  $145.00
                </span>
              </div>
            </div>

            <div className="group">
              <div className="relative bg-surface-container-lowest aspect-[3/4] mb-6 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  data-alt="Structured cargo pants in charcoal grey with multiple functional pockets and red stitching accents"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGkvzLC_1QhwInWPPSkBAn13opkOu4RUVVkPhdCvZPEQ26TcPGTmuVhgf6xe-bIwrkSHN0Ur_sRTH_x0bzLqj00Y5HlYZgMywU9Fimnjk7Z51ZD-ACaYA8yXATO5CSNf54AUzP3tIACZyaKg6uqPPQG9BoR9e3lPXEytX8RuxDD74kstr8fj-Dwo-s_Vz49XzLFfmNITWfwc7c5II9pEfNlxCv4PxduBhY2v_TrUEswrgwaiIcY6l96RHFJ-p-ddGfZa7Zhm9g1xOm"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-headline font-bold text-lg uppercase tracking-tight">
                    STREET CARGO PANT
                  </h4>
                  <p className="text-on-surface/60 text-sm uppercase">
                    Twill Fabric
                  </p>
                </div>
                <span className="font-headline font-black text-lg">
                  $110.00
                </span>
              </div>
            </div>

            <div className="group">
              <div className="relative bg-surface-container-lowest aspect-[3/4] mb-6 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  data-alt="Oversized white hoodie with dramatic black typography on the back, hanging against a clinical white background"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgJA5w_SKnp81rW7q_hlOlf-fEw85DGb0c_PiZkC00ddIaeIw8AEKh0Qo64g2_N8P2gAARErYZwJx0f_i-qSlr5n_7G4ODlB7zcfTJsGKMe589OL3Fj4u0Ho7MRnmH9Ed1tt2SDBnSPOV7u8nJfb1xF70B9B8pilPlFLnim3G11GKGnY0F_E9j8XVh4HKHEkaZJHdUx9eb908QH9gHO9oQEW72wliyrLjERj5q_IqWtnDh1na4WagC8z9-IUcC-4G3kbLbdVGSkEVp"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-headline font-bold text-lg uppercase tracking-tight">
                    EDITORIAL HOODIE
                  </h4>
                  <p className="text-on-surface/60 text-sm uppercase">
                    450GSM Fleece
                  </p>
                </div>
                <span className="font-headline font-black text-lg">$95.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
