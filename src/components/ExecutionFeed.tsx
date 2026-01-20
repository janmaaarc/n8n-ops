import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import type { Execution } from '../types';
import { formatDistanceToNow } from '../utils/date';

interface ExecutionFeedProps {
  executions: Execution[];
  isLoading?: boolean;
  onExecutionClick?: (execution: Execution) => void;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    dotColor: 'bg-emerald-500',
    label: 'Success',
    pulse: false,
  },
  error: {
    icon: XCircle,
    classes: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    dotColor: 'bg-red-500',
    label: 'Failed',
    pulse: false,
  },
  running: {
    icon: Loader2,
    classes: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    dotColor: 'bg-blue-500',
    label: 'Running',
    pulse: true,
  },
  waiting: {
    icon: Clock,
    classes: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    dotColor: 'bg-amber-500',
    label: 'Waiting',
    pulse: false,
  },
};

const formatDuration = (startedAt: string, stoppedAt: string | null): string => {
  if (!stoppedAt) return 'Running...';
  const start = new Date(startedAt).getTime();
  const end = new Date(stoppedAt).getTime();
  const duration = end - start;

  if (duration < 1000) return `${duration}ms`;
  if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`;
  return `${Math.floor(duration / 60000)}m ${Math.round((duration % 60000) / 1000)}s`;
};

export const ExecutionFeed: React.FC<ExecutionFeedProps> = ({
  executions,
  isLoading,
  onExecutionClick,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded mb-2" />
                <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (executions.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
        <Clock size={48} className="mx-auto mb-4 opacity-50" />
        <p>No executions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {executions.map((exec, idx) => {
          const status = statusConfig[exec.status] || statusConfig.waiting;
          const Icon = status.icon;

          return (
            <motion.button
              key={exec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onExecutionClick?.(exec)}
              className="w-full text-left p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${status.classes}`}>
                    <Icon
                      size={16}
                      className={status.pulse ? 'animate-spin' : ''}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white text-sm">
                      {exec.workflowName || `Workflow ${exec.workflowId}`}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formatDistanceToNow(exec.startedAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                    {formatDuration(exec.startedAt, exec.stoppedAt)}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
