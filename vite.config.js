import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative paths for assets in the build
  base: './',
  server: {
    allowedHosts: [
      'megalithic-nondelicately-tabitha.ngrok-free.dev'
    ]
  }
});