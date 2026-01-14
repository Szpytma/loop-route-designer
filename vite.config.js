import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use '/loop-route-designer/' for GitHub Pages, '/' for Vercel
  base: process.env.GITHUB_ACTIONS ? '/loop-route-designer/' : '/',
})
