interface CardSkeletonProps {
  count?: number;
}

export default function CardSkeleton({ count = 6 }: CardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden border border-[var(--primary)]/5 animate-pulse"
        >
          <div className="h-48 bg-[var(--primary)]/10" />
          <div className="p-6 space-y-3">
            <div className="h-4 w-20 bg-[var(--primary)]/10 rounded-full" />
            <div className="h-6 w-3/4 bg-[var(--primary)]/10 rounded" />
            <div className="h-4 w-1/3 bg-[var(--primary)]/10 rounded" />
            <div className="h-4 w-full bg-[var(--primary)]/10 rounded" />
            <div className="h-4 w-2/3 bg-[var(--primary)]/10 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
