export default function Comp1() {
  return (
    <>
      <section className="w-full md:w-1/2 flex flex-col justify-between p-8 md:p-16 bg-surface z-10">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold tracking-tighter uppercase font-['Bebas_Neue'] text-[#1c1b1b]">
            StreetRiot
          </h1>
          <a
            className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-primary border-b border-primary pb-1"
            href="/"
          >
            Back to Shop
          </a>
        </div>

        <div className="max-w-md w-full mx-auto md:mx-0">
          <div className="mb-10">
            <h2 className="font-['Bebas_Neue'] text-6xl md:text-8xl leading-none uppercase mb-2 tracking-tight">
              Access
              <br />
              Kinetic
            </h2>
            <div className="velocity-bar w-24 mb-6"></div>
            <p className="font-['Space_Grotesk'] text-sm uppercase tracking-wider opacity-70">
              Enter the editorial ecosystem.
            </p>
          </div>
          <form className="space-y-8">
            <div className="relative group">
              <label className="block font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                Electronic Mail
              </label>
              <input
                className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 focus:border-primary transition-all font-['Space_Grotesk'] uppercase placeholder:opacity-30"
                placeholder="USER@STREETRIOT.COM"
                type="email"
              />
            </div>
            <div className="relative group">
              <label className="block font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                Secret Key
              </label>
              <input
                className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 focus:border-primary transition-all font-['Space_Grotesk'] uppercase"
                placeholder="••••••••••••"
                type="password"
              />
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <input
                  className="w-4 h-4 border-outline-variant rounded-none text-primary focus:ring-primary"
                  id="remember"
                  type="checkbox"
                />
                <label
                  className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest cursor-pointer"
                  htmlFor="remember"
                >
                  Stay Active
                </label>
              </div>
              <a
                className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest hover:text-primary transition-colors"
                href="/"
              >
                Recover Password
              </a>
            </div>
            <div className="pt-6 space-y-4">
              <button
                className="w-full bg-on-surface text-surface py-5 px-8 font-['Space_Grotesk'] font-bold uppercase tracking-[0.2em] text-sm hover:bg-primary transition-colors duration-300 flex justify-between items-center"
                type="submit"
              >
                <span>Authorize Access</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button
                className="w-full border border-outline-variant/20 py-5 px-8 font-['Space_Grotesk'] font-bold uppercase tracking-[0.2em] text-sm hover:bg-surface-container-high transition-colors duration-300 flex justify-center items-center gap-3"
                type="button"
              >
                <span className="material-symbols-outlined">shield</span>
                <span>Sign in with Global ID</span>
              </button>
            </div>
          </form>
          <div className="mt-12 pt-8 border-t border-outline-variant/10">
            <p className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-on-surface-variant">
              No Credentials?
              <a
                className="text-primary font-bold ml-2 underline decoration-2 underline-offset-4"
                href="/"
              >
                Create Riot Profile
              </a>
            </p>
          </div>
        </div>

        <footer className="mt-12">
          <p className="font-['Space_Grotesk'] text-[9px] uppercase tracking-[0.3em] opacity-40">
            ©2024 STREETRIOT KINETIC EDITORIAL. ALL RIGHTS RESERVED.
          </p>
        </footer>
      </section>
    </>
  );
}
