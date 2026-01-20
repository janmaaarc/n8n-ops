import { useEffect, useRef } from 'react';
import type { Execution } from '../types';
import { useNotifications, getNotificationSettings } from './useNotifications';

export const useExecutionNotifications = (executions: Execution[] | undefined) => {
  const { notify } = useNotifications();
  const seenExecutionsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!executions || executions.length === 0) return;

    const settings = getNotificationSettings();
    if (!settings.enabled) return;

    // On first load, just record all existing executions without notifying
    if (!initializedRef.current) {
      executions.forEach((exec) => seenExecutionsRef.current.add(exec.id));
      initializedRef.current = true;
      return;
    }

    // Check for new executions
    executions.forEach((execution) => {
      if (seenExecutionsRef.current.has(execution.id)) return;

      // Mark as seen
      seenExecutionsRef.current.add(execution.id);

      // Only notify for completed executions (not running)
      if (execution.status === 'running') return;

      const workflowName = execution.workflowName || `Workflow ${execution.workflowId}`;
      const errorMessage = execution.data?.resultData?.error?.message;

      if (execution.status === 'error' && settings.onError) {
        notify(`Execution Failed: ${workflowName}`, {
          body: errorMessage || 'An error occurred during execution',
          tag: `execution-error-${execution.id}`,
        });
      } else if (execution.status === 'success' && settings.onSuccess) {
        notify(`Execution Succeeded: ${workflowName}`, {
          body: 'Workflow completed successfully',
          tag: `execution-success-${execution.id}`,
        });
      }
    });

    // Clean up old execution IDs to prevent memory leaks
    // Keep only IDs from the current executions list
    const currentIds = new Set(executions.map((e) => e.id));
    seenExecutionsRef.current.forEach((id) => {
      if (!currentIds.has(id)) {
        seenExecutionsRef.current.delete(id);
      }
    });
  }, [executions, notify]);
};
