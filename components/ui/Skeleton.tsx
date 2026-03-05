'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton', className)} />;
}

export function StationCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/50 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-8 flex-1 rounded-xl" />
        <Skeleton className="h-8 flex-1 rounded-xl" />
      </div>
    </div>
  );
}

export function MapSkeleton({ height = '500px' }: { height?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/50 overflow-hidden" style={{ height }}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-3" />
          <p className="text-white/40 text-sm">Loading map...</p>
        </div>
      </div>
    </div>
  );
}

export function SessionSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/50 p-5 space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/50 p-5 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}
