import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const n8nUrl = process.env.N8N_URL;
  const n8nApiKey = process.env.N8N_API_KEY;

  if (!n8nUrl || !n8nApiKey) {
    return res.status(500).json({ error: 'n8n configuration missing' });
  }

  // Get the path from the catch-all route
  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : path || '';

  // Build the target URL
  const targetUrl = `${n8nUrl}/${pathString}${req.url?.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': n8nApiKey,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to proxy request to n8n',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
