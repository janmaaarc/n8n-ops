import React from 'react';
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
import { SpotlightCard } from './SpotlightCard';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'default' | 'success' | 'error' | 'warning';
}

const colorClasses = {
  default: 'text-neutral-400 dark:text-neutral-500',
  success: 'text-emerald-500 dark:text-emerald-400',
  error: 'text-red-500 dark:text-red-400',
  warning: 'text-amber-500 dark:text-amber-400',
};

const AnimatedCounter: React.FC<{ value: number; suffix?: string }> = ({ value, suffix }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000, bounce: 0 });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  React.useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplay(Math.round(latest * 10) / 10);
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span ref={ref}>
      {suffix === '%' ? display.toFixed(1) : Math.round(display)}
      {suffix}
    </span>
  );
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  suffix,
  icon: Icon,
  trend,
  color = 'default',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <SpotlightCard
        className="h-full rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 transition-shadow"
        spotlightColor="rgba(255, 255, 255, 0.1)"
      >
        <div className="relative z-20 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                {label}
              </p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-2 tabular-nums">
                <AnimatedCounter value={value} suffix={suffix} />
              </p>
              {trend && (
                <p className={`text-xs mt-1 ${trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
                </p>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 ${colorClasses[color]}`}>
              <Icon size={24} />
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
};
