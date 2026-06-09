
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');

  // The API Gateway base URL — set VITE_API_BASE_URL in your .env file
  // In production, Amplify rewrites handle proxying /api/* to API Gateway
  const apiTarget = env.VITE_API_BASE_URL || 'http://localhost:3000';

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env': process.env,
    },
    server: {
      proxy: {
        // In local dev, proxy all /api/* calls to the API Gateway URL
        // Strip the /api prefix before forwarding (API Gateway routes don't include it)
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
        },
      },
    },
  };
});
