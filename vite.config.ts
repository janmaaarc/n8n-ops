import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/n8n': {
          target: env.VITE_N8N_URL || 'https://localhost:5678',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/n8n/, ''),
          secure: false,
        },
      },
    },
  }
})
