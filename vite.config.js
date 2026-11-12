import { defineConfig } from 'vite';
export default defineConfig({
  base: './',
  build: {
    outDir: 'wp-content/themes/konnect/assets/dist', emptyOutDir: true, manifest: true,
    rollupOptions: { input: ['src/main.js','src/pocket-motion.js'], output: { entryFileNames: '[name]-[hash].js', chunkFileNames: '[name]-[hash].js' } },
    chunkSizeWarningLimit: 800
  }
});
