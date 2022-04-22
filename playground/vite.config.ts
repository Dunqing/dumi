import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import plugin from 'vite-plugin-dumi'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    plugin(),
    react({
      include: [/\.md$/],
    })],
})
