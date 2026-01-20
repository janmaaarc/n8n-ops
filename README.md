# n8n Dashboard

A monitoring dashboard for n8n workflows built with React, TypeScript, and Tailwind CSS. Features a Linear-inspired minimal design.

## Features

- **Workflow Management**
  - View all workflows with status indicators
  - Toggle workflows active/inactive
  - Manual workflow triggering
  - Search workflows by name, ID, or tags
  - Filter by status (active/inactive) and tags
  - Sort by favorites, name, status, or node count
  - Bulk activate/deactivate actions
  - Favorites system with persistence
  - Export to CSV/JSON

- **Execution Monitoring**
  - Real-time execution feed with auto-refresh
  - 7-day execution history chart with loading skeleton
  - Detailed execution panel (success/error/running)
  - Filter executions by status
  - Export executions to CSV/JSON
  - Error tracking with stack traces

- **User Experience**
  - Keyboard shortcuts (R: refresh, /: search, ,: settings, D: dark mode, ?: help)
  - Toast notifications for actions
  - Pagination for large lists (workflows and executions)
  - Dark/light theme toggle
  - Settings modal for connection configuration
  - Configurable auto-refresh interval
  - Connection testing
  - Error boundaries for graceful error handling
  - Mobile-responsive design

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- React Query (TanStack Query)
- Recharts (analytics)
- date-fns (date formatting)
- Lucide React (icons)
- Vercel (deployment)

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd n8n-dashboard
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your n8n credentials:

```bash
cp .env.example .env
```

**Development:**
```
VITE_N8N_URL=https://your-n8n-instance.com
VITE_N8N_API_KEY=your-n8n-api-key
```

**Production (Vercel):**
```
N8N_URL=https://your-n8n-instance.com
N8N_API_KEY=your-n8n-api-key
```

### 3. Run locally

```bash
npm run dev
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `R` | Refresh data |
| `/` | Focus search |
| `,` | Open settings |
| `D` | Toggle dark mode |
| `?` | Show shortcuts |
| `Esc` | Close modal |

## Project Structure

```
src/
├── components/           # UI components
│   ├── WorkflowList.tsx      # Workflow table with search/filter/pagination
│   ├── ExecutionFeed.tsx     # Recent executions list with filter
│   ├── ExecutionChart.tsx    # 7-day execution history chart
│   ├── ExecutionDetailsPanel.tsx  # Execution details modal
│   ├── StatCard.tsx          # Dashboard stat cards
│   ├── Section.tsx           # Section wrapper
│   ├── SettingsModal.tsx     # Settings configuration
│   ├── KeyboardShortcutsModal.tsx # Shortcuts help
│   ├── Toast.tsx             # Toast notification system
│   ├── ErrorBoundary.tsx     # Error boundary component
│   └── ThemeToggle.tsx       # Dark mode toggle
├── hooks/                # React hooks
│   ├── useN8n.ts             # API hooks (React Query)
│   ├── useSettings.ts        # Settings management
│   ├── useFavorites.ts       # Favorites persistence
│   └── useKeyboardShortcuts.ts # Keyboard shortcuts
├── services/             # API client
│   └── n8n.ts                # n8n API wrapper
├── utils/                # Utilities
│   ├── date.ts               # Date formatting
│   └── export.ts             # CSV/JSON export functions
├── types/                # TypeScript interfaces
│   └── index.ts
└── App.tsx               # Main layout

api/
└── n8n/[...path].ts      # Vercel serverless proxy
```

## How It Works

- Workflows are fetched from your n8n instance via API
- Dashboard polls for updates (workflows: 30s, executions: 10s)
- Development uses Vite proxy to avoid CORS issues
- Production uses a Vercel serverless proxy to secure API keys
- Settings and favorites are persisted in localStorage

## Security

### API Key Protection

| Environment | Where to set | Exposed to browser? |
|-------------|--------------|---------------------|
| **Production** | Vercel Dashboard env vars | No (serverless proxy) |
| **Development** | `.env` file | Yes (local only) |

**Production**: API keys are stored in Vercel environment variables and accessed only by the serverless proxy (`api/n8n/[...path].ts`). The browser never sees the actual API key.

**Development**: `VITE_*` variables are bundled into the client. This is acceptable for local development since the `.env` file is gitignored.

### Best Practices

1. Never commit `.env` files
2. Use Vercel environment variables for production
3. Rotate API keys if accidentally exposed
4. The in-app settings (localStorage) are for personal/internal use only

## Deployment

Deploy to Vercel and set the environment variables (`N8N_URL`, `N8N_API_KEY`) in your project settings.
