type CatalogFiltersProps = {
    categories: string[];
    categoryLocked: boolean;
    productCountByCategory: Record<string, number>;
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    availableSizes: string[];
    selectedSizes: string[];
    toggleSize: (size: string) => void;
    maxPrice: number;
    selectedMaxPrice: number;
    setSelectedMaxPrice: (value: number) => void;
    currency: string;
    clearFilters: () => void;
    applyFilters: () => void;
    hasPendingFilterChanges: boolean;
};

export default function CatalogFilters({
    categories,
    categoryLocked,
    productCountByCategory,
    activeCategory,
    setActiveCategory,
    availableSizes,
    selectedSizes,
    toggleSize,
    maxPrice,
    selectedMaxPrice,
    setSelectedMaxPrice,
    currency,
    clearFilters,
    applyFilters,
    hasPendingFilterChanges,
}: CatalogFiltersProps) {
    return (
        <div className="space-y-10">
            {!categoryLocked && (
                <section>
                    <h3 className="bebas text-xl tracking-widest mb-6 border-l-4 border-primary pl-3">
                        CATEGORY
                    </h3>
                    <ul className="space-y-3 text-sm font-medium">
                        {categories.map((category) => {
                            const selected = category === activeCategory;
                            const count = productCountByCategory[category] || 0;

                            return (
                                <li key={category}>
                                    <button
                                        onClick={() => setActiveCategory(category)}
                                        className={`w-full flex justify-between items-center group transition-colors ${selected ? 'text-primary' : 'hover:text-primary'
                                            }`}
                                    >
                                        <span>{category.toUpperCase()}</span>
                                        <span
                                            className={`text-[10px] ${selected ? 'text-primary' : 'text-on-surface/40 group-hover:text-primary'
                                                }`}
                                        >
                                            {String(count).padStart(2, '0')}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            )}

            <section>
                <h3 className="bebas text-xl tracking-widest mb-6 border-l-4 border-primary pl-3">SIZE</h3>
                <div className="grid grid-cols-4 gap-2">
                    {availableSizes.map((size) => {
                        const selected = selectedSizes.includes(size);

                        return (
                            <button
                                key={size}
                                onClick={() => toggleSize(size)}
                                className={`h-10 text-xs font-bold transition-all border ${selected
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-on-surface/10 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>
            </section>

            <section>
                <h3 className="bebas text-xl tracking-widest mb-6 border-l-4 border-primary pl-3">PRICE</h3>
                <div className="space-y-4">
                    <input
                        className="w-full accent-primary bg-surface-container-high h-1 appearance-none cursor-pointer"
                        type="range"
                        min={0}
                        max={maxPrice || 1}
                        value={selectedMaxPrice}
                        onChange={(event) => setSelectedMaxPrice(Number(event.target.value))}
                    />
                    <div className="flex justify-between text-xs font-bold">
                        <span>
                            {currency}
                            0
                        </span>
                        <span className="text-primary">
                            {currency}
                            {selectedMaxPrice || maxPrice}
                        </span>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={clearFilters}
                    className="w-full border border-on-surface/20 py-4 bebas text-lg tracking-widest hover:border-primary hover:text-primary transition-colors"
                >
                    CLEAR FILTERS
                </button>
                <button
                    onClick={applyFilters}
                    disabled={!hasPendingFilterChanges}
                    className="w-full bg-on-surface text-white py-4 bebas text-lg tracking-widest hover:bg-primary transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
                >
                    APPLY FILTERS
                </button>
            </div>
        </div>
    );
}
