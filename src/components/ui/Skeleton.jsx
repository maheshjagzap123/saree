// Simple shimmer skeleton placeholders for loading states.
export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-beige/60 ${className}`} />
}

// A product-card-shaped skeleton grid for shop/collection loading.
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[3/4] w-full" />
          <Skeleton className="mt-4 h-3 w-1/3" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-2 h-3 w-1/4" />
        </div>
      ))}
    </div>
  )
}
