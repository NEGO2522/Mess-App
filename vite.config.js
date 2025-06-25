import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    outDir: 'build', // For Vercel compatibility
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          ui: ['react-icons', 'framer-motion', 'react-toastify']
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      },
      {
        find: '@components',
        replacement: path.resolve(__dirname, 'src/components')
      },
      {
        find: '@pages',
        replacement: path.resolve(__dirname, 'src/pages')
      },
      {
        find: '@auth',
        replacement: path.resolve(__dirname, 'src/components/auth-components')
      },
      {
        find: '@utils',
        replacement: path.resolve(__dirname, 'src/utils')
      }
    ]
  }
});
  