export default function Comp5() {
  return (
    <>
      <footer className="fixed bottom-0 right-0 left-64 bg-surface-container-lowest border-t border-outline-variant/20 px-12 py-6 flex justify-between items-center z-40 shadow-[0_-12px_40px_rgba(28,27,27,0.06)]">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-bold font-label uppercase tracking-widest">
              Unsaved Changes Detected
            </span>
          </div>
          <div className="h-8 w-px bg-outline-variant/30"></div>
          <button className="flex items-center gap-2 text-on-surface/60 hover:text-on-surface transition-colors font-label text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">
              visibility
            </span>
            Live Preview
          </button>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-4 border border-outline-variant text-on-surface font-label font-bold uppercase tracking-widest hover:bg-surface-container-high transition-colors">
            Save Draft
          </button>
          <button className="px-10 py-4 bg-on-surface text-white font-label font-bold uppercase tracking-widest hover:bg-primary transition-colors flex items-center gap-3">
            Publish to Storefront
            <span className="material-symbols-outlined text-sm">
              rocket_launch
            </span>
          </button>
        </div>
      </footer>
    </>
  );
}
