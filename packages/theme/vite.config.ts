import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'cjs' ? 'js' : 'mjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router-dom'],
    },
    emptyOutDir: false,
  },
  plugins: [
    dts(),
    react({
      include: [/\.md$/],
    }),
  ],
})
