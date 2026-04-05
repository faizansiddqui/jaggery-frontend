import type { SortKey, SortOption } from './types';

type MobileCatalogControlsProps = {
    isMobileSortOpen: boolean;
    setIsMobileSortOpen: (open: boolean) => void;
    openMobileFilterPanel: () => void;
    sortBy: SortKey;
    setSortBy: (sort: SortKey) => void;
    sortOptions: SortOption[];
};

export default function MobileCatalogControls({
    isMobileSortOpen,
    setIsMobileSortOpen,
    openMobileFilterPanel,
    sortBy,
    setSortBy,
    sortOptions,
}: MobileCatalogControlsProps) {
    return (
        <div className="md:hidden mb-5 relative z-[70]">
            <div className="flex items-center gap-3">
                <button
                    onClick={openMobileFilterPanel}
                    className="flex-1 h-11 border border-on-surface/20 bg-white text-xs font-bold tracking-[0.16em] uppercase flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-base">tune</span>
                    Filter
                </button>

                <button
                    onClick={() => setIsMobileSortOpen(!isMobileSortOpen)}
                    className="flex-1 h-11 border border-on-surface/20 bg-white text-xs font-bold tracking-[0.16em] uppercase flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-base">swap_vert</span>
                    Sort
                </button>
            </div>

            <div
                className={`absolute right-0 top-14 z-[75] w-full max-h-[70vh] overflow-y-auto bg-white border border-on-surface/10 shadow-2xl origin-top transition-all duration-300 ${isMobileSortOpen
                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                    : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                    }`}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-on-surface/10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-on-surface/55">
                        SORT BY
                    </span>
                    <button
                        onClick={() => setIsMobileSortOpen(false)}
                        className="material-symbols-outlined text-on-surface/60 hover:text-primary transition-colors"
                        aria-label="Close sort options"
                    >
                        close
                    </button>
                </div>

                {sortOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => {
                            setSortBy(option.value);
                            setIsMobileSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold tracking-[0.14em] uppercase transition-colors ${sortBy === option.value ? 'bg-primary text-white' : 'hover:bg-surface-container-high text-on-surface'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
