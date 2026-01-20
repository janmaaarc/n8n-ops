import React from 'react';
import { X, AlertCircle, Copy, Check } from 'lucide-react';
import type { Execution } from '../types';

interface ErrorPanelProps {
  execution: Execution | null;
  onClose: () => void;
}

export const ErrorPanel: React.FC<ErrorPanelProps> = ({ execution, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!execution) return null;

  const errorMessage = execution?.data?.resultData?.error?.message || 'Unknown error';
  const errorStack = execution?.data?.resultData?.error?.stack;

  const handleCopy = () => {
    const text = errorStack || errorMessage;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-[10vh] px-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-xl bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600 dark:text-red-500" />
            <div>
              <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                Execution Failed
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {execution.workflowName || `Workflow ${execution.workflowId}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {/* Error Message */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                Error
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-3 rounded-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <p className="text-sm text-red-700 dark:text-red-400 font-mono break-words">
                {errorMessage}
              </p>
            </div>
          </div>

          {/* Stack Trace */}
          {errorStack && (
            <div>
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2 block">
                Stack Trace
              </span>
              <pre className="p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono text-neutral-600 dark:text-neutral-300 overflow-x-auto whitespace-pre-wrap break-words">
                {errorStack}
              </pre>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-0.5">
                Execution ID
              </span>
              <span className="text-sm font-mono text-neutral-900 dark:text-white">
                {execution.id}
              </span>
            </div>
            <div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-0.5">
                Started At
              </span>
              <span className="text-sm text-neutral-900 dark:text-white">
                {new Date(execution.startedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
