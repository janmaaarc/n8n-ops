import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ArrowUpRight, GitBranch } from 'lucide-react';
import type { Workflow } from '../types';
import { SpotlightCard } from './SpotlightCard';

interface WorkflowListProps {
  workflows: Workflow[];
  isLoading?: boolean;
  onToggleActive?: (workflow: Workflow) => void;
}

export const WorkflowList: React.FC<WorkflowListProps> = ({
  workflows,
  isLoading,
  onToggleActive,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                <div>
                  <div className="h-5 w-40 bg-neutral-200 dark:bg-neutral-800 rounded mb-2" />
                  <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
        <GitBranch size={48} className="mx-auto mb-4 opacity-50" />
        <p>No workflows found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {workflows.map((workflow, idx) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            whileHover={{ y: -2 }}
          >
            <SpotlightCard
              className="rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 transition-shadow"
              spotlightColor="rgba(255, 255, 255, 0.1)"
            >
              <div className="relative z-20 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${
                      workflow.active
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500'
                    }`}>
                      <GitBranch size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">
                        {workflow.name}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {workflow.nodes.length} nodes
                        {workflow.tags && workflow.tags.length > 0 && (
                          <> · {workflow.tags.map(t => t.name).join(', ')}</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                      workflow.active
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        workflow.active ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'
                      }`} />
                      {workflow.active ? 'Active' : 'Inactive'}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onToggleActive?.(workflow)}
                      className={`p-2 rounded-lg transition-colors ${
                        workflow.active
                          ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20'
                      }`}
                      aria-label={workflow.active ? 'Deactivate workflow' : 'Activate workflow'}
                    >
                      {workflow.active ? <Pause size={16} /> : <Play size={16} />}
                    </motion.button>

                    <motion.a
                      whileTap={{ scale: 0.9 }}
                      href={`${import.meta.env.VITE_N8N_URL}/workflow/${workflow.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 transition-colors"
                      aria-label="Open in n8n"
                    >
                      <ArrowUpRight size={16} />
                    </motion.a>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
