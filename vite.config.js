import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://telehealth.informatikaunimus.site',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});