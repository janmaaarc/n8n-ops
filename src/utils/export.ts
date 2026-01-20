import type { Workflow, Execution } from '../types';

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportWorkflowsToCSV = (workflows: Workflow[]) => {
  const headers = ['ID', 'Name', 'Active', 'Nodes', 'Tags', 'Created At', 'Updated At'];
  const rows = workflows.map((w) => [
    w.id,
    `"${w.name.replace(/"/g, '""')}"`,
    w.active ? 'Yes' : 'No',
    w.nodes.length.toString(),
    `"${(w.tags?.map((t) => t.name).join(', ') || '').replace(/"/g, '""')}"`,
    w.createdAt || '',
    w.updatedAt || '',
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(csv, `workflows-${timestamp}.csv`, 'text/csv');
};

export const exportWorkflowsToJSON = (workflows: Workflow[]) => {
  const data = workflows.map((w) => ({
    id: w.id,
    name: w.name,
    active: w.active,
    nodeCount: w.nodes.length,
    tags: w.tags?.map((t) => t.name) || [],
    createdAt: w.createdAt,
    updatedAt: w.updatedAt,
  }));

  const json = JSON.stringify(data, null, 2);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(json, `workflows-${timestamp}.json`, 'application/json');
};

export const exportExecutionsToCSV = (executions: Execution[]) => {
  const headers = ['ID', 'Workflow ID', 'Workflow Name', 'Status', 'Started At', 'Finished At', 'Duration (ms)'];
  const rows = executions.map((e) => {
    const duration = e.stoppedAt
      ? new Date(e.stoppedAt).getTime() - new Date(e.startedAt).getTime()
      : '';
    return [
      e.id,
      e.workflowId,
      `"${(e.workflowName || '').replace(/"/g, '""')}"`,
      e.status,
      e.startedAt,
      e.stoppedAt || '',
      duration.toString(),
    ];
  });

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(csv, `executions-${timestamp}.csv`, 'text/csv');
};

export const exportExecutionsToJSON = (executions: Execution[]) => {
  const data = executions.map((e) => ({
    id: e.id,
    workflowId: e.workflowId,
    workflowName: e.workflowName,
    status: e.status,
    startedAt: e.startedAt,
    stoppedAt: e.stoppedAt,
    durationMs: e.stoppedAt
      ? new Date(e.stoppedAt).getTime() - new Date(e.startedAt).getTime()
      : null,
  }));

  const json = JSON.stringify(data, null, 2);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(json, `executions-${timestamp}.json`, 'application/json');
};
