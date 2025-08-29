import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // allow access from localhost and network
    port: 5173, // your frontend port
    strictPort: true, // fail if 5173 is already in use
    proxy: {
      '/backend': {
        target: 'http://localhost:3000', // your backend
        changeOrigin: true,             // important for CORS
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), tailwindcss()],
})
