import type { Workflow, Execution } from '../types';

const getBaseUrl = (): string => {
  // In production, use the Vercel serverless proxy
  if (import.meta.env.PROD) {
    return '/api/n8n';
  }
  // In development, use the direct n8n URL (requires CORS configuration)
  return import.meta.env.VITE_N8N_URL || '';
};

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Only add API key header in development (proxy handles it in production)
  if (import.meta.env.DEV && import.meta.env.VITE_N8N_API_KEY) {
    headers['X-N8N-API-KEY'] = import.meta.env.VITE_N8N_API_KEY;
  }

  return headers;
};

export const n8nApi = {
  async getWorkflows(): Promise<{ data: Workflow[] }> {
    const res = await fetch(`${getBaseUrl()}/api/v1/workflows`, {
      headers: getHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch workflows: ${res.statusText}`);
    }

    return res.json();
  },

  async getWorkflow(id: string): Promise<Workflow> {
    const res = await fetch(`${getBaseUrl()}/api/v1/workflows/${id}`, {
      headers: getHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch workflow: ${res.statusText}`);
    }

    return res.json();
  },

  async getExecutions(params?: {
    limit?: number;
    status?: string;
    workflowId?: string;
  }): Promise<{ data: Execution[] }> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.workflowId) searchParams.set('workflowId', params.workflowId);

    const url = `${getBaseUrl()}/api/v1/executions?${searchParams.toString()}`;
    const res = await fetch(url, {
      headers: getHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch executions: ${res.statusText}`);
    }

    return res.json();
  },

  async getExecution(id: string): Promise<Execution> {
    const res = await fetch(`${getBaseUrl()}/api/v1/executions/${id}`, {
      headers: getHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch execution: ${res.statusText}`);
    }

    return res.json();
  },

  async activateWorkflow(id: string): Promise<Workflow> {
    const res = await fetch(`${getBaseUrl()}/api/v1/workflows/${id}/activate`, {
      method: 'POST',
      headers: getHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to activate workflow: ${res.statusText}`);
    }

    return res.json();
  },

  async deactivateWorkflow(id: string): Promise<Workflow> {
    const res = await fetch(`${getBaseUrl()}/api/v1/workflows/${id}/deactivate`, {
      method: 'POST',
      headers: getHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to deactivate workflow: ${res.statusText}`);
    }

    return res.json();
  },
};
