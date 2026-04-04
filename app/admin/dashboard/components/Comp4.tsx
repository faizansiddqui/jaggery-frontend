export default function Comp4() {
  return (
    <>
      <footer className="p-8 border-t border-outline-variant/10 bg-surface-container-low flex justify-between items-center mt-auto">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
          StreetRiot CMS Engine v4.82 // 2024
        </p>
        <div className="flex gap-8">
          <a
            className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors"
            href="/"
          >
            Documentation
          </a>
          <a
            className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors"
            href="/"
          >
            System Log
          </a>
          <a
            className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors"
            href="/"
          >
            Status
          </a>
        </div>
      </footer>
    </>
  );
}
