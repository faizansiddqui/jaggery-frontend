export default function Comp5() {
  return (
    <>
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
    </>
  );
}
