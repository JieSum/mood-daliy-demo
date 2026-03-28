import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'better-sqlite3': path.resolve(__dirname, './src/utils/database-polyfill.ts')
    }
  },
  optimizeDeps: {
    exclude: ['better-sqlite3']
  }
})