import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  color?: 'default' | 'success' | 'error' | 'warning';
}

const colorClasses = {
  default: 'text-neutral-500 dark:text-neutral-400',
  success: 'text-emerald-600 dark:text-emerald-500',
  error: 'text-red-600 dark:text-red-500',
  warning: 'text-amber-600 dark:text-amber-500',
};

const iconBgClasses = {
  default: 'bg-neutral-100 dark:bg-neutral-800',
  success: 'bg-emerald-50 dark:bg-emerald-500/10',
  error: 'bg-red-50 dark:bg-red-500/10',
  warning: 'bg-amber-50 dark:bg-amber-500/10',
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  suffix,
  icon: Icon,
  color = 'default',
}) => {
  const displayValue = suffix === '%' ? value.toFixed(1) : value;

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className={`p-2 rounded-md ${iconBgClasses[color]}`}>
        <Icon size={18} className={colorClasses[color]} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-neutral-900 dark:text-white tabular-nums">
          {displayValue}{suffix}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {label}
        </p>
      </div>
    </div>
  );
};
