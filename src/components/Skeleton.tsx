import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded ${className}`} />
);

export const SkeletonText: React.FC<{ width?: string }> = ({ width = 'w-24' }) => (
  <Skeleton className={`h-4 ${width}`} />
);

export const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

export const SkeletonTableRow: React.FC<{ cols?: number }> = ({ cols = 5 }) => (
  <tr className="border-b border-neutral-200 dark:border-neutral-800">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className={`h-4 ${i === 0 ? 'w-8' : i === 1 ? 'w-40' : 'w-20'}`} />
      </td>
    ))}
  </tr>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 5 }) => (
  <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
    <table className="w-full">
      <thead>
        <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i} className="px-4 py-3 text-left">
              <Skeleton className="h-3 w-16" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonTableRow key={i} cols={cols} />
        ))}
      </tbody>
    </table>
  </div>
);

export const SkeletonStatCard: React.FC = () => (
  <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
    <div className="flex items-center gap-2 mb-2">
      <Skeleton className="w-4 h-4 rounded" />
      <Skeleton className="h-3 w-20" />
    </div>
    <Skeleton className="h-8 w-16" />
  </div>
);

export const SkeletonList: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="px-4 py-3 flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-8 h-8 rounded" />
          <Skeleton className="w-8 h-8 rounded" />
        </div>
      </div>
    ))}
  </div>
);
