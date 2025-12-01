import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Prevents "process is not defined" error in the browser
      // Uses a fallback string if API_KEY is missing to prevent build crash
      'process.env': {
        API_KEY: JSON.stringify(env.API_KEY || "")
      }
    }
  };
});