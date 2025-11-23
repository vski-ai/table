/// <reference types="vitest" />
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import deno from "@deno/vite-plugin";

export default defineConfig({
  plugins: [preact(), deno()],
  test: {
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    alias: {
      "npm:@preact/signals@^2.5.1": "@preact/signals",
    },
  },
});
