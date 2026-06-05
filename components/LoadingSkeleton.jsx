'use client'

export default function LoadingSkeleton({ locationName }) {
  return (
    <div className="animate-fade-up space-y-4">
      <div className="glass-card overflow-hidden p-7">
        <div className="flex justify-between">
          <div className="space-y-3">
            <div className="skeleton-shimmer h-3 w-24 rounded-full" />
            <div className="skeleton-shimmer h-10 w-48 rounded-xl" />
            <div className="skeleton-shimmer h-4 w-32 rounded-full" />
          </div>
          <div className="skeleton-shimmer h-28 w-28 rounded-full" />
        </div>
        <div className="mt-8 skeleton-shimmer h-20 w-40 rounded-2xl" />
        <div className="mt-6 grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-shimmer mx-auto h-16 w-14 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="glass-card-light p-5">
        <div className="skeleton-shimmer mb-4 h-3 w-28 rounded-full" />
        <div className="flex gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-24 w-14 shrink-0 rounded-2xl" />
          ))}
        </div>
      </div>
      {locationName && (
        <p className="text-center text-xs uppercase tracking-[0.25em] text-sky-300/40">
          Loading {locationName}…
        </p>
      )}
    </div>
  )
}
