import React from 'react';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WorkflowHealthScoreProps {
  successRate: number;
  executionCount: number;
  recentTrend?: 'up' | 'down' | 'stable';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const getHealthColor = (score: number): { bg: string; text: string; dot: string } => {
  if (score >= 95) return { bg: 'bg-green-100 dark:bg-green-500/20', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' };
  if (score >= 80) return { bg: 'bg-lime-100 dark:bg-lime-500/20', text: 'text-lime-700 dark:text-lime-400', dot: 'bg-lime-500' };
  if (score >= 60) return { bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' };
  if (score >= 40) return { bg: 'bg-orange-100 dark:bg-orange-500/20', text: 'text-orange-700 dark:text-orange-400', dot: 'bg-orange-500' };
  return { bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' };
};

const getHealthLabel = (score: number): string => {
  if (score >= 95) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Critical';
};

const TrendIcon: React.FC<{ trend?: 'up' | 'down' | 'stable'; size: number }> = ({ trend, size }) => {
  if (!trend) return null;
  switch (trend) {
    case 'up':
      return <TrendingUp size={size} className="text-green-500" />;
    case 'down':
      return <TrendingDown size={size} className="text-red-500" />;
    case 'stable':
      return <Minus size={size} className="text-neutral-400" />;
  }
};

export const WorkflowHealthScore: React.FC<WorkflowHealthScoreProps> = ({
  successRate,
  executionCount,
  recentTrend,
  showLabel = true,
  size = 'md',
}) => {
  const colors = getHealthColor(successRate);
  const label = getHealthLabel(successRate);

  const sizeClasses = {
    sm: { padding: 'px-1.5 py-0.5', text: 'text-xs', icon: 10, gap: 'gap-1' },
    md: { padding: 'px-2 py-1', text: 'text-xs', icon: 12, gap: 'gap-1.5' },
    lg: { padding: 'px-2.5 py-1.5', text: 'text-sm', icon: 14, gap: 'gap-2' },
  };

  const styles = sizeClasses[size];

  if (executionCount === 0) {
    return (
      <span className={`inline-flex items-center ${styles.gap} ${styles.padding} rounded-full bg-neutral-100 dark:bg-neutral-800 ${styles.text} text-neutral-500 dark:text-neutral-400`}>
        <Activity size={styles.icon} />
        No data
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center ${styles.gap} ${styles.padding} rounded-full ${colors.bg} ${colors.text} ${styles.text} font-medium`}
      title={`Health: ${label} (${successRate.toFixed(0)}% success rate from ${executionCount} executions)`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {showLabel ? label : `${successRate.toFixed(0)}%`}
      <TrendIcon trend={recentTrend} size={styles.icon} />
    </span>
  );
};

// Calculate health score from executions
interface HealthCalculation {
  successRate: number;
  executionCount: number;
  recentTrend: 'up' | 'down' | 'stable';
}

export const calculateWorkflowHealth = (
  executions: { status: string; startedAt: string }[],
  workflowId: string
): HealthCalculation => {
  const workflowExecutions = executions.filter(e =>
    'workflowId' in e && (e as { workflowId: string }).workflowId === workflowId
  );

  if (workflowExecutions.length === 0) {
    return { successRate: 0, executionCount: 0, recentTrend: 'stable' };
  }

  const sorted = [...workflowExecutions].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );

  const totalSuccess = sorted.filter(e => e.status === 'success').length;
  const successRate = (totalSuccess / sorted.length) * 100;

  // Calculate trend from recent vs older executions
  const halfPoint = Math.ceil(sorted.length / 2);
  const recentExecutions = sorted.slice(0, halfPoint);
  const olderExecutions = sorted.slice(halfPoint);

  if (olderExecutions.length === 0) {
    return { successRate, executionCount: sorted.length, recentTrend: 'stable' };
  }

  const recentSuccessRate = (recentExecutions.filter(e => e.status === 'success').length / recentExecutions.length) * 100;
  const olderSuccessRate = (olderExecutions.filter(e => e.status === 'success').length / olderExecutions.length) * 100;

  let recentTrend: 'up' | 'down' | 'stable' = 'stable';
  const trendThreshold = 5; // 5% difference threshold

  if (recentSuccessRate > olderSuccessRate + trendThreshold) {
    recentTrend = 'up';
  } else if (recentSuccessRate < olderSuccessRate - trendThreshold) {
    recentTrend = 'down';
  }

  return { successRate, executionCount: sorted.length, recentTrend };
};
