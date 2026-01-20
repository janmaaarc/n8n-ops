import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Play, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { StatCard } from './components/StatCard';
import { Section } from './components/Section';
import { ExecutionFeed } from './components/ExecutionFeed';
import { WorkflowList } from './components/WorkflowList';
import { ErrorPanel } from './components/ErrorPanel';
import { useWorkflows, useExecutions, useToggleWorkflow, useDashboardStats } from './hooks/useN8n';
import type { Execution, Workflow } from './types';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null);

  // Fetch data
  const { data: workflows, isLoading: workflowsLoading, refetch: refetchWorkflows } = useWorkflows();
  const { data: executions, isLoading: executionsLoading, refetch: refetchExecutions } = useExecutions({ limit: 50 });
  const toggleWorkflow = useToggleWorkflow();

  // Calculate stats
  const stats = useDashboardStats(workflows, executions);

  // Theme handling
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleRefresh = () => {
    refetchWorkflows();
    refetchExecutions();
  };

  const handleToggleWorkflow = (workflow: Workflow) => {
    toggleWorkflow.mutate(workflow);
  };

  const handleExecutionClick = (execution: Execution) => {
    if (execution.status === 'error') {
      setSelectedExecution(execution);
    }
  };

  // Filter recent executions for the feed
  const recentExecutions = executions?.slice(0, 10) || [];
  const errorExecutions = executions?.filter(e => e.status === 'error').slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-neutral-900 font-sans text-neutral-800 dark:text-neutral-300 selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors duration-300">
      {/* Background Grid Pattern */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Theme Toggle */}
      <div className="fixed top-8 right-8 z-50">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleRefresh}
            className="p-2.5 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-sm border border-black/5 dark:border-white/10 hover:bg-white/80 dark:hover:bg-black/80 transition-all text-neutral-600 dark:text-neutral-400"
            aria-label="Refresh data"
          >
            <RefreshCw size={18} />
          </motion.button>
          <div className="flex items-center bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-full p-1.5 shadow-sm border border-black/5 dark:border-white/10 hover:bg-white/80 dark:hover:bg-black/80 transition-all">
            <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-screen-xl px-6 md:px-12 py-12 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
            n8n Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Monitor your workflows in real-time
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
        >
          <StatCard
            label="Workflows"
            value={stats.totalWorkflows}
            icon={GitBranch}
          />
          <StatCard
            label="Executions"
            value={stats.totalExecutions}
            icon={Play}
          />
          <StatCard
            label="Success Rate"
            value={stats.successRate}
            suffix="%"
            icon={CheckCircle}
            color="success"
          />
          <StatCard
            label="Errors"
            value={stats.recentErrors}
            icon={AlertCircle}
            color={stats.recentErrors > 0 ? 'error' : 'default'}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workflows Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Section title="Workflows">
              <WorkflowList
                workflows={workflows || []}
                isLoading={workflowsLoading}
                onToggleActive={handleToggleWorkflow}
              />
            </Section>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {/* Recent Executions */}
            <Section title="Recent Executions">
              <ExecutionFeed
                executions={recentExecutions}
                isLoading={executionsLoading}
                onExecutionClick={handleExecutionClick}
              />
            </Section>

            {/* Recent Errors */}
            {errorExecutions.length > 0 && (
              <Section title="Recent Errors">
                <ExecutionFeed
                  executions={errorExecutions}
                  onExecutionClick={handleExecutionClick}
                />
              </Section>
            )}
          </motion.div>
        </div>
      </div>

      {/* Error Panel Modal */}
      <ErrorPanel
        execution={selectedExecution}
        onClose={() => setSelectedExecution(null)}
      />
    </div>
  );
};

export default App;
