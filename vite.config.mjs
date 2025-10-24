import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import preact from "@preact/preset-vite";
import deno from "@deno/vite-plugin";

export default defineConfig({
  plugins: [deno(), tailwindcss(), preact()],
});
