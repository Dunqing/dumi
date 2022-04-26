import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'cjs' ? 'js' : 'mjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router-dom', '@dumi/theme'],
    },
    emptyOutDir: false,
  },
  plugins: [
    react({
      include: [/\.md$/],
    }),
    dts(),
  ],
})
