import { defineConfig } from 'vite';
import { globSync } from 'glob';
import injectHtml from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';

export default defineConfig(({ command }) => ({
  // !!!
  base: '/shapoval-agency/',

  root: 'src',

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,

    rollupOptions: {
      input: globSync('./src/*.html'),
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
        },
        entryFileNames: 'commonHelpers.js',
      },
    },
  },

  plugins: [injectHtml(), FullReload(['./src/**/*.html'])],
}));
