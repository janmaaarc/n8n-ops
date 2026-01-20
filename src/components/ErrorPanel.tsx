import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Copy, Check } from 'lucide-react';
import type { Execution } from '../types';

interface ErrorPanelProps {
  execution: Execution | null;
  onClose: () => void;
}

export const ErrorPanel: React.FC<ErrorPanelProps> = ({ execution, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const errorMessage = execution?.data?.resultData?.error?.message || 'Unknown error';
  const errorStack = execution?.data?.resultData?.error?.stack;

  const handleCopy = () => {
    const text = errorStack || errorMessage;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {execution && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl z-50 overflow-hidden border border-neutral-200 dark:border-neutral-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">
                    Execution Failed
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {execution.workflowName || `Workflow ${execution.workflowId}`}
                  </p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Error Message */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Error Message
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </motion.button>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                    <p className="text-sm text-red-700 dark:text-red-400 font-mono">
                      {errorMessage}
                    </p>
                  </div>
                </div>

                {/* Stack Trace */}
                {errorStack && (
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 block">
                      Stack Trace
                    </span>
                    <pre className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono text-neutral-700 dark:text-neutral-300 overflow-x-auto">
                      {errorStack}
                    </pre>
                  </div>
                )}

                {/* Execution Details */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-1">
                      Execution ID
                    </span>
                    <span className="text-sm font-mono text-neutral-900 dark:text-white">
                      {execution.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-1">
                      Started At
                    </span>
                    <span className="text-sm text-neutral-900 dark:text-white">
                      {new Date(execution.startedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
