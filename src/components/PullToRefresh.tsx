import React from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  threshold?: number;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  pullDistance,
  isRefreshing,
  threshold = 80,
}) => {
  const progress = Math.min(1, pullDistance / threshold);
  const isReady = pullDistance >= threshold;

  if (pullDistance === 0 && !isRefreshing) return null;

  return (
    <div
      className="fixed top-14 left-0 right-0 z-50 flex items-center justify-center md:hidden"
      style={{
        height: isRefreshing ? 40 : pullDistance,
        opacity: Math.min(1, progress * 1.5),
        transition: isRefreshing ? 'height 0.2s ease-out' : 'none',
      }}
    >
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-neutral-800 shadow-md border border-neutral-200 dark:border-neutral-700 ${
          isRefreshing ? 'animate-spin' : ''
        }`}
        style={{
          transform: isRefreshing ? 'none' : `rotate(${progress * 180}deg)`,
        }}
      >
        <RefreshCw
          size={16}
          className={isReady || isRefreshing ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}
        />
      </div>
    </div>
  );
};
