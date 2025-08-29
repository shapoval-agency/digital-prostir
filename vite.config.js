import { defineConfig } from 'vite';
import { globSync } from 'glob';
import injectHtml from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/digital-prostir/',
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: globSync('./src/*.html'),
    },
  },
  plugins: [
    injectHtml(),
    FullReload(['./src/**/*.html']),
    viteStaticCopy({
      targets: [
        { src: 'css/*', dest: 'css' },
        { src: 'js/*', dest: 'js' },
        { src: 'Public/*', dest: '.' },
        { src: 'fonts/*', dest: 'fonts' },
      ],
    }),
  ],
});
