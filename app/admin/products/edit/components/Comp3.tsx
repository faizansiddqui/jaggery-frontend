export default function Comp3() {
  return (
    <>
      <footer className="fixed bottom-0 left-64 w-[calc(100%-16rem)] bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.05)] border-t border-outline-variant/10 px-12 py-6 z-40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-green-600">
            <span className="material-symbols-outlined text-sm">
              check_circle
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">
              All changes synced
            </span>
          </div>
          <div className="h-4 w-[1px] bg-outline-variant/20"></div>
          <p className="text-[10px] opacity-40 uppercase tracking-widest">
            Autosaved 2m ago
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-surface-container-high transition-colors">
            Discard Changes
          </button>
          <button className="kinetic-gradient px-12 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg active:scale-95 transition-all">
            Save &amp; Update
          </button>
        </div>
      </footer>
    </>
  );
}
