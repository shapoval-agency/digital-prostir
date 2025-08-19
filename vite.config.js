// vite.config.js
import { defineConfig } from "vite";
import { globSync } from "glob";
import injectHtml from "vite-plugin-html-inject";
import FullReload from "vite-plugin-full-reload";

export default defineConfig(({ command }) => ({
  // 1) Говорим Vite, что «корнем» является папка src
  root: "src",

  // 2) Куда выкладывать собранный build
  build: {
    outDir: "../dist", // на уровень выше, чтобы src осталось чистым
    emptyOutDir: true,
    sourcemap: true,

    // 3) Собираем каждую HTML-страницу из src как отдельную точку входа
    rollupOptions: {
      input: globSync("./src/*.html"),
      output: {
        // складываем сторонние либы в vendor.js
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
        },
        entryFileNames: "commonHelpers.js",
      },
    },
  },

  plugins: [
    injectHtml(), // склейка <load />
    FullReload(["./src/**/*.html"]), // live-reload всех html
  ],
}));
