import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindConfig from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindConfig()],
  server: {
      "rewrites": [
        {
          "source": "/(.*)",
          "destination": "/index.html"
        }
      ],
  },
});
