export default function Comp6() {
  return (
    <>
      <section className="mt-24 px-8">
        <div className="bg-primary text-on-primary p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="font-brand text-5xl md:text-7xl uppercase leading-none mb-4">
              The Riot Wire
            </h2>
            <p className="font-headline text-lg uppercase tracking-tight">
              Direct updates from the circuit. No noise, just speed.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <div className="flex border-b-2 border-on-primary pb-2 gap-4 w-full md:min-w-[400px]">
              <input
                className="bg-transparent border-none focus:ring-0 placeholder:text-on-primary/50 text-on-primary font-headline uppercase w-full"
                placeholder="EMAIL ADDRESS"
                type="email"
              />
              <button className="font-brand text-2xl uppercase hover:translate-x-2 transition-transform">
                JOIN
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
