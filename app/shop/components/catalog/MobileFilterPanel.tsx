import type { ComponentProps } from 'react';
import CatalogFilters from './CatalogFilters';

type MobileFilterPanelProps = {
    isOpen: boolean;
    closePanel: () => void;
    filters: ComponentProps<typeof CatalogFilters>;
};

export default function MobileFilterPanel({ isOpen, closePanel, filters }: MobileFilterPanelProps) {
    return (
        <div
            className={`fixed inset-0 z-[80] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
        >
            <button
                aria-label="Close filter panel"
                className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
                onClick={closePanel}
            />

            <aside
                className={`absolute top-0 right-0 h-full w-[86%] max-w-[360px] bg-white shadow-2xl p-6 overflow-y-auto transition-transform duration-400 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between mb-8 border-b border-on-surface/10 pb-4">
                    <h2 className="bebas text-2xl tracking-[0.16em]">FILTERS</h2>
                    <button
                        onClick={closePanel}
                        className="material-symbols-outlined text-on-surface/70 hover:text-primary transition-colors"
                    >
                        close
                    </button>
                </div>

                <CatalogFilters {...filters} />
            </aside>
        </div>
    );
}
