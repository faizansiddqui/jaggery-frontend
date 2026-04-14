import React from "react";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-surface-container-high rounded-lg ${className}`} />
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
      {Array.from({ length: count }).map((_, i) => (
        <article key={i} className="group relative">
          <div className="relative mb-6 overflow-hidden rounded-xl bg-surface-container-high aspect-[4/5] w-full animate-pulse"></div>
          <div className="flex flex-col lg:flex-row justify-between items-start mb-2 gap-4">
            <div className="h-6 bg-surface-container-high rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-surface-container-high rounded w-16 animate-pulse"></div>
          </div>
          <div className="h-12 bg-surface-container-high rounded-full w-full mt-4 animate-pulse"></div>
        </article>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-16">
      {/* Personal Information Section Skeleton */}
      <section className="bg-surface-container-low rounded-xl p-8 md:p-12 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-12 w-40 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Shipping Addresses Section Skeleton */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
        <AddressListSkeleton />
      </section>
    </div>
  );
}

export function AddressListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-40 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="pt-24 pb-12 px-2 sm:px-4 lg:px-12 max-w-screen-2xl mx-auto space-y-24">
      {/* Header Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 items-start mt-1 lg:mt-8 w-full outline-none">
        {/* Gallery */}
        <div className="lg:col-span-7 relative">
           <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
        </div>

        {/* Content */}
        <div className="lg:col-span-5 space-y-8 px-3 sm:px-2 lg:px-4 w-full">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-full" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-20 rounded-full" />
                ))}
              </div>
            </div>
            {/* Badges */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-outline-variant/30 space-y-4">
             <div className="flex gap-4">
                <Skeleton className="h-14 w-32 rounded-full" />
                <Skeleton className="h-14 flex-1 rounded-full" />
             </div>
             <Skeleton className="h-14 w-full rounded-full" />
             <Skeleton className="h-6 w-48" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 space-y-24">
        {/* Nutrition section skeleton */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pb-8 border-b border-outline-variant/20">
          <div className="space-y-8">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-24 w-full" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
          <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
        </section>

        {/* Wellness Path placeholder */}
        <Skeleton className="h-64 w-full rounded-3xl" />

        {/* Reviews section skeleton */}
        <section className="space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-4">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-6 w-64" />
            </div>
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
          <div className="flex gap-6 overflow-hidden">
             {[1, 2].map((i) => (
               <Skeleton key={i} className="h-64 w-[400px] md:w-[700px] rounded-3xl flex-shrink-0" />
             ))}
          </div>
        </section>

        {/* Similar products skeleton */}
        <section>
          <Skeleton className="h-10 w-64 mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-12 w-full rounded-full" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export function OrderListSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-surface-container-low rounded-2xl p-6 space-y-4 border border-outline-variant/20">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <div className="flex gap-4 py-4 border-y border-outline-variant/10">
            <Skeleton className="w-20 h-20 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrderDetailSkeleton() {
  return (
    <div className="flex-1 w-full max-w-screen-2xl mx-auto flex flex-col pb-4 pt-24">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-6 gap-8">
        <div className="space-y-4 px-4 md:px-0">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-12 w-64 md:w-96" />
          <Skeleton className="h-4 w-48 md:w-80" />
        </div>
      </div>

      <Skeleton className="h-64 md:h-48 w-full rounded-xl mb-6" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 px-4 md:px-0">
        <div className="xl:col-span-2 space-y-8">
          <Skeleton className="h-10 w-64" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
