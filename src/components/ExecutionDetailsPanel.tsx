import React from 'react';
import { X, CheckCircle, XCircle, Clock, Loader2, Copy, Check, ExternalLink } from 'lucide-react';
import type { Execution } from '../types';
import { getN8nUrl } from '../lib/utils';

interface ExecutionDetailsPanelProps {
  execution: Execution | null;
  onClose: () => void;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    label: 'Success',
    color: 'text-emerald-600 dark:text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  error: {
    icon: XCircle,
    label: 'Failed',
    color: 'text-red-600 dark:text-red-500',
    bg: 'bg-red-50 dark:bg-red-500/10',
  },
  running: {
    icon: Loader2,
    label: 'Running',
    color: 'text-blue-600 dark:text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  waiting: {
    icon: Clock,
    label: 'Waiting',
    color: 'text-amber-600 dark:text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
  },
};

const formatDuration = (startedAt: string, stoppedAt: string | null): string => {
  if (!stoppedAt) return 'Running...';
  const start = new Date(startedAt).getTime();
  const end = new Date(stoppedAt).getTime();
  const duration = end - start;

  if (duration < 1000) return `${duration}ms`;
  if (duration < 60000) return `${(duration / 1000).toFixed(2)}s`;
  return `${Math.floor(duration / 60000)}m ${Math.round((duration % 60000) / 1000)}s`;
};

export const ExecutionDetailsPanel: React.FC<ExecutionDetailsPanelProps> = ({
  execution,
  onClose,
}) => {
  const [copied, setCopied] = React.useState<string | null>(null);

  if (!execution) return null;

  const status = statusConfig[execution.status] || statusConfig.waiting;
  const StatusIcon = status.icon;
  const errorMessage = execution?.data?.resultData?.error?.message;
  const errorStack = execution?.data?.resultData?.error?.stack;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-[5vh] px-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded ${status.bg}`}>
              <StatusIcon
                size={16}
                className={`${status.color} ${execution.status === 'running' ? 'animate-spin' : ''}`}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                {execution.workflowName || `Workflow ${execution.workflowId}`}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {status.label} · {formatDuration(execution.startedAt, execution.stoppedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`${getN8nUrl()}/execution/${execution.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              <ExternalLink size={16} />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-0.5">
                Execution ID
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-neutral-900 dark:text-white">
                  {execution.id}
                </span>
                <button
                  onClick={() => handleCopy(execution.id.toString(), 'id')}
                  className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {copied === 'id' ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            </div>
            <div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-0.5">
                Workflow ID
              </span>
              <span className="text-sm font-mono text-neutral-900 dark:text-white">
                {execution.workflowId}
              </span>
            </div>
            <div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-0.5">
                Started
              </span>
              <span className="text-sm text-neutral-900 dark:text-white">
                {new Date(execution.startedAt).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-0.5">
                Finished
              </span>
              <span className="text-sm text-neutral-900 dark:text-white">
                {execution.stoppedAt
                  ? new Date(execution.stoppedAt).toLocaleString()
                  : 'Still running...'}
              </span>
            </div>
          </div>

          {/* Error Section */}
          {execution.status === 'error' && errorMessage && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                  Error
                </span>
                <button
                  onClick={() => handleCopy(errorStack || errorMessage, 'error')}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {copied === 'error' ? <Check size={12} /> : <Copy size={12} />}
                  {copied === 'error' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-3 rounded-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                <p className="text-sm text-red-700 dark:text-red-400 font-mono break-words">
                  {errorMessage}
                </p>
              </div>
              {errorStack && (
                <pre className="mt-2 p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono text-neutral-600 dark:text-neutral-300 overflow-x-auto whitespace-pre-wrap break-words max-h-48">
                  {errorStack}
                </pre>
              )}
            </div>
          )}

          {/* Success Message */}
          {execution.status === 'success' && (
            <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                Execution completed successfully in {formatDuration(execution.startedAt, execution.stoppedAt)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
