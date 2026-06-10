// Skeleton loading placeholder — ditampilkan saat data sedang di-fetch

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`
        animate-pulse bg-slate-700/50 rounded-lg
        ${className}
      `}
    />
  );
}

// Skeleton khusus untuk NFT card
export function NFTCardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <Skeleton className="w-full aspect-square rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
}