export default function Section6() {
  return (
    <>
      <section className="py-24 px-8 max-w-[1920px] mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-brand text-6xl md:text-8xl text-on-surface leading-none uppercase">
            Categories
          </h2>
          <div className="h-1 bg-primary w-24 mb-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          <div className="relative aspect-[4/5] overflow-hidden group">
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              data-alt="High fashion streetwear jacket in tech-noir style with red neon lighting accents and technical materials"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv1glo75vkPxEhUat0h7SdJldMst5XosXUGorZb-l4Ptfl2Xn_5mZ79d7cfxJ5AgMx799JopAS_VzpiihrAYcZ0jIs-xV3L7nqZHQ-YbQkggC9SV9gW9PvYRcg0fuFbl91QVc6tCjOGumnkz2aiPP-0XU6GxlLaO1M8mvW_O8reVP_LUiapELg_za8CoUHhJgBfEtjTsdGzryOVlKDtW1EkTa3SRTI81TAc8IxF1WoBCbWHGiYVWur5pHfrFJOFcPWHa1yxt_DY75D"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute bottom-8 left-8">
              <h3 className="font-brand text-5xl text-white mb-4">OUTERWEAR</h3>
              <a
                className="text-white font-headline font-bold text-sm tracking-widest underline decoration-primary decoration-4 underline-offset-8"
                href="/"
              >
                EXPLORE
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden group">
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              data-alt="Close up of black high-quality heavyweight cotton hoodie with red minimalist logo branding"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDML_iIkNNvIkuDRtf-2vr_dBQGf5Xzzv1G_kjfFCrY1S0YAsCR7FFTC2Zg0-Ux8R32R4KHFLfv3dXTtjs5fkGVpir2is-qlus3l-MGvWmOfhkiscUYR6IlNfbP_kdtWDhzxQM2NCAlQVjDp1Wlg0qI7l7hBYQIeH4MiqZ-cGQZc1ldFbwnYigrkqq1pb3faISABLff0s3EMAKQx150tri37ZjoxRfGi0VLY1e8vDp4oIhMmWKmk_tCr9r4WnB9IHrfBz-jt8TCV-0W"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute bottom-8 left-8">
              <h3 className="font-brand text-5xl text-white mb-4">BASICS</h3>
              <a
                className="text-white font-headline font-bold text-sm tracking-widest underline decoration-primary decoration-4 underline-offset-8"
                href="/"
              >
                EXPLORE
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden group">
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              data-alt="Streetwear accessories including a black tactical bag and red technical straps laid on a metal grate"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTK-RzVsMLFgWSMLzRJ6CsqbF-ZbHVk4-r87PUS9QrtHAEjbOste56c0Hh59uwTHi1Q5PwgCIbZZN3o67Lg6B7qhkH0PMhKw6w7aTS3xredq1LUcwDkHVvlMZhE2tP-WT6q3wb70jyof3SXS9UQ7S_utVOjFKonBEkg6sIKGxoMxxJQxO7uV4i5eieZ49e3pK-PciMEcFI2CcuMGU8ZWEjA4m2rJQUR7shVYpWqDhlCq2O3B-WMsOdKEDKtdeFnC4NTDadf2VF4AMH"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute bottom-8 left-8">
              <h3 className="font-brand text-5xl text-white mb-4">
                ACCESSORIES
              </h3>
              <a
                className="text-white font-headline font-bold text-sm tracking-widest underline decoration-primary decoration-4 underline-offset-8"
                href="/"
              >
                EXPLORE
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
