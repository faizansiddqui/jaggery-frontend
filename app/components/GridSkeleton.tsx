interface GridSkeletonProps {
    count?: number;
    cardClassName?: string;
}

export default function GridSkeleton({ count = 6, cardClassName = '' }: GridSkeletonProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: count }).map((_, idx) => (
                <div key={idx} className={`border border-[#1c1b1b]/10 bg-[#f6f3f2] p-4 ${cardClassName}`}>
                    <div className="aspect-[4/5] bg-[#e9e4e4] mb-4" />
                    <div className="h-4 bg-[#e9e4e4] mb-2" />
                    <div className="h-4 w-2/3 bg-[#e9e4e4] mb-4" />
                    <div className="h-10 bg-[#e9e4e4]" />
                </div>
            ))}
        </div>
    );
}
